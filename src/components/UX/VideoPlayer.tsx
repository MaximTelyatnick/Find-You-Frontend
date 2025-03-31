import { useEffect, useRef } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

export const VideoPlayer = ({ src }: { src: string }) => {
   const videoRef = useRef<HTMLDivElement>(null);
   const playerRef = useRef<any>(null);
   const playerIdRef = useRef<string>(`video-player-${Math.random().toString(36).substring(2, 9)}`);
   const styleIdRef = useRef<string>(`video-style-${Math.random().toString(36).substring(2, 9)}`);

   const videoJsOptions = {
      autoplay: false,
      controls: true,
      responsive: true,
      fluid: true,
      preload: 'auto',
      playerId: playerIdRef.current,
      controlBar: {
         children: [
            'playToggle',
            {
               name: 'timeDisplay',
               children: [
                  'currentTimeDisplay',
                  'timeDivider',
                  'durationDisplay'
               ]
            },
            'volumePanel',
            'fullscreenToggle',
            'settingsMenuButton'
         ],
         progressControl: {
            seekBar: true
         }
      },
      sources: [{
         src,
         type: 'video/mp4'
      }]
   };

   const handlePlayerReady = (player: any) => {
      playerRef.current = player;

      const formatTime = (seconds: number) => {
         if (isNaN(seconds) || seconds === Infinity) return '00:00';
         seconds = Math.floor(seconds);
         const minutes = Math.floor(seconds / 60);
         const remainingSeconds = seconds % 60;
         return `${minutes < 10 ? '0' + minutes : minutes}:${remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds}`;
      };

      // Modify the video.js time display behavior
      player.ready(() => {
         player.addClass('vjs-youtube-like');

         // Access the time display component
         const timeDisplay = player.controlBar.getChild('timeDisplay');

         // Override the time display functionality
         if (timeDisplay) {
            // Override the time display update method
            const updateTimeDisplay = () => {
               const currentTime = player.currentTime();
               const duration = player.duration();

               const formattedCurrent = formatTime(currentTime);
               const formattedDuration = formatTime(duration);

               // Find the container element and update it
               const container = timeDisplay.el();
               if (container) {
                  container.innerHTML = `<span>${formattedCurrent} / ${formattedDuration}</span>`;
               }
            };

            // Update display initially and on timeupdate events
            updateTimeDisplay();
            player.on('timeupdate', updateTimeDisplay);
            player.on('loadedmetadata', updateTimeDisplay);
         }
      });
   };

   useEffect(() => {
      if (!playerRef.current && videoRef.current) {
         const styleElement = document.createElement('style');
         styleElement.id = styleIdRef.current;
         styleElement.innerHTML = `
            /* Основной стиль, похожий на YouTube */
            .video-js.vjs-youtube-like {
               font-family: 'Roboto', Arial, sans-serif;
            }
            
            /* Панель управления */
            .video-js.vjs-youtube-like .vjs-control-bar {
               background-color: rgba(0, 0, 0, 0.9);
               height: 32px;
               padding: 0 10px;
               display: flex !important;
               visibility: visible !important;
               opacity: 1 !important;
               transition: opacity 0.2s ease;
            }
            
            /* Update this part in your CSS */
            /* Remove this part that hides the time elements */
            /*
            .video-js.vjs-youtube-like .vjs-current-time-display,
            .video-js.vjs-youtube-like .vjs-duration-display,
            .video-js.vjs-youtube-like .vjs-time-divider {
               display: none !important;
            }
            */

            /* Add this to style the custom time display */
            /* Make sure the time display is visible */
            .video-js.vjs-youtube-like .vjs-time-control {
            display: flex !important;
            align-items: center;
            padding: 0 5px;
            font-size: 13px;
            color: #ffffff;
            min-width: 100px;
            text-align: center;
            }

            /* Ensure the time elements inside are visible */
            .video-js.vjs-youtube-like .vjs-time-control span {
            display: inline !important;
            }
            
            /* Стиль для полоски прогресса */
            .video-js.vjs-youtube-like .vjs-progress-control {
               position: absolute;
               top: -10px;
               right: 0;
               left: 0;
               width: 100%;
               height: 5px;
            }
            
            .video-js.vjs-youtube-like .vjs-progress-control:hover {
               height: 10px;
               top: -15px;
            }
            
            .video-js.vjs-youtube-like .vjs-progress-holder {
               height: 100%;
            }
            
            .video-js.vjs-youtube-like .vjs-play-progress {
               background-color: #ff0000;
            }
            
            /* Кнопки управления */
            .video-js.vjs-youtube-like .vjs-button {
               height: 40px;
               width: 40px;
            }
            
            /* Кнопка громкости */
            .video-js.vjs-youtube-like .vjs-volume-panel {
               margin-right: 10px;
            }
            
            /* Большая кнопка воспроизведения */
            .video-js.vjs-youtube-like .vjs-big-play-button {
               background-color: rgba(0, 0, 0, 0.6);
               border: 2px solid #fff;
               border-radius: 50%;
               font-size: 3em;
               line-height: 1.5em;
               height: 1.5em;
               width: 1.5em;
               margin-left: -0.75em;
               margin-top: -0.75em;
            }
            
            /* Настройки (три точки) */
            .video-js.vjs-youtube-like .vjs-menu-button-popup .vjs-menu {
               bottom: 3em;
            }
            
            .video-js.vjs-youtube-like .vjs-menu-content {
               background-color: rgba(0, 0, 0, 0.9);
            }
         `;
         document.head.appendChild(styleElement);

         const videoElement = document.createElement('video');
         videoElement.className = 'video-js vjs-big-play-centered';
         videoElement.id = playerIdRef.current;

         videoRef.current.appendChild(videoElement);

         const player = videojs(videoElement, videoJsOptions, () => {
            handlePlayerReady(player);
         });

         playerRef.current = player;
      } else if (playerRef.current) {
         const player = playerRef.current;
         player.src(videoJsOptions.sources);
      }
   }, [src]);

   useEffect(() => {
      return () => {
         const styleElement = document.getElementById(styleIdRef.current);
         if (styleElement) {
            document.head.removeChild(styleElement);
         }

         if (playerRef.current && !playerRef.current.isDisposed()) {
            playerRef.current.dispose();
            playerRef.current = null;
         }
      };
   }, []);

   return (
      <div data-vjs-player style={{ width: '100%', height: '100%' }}>
         <div ref={videoRef} style={{ width: '100%', height: '100%' }} />
      </div>
   );
};

export default VideoPlayer;