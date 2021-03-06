require('dotenv').config()
const express = require( 'express' );
const app = express();
const elementRoutes = require( './routes/elements_route' );
const userRoutes = require( './routes/user_route' )
const path = require( 'path' );
const helmet = require( "helmet" );
const rateLimit = require( "express-rate-limit" );//anti ddos
var history = require('connect-history-api-fallback');


//parser//
app.use( express.json() );


app.use(history());
//sécurité helmet//
app.use( helmet() );

//sécurité cors abaissée//
app.use( ( req, res, next ) => {
    res.setHeader( 'Access-Control-Allow-Origin', '*' );
    res.setHeader( 'Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization' );
    res.setHeader( 'Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS' );
    next();
} );

//anti ddos/limiter//
const limiter = rateLimit( {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 500 // limit each IP to 100 requests per windowMs
} );
//  apply to all requests
app.use( limiter );


//ligne lié à multer, va servir le dossier indiqué//
app.use( "/image", express.static( path.join( process.cwd(), 'image' ) ) );

app.use( '/', elementRoutes );
app.use( '/auth', userRoutes );

module.exports = app;