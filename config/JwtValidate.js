/**
 * If JWT token got successfully decoded, check if the user empeded 
 * in it is an authorized user, and inject the user in the request 
 * for other routes to use it.
 * 
 * @param {} jwtPayload 
 * @param {} request 
 * @author Abdullah Al-Faqeir <abdullah@devloops.net>
 */
module.exports = async (jwtPayload, request) => {
    let mongoose = require('mongoose');
    let User = require('../models/User');
    let user = await User.findOne({
        _id: new mongoose.mongo.ObjectId(jwtPayload._id)
    });
    if (user) {
        request.user = user;
        return {
            isValid: true
        };
    } else {
        return {
            isValid: false
        };
    }
}