const app = require("./app");  // Import the Express app from app.js

const PORT = process.env.PORT || 5000;  // Set the port, default is 5000

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);  // Log when the server is running
});
