import React, { useEffect, useState } from 'react';
import { getProfile } from './api/api';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CreatePublication from './pages/CreatePublication';
import Login from './pages/Login';
import CollectionView from './pages/CollectionView';
import Collections from './pages/Collections';





import './styles/main.css';
import './styles/theme.css';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const tryGetUser = async () => {
      try {
        const res = await getProfile();
        setUser(res.user);
      } catch (err) {
        console.log('Не авторизован');
      }
    };
    tryGetUser();
  }, []);

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <Router>
      <Navbar user={user} />
      <div className="container">
        <Routes>
        <Route path="/collections" element={<Collections />} />
        <Route path="/collection/:id" element={<CollectionView />} />
          <Route path="/" element={<Home user={user} />} />
          <Route path="/create" element={<CreatePublication user={user} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
