const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');

require('dotenv').config();


app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true
}));

const allowedOrigins = [
    "https://bstride-premium-footware.netlify.app/",
    "http://localhost:5173"
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));

// for Login and Register
const authRouter = require('./routes/auth');
app.use('/api/auth', authRouter);


// for product
const productRouter = require("./routes/productRoutes");

const cartRoutes     = require("./routes/cart.routes");
const wishlistRoutes = require("./routes/wishlist.routes");
const orderRoutes    = require("./routes/order.routes");

app.use("/api/cart",     cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/orders",   orderRoutes);

app.use("/api/products", productRouter);

app.get("/", (req, res) => {
    res.send("Backend is running");
  });
  

module.exports = app;