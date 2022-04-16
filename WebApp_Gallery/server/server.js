const express = require('express');
const mysql = require('mysql');
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
// ex. http://localhost:8080/home

// Route 2 - register as GET 
app.get('/artwork', routes.artworkInfo);
// URL format: /artwork/?objectID=xx
// ex. http://localhost:8080/artwork?objectID=0

// Route 3 - register as GET 
app.get('/artwork/similarArtworks', routes.similarArtworks);
// URL format: /artwork/similarArtworks?id=0
// ex. http://localhost:8080/artwork/similarArtworks?id=0


// #######################################
// ############# YINJIE ##################
// #######################################
// Route 4 - register as GET 
app.get('/search/byFilter', routes.filterSearch);
// URL format: /search/byFilter?nationality=xxxx&style=xxxx&beginYear=xxxx&endYear=xxxx&classification=xxxx
// ex. http://localhost:8080/search/byFilter?nationality=American&style=Impressionist&beginYear=1000&endYear=1899&classification=painting&page=2&pagesize=10

// Route 5 - register as GET 
app.get('/search/byKeyword', routes.keywordSearch);
// URL format: /search/byKeyword?artworkTitle=xxxx&artistName=xxxx 
// ex. http://localhost:8080/search/byKeyword?artworkTitle=American%20Flamingo&artistName=Robert%20Havell%20after%20John%20James%20Audubon&page=2&pagesize=10

// Route 6 - register as GET 
app.get('/search/naughtySearchByHeight', routes.naughtySearchHeight);
// URL format: /search/naughtySearchByHeight?height=xx&page=x&pagesize=x
// ex. http://localhost:8080/search/naughtySearchByHeight?height=170&page=2&pagesize=10

// Route 7 - register as GET 
app.get('/search/naughtySearchByBirthYear', routes.naughtySearchBirthYear);
// URL format: /search/naughtySearchByBirthYear?birthYear=xxxx&page=x&pagesize=xx
// ex. http://localhost:8080/search/naughtySearchByBirthYear?birthYear=1999&page=2&pagesize=10

// #######################################
// ############# IRIS ####################
// #######################################
// Route 8 - register as GET 
app.get('/analysis/analysisOverview', routes.analysisOverview);
// ex. http://localhost:8080/analysis/analysisOverview 

// Route 9 - register as GET 
app.get('/analysis/analysisByType/:analysisType', routes.analysisByType);
// URL format: /analysis/analysisByType/:analysisType?page=x&pagesize=x 
// ex. http://localhost:8080/analysis/analysisByType/Place%20Executed?page=2&pagesize=5   

// Route 10 - register as GET 
app.get('/analysis/portraitsAcrossTime/:artworkClass', routes.portraitsAcrossTime);
// URL format: /analysis/portraitsAcrossTime/:artworkClass?beginYear=xxxx&endYear=xxxx&page=x&pagesize=xx
// ex. http://localhost:8080/analysis/portraitsAcrossTime/drawing?beginYear=1700&endYear=1799&page=2&pagesize=20


// Iris Comment: Same as HW2, don't change-----------------------
app.listen(config.server_port, () => {
    console.log(`Server running at http://${config.server_host}:${config.server_port}/`);
});


module.exports = app;
