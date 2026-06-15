const mongoose = require('mongoose');

let isConnected = false;

const connectToDB = async () => {
    if (isConnected) {
        console.log('Using existing MongoDB connection');
        return;
    }
    try {
        await mongoose.connect(process.env.MONGO_URI);
        isConnected = true;
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

module.exports = connectToDB;