// pages/CollectionDetail/CollectionDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { collectionService } from '../../services/collectionService';
import { likeService } from '../../services/likeService';
import './CollectionDetail.css';

// Import the modal component (you'll need to create this)
import AddArtworksModal from '../../components/AddArtworksModal/AddArtworksModal';

const CollectionDetail = () => {
  const { id } = useParams();
  const { user } = useUser();
  const navigate = useNavigate();
  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isOwner, setIsOwner] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState(null); // Added missing state
  const [isModalOpen, setIsModalOpen] = useState(false); // Added missing state
  const [showAddArtworks, setShowAddArtworks] = useState(false); // ADDED THIS LINE

  useEffect(() => {
    fetchCollection();
  }, [id]);

  const fetchCollection = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await collectionService.getById(id);
      setCollection(response);
      
      // Check if current user is the owner
      if (user && response.clerkUserId === user.id) {
        setIsOwner(true);
      }
    } catch (err) {
      console.error('Error fetching collection:', err);
      setError('Collection not found or access denied');
    } finally {
      setLoading(false);
    }
  };

  const handleArtworkClick = (artwork) => {
    // Open a modal with artwork details
    setSelectedArtwork(artwork);
    setIsModalOpen(true);
  };

  const handleDeleteCollection = async () => {
    if (!window.confirm('Are you sure you want to delete this collection? This action cannot be undone.')) {
      return;
    }

    try {
      await collectionService.delete(id, user.id);
      navigate('/collections');
    } catch (err) {
      console.error('Error deleting collection:', err);
      alert('Failed to delete collection');
    }
  };

  const handleRemoveArtwork = async (artworkId) => {
    if (!window.confirm('Remove this artwork from collection?')) {
      return;
    }

    try {
      await collectionService.removeArtwork(id, artworkId, user.id);
      // Refresh collection data
      fetchCollection();
    } catch (err) {
      console.error('Error removing artwork:', err);
      alert('Failed to remove artwork');
    }
  };

  // ADD THIS FUNCTION: Handle when artworks are added via modal
  const handleArtworksAdded = (updatedCollection) => {
    setCollection(updatedCollection);
    setShowAddArtworks(false);
  };

  if (loading) {
    return (
      <div className="collection-detail-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading collection...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="collection-detail-container">
        <div className="error-message">
          <h3>Collection Not Found</h3>
          <p>{error}</p>
          <Link to="/collections" className="back-btn">
            ← Back to Collections
          </Link>
        </div>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="collection-detail-container">
        <div className="error-message">
          <h3>Collection Not Found</h3>
          <Link to="/collections" className="back-btn">
            ← Back to Collections
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="collection-detail-container">
      {/* Collection Header */}
      <div className="collection-header">
        <Link to="/collections" className="back-link">
          ← Back to Collections
        </Link>
        
        <div className="collection-hero">
          <div className="collection-cover-large">
            {collection.coverImage ? (
              <img src={collection.coverImage} alt={collection.name} />
            ) : (
              <div className="collection-cover-placeholder">
                <span>{collection.name.charAt(0)}</span>
              </div>
            )}
          </div>
          
          <div className="collection-info">
            <div className="collection-meta">
              <span className={`visibility-badge ${collection.isPublic ? 'public' : 'private'}`}>
                {collection.isPublic ? '🌎 Public' : '🔒 Private'}
              </span>
              <span className="category-badge">{collection.category}</span>
            </div>
            
            <h1 className="collection-title">{collection.name}</h1>
            <p className="collection-description">{collection.description}</p>
            
            <div className="collection-owner-info">
              {collection.owner?.profileImage ? (
                <img 
                  src={collection.owner.profileImage} 
                  alt={collection.owner.username}
                  className="owner-avatar-large"
                />
              ) : (
                <div className="owner-avatar-placeholder-large">
                  {collection.owner?.username?.charAt(0) || 'U'}
                </div>
              )}
              <div>
                <p className="owner-name">by {collection.owner?.username || 'Unknown'}</p>
                <p className="collection-date">Created {new Date(collection.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            {/* Owner Actions */}
            {isOwner && (
              <div className="owner-actions">
                <Link 
                  to={`/collections/${id}/edit`}
                  className="edit-btn"
                >
                  ✏️ Edit Collection
                </Link>
                <button 
                  onClick={handleDeleteCollection}
                  className="delete-btn"
                >
                  🗑️ Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Artworks Grid */}
      <div className="collection-artworks-section">
        <div className="section-header">
          <h2>Artworks ({collection.artworks?.length || 0})</h2>
          {isOwner && (
            <button 
              onClick={() => setShowAddArtworks(true)}
              className="add-artworks-btn"
            >
              + Add Artworks
            </button>
          )}
        </div>

        {collection.artworks && collection.artworks.length > 0 ? (
          <div className="artworks-grid">
            {collection.artworks.map((artwork) => (
              <div 
                key={artwork._id} 
                className="artwork-card"
                onClick={() => handleArtworkClick(artwork)}
              >
                <div className="artwork-image-container">
                  <img 
                    src={artwork.imageUrl} 
                    alt={artwork.title}
                    className="artwork-image"
                  />
                  <div className="artwork-overlay">
                    <div className="artwork-stats">
                      <span className="likes">❤️ {artwork.likes?.length || 0}</span>
                      <span className="views">👁️ {artwork.views || 0}</span>
                    </div>
                  </div>
                </div>
                
                <div className="artwork-info">
                  <h4 className="artwork-title">{artwork.title}</h4>
                  <p className="artwork-artist">by {artwork.artistName}</p>
                  
                  {isOwner && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveArtwork(artwork._id);
                      }}
                      className="remove-artwork-btn"
                    >
                      Remove from Collection
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-artworks">
            <div className="no-artworks-icon">🎨</div>
            <h3>No artworks in this collection</h3>
            <p>
              {isOwner 
                ? 'Start building your collection by adding artworks!' 
                : 'This collection is empty. Check back later for updates.'
              }
            </p>
            {isOwner && (
              <button 
                onClick={() => setShowAddArtworks(true)}
                className="add-first-artwork-btn"
              >
                + Add Your First Artwork
              </button>
            )}
          </div>
        )}
      </div>

      {/* Tags */}
      {collection.tags && collection.tags.length > 0 && (
        <div className="collection-tags">
          <h3>Tags</h3>
          <div className="tags-container">
            {collection.tags.map((tag, index) => (
              <span key={index} className="tag">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Add Artworks Modal */}
      {showAddArtworks && (
        <AddArtworksModal
          collectionId={id}
          onClose={() => setShowAddArtworks(false)}
          onArtworksAdded={handleArtworksAdded}
        />
      )}

      {/* Artwork Detail Modal - If you have one */}
      {/* {isModalOpen && selectedArtwork && (
        <ArtworkModal
          artwork={selectedArtwork}
          onClose={() => setIsModalOpen(false)}
          onDelete={isOwner ? () => handleRemoveArtwork(selectedArtwork._id) : null}
        />
      )} */}
    </div>
  );
};

export default CollectionDetail;