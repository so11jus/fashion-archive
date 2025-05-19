import React, { useState } from 'react';
import axios from 'axios';

const TagSuggester = ({ onTagsSelected, onImageSelected }) => {
  const [image, setImage] = useState(null);
  const [suggestedTags, setSuggestedTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setSuggestedTags([]);
    setError('');

    if (onImageSelected) {
      onImageSelected(file); // ← передаём изображение в родительский компонент
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('file', image);

    try {
      const response = await axios.post('http://localhost:8000/analyze-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const tags = response.data.tags || [];
      setSuggestedTags(tags);
      if (onTagsSelected) onTagsSelected(tags);
    } catch (err) {
      console.error(err);
      setError('Ошибка при анализе изображения.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: '1rem' }}>
      <label>Изображение публикации:</label><br />
      <input type="file" accept="image/*" onChange={handleFileChange} required />
      
      <button
        type="button"
        onClick={handleAnalyze}
        disabled={!image || loading}
        style={{ marginTop: '0.5rem' }}
      >
        {loading ? 'Анализ...' : 'Предложить теги'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {suggestedTags.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <p>Предложенные теги:</p>
          <ul>
            {suggestedTags.map((tag, index) => (
              <li key={index}>#{tag}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TagSuggester;
