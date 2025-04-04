import { useNavigate } from 'react-router-dom';

const Header = ({ activeLink }: { activeLink?: string }) => {
   let navigate = useNavigate();

   // Функция для обработки клика по ссылке и установки активного элемента
   const handleLinkClick = (linkName: string) => {
      // Можно добавить логику перехода на страницу, если нужно
      if (linkName === 'Home') {
         navigate('/');
      } else if (linkName === 'Cities') {
         navigate('/Cities');
      } else if (linkName === 'Tags') {
         navigate('/Tags');
      } else if (linkName === 'Orders') {
         navigate('/Order');
      } else if (linkName === 'Delete') {
         navigate('/Delete');
      } else if (linkName === 'Access') {
         navigate('/access');
      } else if (linkName === 'Mirrors') {
         navigate('/Mirrors');
      } else if (linkName === 'About') {
         navigate('/About');
      }
   };

   return (
      <div>
         <div className="visible-desktop navbar navbar-fixed-top" >
            <div className="navbar-inner">
               <div className="layout-container ">
                  <a className="brand pt25" onClick={() => handleLinkClick('Home')}><img src='/images/logoHeader.png' className='logo' /></a>
                  <ul className="nav pt pull-right">
                     <li className={activeLink === 'Home' ? 'active' : ''}>
                        <a onClick={() => handleLinkClick('Home')}>Главная</a>
                     </li>
                     <li className={activeLink === 'Cities' ? 'active' : ''}>
                        <a onClick={() => handleLinkClick('Cities')}>Города</a>
                     </li>
                     <li className={activeLink === 'Tags' ? 'active' : ''}>
                        <a onClick={() => handleLinkClick('Tags')}>Тэги</a>
                     </li>
                     <li className={activeLink === 'Orders' ? 'active' : ''}>
                        <a onClick={() => handleLinkClick('Orders')}>Заказы</a>
                     </li>
                     <li className={activeLink === 'Delete' ? 'active' : ''}>
                        <a onClick={() => handleLinkClick('Delete')}>Удаление</a>
                     </li>
                     <li className={activeLink === 'Access' ? 'active' : ''}>
                        <a onClick={() => handleLinkClick('Access')}>Бесплатный доступ</a>
                     </li>
                     <li className={activeLink === 'Mirrors' ? 'active' : ''}>
                        <a onClick={() => handleLinkClick('Mirrors')}>Зеркала</a>
                     </li>
                     <li className={activeLink === 'About' ? 'active' : ''}>
                        <a onClick={() => handleLinkClick('About')}>О проекте</a>
                     </li>
                  </ul>
               </div>
            </div>
         </div>

         <div className="jumbotron-mob hidden-desktop">
            <div className="layout-container">
               <a className="header-mobile__logo" onClick={() => handleLinkClick('Home')}><h1>Check You 18+</h1></a>
               <div className="nav header-mobile__menu">
                  <li className={activeLink === 'Home' ? 'active' : ''}>
                     <a onClick={() => handleLinkClick('Home')}>Главная</a>
                  </li>
                  <li className={activeLink === 'Cities' ? 'active' : ''}>
                     <a onClick={() => handleLinkClick('Cities')}>Города</a>
                  </li>
                  <li className={activeLink === 'Tags' ? 'active' : ''}>
                     <a onClick={() => handleLinkClick('Tags')}>Тэги</a>
                  </li>
                  <li className={activeLink === 'Order' ? 'active' : ''}>
                     <a onClick={() => handleLinkClick('Order')}>Заказы</a>
                  </li>
                  <li className={activeLink === 'Delete' ? 'active' : ''}>
                     <a onClick={() => handleLinkClick('Delete')}>Удаление</a>
                  </li>
                  <li className={activeLink === 'Access' ? 'active' : ''}>
                     <a onClick={() => handleLinkClick('Access')}>Бесплатный доступ</a>
                  </li>
                  <li className={activeLink === 'Mirrors' ? 'active' : ''}>
                     <a onClick={() => handleLinkClick('Mirrors')}>Зеркала</a>
                  </li>
                  <li className={activeLink === 'About' ? 'active' : ''}>
                     <a onClick={() => handleLinkClick('About')}>О проекте</a>
                  </li>
               </div>
            </div>
         </div>
      </div>
   )
}

export default Header