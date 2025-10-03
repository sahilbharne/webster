import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { artworkAPI } from "../../utils/api";
import "./Discover.css";

const Discover = () => {
  const { user } = useUser();
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchArtworks();
  }, []);

  const fetchArtworks = async () => {
    try {
      setLoading(true);
      console.log("🔄 Fetching artworks from API...");
      const response = await artworkAPI.getAll();
      console.log("✅ API Response:", response);
      console.log("📦 Response data:", response.data);
      
      // Handle different response structures
      let artworksData = [];
      
      if (Array.isArray(response.data)) {
        // If response.data is directly an array
        artworksData = response.data;
      } else if (response.data && Array.isArray(response.data.artworks)) {
        // If response.data has an artworks property
        artworksData = response.data.artworks;
      } else if (response.data && Array.isArray(response.data.data)) {
        // If response.data has a data property
        artworksData = response.data.data;
      } else {
        // If it's an object or unexpected format
        console.warn("⚠️ Unexpected API response format:", response.data);
        artworksData = [];
      }
      
      console.log("🎨 Processed artworks:", artworksData);
      setArtworks(artworksData);
      setError("");
    } catch (err) {
      console.error("❌ Error fetching artworks:", err);
      setError("Failed to load artworks. Using sample data.");
      
      // Fallback data
      setArtworks([
        {
          _id: "1",
          title: "Digital Dreams",
          artistName: "Alex Chen",
          description: "A beautiful digital artwork showcasing futuristic landscapes",
          imageUrl: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop",
          likes: 1200,
          views: 2500
        },
        {
          _id: "2",
          title: "Sunset Mountains", 
          artistName: "Nature Lover",
          description: "A beautiful painting of mountains during sunset",
          imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
          likes: 15,
          views: 89
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Ensure artworks is always an array before filtering
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

        {/* Error Message */}
        {error && (
          <div className="max-w-2xl mx-auto mb-6 p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
            <p className="text-yellow-200 text-center">{error}</p>
          </div>
        )}

        {/* Debug Info */}
        <div className="max-w-2xl mx-auto mb-6 p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg">
          <p className="text-blue-200 text-center">
            Artworks loaded: {Array.isArray(artworks) ? artworks.length : 'Invalid format'}
          </p>
        </div>

        {/* Artworks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArtworks.map((artwork) => (
            <div key={artwork._id} className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <img 
                src={artwork.imageUrl} 
                alt={artwork.title}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-white font-bold text-lg mb-2">{artwork.title}</h3>
              <p className="text-gray-400 mb-2">by {artwork.artistName}</p>
              <p className="text-gray-300 text-sm mb-4">{artwork.description}</p>
              <div className="flex justify-between text-gray-400">
                <span>❤️ {artwork.likes}</span>
                <span>👁️ {artwork.views}</span>
              </div>
            </div>
          ))}
        </div>

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