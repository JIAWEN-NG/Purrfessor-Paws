// controllers/userController.js
const { db } = require('../config/firebase'); // Adjust if necessary

// Function to get a user by ID
const getUserById = async (req, res) => {
    const userId = req.params.id;
    console.log(`Received userId: ${userId}`); // Log the userId to verify // Assuming you're using the ID from the URL
    try {
        const userRef = db.collection('Users').doc(userId); // Adjust if collection name is different
        const doc = await userRef.get();
        console.log(doc.data());

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
      console.log('All users:', users); // Log all users for debugging
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
        totalItemDonated: 0,
        totalMoneyDonated: 0,
      });
      res.status(200).json({ message: 'User successfully registered in Firestore.' });
    } catch (error) {
      res.status(500).json({ message: 'Error saving user to Firestore', error });
    }
  };
  
  
module.exports = {
    getUserById,
    getAllUsers,
    registerUser
};
