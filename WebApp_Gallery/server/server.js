const express = require('express');
const mysql      = require('mysql');
var cors = require('cors')

const routes = require('./routes') // import (bridge) to use the functions defined in `routes.js` file
const config = require('./config.json')

const app = express();

// #######################################
// ############# IRIS ####################
// #######################################

/** **************************************
 * Iris Comment: Same as HW2, don't change
 * ***************************************
 * whitelist localhost 3000
 */
app.use(cors({ credentials: true, origin: ['http://localhost:3000'] }));

// Route 1 - register as GET 
app.get('/home', routes.galleryOverview);

// Route 2 - register as GET 
app.get('/artwork', routes.artworkInfo);

// Route 3 - register as GET 
app.get('/artwork/similarArtworks', routes.similarArtworks);


// #######################################
// ############# YINJIE ##################
// #######################################
// Route 4 - register as GET 
app.get('/search/byFilter', routes.filterSearch);
// URL format: /search/byFilter?nationality=xxxx&style=xxxx&beginYear=xxxx&endYear=xxxx&classification=xxxx <== Query Param

// Route 5 - register as GET 
app.get('/search/byKeyword', routes.keywordSearch);
// URL format: /search/byKeyword?artworkTitle=xxxx&artistName=xxxx  <== Query Param

// Route 6 - register as GET 
app.get('/search/naughtySearchByHeight', routes.naughtySearchHeight);
// query param: ?height=

// Route 7 - register as GET 
app.get('/search/naughtySearchByBirthYear', routes.naughtySearchBirthYear);
// query param: ?birthYear=


// #######################################
// ############# IRIS ####################
// #######################################
// Route 8 - register as GET 
app.get('/analysis/analysisOverview', routes.analysisOverview);

// Route 9 - register as GET 
app.get('/analysis/analysisByType/:analysisType', routes.analysisByType);

// Route 10 - register as GET 
app.get('/analysis/portraitsAcrossTime/:artworkClass', routes.portraitsAcrossTime);


// Iris Comment: Same as HW2, don't change-----------------------
app.listen(config.server_port, () => {
    console.log(`Server running at http://${config.server_host}:${config.server_port}/`);
});


module.exports = app;
