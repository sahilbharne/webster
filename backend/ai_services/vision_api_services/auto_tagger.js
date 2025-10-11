import vision from '@google-cloud/vision';
import path from 'path';
import 'dotenv/config';

if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    throw new Error("FATAL ERROR: GOOGLE_APPLICATION_CREDENTIALS is not set in .env.");
}

async function analyzeImage(imagePath) {
    try {
        console.log('🔍 Initializing Google Vision API client...');
        
        const client = new vision.ImageAnnotatorClient(); 
        
        console.log('🔄 Analyzing image:', path.basename(imagePath));

        const [response] = await client.annotateImage({
            image: {
                source: { filename: imagePath }
            },
            features: [
                { type: 'LABEL_DETECTION', maxResults: 15 },
                { type: 'SAFE_SEARCH_DETECTION' }
            ]
        });

        const labelsResponse = response.labelAnnotations || [];
        const safeSearchResponse = response.safeSearchAnnotation || {};
        
        console.log(`✅ Analysis complete. Found ${labelsResponse.length} labels.`);
        
        return {
            labels: labelsResponse,
            safeSearch: safeSearchResponse
        };

    } catch (error) {
        console.error('❌ Google Vision API Error:', error.message);
        
        throw new Error(`Google Vision analysis failed: ${error.message}`);
    }
}

export { analyzeImage };