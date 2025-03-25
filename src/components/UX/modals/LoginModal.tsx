import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import IModal from '../../../types/IModal';

const LoginModal = ({ isOpen, setIsOpen, children }: IModal) => {
   const navigate = useNavigate();
   const [login, setLogin] = useState('');
   const [password, setPassword] = useState('');
   const [error, setError] = useState('');

   const openModal = () => setIsOpen(true);
   const closeModal = () => setIsOpen(false);

   const navigateHandler = (path: string) => {
      navigate(path);
   }

   const loginHandler = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError('');  // Сбрасываем ошибку перед отправкой запроса

      try {
         const response = await axios.post('http://167.86.84.197/api/login', {
            login,
            password
         });

         if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            navigate('')
            setIsOpen(false);
         }

      } catch (err) {
         setError('Неверный логин или пароль'); // Показываем ошибку, если что-то пошло не так
      }
   }

   return (
      <>
         <div onClick={openModal}>{children}</div>
         {isOpen && (
            <div id="loginModal" className="modal">
               <div className="modal-content">
                  <div className="modal-header">
                     ВАШ АККАУНТ НА САЙТЕ
                     <span className="close-btn" onClick={closeModal}>&times;</span>
                  </div>
                  <form onSubmit={loginHandler}>
                     <input
                        type="text"
                        placeholder="Логин"
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
                        required
                     />
                     <input
                        type="password"
                        placeholder="Пароль"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                     />
                     {error && <p style={{ color: 'red' }}>{error}</p>}
                     <button type="submit" className="btn btn-info">Войти</button>
                  </form>
                  <div className="modal-footer">
                     <a onClick={() => { navigateHandler('/recovery') }}>Забыли пароль?</a>
                     <a onClick={() => { navigateHandler('/registration') }}>Регистрация</a>
                  </div>
               </div>
            </div>
         )}
      </>
   );
};

export default LoginModal;
