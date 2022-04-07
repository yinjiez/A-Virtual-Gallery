const config = require('./config.json')
const mysql = require('mysql');
const util = require("util"); // NEW FEATURE!!
const e = require('express');
const { deepStrictEqual } = require('assert');

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


// #######################################
// ############# IRIS ####################
// #######################################
/** **************************************
 * Route 1 (handler) - galleryOverview
 * ***************************************
 * query and return for gallery summary statistics
 * i.e. there are 3800+ paintings, 30000+ drawings, 70000+ prints..
 */
async function galleryOverview(req, res) {
    
    let queryStr = `
    SELECT classification, count(*) as artworkCounts
    FROM objects
    GROUP BY classification;`;
    
    // a GET request to URL: /home
    connection.query( queryStr, 
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
        }
    );
};

// #######################################
// ############# IRIS ####################
// #######################################
/** **************************************
 * Route 2 (handler) - artworkInfo
 * ***************************************
 * query parameter `?objectID=`
 * ************************************
 * given the objectID of an artwork, this function will query and return all the necessary/detailed information about a given artwork
 * URL format (with route parameter): URL: /localhost:8080/artwork?objectID=xx  
 * ex. URL: http://localhost:8080/artwork?objectID=0  
 * 
 */
async function artworkInfo(req, res) {

    const objectID = req.query.objectID ? req.query.objectID : 32572 ; //"American Flamingo" (objectID=32572), as default

    // 1) query for part 1 of the result
    let queryStr1= `
    SELECT O.title, O.attribution, O.medium, O.dimensions, O.classification, O.series, O.portfolio, O.volume, OI.URL
    FROM objects O JOIN objects_images OI ON O.objectID = OI.objectID
    WHERE O.objectID = ${objectID};` ;
    const p1 = await connection.query(queryStr1).catch(err => {throw err});
    // 1.1) get the High-Quality Image of this artwork by IIIF API ( https://iiif.io/api/image/2.1/ )
    HDimageURL = p1[0].URL + "/full/!600,600/0/default.jpg" // this is getting the {full view, pixel 600 x 600, default-tone}
    p1[0].URL = HDimageURL;

    // 2) query for part 2 of the result
    let queryStr2= `
    SELECT C.preferredDisplayName,OC.displayOrder, C.displayDate, C.visualBrowserNationality
    FROM objects_constituents OC JOIN constituents C ON OC.constituentID = C.constituentID
    WHERE OC.objectID = ${objectID}
    ORDER BY displayOrder;` ;
    const p2 = await connection.query(queryStr2).catch(err => {throw err});

    // 3) query for part 3 of the result
    let queryStr3 = `
    SELECT OT.termType, OT.term
    FROM objects_terms OT
    WHERE OT.objectID = ${objectID}
    ORDER BY termType;` ;

    const p3 = await connection.query(queryStr3).catch(err => {throw err});
    
    // 4) return all three parts together as a JSON object
    res.json( {results_P1 : p1, results_P2: p2, results_P3: p3} );
};


// #######################################
// ############# IRIS ####################
// #######################################
/** **************************************
 * Route 3 (handler) - similarArtworks
 * ***************************************
 * query parameter `objectID`
 * ****************************************
 * recommand similar artwork by primary and secondary similarities 
 * 
 * URL format (with query parameter): /localhost:8080/artwork/similarArtworks?id=xx  
 * ex. URL: http://localhost:8080/artwork/similarArtworks?id=0
 */
 async function similarArtworks(req, res) {

    var objectID = req.query.objectID ? req.query.objectID : 32572 ; //"American Flamingo" (objectID=32572), as default

    /** ******************************************************************************
     * Step 1: get the relavent information components,
     * so that we can subsequently search for similar artworks based on these information
     * **********************************************************************************
     */
    // 1) get the classification, portfolio, series, volume information about this artwork
    let info1= `
    SELECT O.title, O.attribution, O.classification, O.series, O.portfolio, O.volume, OI.URL
    FROM objects O JOIN objects_images OI ON O.objectID = OI.objectID
    WHERE O.objectID = ${objectID};` ;
    const p1 = await connection.query(info1).catch(err => {throw err});
    const artworkClass = p1[0].classification;
    const portfolio = p1[0].portfolio;
    const series = p1[0].series;
    const volume = p1[0].volume;

    // 2) get the artist's ID of this artwork
    let info2= `
    SELECT objectID, constituentID, displayOrder
    FROM objects_constituents
    WHERE objectID = 32572
    ORDER BY displayOrder;
    ` ;
    const p2 = await connection.query(info2).catch(err => {throw err});
    const artistID = p2[0].constituentID; // just take the first artist (if multiple artists)
    console.log(artistID)
    
    // 3) get the Style, School, Keyword, Theme information of this artwork
    let info3 = `
    SELECT OT.termType, OT.term
    FROM objects_terms OT
    WHERE OT.objectID = ${objectID}
    ORDER BY termType;` ;
    const p3 = await connection.query(info3).catch(err => {throw err});
    var style = null;
    var school = null;
    var keyword = null;
    var theme = null;
    for (i=0; i < p3.length; i++) {
        if (p3[i].termType === "Style"){
            style = p3[i].term;
        } else if (p3[i].termType === "School"){
            school  = p3[i].term;
        } else if (p3[i].termType === "Keyword"){
            keyword  = p3[i].term;
        } else if (p3[i].termType === "Theme"){
            theme  = p3[i].term;
        } else continue
    };
    // *******************************************************************

    /** ****************************************************************************
     * Step 2: find the similar artworks based on primary and secondary similarity
     * ****************************************************************************
     */
    // 1) Primary Recommandation: based on same artist, same portfolio/series/volume
    let queryStr1 = `
    SELECT DISTINCT O.title, O.attribution, O.objectID, OI.thumbURL, O.series, O.portfolio, O.volume
    FROM objects O JOIN objects_constituents OC
            JOIN constituents C
            JOIN objects_images OI
        ON O.objectID = OC.objectID AND
           OC.constituentID = C.constituentID AND
           O.objectID = OI.objectID
    WHERE (O.objectID <> ${objectID} ) AND (O.classification = '${artworkClass}') AND
          ( (O.portfolio LIKE '${portfolio}') OR
            (O.series LIKE '${series}}') OR
            (O.volume LIKE '${volume}') OR
            (C.constituentID = ${artistID}) )
    ORDER BY O.series, O.portfolio, O.volume, O.attribution
    LIMIT 4;`;
    const similar1 = await connection.query(queryStr1).catch(err => {throw err});

    // 2) Secondary Recommandation: based on same style, school, keyword, theme
    let queryStr2= `SELECT O.title, O.attribution, O.objectID, OI.thumbURL, OT.termType, O.series, O.portfolio, O.volume
    FROM objects O JOIN objects_images OI JOIN objects_terms OT
        ON O.objectID = OI.objectID AND O.objectID = OT.objectID
    WHERE (O.objectID <> ${objectID}) AND (O.classification = '${artworkClass}') AND (
          (OT.termType = 'Style' AND OT.term = '${style}') OR
          (OT.termType = 'School' AND OT.term = '${school}') OR
          (OT.termType = 'Keyword' AND OT.term = '${keyword}') OR
          (OT.termType = 'Theme' AND OT.term = '${theme}') )
    ORDER BY termType
    LIMIT 4;` ;
    const similar2 = await connection.query(queryStr2).catch(err => {throw err});
    
    // 3) if there is no similar artwork found (based on all the above criteria), we return this message
    if ( !similar1 && !similar2 ) {
        return res.json ({results_P1 : "this is the only artwork of its kind"});
    }

    // 4) return the similar artworks
    return res.json( {results_P1 : similar1, results_P2: similar2});
};


// #######################################
// ############# YINJIE ##################
// #######################################
/** **************************************
 * Route 4 (handler) - filterSearch
 * ***************************************
 * search relavent artworks by a variety of filters: artists's
 */
 async function filterSearch(req, res) {
    return res.json({error: "Not implemented"});
 };


// #######################################
// ############# YINJIE ##################
// #######################################
/** **************************************
 * Route 5 (handler) - keywordSearch
 * ***************************************
 * search relavent artworks by artwork's title OR/AND artist's name
 */
 async function keywordSearch(req, res) {
    return res.json({error: "Not implemented"});
 };


 
// #######################################
// ############# YINJIE ##################
// #######################################
/** **************************************
 * Route 6 (handler) - naughtySearchByHeight
 * ***************************************
 * naughty search by user's height
 */
async function naughtySearchByHeight(req, res) {
    return res.json({error: "Not implemented"});
};


// #######################################
// ############# YINJIE ##################
// #######################################
/** **************************************
 * Route 7 (handler) - naughtySearchByBirthYear
 * ***************************************
 * naughty search by user's birthYear
 */
 async function naughtySearchByBirthYear(req, res) {
    return res.json({error: "Not implemented"});
};



// #######################################
// ############# IRIS ####################
// #######################################
/** **************************************
 * Route 8 (handler) - analysisOverview
 * ***************************************
 * 1) Showing how many term varieties each big analysis category contains
 *      i.e. School (162), Style(82), Theme(467), Technique(163), Keyword(6320), Place Executed (1000)
 * 2) Showing the top 5 popular term for each category
 */
 async function analysisOverview(req, res) {
    
    // 0) query for Overview of Analysis Category: showing term counts for each category of analysis. i.e. Style, School, Theme, Technique, Keyword, Place Executed,
    let queryStr0 = `
    (SELECT OT.termType, COUNT(DISTINCT OT.term) AS termVarietyCount
    FROM objects O JOIN objects_terms OT ON O.objectID = OT.objectID
    WHERE OT.termType = 'Style')
    UNION
    (SELECT OT.termType, COUNT(DISTINCT OT.term) AS termVarietyCount
    FROM objects O JOIN objects_terms OT ON O.objectID = OT.objectID
    WHERE OT.termType = 'School')
    UNION
    (SELECT OT.termType, COUNT(DISTINCT OT.term) AS termVarietyCount
    FROM objects O JOIN objects_terms OT ON O.objectID = OT.objectID
    WHERE OT.termType = 'Theme')
    UNION
    (SELECT OT.termType, COUNT(DISTINCT OT.term) AS termVarietyCount
    FROM objects O JOIN objects_terms OT ON O.objectID = OT.objectID
    WHERE OT.termType = 'Keyword')
    UNION
    (SELECT OT.termType, COUNT(DISTINCT OT.term) AS termVarietyCount
    FROM objects O JOIN objects_terms OT ON O.objectID = OT.objectID
    WHERE OT.termType = 'Technique')
    UNION
    (SELECT OT.termType, COUNT(DISTINCT OT.term) AS termVarietyCount
    FROM objects O JOIN objects_terms OT ON O.objectID = OT.objectID
    WHERE OT.termType = 'Place Executed');
    `;
    const resOverview = await connection.query(queryStr0).catch(err => {throw err});

     // 1) query for part 1 of the result
     let queryStr1= `
     SELECT OT.term, COUNT(*) AS StyleCounts
     FROM objects O JOIN objects_terms OT ON O.objectID = OT.objectID
     WHERE OT.termType = 'Style'
     GROUP BY OT.term
     ORDER BY COUNT(*) DESC
     LIMIT 5
     ` ;
     const resStyle = await connection.query(queryStr1).catch(err => {throw err});
 
     // 2) query for part 2 of the result
     let queryStr2= `
     SELECT OT.term, COUNT(*) AS SchoolCounts
     FROM objects O JOIN objects_terms OT ON O.objectID = OT.objectID
     WHERE OT.termType = 'School'
     GROUP BY OT.term
     ORDER BY COUNT(*) DESC
     LIMIT 5
     `;
     const resSchool = await connection.query(queryStr2).catch(err => {throw err});
 
     // 3) query for part 3 of the result
     let queryStr3 = `
     SELECT OT.term, COUNT(*) AS TechniqueCounts
     FROM objects O JOIN objects_terms OT ON O.objectID = OT.objectID
     WHERE OT.termType = 'Technique'
     GROUP BY OT.term
     ORDER BY COUNT(*) DESC
     LIMIT 5
     `;
     const resTechnique = await connection.query(queryStr3).catch(err => {throw err});
     
     // 4) query for part 4 of the result
     let queryStr4 = `
     SELECT OT.term, COUNT(*) AS ThemeCounts
     FROM objects O JOIN objects_terms OT ON O.objectID = OT.objectID
     WHERE OT.termType = 'Theme'
     GROUP BY OT.term
     ORDER BY COUNT(*) DESC
     LIMIT 5
     `;
     const resTheme = await connection.query(queryStr4).catch(err => {throw err});
     
     // 5) query for part 5 of the result
     let queryStr5 = `
     SELECT OT.term, COUNT(*) AS KeywordCounts
     FROM objects O JOIN objects_terms OT ON O.objectID = OT.objectID
     WHERE OT.termType = 'Keyword'
     GROUP BY OT.term
     ORDER BY COUNT(*) DESC
     LIMIT 5
     `;
     const resKeyword = await connection.query(queryStr5).catch(err => {throw err});


     // 6) query for part 5 of the result
     let queryStr6 = `
     SELECT OT.term, COUNT(*) AS PlaceExecutedCounts
     FROM objects O JOIN objects_terms OT ON O.objectID = OT.objectID
     WHERE OT.termType = 'Place Executed'
     GROUP BY OT.term
     ORDER BY COUNT(*) DESC
     LIMIT 5
     `;
     const resPlaceExecuted = await connection.query(queryStr6).catch(err => {throw err});

     // 7) return all three parts together as a JSON object
     res.json( { Overview: resOverview, Style: resStyle, School: resSchool, Theme: resTheme, Technique: resTechnique, Keyword: resKeyword, PlaceExecuted: resPlaceExecuted } );

};


// #######################################
// ############# IRIS ####################
// #######################################
/** **************************************
 * Route 9 (handler) - analysisByType
 * ***************************************
 * front-end will prompt user to specify whcih type of analysis he/she wants to check
 * this function will return, in descending order, most popular terms under the analysis category
 * analysis types: Style, School, Theme, Technique, Keyword, Place Executed
 * Note: single space in URL's route parameter needs to be encoded as `%20` 
 * ex. URL http://localhost:8080/analysis/analysisByType/Place%20Executed
 * ex. URL (pagination) http://localhost:8080/analysis/analysisByType/Place%20Executed?page=2&pageszie=10
 */
 async function analysisByType(req, res) {
    
    //1) fetch Route Paramter from {URL parameter portion}
    const analysisType = req.params.analysisType ? req.params.analysisType : 'Style' // default analysis is by Style
    //2) fetch Query Parameter "page" & "pagesize"
    const page = req.query.page //we assume user always enters valid page range: [1~n]
    const limit = req.query.pagesize ? req.query.pagesize : 10 //default 10 rows of query result per page display
    //3) calculate offsets
    const offset = (page - 1) * limit //(page-1) since query offset is 0-based-indexing


    if (req.query.page && !isNaN(req.query.page)) {
        // This is the case where page is defined.
        let queryStr = `
        SELECT OT.term, COUNT(*) AS termCounts
        FROM objects O JOIN objects_terms OT ON O.objectID = OT.objectID
        WHERE OT.termType = '${analysisType}'
        GROUP BY OT.term
        ORDER BY COUNT(*) DESC
        LIMIT ${offset}, ${limit};
        `;
        
        connection.query(queryStr, 
            function (error, results, fields) {
                if (error) {
                    console.log(error);
                    res.json({ error: error});
                } else if (results) {
                    res.json({ results: results })
                }
            }
        );

    } else {
        // if "page" is not defined (even if "pagesize" is defined, this block of code will get executed)
        
        let queryStr = `
        SELECT OT.term, COUNT(*) AS termCounts
        FROM objects O JOIN objects_terms OT ON O.objectID = OT.objectID
        WHERE OT.termType = '${analysisType}'
        GROUP BY OT.term
        ORDER BY COUNT(*) DESC;
        `;

        connection.query(queryStr, 
            function (error, results, fields) {
                if (error) {
                    console.log(error)
                    res.json({ error: error })
                } else if (results) {
                    res.json({ results: results })
                }
            }
        );
    }
};


// #######################################
// ############# IRIS ####################
// #######################################
/** **************************************
 * Route 10 (handler) - portraitsAcrossTime
 * ***************************************
 * URL route parameter `:artworkClass`: 'painting' or 'drawing' or 'print'
 * URL query parameter `?beginYear=xxxx&endYear=xxxx&page=x&pagesize=5`
 */
 async function portraitsAcrossTime(req, res) {
    
    const artworkClass = req.params.artworkClass ? req.params.artworkClass : 'painting' // default is search portraits in 'paintings'
    const beginYear = req.query.beginYear ? req.query.beginYear : 1500
    const endYear = req.query.endYear ? req.query.endYear : 1599
    //2) fetch Query Parameter "page" & "pagesize"
    const page = req.query.page //we assume user always enters valid page range: [1~n]
    const limit = req.query.pagesize ? req.query.pagesize : 5 //default 5 rows of query result per page display
    //3) calculate offsets
    const offset = (page - 1) * limit //(page-1) since query offset is 0-based-indexing
    
    if (req.query.page && !isNaN(req.query.page)){
        let queryStr = `
        SELECT O.title, O.attribution, O.classification, O.objectID, OI.thumbURL, O.endYear
        FROM objects O JOIN objects_images OI JOIN objects_terms OT
        ON O.objectID =OI.objectID AND O.objectID = OT.objectID
        WHERE OT.visualBrowserTheme = 'portrait' AND ( O.endYear <= ${endYear} AND O.endYear >= ${beginYear}) AND classification = '${artworkClass}'
        ORDER BY O.endYear
        LIMIT ${offset}, ${limit};
        `;
        const results = await connection.query(queryStr).catch(err => {throw err});
        res.json( {results: results} );
    } else {
        let queryStr = `
        SELECT O.title, O.attribution, O.classification, O.objectID, OI.thumbURL, O.endYear
        FROM objects O JOIN objects_images OI JOIN objects_terms OT
        ON O.objectID =OI.objectID AND O.objectID = OT.objectID
        WHERE OT.visualBrowserTheme = 'portrait' AND ( O.endYear <= ${endYear} AND O.endYear >= ${beginYear}) AND classification = '${artworkClass}'
        ORDER BY O.endYear
        LIMIT 5;
        `;
        const results = await connection.query(queryStr).catch(err => {throw err});
        res.json( {results: results} );
    }

};



module.exports = {
    galleryOverview,
    artworkInfo,
    similarArtworks,
    filterSearch,
    keywordSearch,
    naughtySearchByHeight,
    naughtySearchByBirthYear,
    analysisOverview,
    analysisByType,
    portraitsAcrossTime
}