import React from 'react';
import { useState } from 'react';
import CollectionModal from './CollectionModal';


const PublicationCard = ({ id, title, description, image, created_at, tags }) => {
  let parsedTags = [];
  const [showModal, setShowModal] = useState(false);


  try {
    parsedTags = JSON.parse(tags);
  } catch (e) {
    parsedTags = [];
  }

  return (
    <div className="card">
      <img
        src={`http://localhost:5000/uploads/${encodeURIComponent(image)}`}
        alt={title}
        style={{ width: '100%', borderRadius: '6px', marginBottom: '1rem' }}
      />
      <h3>{title}</h3>
      <p>{description}</p>
      <small>{new Date(created_at).toLocaleDateString()}</small>
      <button onClick={() => setShowModal(true)}>+ В подборку</button>

{showModal && (
  <CollectionModal
    publicationId={id} // передаём id публикации
    onClose={() => setShowModal(false)}
  />
)}


      {parsedTags.length > 0 && (
        <div style={{ marginTop: '0.5rem' }}>
          <p>Теги:</p>
          <ul style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {parsedTags.map((tag, index) => (
              <li key={index} style={{
                background: '#333',
                color: '#fff',
                padding: '2px 6px',
                borderRadius: '4px',
                fontSize: '0.85rem'
              }}>
                #{tag}
              </li>
            ))}
          </ul>
        </div>
      )}
      
    </div>
  );
};

export default PublicationCard;
