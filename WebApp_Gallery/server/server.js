const express = require('express');
const mysql      = require('mysql');
var cors = require('cors')


const routes = require('./routes')
const config = require('./config.json')

const app = express();

/** **************************************
 * Iris Comment: Same as HW2, don't change
 * ***************************************
 * whitelist localhost 3000
 */
app.use(cors({ credentials: true, origin: ['http://localhost:3000'] }));

// Route 1 - register as GET 
app.get('/home', routes.galleryOverview);

// Route 2 - register as GET 
app.get('/artwork/:objectID', routes.artworkInfo);

// Route 3 - register as GET 
// these two routes are interchangable
app.get('/artwork/:objectID/similarArtworks', routes.similarArtworks);
app.get('/similarArtworks', routes.similarArtworks);


// #######################################
// ############# YINJIE ##################
// #######################################
// Route 4 - register as GET 
app.get('/search/filter', routes.filterSearch);
// /search/filter?Nationality=xxx&name=xxx <== Query Param


// #######################################
// ############# YINJIE ##################
// #######################################
// Route 5 - register as GET 
app.get('/search/naughty/:searchType', routes.naughtySearch);
// router param:  searchType = height, or searchType = birthYear
// query param: ?height=
// query param: ?birthYear=


// #######################################
// ############# IRIS ####################
// #######################################
// Route 6 - register as GET 
app.get('/analysis/analysisOverview', routes.analysisOverview);

// Route 7 - register as GET 
app.get('/analysis/analysisByType/:analysisType', routes.analysisByType);

// Route 8 - register as GET 
app.get('/analysis/portraitsAcrossTime', routes.portraitsAcrossTime);


// Iris Comment: Same as HW2, don't change-----------------------
app.listen(config.server_port, () => {
    console.log(`Server running at http://${config.server_host}:${config.server_port}/`);
});


module.exports = app;
