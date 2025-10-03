// backend/ai_services/vision_api_services/auto_tagger.js

import vision from '@google-cloud/vision';
import path from 'path';
import { fileURLToPath } from 'url';
import * as fs from 'fs'; 
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); 

const KEY_FILE_PATH = process.env.GOOGLE_APPLICATION_CREDENTIALS;

if (!KEY_FILE_PATH) {
    throw new Error("FATAL ERROR: GOOGLE_APPLICATION_CREDENTIALS is not set in .env.");
}

async function analyzeImage(imagePath) {
    
    let credentials;
    try {
        const keyFileContent = fs.readFileSync(KEY_FILE_PATH, 'utf8');
        credentials = JSON.parse(keyFileContent);
    } catch (e) {
        throw new Error(`Failed to load credentials from path: ${KEY_FILE_PATH}. Check file existence and format.`);
    }

    const client = new vision.ImageAnnotatorClient({
        credentials: credentials
    }); 
    
    const image = {
        image: {
            source: {
                filename: imagePath 
            }
        }
    };

    try {
        const [response] = await client.annotateImage({
            image: image.image,
            features: [
                { type: 'LABEL_DETECTION' },
                { type: 'SAFE_SEARCH_DETECTION' }
            ]
        });

        const labelsResponse = response.labelAnnotations || [];
        const safeSearchResponse = response.safeSearchAnnotation || {};
        
        return {
            labels: labelsResponse,
            safeSearch: safeSearchResponse
        };
    } catch (error) {
        console.error('API Call Error:', error.message);
        return { labels: [], safeSearch: {} };
    }
}

(async () => {
    try {
        const imagePath = path.join(__dirname, 'toa-heftiba-F5dWhHH48o0-unsplash.jpg');
        
        const imageAn = await analyzeImage(imagePath);
        
        console.log("--- ANALYSIS RESULTS ---");
        
        if (imageAn.labels.length > 0) {
            console.log("Tags Found:", imageAn.labels.map(l => l.description).slice(0, 5));
        } else {
            console.log("Tags Found: None");
        }
        
        console.log("Safe Search (Adult):", imageAn.safeSearch.adult ? imageAn.safeSearch.adult.toUpperCase() : 'N/A');

    } catch (e) {
        console.error("\nFATAL SETUP ERROR: Script failed to start or load credentials.\n", e.message);
        process.exit(1);
    }
})();

export { analyzeImage };