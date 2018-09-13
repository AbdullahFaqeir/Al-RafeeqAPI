'use strict';

const Hapi = require('hapi');
const mongoose = require('mongoose');
const config = require('./config/config');
const jwtValidate = require('./config/JwtValidate');

/**
 * Connect to MongoDB using Promise
 */
let promise = mongoose.connect("mongodb://rafeeq:5Tgbhu89@ds055782.mlab.com:55782/rafeeqapi");

promise.then((err) => {
    console.log("Connected Successfully to MongoDB.");
});


// Create a server with a host and port
const server = Hapi.server({
    host: '127.0.0.1',
    port: 1994
});


async function start() {

    await server.register(require('hapi-auth-jwt2'));

    /**
     * Add JWT as an auth strategy to Hapi
     */
    server.auth.strategy('jwt', 'jwt', {
        key: config.jwtSecret, // Never Share your secret key
        validate: jwtValidate, // validate function defined above
        verifyOptions: {} // pick a strong algorithm
    });

    /**
     * Set JWT as the default strategy to Hapi
     */
    server.auth.default('jwt');

    //-----Routes-----//
    require('./routes/users')(server);
    //-----Routes-----//

    // Add the route
    server.route({
        method: 'GET',
        path: '/',
        handler: function (request, h) {
            return 'Welcome to Al-Rafeeq API';
        }
    });

    try {
        await server.start();
    } catch (err) {
        console.log(err);
        process.exit(1);
    }

    console.log('Server running at:', server.info.uri);
};

start();