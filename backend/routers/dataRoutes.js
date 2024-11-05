// routers/dataRoutes.js
const express = require('express');
const router = express.Router();
const cors = require('cors');
const userController = require('../controllers/userController'); // Import the controller

const app = express();
app.use(cors());

console.log('dataRoutes.js is loaded'); 
console.log('dataRoutes.js is loaded and /users route is defined');


// Define the route and link it to the controller function
router.get('/users/:id', userController.getUserById); // Use the controller's function
router.get("/users", userController.getAllUsers);
// You can add more routes related to users here using the same controller



router.get("/users", (req, res) => {
    console.log('GET /users route hit');
    userController.getAllUsers(req, res);
});


module.exports = router;
