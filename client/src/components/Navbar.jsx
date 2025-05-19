import React from 'react';
import { Link } from 'react-router-dom';


const Navbar = () => (
  <nav className="navbar">
    <div className="navbar-brand">Архив моды</div>
    <ul className="navbar-links">
      <li><Link to="/">Главная</Link></li>
      <li><Link to="/create">Добавить публикацию</Link></li>
      <li><Link to="/collections">Мои подборки</Link></li>
    </ul>
  </nav>
);

export default Navbar;
