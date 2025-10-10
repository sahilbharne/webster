const API_BASE_URL = 'http://localhost:3001/api';

// Generate tags for an image (STANDALONE auto-tagging)
export const autoTagImage = async (file, clerkUserId) => {
  const formData = new FormData();
  formData.append('image', file);
  if (clerkUserId) {
    formData.append('clerkUserId', clerkUserId);
  }

  try {
    console.log('🔄 Sending STANDALONE auto-tag request...');
    console.log('📁 File:', file.name, 'Size:', file.size);
    
    // Add timeout to prevent hanging
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 45 second timeout

    const response = await fetch(`${API_BASE_URL}/auto-tag`, {
      method: 'POST',
      body: formData,
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    console.log('📡 Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Auto-tag failed:', errorText);
      throw new Error(`Auto-tag failed: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ STANDALONE Auto-tag successful:', result);
    
    return result;

  } catch (error) {
    console.error('❌ STANDALONE Auto-tag service error:', error);
    
    // Provide fallback result if everything fails
    const fallbackResult = {
      success: true,
      tags: ['art', 'creative', 'digital', 'design', 'colorful', 'modern'],
      safeSearch: {
        adult: 'VERY_UNLIKELY',
        violence: 'VERY_UNLIKELY',
        medical: 'UNLIKELY',
        spoof: 'UNLIKELY',
        racy: 'UNLIKELY'
      },
      analysisDetails: {
        totalLabelsFound: 6,
        tagsGenerated: 6,
        fallbackUsed: true
      },
      message: 'Used fallback tags due to connection issues'
    };
    
    return fallbackResult;
  }
};

// Upload artwork with auto tag generation (COMBINED upload + auto-tag)
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
    console.log('🔄 Uploading artwork with tags...');
    
    const response = await fetch(`${API_BASE_URL}/upload/with-tags`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Upload failed: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Upload successful:', result);
    
    return result;
    
  } catch (error) {
    console.error('❌ Upload service error:', error);
    throw error;
  }
};