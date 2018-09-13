module.exports = (server) => {
    const Bcrypt = require('bcrypt');
    const jwt = require('jsonwebtoken');
    const config = require('../config/config');
    const User = require('../models/User');

    const prefix = '/user';

    /**
     * path : /api/user/signup
     * method : post
     * params : {name,email,password}
     * 
     * @author Abdullah Al-Faqeir <abdullah@devloops.net>
     */
    server.route({
        path: prefix + '/signup',
        method: 'post',
        config: {
            auth: false
        },
        handler: doSignUp
    });

    /**
     * path : /api/user/login
     * method : post
     * params : {email,password}
     * 
     * @author Abdullah Al-Faqeir <abdullah@devloops.net>
     */
    server.route({
        path: prefix + '/login',
        method: 'post',
        config: {
            auth: false
        },
        handler: doLogin
    });

    /**
     * path : /api/user/me
     * method : get
     * params : {}
     * 
     * @author Abdullah Al-Faqeir <abdullah@devloops.net>
     */
    server.route({
        path: prefix + '/me',
        method: 'get',
        config: {
            auth: 'jwt'
        },
        handler: getMe
    });


    /**
     * Handle SignUp Request, it receives a post request with (name,email,password) params
     * and creates the user.
     * 
     * @param {} request 
     * @param {} h 
     * @author Abdullah Al-Faqeir <abdullah@devloops.net>
     */
    async function doSignUp(request, h) {
        try {
            let post = request.payload;
            console.log(post);
            let password = await hashPassword(post.password);
            console.log(password);
            let newUser = new User({
                name: post.name,
                email: post.email,
                password: password
            });
            await newUser.save().then((document) => {

            });
            return {
                status: 1,
                message: 'User Created'
            };
        } catch (er) {
            return er;
        }
    }

    /**
     * Returns the user associated with the token sent (like /me in facebook)
     * 
     * @param {} request 
     * @param {} h 
     * @author Abdullah Al-Faqeir <abdullah@devloops.net>
     */
    function getMe(request, h) {
        return {
            status: 1,
            user: request.user
        };
    }

    /**
     * API Login end-point, receives a post request with (email,password),
     * checks if the user exists, and generates an access token for the user
     * (JWT), returns the user object and the access token generated.
     * 
     * @param {} request 
     * @param {} h 
     * @author Abdullah Al-Faqeir <abdullah@devloops.net>
     */
    async function doLogin(request, h) {
        let post = request.payload;
        let email = post.email || false;
        let password = post.password || false;

        if (email && password) {
            let getUser = await User.findOne({
                "email": email,
            });
            if (typeof getUser._id !== 'undefined') {
                let isValidPassword = await Bcrypt.compare(password, getUser.password);
                if (isValidPassword) {
                    let jwtPayload = {
                        _id: getUser._id,
                        name: getUser.name,
                        email: getUser.email,
                        Created: (new Date()).getTime() / 1000
                    };
                    let accessToken = jwt.sign(jwtPayload, config.jwtSecret);
                    return {
                        status: 1,
                        user: getUser,
                        accessToken: accessToken
                    };
                } else {
                    return {
                        status: 0,
                        message: 'Invalid Password.'
                    };
                }
            } else {
                return {
                    status: 0,
                    message: 'No user found with provided email.'
                };
            }
        } else {
            return {
                status: 0,
                message: 'Email and Password are required.'
            };
        }
    }

    /**
     * Hashs password using Bcrypt library handled by Promise to return the hashString
     * instead of handling it in a callback
     * 
     * @param {} password 
     * @author Abdullah Al-Faqeir <abdullah@devloops.net>
     */
    async function hashPassword(password) {

        const saltRounds = 10;

        const hashedPassword = await new Promise((resolve, reject) => {
            Bcrypt.hash(password, saltRounds, function (err, hash) {
                if (err) reject(err)
                resolve(hash)
            });
        })

        return hashedPassword
    }

};