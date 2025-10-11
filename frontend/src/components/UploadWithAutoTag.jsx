import React, { useState } from 'react';
import { autoTagImage } from '../services/autoTagService';

const UploadWithAutoTag = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [generatedTags, setGeneratedTags] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setGeneratedTags([]);
      setMessage('');
    }
  };

  const generateTags = async () => {
    if (!selectedFile) {
      setMessage('Please select an image first');
      return;
    }

    setIsLoading(true);
    setMessage('Analyzing image...');

    try {
      const result = await autoTagImage(selectedFile);
      
      if (result.success) {
        setGeneratedTags(result.tags);
        setMessage(`✅ Generated ${result.tags.length} tags automatically!`);
      } else {
        setMessage('❌ Failed to generate tags');
      }
    } catch (error) {
      console.error('Tag generation error:', error);
      setMessage('❌ Error generating tags. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = () => {
    
    console.log('Uploading with tags:', generatedTags);
    setMessage('🎨 Artwork uploaded with auto-generated tags!');
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white/5 rounded-2xl border border-white/10">
      <h2 className="text-2xl font-bold text-white mb-6">Upload Artwork with Auto-Tags</h2>
      
      {/* File Selection */}
      <div className="mb-6">
        <label className="block text-gray-300 mb-2">Select Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="w-full text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700"
        />
      </div>

      {/* Preview */}
      {previewUrl && (
        <div className="mb-6">
          <label className="block text-gray-300 mb-2">Preview</label>
          <img 
            src={previewUrl} 
            alt="Preview" 
            className="max-w-full h-64 object-cover rounded-lg border border-white/20"
          />
        </div>
      )}

      {/* Generate Tags Button */}
      {selectedFile && !isLoading && generatedTags.length === 0 && (
        <button
          onClick={generateTags}
          className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 mb-4"
        >
          🏷️ Generate Auto-Tags
        </button>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-gray-400 mt-2">Analyzing image with AI...</p>
        </div>
      )}

      {/* Generated Tags */}
      {generatedTags.length > 0 && (
        <div className="mb-6">
          <label className="block text-gray-300 mb-2">Auto-Generated Tags</label>
          <div className="flex flex-wrap gap-2">
            {generatedTags.map((tag, index) => (
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

      {/* Message */}
      {message && (
        <div className={`p-3 rounded-lg mb-4 ${
          message.includes('✅') ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 
          message.includes('❌') ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 
          'bg-blue-500/20 text-blue-300 border border-blue-500/30'
        }`}>
          {message}
        </div>
      )}

      {/* Upload Button */}
      {generatedTags.length > 0 && (
        <button
          onClick={handleUpload}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300"
        >
          📤 Upload Artwork with Tags
        </button>
      )}
    </div>
  );
};

export default UploadWithAutoTag;