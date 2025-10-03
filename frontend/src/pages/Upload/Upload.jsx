import React, { useState } from 'react';

const Upload = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    tags: '',
    isPublic: true
  });
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    
    // Simulate upload
    setTimeout(() => {
      console.log('Uploading:', formData);
      alert('Artwork uploaded successfully! (This is a demo)');
      setFormData({
        title: '',
        description: '',
        category: '',
        tags: '',
        isPublic: true
      });
      setIsUploading(false);
    }, 2000);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="pt-20 pb-10 px-6">
      <div className="container mx-auto max-w-2xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Upload Artwork</h1>
          <p className="text-gray-300 text-lg">Share your creativity with the world</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/5 rounded-2xl p-8 border border-white/10">
          {/* Upload Area */}
          <div className="border-2 border-dashed border-white/20 rounded-2xl p-12 text-center mb-6 hover:border-white/40 transition-colors cursor-pointer">
            <div className="text-4xl mb-4">📁</div>
            <p className="text-white font-semibold mb-2">Drop your artwork here</p>
            <p className="text-gray-400 text-sm">or click to browse files</p>
            <p className="text-gray-500 text-xs mt-2">PNG, JPG, GIF up to 10MB</p>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            <div>
              <label className="text-white font-medium mb-2 block">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter artwork title"
              />
            </div>

            <div>
              <label className="text-white font-medium mb-2 block">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Describe your artwork..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-white font-medium mb-2 block">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Select category</option>
                  <option value="digital">Digital Art</option>
                  <option value="photography">Photography</option>
                  <option value="painting">Painting</option>
                  <option value="3d">3D Art</option>
                </select>
              </div>

              <div>
                <label className="text-white font-medium mb-2 block">Tags</label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., abstract, nature, digital"
                />
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="isPublic"
                checked={formData.isPublic}
                onChange={(e) => setFormData({...formData, isPublic: e.target.checked})}
                className="w-4 h-4 text-purple-500 bg-white/10 border-white/20 rounded focus:ring-purple-500 focus:ring-2"
              />
              <label className="text-white">Make this artwork public</label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isUploading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-semibold text-lg hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? 'Uploading...' : 'Upload Artwork'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Upload;