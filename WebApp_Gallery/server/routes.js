const config = require('./config.json')
const mysql = require('mysql');
const util = require("util");
const e = require('express');

/** **************************************
 * Iris Comment: Same as HW2, don't change
 * ***************************************
 * fill in connection details
 */
const connection = mysql.createConnection({
    host: config.rds_host,
    user: config.rds_user,
    password: config.rds_password,
    port: config.rds_port,
    database: config.rds_db
});
// NEW FEATURE: promise wrapper to enable async await with MYSQL
connection.query = util.promisify(connection.query).bind(connection);
// establish the connection to database
connection.connect();


/** **************************************
 * Route 1 (handler) - galleryOverview
 * ***************************************
 * query and return for gallery summary statistics
 * i.e. there are 3800+ paintings, 30000+ drawings, 70000+ prints..
 */
async function galleryOverview(req, res) {
    // a GET request to URL: /home
    connection.query(
        `SELECT classification, count(*) as artworkCounts
        FROM objects
        GROUP BY classification;`, 
    function (error, results, fields) {
        // if the query action results in ERORR rising, output the error message to console display
        if (error) {
            console.log(error)
            res.json({ error: error })
        // if there is legit query reusults returned, diplay the result
        } else if (results) {
            const strWelcome = "Welcome to DataOmni's Virtual Gallery (powered by National Gallery of Art)!"
            res.json({ msg: strWelcome, results: results })
        }
    });
};

/** **************************************
 * Route 2 (handler) - artworkInfo
 * ***************************************
 * given the objectID of an artwork, this function will query and return all the necessary/detailed information about a given artwork
 * URL format (with route parameter): URL: /localhost:8080/artwork/:objectID  
 * ex. URL: http://localhost:8080/artwork/0  
 * 
 */
async function artworkInfo(req, res) {

    // 1) query for part 1 of the result
    let queryStr1= `SELECT O.title, O.attribution, O.medium, O.dimensions, O.classification, O.series, O.portfolio, O.volume, OI.URL
    FROM objects O JOIN objects_images OI ON O.objectID = OI.objectID
    WHERE O.objectID = 0;`
    const p1 = await connection.query(queryStr1).catch(err => {throw err});

    // 2) query for part 2 of the result
    let queryStr2= `SELECT C.preferredDisplayName,OC.displayOrder, C.displayDate, C.visualBrowserNationality
    FROM objects_constituents OC JOIN constituents C ON OC.constituentID = C.constituentID
    WHERE OC.objectID = 0
    ORDER BY displayOrder;`
    const p2 = await connection.query(queryStr2).catch(err => {throw err});

    // 3) query for part 3 of the result
    let queryStr3 = `SELECT OT.termType, OT.term
    FROM objects_terms OT
    WHERE OT.objectID = 0
    ORDER BY termType;`

    const p3 = await connection.query(queryStr3).catch(err => {throw err});
    
    // 4) return all three parts together as a JSON object
    res.json( {results_P1 : p1, results_P2: p2, results_P3: p3} );
};


/** **************************************
 * Route 3 (handler) - similarArtworks
 * ***************************************
 * recommand similar artwork by 
 * URL format (with query parameter): URL: /localhost:8080/artwork/similarArtworks?id=xx  
 * ex. URL: http://localhost:8080/artwork/similarArtworks?id=0
 */
 async function similarArtworks(req, res) {

    // 1) query for part 1 of the result
    let queryStr1 = `SELECT DISTINCT O.title, O.attribution, O.objectID, OI.thumbURL, O.series, O.portfolio, O.volume
    FROM objects O JOIN objects_constituents OC
            JOIN constituents C
            JOIN objects_images OI
        ON O.objectID = OC.objectID AND
           OC.constituentID = C.constituentID AND
           O.objectID = OI.objectID
    WHERE (O.objectID <> 0 ) AND (O.classification = 'painting') AND
          ( (O.portfolio LIKE '%') OR
            (O.series LIKE '%') OR
            (O.volume LIKE '%') OR
            (C.constituentID = 38613) )
    ORDER BY O.series, O.portfolio, O.volume, O.attribution
    LIMIT 4;`
    const same1 = await connection.query(queryStr1).catch(err => {throw err});

    // 2) query for part 2 of the result
    let queryStr2= `SELECT O.title, O.attribution, O.objectID, OI.thumbURL, OT.termType, O.series, O.portfolio, O.volume
    FROM objects O JOIN objects_images OI JOIN objects_terms OT
        ON O.objectID = OI.objectID AND O.objectID = OT.objectID
    WHERE (O.objectID <> 0 ) AND (O.classification = 'painting') AND (
          (OT.termType = 'Style' AND OT.term = 'Gothic') OR
          (OT.termType = 'School' AND OT.term = 'Florentine') OR
          (OT.termType = 'Keyword' AND OT.term = 'James Major') OR
          (OT.termType = 'Theme' AND OT.term = 'saints') )
    ORDER BY termType
    LIMIT 4;`
    const same2 = await connection.query(queryStr2).catch(err => {throw err});
    
    // 4) return all three parts together as a JSON object
    res.json( {results_P1 : same1, results_P2: same2});
};



/** **************************************
 * Route 4 (handler) - filterSearch
 * ***************************************
 * search relavent artworks by a variety of filters: artists's
 */
 async function filterSearch(req, res) {
    return res.json({error: "Not implemented"});
 };


 
/** **************************************
 * Route 5 (handler) - naughtySearch
 * ***************************************
 * naughty search by height, OR naughty search by birthYear
 */
async function naughtySearch(req, res) {
    return res.json({error: "Not implemented"});
};


/** **************************************
 * Route 6 (handler) - analysisOverview
 * ***************************************
 * 
 */
 async function analysisOverview(req, res) {
    return res.json({error: "Not implemented"});
};


/** **************************************
 * Route 7 (handler) - analysisByType
 * ***************************************
 * 
 */
 async function analysisByType(req, res) {
    return res.json({error: "Not implemented"});
};


/** **************************************
 * Route 8 (handler) - portraitsAcrossTime
 * ***************************************
 * 
 */
 async function portraitsAcrossTime(req, res) {
    return res.json({error: "Not implemented"});
};




module.exports = {
    galleryOverview,
    artworkInfo,
    similarArtworks,
    filterSearch,
    naughtySearch,
    analysisOverview,
    analysisByType,
    portraitsAcrossTime
}