const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDB = require("./config/database");
const { connectRedis } = require("./config/redis");
const authRoutes = require("./routes/authRoutes");
const propertyRoutes = require("./routes/propertyRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const recommendationRoutes = require("./routes/recommendationRoutes");

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Welcome to the Real Estate API`S");
});  

(async () => {
  await connectDB();
  await connectRedis();
})();

app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/recommendations", recommendationRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
