const asyncHandler = require('express-async-handler');
const jwt = require("jsonwebtoken");

const validateToken = asyncHandler(async (req, res, next) => {

    let token;
    let authHeader = req.headers.Authorization || req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer")) {
        token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
            if (err) {
                res.status(404);
                throw new Error("User is not authenticated");
            }
            req.user = decoded.user;
            next();
        })
        if(!token)
            {
                res.status(401);
                throw new Error("user not authorized")
            }
    }
})
module.exports = validateToken;