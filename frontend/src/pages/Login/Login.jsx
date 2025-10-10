import React from 'react';
import { SignIn } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';

const Login = () => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Compact Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">AH</span>
            </div>
            <span className="text-white text-xl font-bold">ArtHive</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Welcome Back</h1>
          <p className="text-gray-400 text-sm">Sign in to continue</p>
        </div>

        {/* Compact Login Form */}
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <SignIn 
            routing="path"
            path="/login"
            redirectUrl=""
            signUpUrl="/signup"
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "bg-transparent shadow-none p-0 m-0 w-full",
                header: "hidden",
                socialButtonsBlock: "flex flex-col space-y-2 mb-4",
                socialButtons: "w-full",
                socialButton: 
                  "w-full bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-all duration-200 rounded-lg py-2 px-3 text-sm font-medium",
                dividerLine: "bg-gray-600 my-3",
                dividerText: "text-gray-400 text-xs px-2",
                form: "space-y-3",
                formField: "space-y-1",
                formFieldLabel: "text-white font-medium text-xs",
                formFieldInput: 
                  "w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-400 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-200",
                formButtonPrimary:
                  "w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 px-3 rounded-lg font-medium hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-200 mt-3 text-sm",
                footer: "hidden",
                formResendCodeLink: "text-purple-400 hover:text-purple-300 text-xs",
                alert: "bg-red-500/10 border border-red-500/20 text-red-300 rounded-lg p-2 text-xs mt-2",
                alertText: "text-red-300 text-xs",
                alertIcon: "text-red-400 w-3 h-3",
                forgotPasswordLink: "text-purple-400 hover:text-purple-300 text-xs block text-center mt-2",
                formFieldAction: "text-xs"
              },
              layout: {
                socialButtonsPlacement: "top"
              },
              variables: {
                colorPrimary: "#8B5CF6",
                colorText: "#FFFFFF",
                colorTextSecondary: "#9CA3AF",
                colorBackground: "transparent",
                colorInputBackground: "rgba(255, 255, 255, 0.05)",
                colorInputText: "#FFFFFF",
                fontSize: "14px"
              }
            }}
          />
        </div>

        {/* Compact Footer */}
        <div className="text-center mt-4">
          <p className="text-gray-400 text-xs">
            New to ArtHive?{' '}
            <Link 
              to="/signup" 
              className="text-purple-400 hover:text-purple-300 font-medium"
            >
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;