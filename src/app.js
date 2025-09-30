const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

const historiasClinicasRoutes = require("./routes/historiaClinica");

const app = express();
const PORT = process.env.PORT || 3000;
dotenv.config();

// Middleware
app.use(express.json());

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Database connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/historias-clinicas", historiasClinicasRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
