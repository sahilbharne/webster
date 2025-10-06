// pages/CreateCollection/CreateCollection.jsx
import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { collectionService } from '../../services/collectionService';
import './CreateCollection.css';

const CreateCollection = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'personal',
    tags: '',
    isPublic: true
  });

  const categories = [
    { value: 'personal', label: 'Personal', icon: '👤' },
    { value: 'inspiration', label: 'Inspiration', icon: '💫' },
    { value: 'work', label: 'Work', icon: '💼' },
    { value: 'favorites', label: 'Favorites', icon: '⭐' },
    { value: 'other', label: 'Other', icon: '📁' }
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setError('Please sign in to create a collection');
      return;
    }

    if (!formData.name.trim()) {
      setError('Collection name is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const collectionData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        clerkUserId: user.id
      };

      const result = await collectionService.create(collectionData);
      
      if (result.success) {
        navigate(`/collections/${result.collection._id}`);
      } else {
        setError(result.error || 'Failed to create collection');
      }
    } catch (err) {
      console.error('Error creating collection:', err);
      setError(err.response?.data?.error || 'Failed to create collection');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="create-collection-container">
        <div className="auth-required">
          <h2>Sign In Required</h2>
          <p>Please sign in to create a collection.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="create-collection-container">
      <div className="create-collection-header">
        <h1>Create New Collection</h1>
        <p>Organize your favorite artworks into beautiful collections</p>
      </div>

      <div className="create-collection-form-container">
        <form onSubmit={handleSubmit} className="create-collection-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {/* Collection Name */}
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Collection Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Digital Art Inspiration, Nature Photography, My Portfolio"
              className="form-input"
              required
              maxLength={100}
            />
            <div className="character-count">
              {formData.name.length}/100
            </div>
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe what this collection is about..."
              className="form-textarea"
              rows="4"
              maxLength={500}
            />
            <div className="character-count">
              {formData.description.length}/500
            </div>
          </div>

          {/* Category */}
          <div className="form-group">
            <label htmlFor="category" className="form-label">
              Category
            </label>
            <div className="category-options">
              {categories.map(category => (
                <label key={category.value} className="category-option">
                  <input
                    type="radio"
                    name="category"
                    value={category.value}
                    checked={formData.category === category.value}
                    onChange={handleChange}
                    className="category-radio"
                  />
                  <div className="category-card">
                    <span className="category-icon">{category.icon}</span>
                    <span className="category-label">{category.label}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="form-group">
            <label htmlFor="tags" className="form-label">
              Tags
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="e.g., digital, nature, abstract, photography"
              className="form-input"
            />
            <div className="form-hint">
              Separate tags with commas
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="form-group">
            <label className="form-label">Visibility</label>
            <div className="privacy-options">
              <label className="privacy-option">
                <input
                  type="radio"
                  name="isPublic"
                  value={true}
                  checked={formData.isPublic === true}
                  onChange={() => setFormData(prev => ({ ...prev, isPublic: true }))}
                  className="privacy-radio"
                />
                <div className="privacy-card public">
                  <span className="privacy-icon">🌎</span>
                  <div>
                    <div className="privacy-title">Public</div>
                    <div className="privacy-description">Anyone can view this collection</div>
                  </div>
                </div>
              </label>
              
              <label className="privacy-option">
                <input
                  type="radio"
                  name="isPublic"
                  value={false}
                  checked={formData.isPublic === false}
                  onChange={() => setFormData(prev => ({ ...prev, isPublic: false }))}
                  className="privacy-radio"
                />
                <div className="privacy-card private">
                  <span className="privacy-icon">🔒</span>
                  <div>
                    <div className="privacy-title">Private</div>
                    <div className="privacy-description">Only you can view this collection</div>
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/collections')}
              className="cancel-btn"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="create-btn"
              disabled={loading || !formData.name.trim()}
            >
              {loading ? (
                <>
                  <div className="loading-spinner"></div>
                  Creating...
                </>
              ) : (
                'Create Collection'
              )}
            </button>
          </div>
        </form>

        {/* Preview Section */}
        <div className="collection-preview">
          <h3>Preview</h3>
          <div className="preview-card">
            <div className="preview-cover">
              {formData.name ? (
                <div className="preview-cover-text">
                  {formData.name.charAt(0).toUpperCase()}
                </div>
              ) : (
                <div className="preview-cover-placeholder">
                  Collection Cover
                </div>
              )}
            </div>
            <div className="preview-info">
              <h4 className="preview-name">
                {formData.name || 'Your Collection Name'}
              </h4>
              <p className="preview-description">
                {formData.description || 'Collection description will appear here...'}
              </p>
              <div className="preview-meta">
                <span className="preview-category">
                  {categories.find(cat => cat.value === formData.category)?.label || 'Personal'}
                </span>
                <span className={`preview-visibility ${formData.isPublic ? 'public' : 'private'}`}>
                  {formData.isPublic ? 'Public' : 'Private'}
                </span>
              </div>
              {formData.tags && (
                <div className="preview-tags">
                  {formData.tags.split(',').map((tag, index) => (
                    tag.trim() && (
                      <span key={index} className="preview-tag">
                        {tag.trim()}
                      </span>
                    )
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCollection;