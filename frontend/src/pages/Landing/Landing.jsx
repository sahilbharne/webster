import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import './Landing.css';

const Landing = () => {
  const { isSignedIn } = useUser();

  const features = [
    {
      icon: '🎨',
      title: 'Discover Art',
      description: 'Explore thousands of artworks from talented artists worldwide'
    },
    {
      icon: '🖼️',
      title: 'Create Collections',
      description: 'Organize your favorite artworks into personalized collections'
    },
    {
      icon: '👥',
      title: 'Connect with Artists',
      description: 'Follow your favorite artists and discover new talents'
    },
    {
      icon: '💫',
      title: 'Share Your Work',
      description: 'Showcase your creativity and build your artistic portfolio'
    }
  ];

  const trendingArtworks = [
    {
      id: 1,
      title: "Digital Dreams",
      artist: "Alex Chen",
      likes: "1.2K",
      image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop"
    },
    {
      id: 2,
      title: "Urban Nights",
      artist: "Maria Rodriguez",
      likes: "892",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop"
    },
    {
      id: 3,
      title: "Cosmic Harmony",
      artist: "James Wilson",
      likes: "2.1K",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop"
    }
  ];

  return (
    <div className="landing">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container mx-auto px-6 py-20 text-center">
          <h1 className="text-6xl font-bold text-white mb-6">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Grand Gallery
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Discover, create, and share amazing artwork with a global community of artists and art lovers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isSignedIn ? (
              <>
                <Link 
                  to="/discover" 
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-300"
                >
                  Explore Artworks
                </Link>
                <Link 
                  to="/dashboard" 
                  className="bg-white/10 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/20 transition-all duration-300 border border-white/20"
                >
                  Your Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link 
                  to="/signup" 
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-300"
                >
                  Get Started Free
                </Link>
                <Link 
                  to="/discover" 
                  className="bg-white/10 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/20 transition-all duration-300 border border-white/20"
                >
                  Browse Artworks
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-white text-center mb-12">
            Why Choose Grand Gallery?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 group"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Artworks */}
      <section className="trending-section py-20 bg-white/5">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-white text-center mb-12">
            Trending Artworks
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {trendingArtworks.map((artwork) => (
              <div 
                key={artwork.id} 
                className="bg-black/20 rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300 group"
              >
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={artwork.image} 
                    alt={artwork.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">
                    {artwork.title}
                  </h3>
                  <p className="text-gray-400 mb-3">by {artwork.artist}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 flex items-center">
                      ❤️ {artwork.likes}
                    </span>
                    <Link 
                      to="/discover" 
                      className="text-purple-400 hover:text-purple-300 font-medium text-sm"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link 
              to="/discover" 
              className="bg-white/10 text-white px-8 py-3 rounded-full font-semibold hover:bg-white/20 transition-all duration-300 border border-white/20"
            >
              View All Artworks
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Start Your Artistic Journey?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of artists and art enthusiasts in our growing community.
          </p>
          {!isSignedIn && (
            <Link 
              to="/signup" 
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 inline-block"
            >
              Create Your Account
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Landing;