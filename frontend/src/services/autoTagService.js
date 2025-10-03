const API_BASE_URL = 'http://localhost:3001/api';

// Generate tags for an image
export const autoTagImage = async (imageFile) => {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await fetch(`${API_BASE_URL}/auto-tag`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Auto-tag service error:', error);
    throw new Error('Failed to generate tags for image');
  }
};

// Upload artwork with auto-generated tags
export const uploadArtworkWithTags = async (artworkData) => {
  try {
    const formData = new FormData();
    formData.append('image', artworkData.image);
    formData.append('title', artworkData.title);
    formData.append('description', artworkData.description);
    formData.append('artistName', artworkData.artistName);
    formData.append('category', artworkData.category);
    formData.append('price', artworkData.price.toString());
    formData.append('isPublic', 'true');
    
    if (artworkData.customTags) {
      formData.append('customTags', artworkData.customTags);
    }

    const response = await fetch(`${API_BASE_URL}/upload-with-tags`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Upload with tags error:', error);
    throw new Error('Failed to upload artwork with tags');
  }
};