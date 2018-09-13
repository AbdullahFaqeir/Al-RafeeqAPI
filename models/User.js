/**
 * User Model (MongoDB Collection users)
 * 
 * @author Abdullah Al-Faqeir <abdullah@devloops.net>
 */
const mongoose = require('mongoose');
var UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at'
    }
});

module.exports = mongoose.model('User', UserSchema);