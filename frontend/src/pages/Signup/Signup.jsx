import React from 'react';
import { SignUp } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';

const Signup = () => {
  return (
    <div className="min-h-screen pt-20 bg-black flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">GG</span>
              </div>
              <span className="text-white text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Grand Gallery
              </span>
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Join Grand Gallery</h1>
          <p className="text-gray-400">Create your account to start exploring</p>
        </div>
        
        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
          <SignUp 
            routing="path"
            path="/signup"
            redirectUrl="/dashboard"
            signInUrl="/login"
          />
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
  );
};

export default Signup;