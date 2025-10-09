// pages/CollectionDetail/CollectionDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { collectionService } from '../../services/collectionService';
import { likeService } from '../../services/likeService';
import AddArtworksModal from '../../components/AddArtworksModal/AddArtworksModal';

const CollectionDetail = () => {
  const { id } = useParams();
  const { user } = useUser();
  const navigate = useNavigate();
  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isOwner, setIsOwner] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAddArtworks, setShowAddArtworks] = useState(false);

  useEffect(() => {
    fetchCollection();
  }, [id]);

  const fetchCollection = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await collectionService.getById(id);
      setCollection(response);
      
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
      fetchCollection();
    } catch (err) {
      console.error('Error removing artwork:', err);
      alert('Failed to remove artwork');
    }
  };

  const handleArtworksAdded = (updatedCollection) => {
    setCollection(updatedCollection);
    setShowAddArtworks(false);
  };

  const getGradientClass = () => {
    const gradients = {
      personal: 'from-purple-500 to-pink-500',
      inspiration: 'from-blue-500 to-cyan-500',
      work: 'from-green-500 to-emerald-500',
      favorites: 'from-orange-500 to-yellow-500',
      other: 'from-gray-500 to-gray-700'
    };
    return gradients[collection?.category] || 'from-purple-500 to-pink-500';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 text-lg">Loading collection...</p>
        </div>
      </div>
    );
  }

  if (error || !collection) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 pt-20 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl">🖼️</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">Collection Not Found</h3>
          <p className="text-gray-400 mb-8">{error || 'The collection you are looking for does not exist.'}</p>
          <Link 
            to="/collections" 
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-300"
          >
            ← Back to Collections
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900/20 pt-20">
      {/* Header Section */}
      <div className="relative">
        {/* Background Gradient */}
        <div className={`absolute inset-0 bg-gradient-to-r ${getGradientClass()} opacity-10 h-96`}></div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-8">
          {/* Back Button */}
          <Link 
            to="/collections" 
            className="inline-flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-300 mb-8 group"
          >
            <span className="group-hover:-translate-x-1 transition-transform duration-300">←</span>
            <span>Back to Collections</span>
          </Link>

          {/* Collection Hero - FIXED: Equal height sections */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Cover Image - FIXED: Match height with info section */}
            <div className="lg:col-span-1">
              <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 shadow-2xl h-full flex flex-col">
                {collection.coverImage ? (
                  <img 
                    src={collection.coverImage} 
                    alt={collection.name}
                    className="w-full h-64 object-cover rounded-xl flex-shrink-0"
                  />
                ) : (
                  <div className={`w-full h-64 bg-gradient-to-r ${getGradientClass()} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <span className="text-6xl text-white/80 font-bold">
                      {collection.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                {/* Add spacing to match the info section height */}
                <div className="flex-grow"></div>
              </div>
            </div>

            {/* Collection Info - FIXED: Consistent height */}
            <div className="lg:col-span-2">
              <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 shadow-2xl h-full">
                {/* Meta Badges - FIXED: Better spacing and alignment */}
                <div className="flex flex-wrap gap-3 mb-6">
                  <span className={`px-4 py-2 rounded-full text-sm font-medium border ${
                    collection.isPublic 
                      ? 'bg-green-500/20 text-green-300 border-green-500/30' 
                      : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                  }`}>
                    {collection.isPublic ? '🌎 Public' : '🔒 Private'}
                  </span>
                  <span className="bg-white/10 text-gray-300 px-4 py-2 rounded-full text-sm font-medium border border-white/10">
                    {collection.category}
                  </span>
                  <span className="bg-white/10 text-gray-300 px-4 py-2 rounded-full text-sm font-medium border border-white/10">
                    {collection.artworks?.length || 0} artworks
                  </span>
                </div>

                {/* Title and Description - FIXED: Better spacing */}
                <div className="mb-8">
                  <h1 className="text-4xl font-bold text-white mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    {collection.name}
                  </h1>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    {collection.description || 'No description provided.'}
                  </p>
                </div>

                {/* Owner Info and Actions Container - FIXED: Align at bottom */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mt-auto">
                  {/* Owner Info */}
                  <div className="flex items-center space-x-4">
                    {collection.owner?.profileImage ? (
                      <img 
                        src={collection.owner.profileImage} 
                        alt={collection.owner.username}
                        className="w-12 h-12 rounded-full border-2 border-white/20"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                        {collection.owner?.username?.charAt(0) || 'U'}
                      </div>
                    )}
                    <div>
                      <p className="text-white font-semibold">by {collection.owner?.username || 'Unknown'}</p>
                      <p className="text-gray-400 text-sm">
                        Created {new Date(collection.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Owner Actions */}
                  {isOwner && (
                    <div className="flex flex-wrap gap-3">
                      <Link 
                        to={`/collections/${id}/edit`}
                        className="bg-white/10 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/20 transition-all duration-300 border border-white/10 flex items-center space-x-2"
                      >
                        <span>✏️</span>
                        <span>Edit Collection</span>
                      </Link>
                      <button 
                        onClick={handleDeleteCollection}
                        className="bg-red-500/20 text-red-300 px-6 py-3 rounded-xl font-semibold hover:bg-red-500/30 transition-all duration-300 border border-red-500/30 flex items-center space-x-2"
                      >
                        <span>🗑️</span>
                        <span>Delete</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Artworks Section */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 shadow-2xl">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Artworks ({collection.artworks?.length || 0})
              </h2>
              <p className="text-gray-400">
                {isOwner ? 'Manage your collection artworks' : 'Browse the artworks in this collection'}
              </p>
            </div>
            {isOwner && (
              <button 
                onClick={() => setShowAddArtworks(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 mt-4 sm:mt-0"
              >
                + Add Artworks
              </button>
            )}
          </div>

          {/* Artworks Grid */}
          {collection.artworks && collection.artworks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {collection.artworks.map((artwork) => (
                <div 
                  key={artwork._id} 
                  className="group bg-white/5 rounded-2xl border border-white/10 hover:border-purple-500/50 transition-all duration-500 overflow-hidden hover:shadow-2xl hover:shadow-purple-500/20 cursor-pointer"
                  onClick={() => handleArtworkClick(artwork)}
                >
                  {/* Artwork Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={artwork.imageUrl} 
                      alt={artwork.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                    
                    {/* Overlay Stats */}
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="flex justify-between items-center">
                        <div className="flex space-x-2">
                          <span className="bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs">
                            ❤️ {artwork.likes?.length || 0}
                          </span>
                          <span className="bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs">
                            👁️ {artwork.views || 0}
                          </span>
                        </div>
                        {isOwner && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveArtwork(artwork._id);
                            }}
                            className="bg-red-500/80 text-white px-2 py-1 rounded-full text-xs hover:bg-red-600 transition-colors duration-300"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Artwork Info */}
                  <div className="p-4">
                    <h4 className="text-white font-semibold mb-1 line-clamp-1 group-hover:text-purple-300 transition-colors duration-300">
                      {artwork.title}
                    </h4>
                    <p className="text-gray-400 text-sm line-clamp-1">
                      by {artwork.artistName}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/10">
                <span className="text-4xl">🎨</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">No Artworks Yet</h3>
              <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
                {isOwner 
                  ? 'Start building your collection by adding amazing artworks!' 
                  : 'This collection is empty. Check back later for updates.'
                }
              </p>
              {isOwner && (
                <button 
                  onClick={() => setShowAddArtworks(true)}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-300"
                >
                  + Add Your First Artwork
                </button>
              )}
            </div>
          )}
        </div>

        {/* Tags Section */}
        {collection.tags && collection.tags.length > 0 && (
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 shadow-2xl mt-6">
            <h3 className="text-xl font-bold text-white mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {collection.tags.map((tag, index) => (
                <span 
                  key={index} 
                  className="bg-white/10 text-gray-300 px-3 py-2 rounded-lg text-sm border border-white/10 hover:border-purple-500/50 transition-all duration-300"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Artworks Modal */}
      {showAddArtworks && (
        <AddArtworksModal
          collectionId={id}
          onClose={() => setShowAddArtworks(false)}
          onArtworksAdded={handleArtworksAdded}
        />
      )}
    </div>
  );
};

export default CollectionDetail;