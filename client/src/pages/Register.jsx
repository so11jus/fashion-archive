import React, { useState } from 'react';
import axios from '../api/api';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/auth/register', { username, password });
      alert('Пользователь зарегистрирован! Теперь можешь войти.');
    } catch (err) {
      alert('Ошибка регистрации');
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleRegister} className="form">
      <h2>Регистрация</h2>
      <input
        type="text"
        placeholder="Логин"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Пароль"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Зарегистрироваться</button>
    </form>
  );
};

export default Register;
