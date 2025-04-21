const express = require("express");
const cors = require("cors");
const { createBooking } = require('./controllers/bookingController');  // Make sure the path is correct
const { getBookings } = require('./controllers/bookingController'); 

const app = express();

app.use(cors());
app.use(express.json());

// Add this route to respond on GET /
app.post('/bookings', createBooking); 
app.get('/bookings', getBookings); 
app.get("/", (req, res) => {
  res.send(" Welcome to Camper Airbnb API!");
});

module.exports = app;
