import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/api';

const CollectionView = () => {
  const { id } = useParams();
  const [publications, setPublications] = useState([]);

  useEffect(() => {
    api.get(`/collections/${id}/publications`)
      .then(res => setPublications(res.data))
      .catch(() => alert('Ошибка при загрузке публикаций'));
  }, [id]);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Публикации в подборке #{id}</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        {publications.map(pub => (
          <div key={pub.id} style={{ background: '#222', padding: '1rem', width: '200px' }}>
            <img src={`http://localhost:5000/uploads/${pub.image}`} alt="" style={{ width: '100%' }} />
            <h4>{pub.title}</h4>
            <p>{pub.description}</p>
            <p>{pub.tags}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CollectionView;
