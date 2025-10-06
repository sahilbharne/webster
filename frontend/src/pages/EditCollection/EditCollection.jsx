// pages/EditCollection/EditCollection.jsx
import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useParams, useNavigate } from 'react-router-dom';
import { collectionService } from '../../services/collectionService';
import './EditCollection.css';

const EditCollection = () => {
  const { id } = useParams();
  const { user } = useUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

  useEffect(() => {
    fetchCollection();
  }, [id]);

  const fetchCollection = async () => {
    try {
      setLoading(true);
      const response = await collectionService.getById(id);
      
      // Check if user owns this collection
      if (response.clerkUserId !== user?.id) {
        setError('You are not authorized to edit this collection');
        return;
      }

      setFormData({
        name: response.name,
        description: response.description || '',
        category: response.category || 'personal',
        tags: response.tags?.join(', ') || '',
        isPublic: response.isPublic
      });
      
    } catch (err) {
      console.error('Error fetching collection:', err);
      setError('Collection not found');
    } finally {
      setLoading(false);
    }
  };

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
      setError('Please sign in to edit collection');
      return;
    }

    if (!formData.name.trim()) {
      setError('Collection name is required');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const updates = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        clerkUserId: user.id
      };

      const result = await collectionService.update(id, updates);
      
      if (result.success) {
        navigate(`/collections/${id}`);
      } else {
        setError(result.error || 'Failed to update collection');
      }
    } catch (err) {
      console.error('Error updating collection:', err);
      setError(err.response?.data?.error || 'Failed to update collection');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this collection? This action cannot be undone.')) {
      return;
    }

    try {
      await collectionService.delete(id, user.id);
      navigate('/collections');
    } catch (err) {
      console.error('Error deleting collection:', err);
      setError('Failed to delete collection');
    }
  };

  if (loading) {
    return (
      <div className="edit-collection-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading collection...</p>
        </div>
      </div>
    );
  }

  if (error && !formData.name) {
    return (
      <div className="edit-collection-container">
        <div className="error-message">
          <h3>Error</h3>
          <p>{error}</p>
          <button onClick={() => navigate('/collections')} className="back-btn">
            ← Back to Collections
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-collection-container">
      <div className="edit-collection-header">
        <button onClick={() => navigate(`/collections/${id}`)} className="back-link">
          ← Back to Collection
        </button>
        <h1>Edit Collection</h1>
        <p>Update your collection details and settings</p>
      </div>

      <div className="edit-collection-form-container">
        <form onSubmit={handleSubmit} className="edit-collection-form">
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
              placeholder="e.g., Digital Art Inspiration"
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
            <div className="left-actions">
              <button
                type="button"
                onClick={() => navigate(`/collections/${id}`)}
                className="cancel-btn"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="save-btn"
                disabled={saving || !formData.name.trim()}
              >
                {saving ? (
                  <>
                    <div className="loading-spinner"></div>
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
            
            <div className="right-actions">
              <button
                type="button"
                onClick={handleDelete}
                className="delete-btn"
                disabled={saving}
              >
                🗑️ Delete Collection
              </button>
            </div>
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

export default EditCollection;