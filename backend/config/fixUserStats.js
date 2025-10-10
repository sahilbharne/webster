import mongoose from 'mongoose';
import User from '../models/User.js'; // Ensure you import your User model
import Artwork from '../models/Artwork.js'; // Ensure you import your Artwork model
import Follow from '../models/Follow.js';
import Collection from '../models/Collection.js';

const MONGODB_URI = 'mongodb+srv://dixitrajeev5202_db_user:y7SJJL6fHfJynxWb@cluster0.gkc7ftl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'; // REPLACE with your DB URI

async function fixStats() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true, // Deprecated in newer Mongoose
      useUnifiedTopology: true // Deprecated in newer Mongoose
    });
    console.log('MongoDB connected successfully.');

    const users = await User.find({}); // Get all users

    for (const user of users) {
      console.log(`Processing user: ${user.email} (Clerk ID: ${user.clerkUserId})`);
      await user.updateStats(); // Call the updateStats method for each user
      console.log(`Updated stats for ${user.email}. New artwork count: ${user.stats.artworksCount}`);
    }

    console.log('All user stats have been re-calculated and updated.');

  } catch (error) {
    console.error('Error fixing user stats:', error);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB disconnected.');
  }
}

fixStats();