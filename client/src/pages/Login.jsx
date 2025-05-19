import React, { useState, useEffect } from 'react';
import { login, register, getProfile } from '../api/api';
import Register from './Register';


const Login = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const { token } = await login(username, password);
        localStorage.setItem('token', token);
        const profile = await getProfile();
        onLogin(profile.user);
      } else {
        await register(username, email, password);
        alert('Регистрация прошла успешно. Теперь войди.');
        setIsLogin(true);
      }
    } catch (err) {
      alert('Ошибка: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
        
      <h2>{isLogin ? 'Вход' : 'Регистрация'}</h2>
      <input
        type="text"
        placeholder="Имя пользователя"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      
      {!isLogin && (
        <input
          type="email"
          placeholder="Электронная почта"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      )}
      <input
        type="password"
        placeholder="Пароль"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">{isLogin ? 'Войти' : 'Зарегистрироваться'}</button>
      <p onClick={() => setIsLogin(!isLogin)} style={{ cursor: 'pointer', marginTop: '1rem' }}>
        {isLogin ? 'Нет аккаунта? Зарегистрируйся' : 'Уже есть аккаунт? Войти'}
      </p>
    </form>

  );
};


export default Login;
