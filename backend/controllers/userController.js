// controllers/userController.js
const { db } = require('../config/firebase'); // Adjust if necessary

// Function to get a user by ID
const getUserById = async (req, res) => {
    const userId = req.params.id;
   // console.log(`Received userId: ${userId}`); // Log the userId to verify // Assuming you're using the ID from the URL
    try {
        const userRef = db.collection('Users').doc(userId); // Adjust if collection name is different
        const doc = await userRef.get();
       

        if (!doc.exists) {
          console.log('User not found');
            return res.status(404).json({ message: 'User not found' }); // Proper JSON response
        }

        res.status(200).json(doc.data()); // Return user data
    } catch (error) {
        res.status(500).json({ error: error.message }); // Return error message
    }
};
const getAllUsers = async (req, res) => {
  try {
      const snapshot = await db.collection('Users').get(); // Ensure collection name matches Firestore
      const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.status(200).json(users);
  } catch (error) {
      console.error('Error in getAllUsers:', error.message);
      res.status(500).json({ error: error.message });
  }
};

// Controller for user registration
const registerUser = async (req, res) => {
    const { uid, name, email, petDescription, role, profileImage } = req.body;
    try {
      await db.collection('Users').doc(uid).set({
        name,
        email,
        petDescription: petDescription || '',
        role: role || 'user',
        profileImage: profileImage || '',
        isVerified: false,
        isPhotoVerified: false,
        rejectionReason: '',
      });
      res.status(200).json({ message: 'User successfully registered in Firestore.' });
    } catch (error) {
      console.log("Error saving user to Firestore:", error.message)
      res.status(500).json({ message: 'Error saving user to Firestore', error });
    }
  };
  
  const updateUserPhotoVerification = async (userId, imageUrl) => {
    try {
        const userRef = db.collection('Users').doc(userId);
        await userRef.update({
            verificationPhotoUrl: imageUrl,
            isPhotoVerified: false, // Mark as not verified by default
        });
        console.log(`Verification photo URL saved for user: ${userId}`);
    } catch (error) {
        console.error('Error updating user with verification photo:', error);
        throw error;
    }
};

  
module.exports = {
    getUserById,
    getAllUsers,
    registerUser,
    updateUserPhotoVerification
};
const admin = require('firebase-admin');
const db = admin.firestore();

const UserController = {
  async getUser(req, res) {
    try {
      const userId = req.params.id;
      console.log("Fetching user data for ID:", userId);

      const userDoc = await db.collection('users').doc(userId).get();

      if (!userDoc.exists) {
        console.error("No document found for ID:", userId);
        return res.status(404).json({ error: 'User not found' });
      }

      const userData = userDoc.data();
      // Extract only the necessary fields
      const { role, profileImage, petDescription, name, email } = userData;

      // Send the data to the frontend
      res.json({ role, profileImage, petDescription, name, email });
    } catch (error) {
      console.error("Error fetching user data:", error.message);
      res.status(500).json({ error: 'Error fetching user data', message: error.message });
    }
  },
};

module.exports = UserController;
