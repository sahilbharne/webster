import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { artworkAPI } from "../../utils/api";
import { likeService } from "../../services/likeService";
import { viewService } from "../../services/viewService";
import { collectionService } from "../../services/collectionService";
import { followService } from "../../services/followService";
import { useNavigate } from "react-router-dom";
import "./Discover.css";

const Discover = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [likingArtwork, setLikingArtwork] = useState(null);
  const [followingArtist, setFollowingArtist] = useState(null);
  const [unfollowingArtist, setUnfollowingArtist] = useState(null);

  // Modal state
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Collection state
  const [userCollections, setUserCollections] = useState([]);
  const [showCollectionDropdown, setShowCollectionDropdown] = useState(false);
  const [addingToCollection, setAddingToCollection] = useState(null);

  // Message state
  const [message, setMessage] = useState("");

  // Follow state
  const [followingArtists, setFollowingArtists] = useState(new Set());

  useEffect(() => {
    fetchArtworks();
    if (user) {
      fetchFollowingArtists();
    }
  }, [user]);

  // Fetch user's collections when modal opens
  useEffect(() => {
    if (isModalOpen && user && selectedArtwork) {
      fetchUserCollections();
    }
  }, [isModalOpen, user, selectedArtwork]);

  // Fetch user's collections
  const fetchUserCollections = async () => {
    try {
      const response = await collectionService.getUserCollections(user.id);
      setUserCollections(response.collections || []);
    } catch (error) {
      console.error('Error fetching user collections:', error);
    }
  };

  // Fetch artists the user is following
  const fetchFollowingArtists = async () => {
    try {
      const response = await followService.getFollowing(user.id);
      console.log("Backend response for who I follow:", response.following);
      const followingIds = new Set(response.following?.map(artist => artist.clerkUserId) || []);
      console.log("State 'followingArtists' is now:", followingIds);
      setFollowingArtists(followingIds);
    } catch (error) {
      console.error('Error fetching following artists:', error);
    }
  };

  // Follow artist - FIXED VERSION
const handleFollowArtist = async (artistId, artistName, e) => {
  if (e) e.stopPropagation();

  if (!user) {
    alert("Please sign in to follow artists");
    return;
  }

  if (!user.id) {
    console.error("Follower ID (user.id) is missing.");
    setMessage("❌ Cannot follow artist, your session may still be loading. Please wait a moment and try again.");
    return;
  }

  if (artistId === user.id) {
    setMessage("❌ You cannot follow yourself");
    return;
  }

  setFollowingArtist(artistId);

  try {
    const response = await followService.followArtist(artistId, user.id);
    console.log("Follow API response:", response);

    // FIX: Check response.data.success (the actual response structure)
    if (response && response.data && response.data.success) {
      // Update local state
      setFollowingArtists(prev => {
        const newFollowing = new Set(prev);
        newFollowing.add(artistId);
        console.log("Updated followingArtists:", newFollowing);
        return newFollowing;
      });

      // Show success message
      setMessage(`✅ Following ${artistName}`);

      // Update artworks to reflect follow status
      setArtworks(prevArtworks =>
        prevArtworks.map(artwork =>
          artwork.clerkUserId === artistId
            ? {
              ...artwork,
              isFollowing: true
            }
            : artwork
        )
      );

      // Update modal artwork if it's the same artist
      if (selectedArtwork && selectedArtwork.clerkUserId === artistId) {
        setSelectedArtwork(prev => ({
          ...prev,
          isFollowing: true
        }));
      }
    } else {
      console.error("Follow API returned unsuccessful:", response);
      setMessage(`❌ Failed to follow artist: ${response?.data?.error || 'Unknown error'}`);
    }
  } catch (error) {
    console.error("Error following artist:", error);
    setMessage(`❌ Failed to follow artist: ${error.message}`);
  } finally {
    setFollowingArtist(null);
  }
};

  // Unfollow artist - FIXED VERSION
const handleUnfollowArtist = async (artistId, artistName, e) => {
  if (e) e.stopPropagation();

  if (!user) {
    alert("Please sign in to unfollow artists");
    return;
  }

  if (!user.id) {
    console.error("Follower ID (user.id) is missing.");
    setMessage("❌ Cannot unfollow artist, your session may still be loading.");
    return;
  }

  setUnfollowingArtist(artistId);

  try {
    const response = await followService.unfollowArtist(artistId, user.id);
    console.log("Unfollow API response:", response);

    // FIX: Check response.data.success
    if (response && response.data && response.data.success) {
      // Update local state
      setFollowingArtists(prev => {
        const newFollowing = new Set(prev);
        newFollowing.delete(artistId);
        console.log("Updated followingArtists after unfollow:", newFollowing);
        return newFollowing;
      });

      // Show success message
      setMessage(`👋 Unfollowed ${artistName}`);

      // Update artworks to reflect follow status
      setArtworks(prevArtworks =>
        prevArtworks.map(artwork =>
          artwork.clerkUserId === artistId
            ? {
              ...artwork,
              isFollowing: false
            }
            : artwork
        )
      );

      // Update modal artwork if it's the same artist
      if (selectedArtwork && selectedArtwork.clerkUserId === artistId) {
        setSelectedArtwork(prev => ({
          ...prev,
          isFollowing: false
        }));
      }
    } else {
      console.error("Unfollow API returned unsuccessful:", response);
      setMessage(`❌ Failed to unfollow artist: ${response?.data?.error || 'Unknown error'}`);
    }
  } catch (error) {
    console.error("Error unfollowing artist:", error);
    setMessage(`❌ Failed to unfollow artist: ${error.message}`);
  } finally {
    setUnfollowingArtist(null);
  }
};

  // Add artwork to collection
  const handleAddToCollection = async (collectionId, collectionName) => {
    if (!user || !selectedArtwork) return;

    // Prevent adding if artwork doesn't belong to user
    if (selectedArtwork.clerkUserId !== user.id) {
      setMessage("❌ You can only add your own artworks to collections");
      setShowCollectionDropdown(false);
      return;
    }

    setAddingToCollection(collectionId);

    try {
      await collectionService.addArtwork(collectionId, selectedArtwork._id, user.id);

      // Show success message
      setMessage(`✅ Added to "${collectionName}"!`);
      setShowCollectionDropdown(false);

      // Refresh collections to update counts
      fetchUserCollections();

    } catch (error) {
      console.error('Error adding to collection:', error);
      setMessage(`❌ Failed to add to collection: ${error.message}`);
    } finally {
      setAddingToCollection(null);
    }
  };

  const handleCreateNewCollection = () => {
    navigate('/collections/create');
  };

  const fetchArtworks = async () => {
    try {
      setLoading(true);
      const response = await artworkAPI.getAll();

      let artworksData = [];
      if (Array.isArray(response.data)) {
        artworksData = response.data;
      } else if (response.data && Array.isArray(response.data.artworks)) {
        artworksData = response.data.artworks;
      } else if (response.data && Array.isArray(response.data.data)) {
        artworksData = response.data.data;
      }

      // PRE-FILTER: Only check follow status for artworks with valid users
      if (user) {
        // First, identify which artworks have valid users
        const artworksWithValidUsers = await Promise.all(
          artworksData.map(async (artwork) => {
            if (!artwork.clerkUserId) {
              return { ...artwork, hasValidUser: false };
            }
            
            // Check if this user exists in our database
            try {
              const userCheck = await followService.checkFollowStatus(artwork.clerkUserId, user.id);
              return {
                ...artwork,
                hasValidUser: userCheck.artistExists !== false,
                preCheckedFollow: userCheck.isFollowing
              };
            } catch (error) {
              return { ...artwork, hasValidUser: false };
            }
          })
        );

        // Now process only valid artworks
        const artworksWithStatus = await Promise.all(
          artworksWithValidUsers.map(async (artwork) => {
            try {
              const artworkData = {
                ...artwork,
                hasLiked: false,
                likesCount: artwork.likes ? artwork.likes.length : 0,
                views: artwork.views || 0,
                isFollowing: artwork.preCheckedFollow || false
              };

              // Get like status
              try {
                const likeStatus = await likeService.getLikeStatus(artwork._id, user.id);
                artworkData.hasLiked = likeStatus.hasLiked;
                artworkData.likesCount = likeStatus.likesCount;
              } catch (likeError) {
                console.warn(`Like status failed for ${artwork._id}:`, likeError.message);
              }

              // Only get fresh follow status if user is valid AND we need to
              if (artwork.hasValidUser && !artwork.preCheckedFollow) {
                try {
                  const followStatus = await followService.checkFollowStatus(artwork.clerkUserId, user.id);
                  artworkData.isFollowing = followStatus.isFollowing;
                } catch (followError) {
                  console.warn(`Follow status failed:`, followError.message);
                }
              }

              return artworkData;
            } catch (error) {
              console.error(`Error processing artwork ${artwork._id}:`, error);
              return {
                ...artwork,
                hasLiked: false,
                likesCount: 0,
                views: 0,
                isFollowing: false
              };
            }
          })
        );
        
        setArtworks(artworksWithStatus);
      } else {
        // For non-logged in users
        setArtworks(artworksData.map(artwork => ({
          ...artwork,
          hasLiked: false,
          likesCount: artwork.likes ? artwork.likes.length : 0,
          views: artwork.views || 0,
          isFollowing: false
        })));
      }

      setError("");
    } catch (err) {
      console.error("❌ Error fetching artworks:", err);
      setError("Failed to load artworks.");
      setArtworks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleArtworkClick = async (artwork) => {
    // Set the selected artwork and open modal
    setSelectedArtwork(artwork);
    setIsModalOpen(true);

    // Record view count
    try {
      if (user) {
        await viewService.recordView(artwork._id, user.id);
      } else {
        await viewService.recordView(artwork._id);
      }

      // Update local views count
      updateLocalViews(artwork._id);

    } catch (error) {
      console.error('Error recording view:', error);
    }
  };

  const handleLike = async (artworkId, e) => {
    if (e) e.stopPropagation();

    if (!user) {
      alert("Please sign in to like artworks");
      return;
    }

    setLikingArtwork(artworkId);

    try {
      const result = await likeService.toggleLike(artworkId, user.id);

      if (result.success) {
        // Update local state for grid
        setArtworks(prevArtworks =>
          prevArtworks.map(artwork =>
            artwork._id === artworkId
              ? {
                ...artwork,
                hasLiked: result.liked,
                likesCount: result.likes
              }
              : artwork
          )
        );

        // Update modal artwork if it's the same one
        if (selectedArtwork && selectedArtwork._id === artworkId) {
          setSelectedArtwork(prev => ({
            ...prev,
            hasLiked: result.liked,
            likesCount: result.likes
          }));
        }
      }
    } catch (error) {
      console.error("Error liking artwork:", error);
      alert("Failed to like artwork: " + error.message);
    } finally {
      setLikingArtwork(null);
    }
  };

  const updateLocalViews = (artworkId) => {
    setArtworks(prevArtworks =>
      prevArtworks.map(artwork =>
        artwork._id === artworkId
          ? {
            ...artwork,
            views: (artwork.views || 0) + 1
          }
          : artwork
      )
    );

    // Update modal artwork if it's the same one
    if (selectedArtwork && selectedArtwork._id === artworkId) {
      setSelectedArtwork(prev => ({
        ...prev,
        views: (prev.views || 0) + 1
      }));
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedArtwork(null);
    setMessage("");
    setShowCollectionDropdown(false);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowCollectionDropdown(false);
      closeModal();
    }
  };

  const filteredArtworks = Array.isArray(artworks) ? artworks.filter(artwork =>
    artwork &&
    (artwork.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      artwork.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      artwork.artistName?.toLowerCase().includes(searchTerm.toLowerCase()))
  ) : [];

  if (loading) {
    return (
      <div className="pt-20 pb-10 px-6">
        <div className="container mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
          <p className="text-gray-300 mt-4">Loading artworks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-10 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Discover Artworks</h1>
          <p className="text-gray-300 text-lg">Explore amazing artwork from our community</p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <input
            type="text"
            placeholder="Search artworks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-full px-6 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {error && (
          <div className="max-w-2xl mx-auto mb-6 p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
            <p className="text-yellow-200 text-center">{error}</p>
          </div>
        )}

        {/* Artworks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArtworks.map((artwork) => (
            <div
              key={artwork._id}
              className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer transform hover:scale-105"
              onClick={() => handleArtworkClick(artwork)}
            >
              <img
                src={artwork.imageUrl}
                alt={artwork.title}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-white font-bold text-lg mb-2">{artwork.title}</h3>

              {/* Artist Info with Follow/Unfollow Buttons */}
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-400">by {artwork.artistName}</p>
                {user && artwork.clerkUserId !== user.id && (
                  <div className="flex space-x-2">
                    {/* Follow Button - Shows when NOT following */}
                    {!artwork.isFollowing && (
                      <button
                        onClick={(e) => handleFollowArtist(artwork.clerkUserId, artwork.artistName, e)}
                        disabled={followingArtist === artwork.clerkUserId}
                        className="flex items-center space-x-1 px-3 py-1 rounded-full text-xs bg-white/10 text-gray-300 border border-white/20 hover:bg-white/20 hover:text-white transition-all duration-300 disabled:opacity-50"
                      >
                        {followingArtist === artwork.clerkUserId ? (
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current"></div>
                        ) : (
                          <span>+ Follow</span>
                        )}
                      </button>
                    )}
                    
                    {/* Unfollow Button - Shows when following */}
                    {artwork.isFollowing && (
                      <button
                        onClick={(e) => handleUnfollowArtist(artwork.clerkUserId, artwork.artistName, e)}
                        disabled={unfollowingArtist === artwork.clerkUserId}
                        className="flex items-center space-x-1 px-3 py-1 rounded-full text-xs bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30 transition-all duration-300 disabled:opacity-50"
                      >
                        {unfollowingArtist === artwork.clerkUserId ? (
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current"></div>
                        ) : (
                          <span>✓ Following</span>
                        )}
                      </button>
                    )}
                  </div>
                )}
              </div>

              <p className="text-gray-300 text-sm mb-4 line-clamp-2">{artwork.description}</p>
              <div className="flex justify-between items-center">
                <button
                  onClick={(e) => handleLike(artwork._id, e)}
                  disabled={likingArtwork === artwork._id || !user}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${artwork.hasLiked
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30'
                    : 'bg-white/10 text-gray-300 border border-white/20 hover:bg-white/20 hover:text-white'
                    } ${!user ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {likingArtwork === artwork._id ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                  ) : (
                    <span>{artwork.hasLiked ? '❤️' : '🤍'}</span>
                  )}
                  <span>{artwork.likesCount || 0}</span>
                </button>
                <span className="text-gray-400 text-sm flex items-center">
                  👁️ {artwork.views || 0}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Artwork Detail Modal */}
        {isModalOpen && selectedArtwork && (
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={handleBackdropClick}
          >
            <div className="bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-white/10">
              <div className="relative">
                {/* Close Button */}
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all duration-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2">
                  {/* Artwork Image */}
                  <div className="lg:sticky lg:top-0">
                    <img
                      src={selectedArtwork.imageUrl}
                      alt={selectedArtwork.title}
                      className="w-full h-64 lg:h-full object-cover rounded-t-2xl lg:rounded-l-2xl lg:rounded-tr-none"
                    />
                  </div>

                  {/* Artwork Details */}
                  <div className="p-6">
                    <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">
                      {selectedArtwork.title}
                    </h2>

                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {selectedArtwork.artistName?.charAt(0) || 'A'}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white font-medium">by {selectedArtwork.artistName}</p>
                            <p className="text-gray-400 text-sm">{selectedArtwork.category}</p>
                          </div>
                          {/* Follow/Unfollow Buttons in Modal */}
                          {user && selectedArtwork.clerkUserId !== user.id && (
                            <div className="flex space-x-2">
                              {/* Follow Button */}
                              {!selectedArtwork.isFollowing && (
                                <button
                                  onClick={(e) => handleFollowArtist(selectedArtwork.clerkUserId, selectedArtwork.artistName, e)}
                                  disabled={followingArtist === selectedArtwork.clerkUserId}
                                  className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white/10 text-gray-300 border border-white/20 hover:bg-white/20 hover:text-white transition-all duration-300 disabled:opacity-50"
                                >
                                  {followingArtist === selectedArtwork.clerkUserId ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                                  ) : (
                                    <>
                                      <span>+</span>
                                      <span>Follow</span>
                                    </>
                                  )}
                                </button>
                              )}
                              
                              {/* Unfollow Button */}
                              {selectedArtwork.isFollowing && (
                                <button
                                  onClick={(e) => handleUnfollowArtist(selectedArtwork.clerkUserId, selectedArtwork.artistName, e)}
                                  disabled={unfollowingArtist === selectedArtwork.clerkUserId}
                                  className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30 transition-all duration-300 disabled:opacity-50"
                                >
                                  {unfollowingArtist === selectedArtwork.clerkUserId ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                                  ) : (
                                    <>
                                      <span>✓</span>
                                      <span>Following</span>
                                    </>
                                  )}
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                        {user && (
                          <p className="text-xs mt-1">
                            {selectedArtwork.clerkUserId === user.id ? (
                              <span className="text-green-400">⭐ Your artwork</span>
                            ) : (
                              <span className="text-blue-400">👤 Other user's artwork</span>
                            )}
                          </p>
                        )}
                      </div>
                    </div>

                    <p className="text-gray-300 mb-6 leading-relaxed">
                      {selectedArtwork.description}
                    </p>

                    {/* Tags */}
                    {selectedArtwork.tags && selectedArtwork.tags.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-white font-semibold mb-2">Tags</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedArtwork.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="bg-purple-600/20 text-purple-300 px-3 py-1 rounded-full text-sm border border-purple-500/30"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Engagement Stats */}
                    <div className="modal-stats">
                      <div className="modal-actions">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLike(selectedArtwork._id, e);
                          }}
                          disabled={likingArtwork === selectedArtwork._id || !user}
                          className={`modal-like-btn ${selectedArtwork.hasLiked ? 'liked' : ''}`}
                        >
                          {likingArtwork === selectedArtwork._id ? (
                            <div className="like-spinner"></div>
                          ) : (
                            <span>{selectedArtwork.hasLiked ? '❤️' : '🤍'}</span>
                          )}
                          <span>{selectedArtwork.likesCount || 0} Likes</span>
                        </button>

                        {/* Message Display */}
                        {message && (
                          <div className={`message-display ${message.includes('❌') ? 'error' : 'success'}`}>
                            {message}
                          </div>
                        )}

                        {/* Add to Collection Button */}
                        {user && selectedArtwork.clerkUserId === user.id && (
                          <div className="collection-dropdown-container">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowCollectionDropdown(!showCollectionDropdown);
                              }}
                              className="add-to-collection-btn"
                            >
                              📁 Add to Collection
                            </button>

                            {showCollectionDropdown && (
                              <div className="collection-dropdown">
                                <div className="dropdown-header">
                                  <h4>Add to Collection</h4>
                                  <button
                                    onClick={() => setShowCollectionDropdown(false)}
                                    className="close-dropdown"
                                  >
                                    ×
                                  </button>
                                </div>

                                <div className="collections-list">
                                  {userCollections.length > 0 ? (
                                    userCollections.map(collection => (
                                      <button
                                        key={collection._id}
                                        onClick={() => handleAddToCollection(collection._id, collection.name)}
                                        disabled={addingToCollection === collection._id}
                                        className="collection-option"
                                      >
                                        {addingToCollection === collection._id ? (
                                          <div className="small-spinner"></div>
                                        ) : (
                                          <span className="collection-icon">🖼️</span>
                                        )}
                                        <div className="collection-info">
                                          <span className="collection-name">{collection.name}</span>
                                          <span className="artwork-count">
                                            {collection.artworks?.length || 0} artworks
                                          </span>
                                        </div>
                                        {collection.artworks?.includes(selectedArtwork._id) && (
                                          <span className="already-added">✓</span>
                                        )}
                                      </button>
                                    ))
                                  ) : (
                                    <div className="no-collections-message">
                                      <p>No collections yet</p>
                                    </div>
                                  )}
                                </div>

                                <div className="dropdown-actions">
                                  <button
                                    onClick={handleCreateNewCollection}
                                    className="create-collection-btn"
                                  >
                                    + Create New Collection
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {user && selectedArtwork.clerkUserId !== user.id && (
                          <div className="text-gray-400 text-sm mt-2 text-center">
                            <p>You can only add your own artworks to collections</p>
                          </div>
                        )}

                        <div className="modal-views">
                          <span>👁️</span>
                          <span>{selectedArtwork.views || 0} Views</span>
                        </div>
                      </div>

                      {/* Additional Info */}
                      <div className="text-right text-sm text-gray-400">
                        <p>Uploaded {new Date(selectedArtwork.createdAt).toLocaleDateString()}</p>
                        {selectedArtwork.dimensions && (
                          <p>{selectedArtwork.dimensions.width} × {selectedArtwork.dimensions.height} {selectedArtwork.dimensions.unit}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {filteredArtworks.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No artworks found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Discover;