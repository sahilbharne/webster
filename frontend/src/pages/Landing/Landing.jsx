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

  // If user is signed in, show the regular landing page
  if (isSignedIn) {
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
              <Link 
                to="/discover" 
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-300"
              >
                Explore Artworks
              </Link>
              <Link 
                to="/profile" 
                className="bg-white/10 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/20 transition-all duration-300 border border-white/20"
              >
                Your Profile
              </Link>
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
      </div>
    );
  }

  // If user is signed out, show the split layout
  return (
    <div className="min-h-screen bg-black">
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Left Side - Website Info */}
        <div className="lg:w-1/2 p-8 lg:p-12 flex items-center justify-center">
          <div className="max-w-2xl">
            <Link to="/" className="inline-block mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">GG</span>
                </div>
                <span className="text-white text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Grand Gallery
                </span>
              </div>
            </Link>

            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Where Art Finds Its{' '}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Digital Home
              </span>
            </h1>

            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Join thousands of artists and art enthusiasts in our growing community. 
              Discover amazing artwork, create collections, and share your creativity with the world.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="text-2xl mt-1">{feature.icon}</div>
                  <div>
                    <h3 className="text-white font-semibold">{feature.title}</h3>
                    <p className="text-gray-400 text-sm">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-gray-400 text-sm">
              <span className="text-white font-semibold">10K+</span> Artists •{' '}
              <span className="text-white font-semibold">50K+</span> Artworks •{' '}
              <span className="text-white font-semibold">100K+</span> Community
            </div>
          </div>
        </div>

        {/* Right Side - Signup Form */}
        <div className="lg:w-1/2 bg-gradient-to-br from-gray-900 to-black p-8 lg:p-12 flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">
                Join Grand Gallery
              </h2>
              <p className="text-gray-400">
                Create your account and start your artistic journey
              </p>
            </div>
            
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <SignupEmbedded />
            </div>

            <div className="text-center mt-6">
              <p className="text-gray-400">
                Already have an account?{' '}
                <Link to="/login" className="text-purple-400 hover:text-purple-300 font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Embedded Signup Component for the landing page
const SignupEmbedded = () => {
  return (
    <div>
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-white mb-2">Get Started</h3>
        <p className="text-gray-400 text-sm">Choose your sign up method</p>
      </div>
      
      <div className="space-y-4">
        <Link 
          to="/signup" 
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 rounded-lg font-semibold hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 block text-center"
        >
          Create Account
        </Link>
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-900 text-gray-400">Or continue with</span>
          </div>
        </div>
        
        <Link 
          to="/login" 
          className="w-full bg-white/10 text-white py-3 px-4 rounded-lg font-semibold hover:bg-white/20 transition-all duration-300 border border-white/20 block text-center"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default Landing;