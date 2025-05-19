import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { Link } from 'react-router-dom';

const Collections = () => {
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    api.get('/collections')
      .then(res => setCollections(res.data))
      .catch(err => alert('Ошибка загрузки подборок'));
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Мои подборки</h2>
      {collections.map((collection) => (
        <div key={collection.id} style={{ marginBottom: '1rem', background: '#222', padding: '1rem' }}>
          <h3>{collection.name}</h3>
          <p>{collection.description}</p>
          <Link to={`/collection/${collection.id}`} style={{ color: '#ccc' }}>Открыть подборку →</Link>
        </div>
      ))}
    </div>
  );
};

export default Collections;
