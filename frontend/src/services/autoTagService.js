const API_BASE_URL = 'http://localhost:3001/api';

// Generate tags for an image


export const autoTagImage = async (file, clerkUserId) => {
  const formData = new FormData();
  formData.append('image', file);
  if (clerkUserId) {
    formData.append('clerkUserId', clerkUserId);
  }

  try {
    const response = await fetch('http://localhost:3001/api/auto-tag', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Auto-tag failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Auto-tag service error:', error);
    throw error;
  }
};

// Updated upload function
export const uploadArtworkWithTags = async (artworkData, clerkUserId) => {
  const formData = new FormData();
  
  // Append file and form data
  formData.append('image', artworkData.image);
  formData.append('title', artworkData.title);
  formData.append('description', artworkData.description || '');
  formData.append('category', artworkData.category || 'digital');
  formData.append('customTags', artworkData.customTags || '');
  formData.append('clerkUserId', clerkUserId);

  try {
    const response = await fetch('http://localhost:3001/api/upload/with-tags', {
      method: 'POST',
      body: formData,
      // Don't set Content-Type header - browser will set it with boundary
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Upload failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Upload service error:', error);
    throw error;
  }
};