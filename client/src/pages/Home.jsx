import React, { useEffect, useState } from 'react';
import axios from '../api/api';
import PublicationCard from '../components/PublicationCard';

const Home = () => {
  const [publications, setPublications] = useState([]);

  useEffect(() => {
    axios.get('/publications')
      .then(res => setPublications(res.data))
      .catch(err => console.error('Ошибка при загрузке:', err));
  }, []);

  return (
    <div>
      <h2>Последние публикации</h2>

      {publications.length === 0 ? (
        <p>Нет публикаций</p>
      ) : (
        <div className="grid">
          {publications.map(pub => (
            <PublicationCard
              key={pub.id}
              title={pub.title}
              description={pub.description}
              image={pub.image}
              created_at={pub.created_at}
              tags={pub.tags}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
