import React, { useEffect, useState } from 'react';
import axios from '../api/api';

const CollectionModal = ({ publicationId, onClose }) => {
  const [collections, setCollections] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');

  useEffect(() => {
    axios.get('/collections')
      .then(res => setCollections(res.data))
      .catch(err => console.error('Ошибка при загрузке подборок', err));
  }, []);

  const handleAdd = async () => {
    if (selectedId) {
      await axios.post(`/collections/${selectedId}/add`, { publication_id: publicationId });
    } else if (newName.trim() !== '') {
      const res = await axios.post('/collections', {
        name: newName,
        description: newDescription,
        is_private: false
      });
      await axios.post(`/collections/${res.data.id}/add`, { publication_id: publicationId });
    }

    onClose();
  };

  return (
    <div className="modal">
      <div className="modal-content">
      <h3 style={{ marginBottom: '1rem' }}>Добавить в подборку</h3>

<label style={{ marginBottom: '0.3rem' }}>Существующая:</label>


        <select onChange={e => setSelectedId(e.target.value)} value={selectedId || ''}>
          <option value="">-- выбрать --</option>
          {collections.map(col => (
            <option key={col.id} value={col.id}>
              {col.name}
            </option>
          ))}
        </select>

        <p style={{ margin: '1rem 0 0.3rem' }}>или создать новую:</p>

        <input
          type="text"
          placeholder="Название новой подборки"
          value={newName}
          onChange={e => setNewName(e.target.value)}
        />
        <textarea
          placeholder="Описание"
          value={newDescription}
          onChange={e => setNewDescription(e.target.value)}
        />

        <div style={{ marginTop: '1rem' }}>
          <button onClick={handleAdd}>Сохранить</button>
          <button onClick={onClose} style={{ marginLeft: '0.5rem' }}>Отмена</button>
        </div>
      </div>
    </div>
  );
};

export default CollectionModal;
