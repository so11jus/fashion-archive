import React, { useState } from 'react';
import axios from '../api/api';
import TagSuggester from '../components/TagSuggester';

const CreatePublication = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [tags, setTags] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      alert('Загрузите изображение!');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('image', image);
    formData.append('tags', JSON.stringify(tags));

    try {
      await axios.post('/publications', formData);
      alert('Публикация создана!');
      // Можно очистить форму:
      setTitle('');
      setDescription('');
      setImage(null);
      setTags([]);
    } catch (err) {
      console.error(err);
      alert('Ошибка при добавлении публикации');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <h2>Новая публикация</h2>

      <input
        type="text"
        placeholder="Название"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <textarea
        placeholder="Описание"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />

      <TagSuggester
        onTagsSelected={(suggestedTags) => {
          setTags(suggestedTags);
          // автоматическое добавление тегов в описание:
          setDescription((prev) => prev + '\n\nТеги: ' + suggestedTags.join(', '));
        }}
        onImageSelected={(file) => setImage(file)}
      />

      {tags.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <p>Выбранные теги:</p>
          <ul>
            {tags.map((tag, i) => (
              <li key={i}>#{tag}</li>
            ))}
          </ul>
        </div>
      )}

      <button type="submit" style={{ marginTop: '1rem' }}>
        Создать
      </button>
    </form>
  );
};

export default CreatePublication;
