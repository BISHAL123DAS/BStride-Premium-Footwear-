const jwt = require("jsonwebtoken")
const tokenBlacklistModel = require("../models/blacklistmodel")

async function authUser(req, res, next) {
    console.log("ALL COOKIES:", req.cookies);        
    console.log("ALL HEADERS:", req.headers);

    const token = req.cookies.token

    if (!token) {
        
        return res.status(401).json({
            message: "Token not provided."
        })
    }

    const isTokenBlacklisted = await tokenBlacklistModel.findOne({ token })

    if (isTokenBlacklisted) {
        return res.status(401).json({
            message: "token is invalid"
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    } catch (err) {
        return res.status(401).json({
            message: "Invalid token."
        })
    }
}

function isAdmin(req, res, next) {
    if (req.user?.role !== "admin") {
        return res.status(403).json({
            message: "Access denied. Admins only."
        })
    }
    next()
}

module.exports = { authUser, isAdmin }