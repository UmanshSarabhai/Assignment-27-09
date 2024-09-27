const express = require("express");
const app = express();
const routes = require("./routes/route.js");

app.use(express.json());

//Use the routes defined in route.js
routes(app);

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
