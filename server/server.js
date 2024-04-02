const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const usersRouter = require('./routes/route');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.ATLAS_URI)
  .then(() => console.log("MongoDB is connected successfully"))
  .catch((err) => console.error(err));

// Routes
app.use('/', usersRouter);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
