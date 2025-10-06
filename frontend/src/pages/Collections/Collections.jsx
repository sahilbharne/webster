// pages/Collections/Collections.jsx
import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import { collectionService } from '../../services/collectionService';
import './Collections.css';

const Collections = () => {
  const { user } = useUser();
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState('public'); // 'public' or 'my'

  useEffect(() => {
    fetchCollections();
  }, [viewMode]);

  const fetchCollections = async () => {
  try {
    setLoading(true);
    setError('');

    let response;
    if (viewMode === 'my' && user) {
      response = await collectionService.getUserCollections(user.id);
      setCollections(response.collections || []);
    } else {
      response = await collectionService.getAll();
      setCollections(response.collections || []);
    }

    console.log('📦 Collections data:', response); // Add this for debugging

  } catch (err) {
    console.error('Error fetching collections:', err);
    setError('Failed to load collections');
    setCollections([]);
  } finally {
    setLoading(false);
  }
};

  const getCoverImage = (collection) => {
    if (collection.coverImage) return collection.coverImage;
    if (collection.artworks && collection.artworks.length > 0) {
      return collection.artworks[0].imageUrl;
    }
    return '/default-collection-cover.jpg';
  };

  const getGradientClass = (index) => {
    const gradients = [
      'from-purple-500 to-pink-500',
      'from-blue-500 to-cyan-500',
      'from-green-500 to-emerald-500',
      'from-orange-500 to-red-500',
      'from-indigo-500 to-purple-500',
      'from-teal-500 to-blue-500'
    ];
    return gradients[index % gradients.length];
  };

  if (loading) {
    return (
      <div className="collections-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading collections...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="collections-container">
      <div className="collections-header">
        <h1>Collections</h1>
        <p>Discover and organize amazing artworks</p>
        
        {/* View Mode Toggle */}
        <div className="view-mode-toggle">
          <button
            className={`toggle-btn ${viewMode === 'public' ? 'active' : ''}`}
            onClick={() => setViewMode('public')}
          >
            🌎 Public Collections
          </button>
          {user && (
            <button
              className={`toggle-btn ${viewMode === 'my' ? 'active' : ''}`}
              onClick={() => setViewMode('my')}
            >
              🖼️ My Collections
            </button>
          )}
        </div>

        {/* Create Collection Button */}
        {user && viewMode === 'my' && (
          <Link to="/collections/create" className="create-collection-btn">
            + Create New Collection
          </Link>
        )}
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchCollections}>Try Again</button>
        </div>
      )}

      {/* Collections Grid */}
      <div className="collections-grid">
        {collections.map((collection, index) => (
          <div key={collection._id} className="collection-card">
            <Link to={`/collections/${collection._id}`} className="collection-link">
              <div className="collection-cover">
                {getCoverImage(collection) ? (
                  <img 
                    src={getCoverImage(collection)} 
                    alt={collection.name}
                    className="collection-image"
                  />
                ) : (
                  <div className={`collection-placeholder ${getGradientClass(index)}`}>
                    <span className="placeholder-text">{collection.name.charAt(0)}</span>
                  </div>
                )}
                <div className="collection-overlay">
                  <div className="artwork-count">
                    {collection.artworksCount || collection.artworks?.length || 0} artworks
                  </div>
                </div>
              </div>
              
              <div className="collection-info">
                <h3 className="collection-name">{collection.name}</h3>
                <p className="collection-description">
                  {collection.description || 'No description'}
                </p>
                
                <div className="collection-meta">
                  <div className="collection-owner">
                    {collection.owner?.profileImage ? (
                      <img 
                        src={collection.owner.profileImage} 
                        alt={collection.owner.username}
                        className="owner-avatar"
                      />
                    ) : (
                      <div className="owner-avatar-placeholder">
                        {collection.owner?.username?.charAt(0) || 'U'}
                      </div>
                    )}
                    <span>by {collection.owner?.username || 'Unknown'}</span>
                  </div>
                  
                  <div className="collection-category">
                    <span className={`category-tag ${collection.category}`}>
                      {collection.category}
                    </span>
                  </div>
                </div>

                <div className="collection-stats">
                  <div className="stat">
                    <span className="stat-icon">🖼️</span>
                    <span>{collection.artworksCount || collection.artworks?.length || 0}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-icon">👁️</span>
                    <span>{collection.views || 0}</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {collections.length === 0 && !loading && (
        <div className="no-collections">
          <div className="no-collections-icon">🖼️</div>
          <h3>No collections found</h3>
          <p>
            {viewMode === 'my' 
              ? "You haven't created any collections yet." 
              : "No public collections available."
            }
          </p>
          {viewMode === 'my' && user && (
            <Link to="/collections/create" className="create-first-collection-btn">
              Create Your First Collection
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default Collections;