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
 * ex. (defualt) http://localhost:8080/artwork?objectID=
 * ex. URL: http://localhost:8080/artwork?objectID=0  
 * ex. (non-existing objectID) http://localhost:8080/artwork?objectID=99999999    
 * 
 */
async function artworkInfo(req, res) {
    
    // guarding for non-numeric inputs for "objectID" query-parameter
    if (isNaN(req.query.objectID)){
        res.json( {results_P1 :[], results_P2: [], results_P3: []} );
    }

    const objectID = req.query.objectID ? req.query.objectID : 32572 ; //"American Flamingo" (objectID=32572), as default

    // 1) query for part 1 of the result
    let queryStr1= `
    SELECT O.title, O.attribution, O.medium, O.dimensions, O.classification, O.series, O.portfolio, O.volume, OI.URL
    FROM objects O JOIN objects_images OI ON O.objectID = OI.objectID
    WHERE O.objectID = ${objectID};` ;
    const p1 = await connection.query(queryStr1).catch(err => {throw err});
    // 1.1) get the High-Quality Image of this artwork by IIIF API ( https://iiif.io/api/image/2.1/ )
    if (p1[0]){ // check if query reuslt is a truthy value (i.e. if nothing returned, this condition is evaluated to be falsy )
        HDimageURL = p1[0].URL + "/full/!600,600/0/default.jpg" // this is getting the {full view, pixel 600 x 600, default-tone}
        p1[0].URL = HDimageURL;
    }


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
 * query parameter `?objectID=`
 * ****************************************
 * recommand similar artwork by primary and secondary similarities 
 * 
 * URL format (with query parameter): /localhost:8080/artwork/similarArtworks?id=xx
 * ex. (default) URL: http://localhost:8080/artwork/similarArtworks  
 * ex. (normal case) URL: http://localhost:8080/artwork/similarArtworks?id=0
 * ex. (non-existing objectID) http://localhost:8080/artwork/similarArtworks?objectID=9999999                 
 */
 async function similarArtworks(req, res) {
    // guarding for non-numeric inputs for "objectID" query-parameter
    if (isNaN(req.query.objectID)){
        return res.json ({results_P1 : "NOTHING", results_P2 : "NOTHING"});
    }

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
    var artworkClass = null;
    var portfolio = null;
    var series = null;
    var volume = null;
    if (p1[0]) {
        artworkClass = p1[0].classification;
        portfolio = p1[0].portfolio;
        series = p1[0].series;
        volume = p1[0].volume;
    } else {
        // in this case, the given objectID does not exist in our database
        return res.json ({results_P1 : "NOTHING", results_P2 : "NOTHING"});
    }


    // 2) get the artist's ID of this artwork
    let info2= `
    SELECT objectID, constituentID, displayOrder
    FROM objects_constituents
    WHERE objectID = 32572
    ORDER BY displayOrder;
    ` ;
    const p2 = await connection.query(info2).catch(err => {throw err});
    var artistID = null;
    if (p2[0]){
        artistID = p2[0].constituentID; // just take the first artist (if multiple artists)
    }

    
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
    let queryStr2= `
    SELECT DISTINCT O.title, O.attribution, O.objectID, OI.thumbURL, OT.termType, O.series, O.portfolio, O.volume
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
    // to FRONT-END Note: if results_P1 == "NOTHING", meaning there is nothing similar to be recommanded
    if ( !similar1 && !similar2 ) {
        return res.json ({results_P1 : "NOTHING", results_P2 : "NOTHING"});
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
 * search relavent artworks by a variety of filters:
 * result will be returned by the following ordering: endYear >> title >> attribution >> lastName
 * ex. URL (default)      http://localhost:8080/search/byFilter
 * 
 * Normal Filtering Cases: 
 * Case1: full filters 
 * ex. http://localhost:8080/search/byFilter?nationality=French&style=Impressionist&beginYear=1000&endYear=2000&classification=painting&page=1&pagesize=20   
 * Case2: have “style”, miss “nationality”
 * ex. http://localhost:8080/search/byFilter?nationality=&style=Impressionist&beginYear=1000&endYear=2000&classification=painting&page=2&pagesize=20   
 * Case3: have “nationality”, miss “style”
 * ex. http://localhost:8080/search/byFilter?nationality=Japanese&style=&beginYear=1000&endYear=2000&classification=painting&page=1&pagesize=20  
 * Case4: miss “nationality”, miss “style”
 * ex. http://localhost:8080/search/byFilter?nationality=&style=&beginYear=1000&endYear=2000&classification=painting&page=1&pagesize=20  
 * 
 * Edge Case:
 * ex. invalid year inputs: http://localhost:8080/search/byFilter?nationality=French&style=Impressionist&beginYear=iris&endYear=ma&classification=painting&page=&pagesize=   
 */
 async function filterSearch(req, res) {
    
    // #####################################################################################
    // ##################################  SECTION 1  ######################################
    // #####################################################################################
    //1) guarding for invalid parameter values
    if (isNaN(req.query.beginYear) || isNaN(req.query.endYear) || isNaN(req.query.page) || isNaN(req.query.pagesize)){
        return res.json ({results :[]});
    }

    //2) get these basic query parameters (these are always required for all cases)
    var classification = req.query.classification ? req.query.classification : '%' //default match for all classification
    // check if begin, end year are numbers
    var beginYear = null;
    if ( req.query.beginYear && !isNaN(req.query.beginYear)) {
        beginYear = req.query.beginYear;
    } else {
        beginYear = 0; // default beginYear is 0
    }
    var endYear = null;
    if ( req.query.endYear && !isNaN(req.query.endYear)) {
        endYear = req.query.endYear;
    } else {
        endYear = 2022; // default endYear is 2022
    }

    //3) initialize these variables, but needs more specific check for different query cases !!
    var nationality = null; 
    var style = null;   

    //3) fetch query parameter for pagination
    const page = req.query.page ? req.query.page : 1            //defualt show 1st page, also assume user always enters valid page range: [1~n]
    const limit = req.query.pagesize ? req.query.pagesize : 6  //default 10 rows of query result per page display
    const offset = (page - 1) * limit                           //(page-1) since query offset is 0-based-indexing

    //4) initialize a var for hold query string
    var queryStr = null;

    // #####################################################################################
    // ##################################  SECTION 2  ######################################
    // #####################################################################################

    /** **********************************************************************************************************
     * Explaination for the purpose of casing:
     * since filtering for "style", require the extra JOIN with "objects_terms" table,
     * IMPORTANT NOTICE: many artworks do have have a "style" attribute, or do not have any associated term description, hence these artworks'objectID do not exist in "object_terms" table
     * this joining could potentially result in the loss of a significant portion of artworks data
     * Therefore, when the "style" filer is NOT applied (i.e. NULL), we use an alternative version of jointed relations
     * -----------------------------------------
     * similar idea for "nationality" filter, which requires the JOINs with "objects_constituents", "constituents",
     * *********************************************************************************************************
     */

    /** *****************************
     * CASE 1: having "style" filer AND "nationality" filter
     * ******************************
     * in this case, we need to JOIN "objects", "objects_constituents", "constituents", "objects_images", "objects_terms"
     */
    if (req.query.style && req.query.nationality) {
        // if there is a truthy value for "style" & "nationality" query parameters
        nationality = req.query.nationality;
        style = req.query.style;
        queryStr = `
        SELECT DISTINCT O.title, O.attribution, O.endYear, O.objectID, OI.thumbURL
        FROM objects O JOIN objects_constituents OC
            JOIN constituents C
            JOIN objects_images OI
            JOIN objects_terms OT
            ON O.objectID = OC.objectID AND OC.constituentID = C.constituentID AND
                O.objectID =OI.objectID AND O.objectID =OT.objectID
        WHERE (LOWER(C.visualBrowserNationality) LIKE LOWER('%${nationality}%')) AND
                (LOWER(OT.term) LIKE LOWER('%${style}%') AND OT.termType = 'Style') AND
                (O.beginYear >= ${beginYear} AND O.endYear <= ${endYear}) AND
                (LOWER(O.classification) LIKE LOWER('%${classification}%'))
        ORDER BY O.endYear, O.title, O.attribution, C.lastName
        LIMIT ${offset}, ${limit};
        `;
    
    /** *****************************
     * CASE 2: having "style" filter, missing "nationality" filter,
     * ******************************
     * in this case, we need to JOIN "objects", "objects_images", "objects_terms"
     */
    } else if (req.query.style && !req.query.nationality){
        style = req.query.style;
        queryStr = `
        SELECT DISTINCT O.title, O.attribution, O.endYear, O.objectID, OI.thumbURL
        FROM objects O JOIN objects_images OI JOIN objects_terms OT
                    ON O.objectID =OI.objectID AND O.objectID =OT.objectID
        WHERE (LOWER(OT.term) LIKE LOWER('%${style}%') AND OT.termType = 'Style') AND
                        (O.beginYear >= ${beginYear} AND O.endYear <= ${endYear}) AND
                        (LOWER(O.classification) LIKE LOWER('%${classification}%'))
        ORDER BY O.endYear, O.title, O.attribution
        LIMIT ${offset}, ${limit};
        `;
    /** *****************************
     * CASE 3: having "nationality" filter, missing "style" filter
     * ******************************
     * in this case, we need to JOIN "objects", "objects_constituents", "constituents", "objects_images"
     */
    } else if (!req.query.style && req.query.nationality){
        nationality = req.query.nationality;
        queryStr = `
        SELECT DISTINCT O.title, O.attribution, O.endYear, O.objectID, OI.thumbURL
        FROM objects O JOIN objects_constituents OC
                    JOIN constituents C
                    JOIN objects_images OI
                    ON O.objectID = OC.objectID AND OC.constituentID = C.constituentID AND
                        O.objectID =OI.objectID
        WHERE (LOWER(C.visualBrowserNationality) LIKE LOWER('%${nationality}%')) AND
                        (O.beginYear >= ${beginYear} AND O.endYear <= ${endYear}) AND
                        (LOWER(O.classification) LIKE LOWER('%${classification}%'))
        ORDER BY O.endYear, O.title, O.attribution, C.lastName
        LIMIT ${offset}, ${limit};
        `;
    /** *****************************
     * CASE 4: missing "nationality" filter, missing "style" filter
     * ******************************
     * in this case, we need to JOIN "objects", "objects_constituents", "constituents", "objects_images"
     */
    } else if (!req.query.style && !req.query.nationality){
        queryStr = `
        SELECT DISTINCT O.title, O.attribution, O.endYear, O.objectID, OI.thumbURL
        FROM objects O JOIN objects_images OI ON O.objectID =OI.objectID
        WHERE (O.beginYear >= ${beginYear} AND O.endYear <= ${endYear}) AND
                (LOWER(O.classification) LIKE LOWER('%${classification}%'))
        ORDER BY O.endYear, O.title, O.attribution
        LIMIT ${offset}, ${limit};
        `;
    }


    // #####################################################################################
    // ##################################  SECTION 3  ######################################
    // #####################################################################################

    const filterResult = await connection.query(queryStr).catch(err => {throw err});
    return res.json( {results: filterResult});
 };


// #######################################
// ############# YINJIE ##################
// #######################################
/** **************************************
 * Route 5 (handler) - keywordSearch
 * ***************************************
 * search relavent artworks by artwork's title OR/AND artist's name
 * Note: single space in URL's route parameter needs to be encoded as `%20`
 * ex. URL (defualt) http://localhost:8080/search/byKeyword
 * ex. URL (normal case) http://localhost:8080/search/byKeyword?artworkTitle=American%20Flamingo&artistName=Robert%20Havell
 * ex. URL (full) http://localhost:8080/search/byKeyword?artworkTitle=American%20Flamingo&artistName=Robert%20Havell%20after%20John%20James%20Audubon
 * ex. URL (pagination) http://localhost:8080/search/byKeyword?artworkTitle=American%20Flamingo&artistName=Robert%20Havell%20after%20John%20James%20Audubon&page=1&pagesize=10
 */
 async function keywordSearch(req, res) {

    //1) guarding for invalid parameter values
    if ( isNaN(req.query.page) || isNaN(req.query.pagesize)) {
        return res.json ({results :[]});
    }

    //1) fetch Query Paramter from {URL parameter portion}
    const artworkTitle = req.query.artworkTitle ? req.query.artworkTitle : '%' // default match for all
    const artistName = req.query.artistName ? req.query.artistName : '%' // default match for all
    //2) fetch Query Parameter "page" & "pagesize"
    const page = req.query.page ? req.query.page : 1 //we assume user always enters valid page range: [1~n]
    const limit = req.query.pagesize ? req.query.pagesize : 6 //default 10 rows of query result per page display
    //3) calculate offsets
    const offset = (page - 1) * limit //(page-1) since query offset is 0-based-indexing

    let queryStr = `
        SELECT DISTINCT O.title, O.attribution, O.endYear, O.objectID, OI.thumbURL
        FROM objects O JOIN objects_constituents OC
                JOIN constituents C
                JOIN objects_images OI
        ON O.objectID = OC.objectID AND OC.constituentID = C.constituentID AND O.objectID =OI.objectID
        WHERE (LOWER(O.title) LIKE LOWER('%${artworkTitle}%')) AND
            (LOWER(O.attribution) LIKE LOWER('%${artistName}%') OR LOWER(O.attributionInverted) LIKE LOWER('%${artistName}%') OR
            LOWER(C.lastName) LIKE LOWER('%${artistName}%') OR LOWER(C.preferredDisplayName) LIKE LOWER('%${artistName}%') OR
            LOWER(C.forwardDisplayName) LIKE LOWER('%${artistName}%'))
        ORDER BY O.title, O.attribution, C.preferredDisplayName, O.endYear
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
 };

 
// #######################################
// ############# YINJIE ##################
// #######################################
/** **************************************
 * Route 6 (handler) - naughtySearchHeight
 * ***************************************
 * naughty search "painting" artworks by matching user's height (cm) with artwork's height (cm)
 * ex. URL (defualt) http://localhost:8080/search/naughtySearchByHeight
 * ex. URL (height)  http://localhost:8080/search/naughtySearchByHeight?height=185
 * ex. URL (pagination) http://localhost:8080/search/naughtySearchByHeight?height=185&page=2&pagesize=10
 */
 async function naughtySearchHeight(req, res) {

    // guarding for invalid parameter values
    if (isNaN(req.query.height) || isNaN(req.query.page) || isNaN(req.query.pagesize)){
        return res.json ({results :[]});
    }
    //1) fetch Route Paramter from {URL parameter portion}
    const height = req.query.height ? req.query.height : 170 // default height is 170
    //2) fetch Query Parameter "page" & "pagesize"
    const page = req.query.page? req.query.page : 1 //default page is 1, we assume user always enters valid page range: [1~n]
    const limit = req.query.pagesize ? req.query.pagesize : 10 //default 10 rows of query result per page display
    //3) calculate offsets
    const offset = (page - 1) * limit //(page-1) since query offset is 0-based-indexing
    
    let queryStr = `
    SELECT O.title, O.attribution, O.objectID, OI.thumbURL, OD.dimension, ABS(${height}-OD.dimension) AS deviation
    FROM objects O JOIN objects_images OI
    JOIN objects_dimensions OD
    ON O.objectID =OI.objectID AND O.objectID = OD.objectID
    WHERE O.classification = 'painting' AND OD.dimensionType = 'height' AND OD.unitName = 'centimeters' 
    ORDER BY ABS(${height}-OD.dimension), O.title   
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
};


// #######################################
// ############# YINJIE ##################
// #######################################
/** **************************************
 * Route 7 (handler) - naughtySearchBirthYear
 * ***************************************
 * naughty search artworks by matching with user's birthYear,
 * return the artwork (of all kinds) produced in the birthYear in height descending order (tall --> short)
 * ex. URL (default) http://localhost:8080/search/naughtySearchByBirthYear
 * ex. URL (year)    http://localhost:8080/search/naughtySearchByBirthYear?birthYear=1986
 * ex. URL (pagination) http://localhost:8080/search/naughtySearchByBirthYear?birthYear=1986&page=2&pageszie=10
 * Edge Case Safe:
 * ex. (birthYear non-number) http://localhost:8080/search/naughtySearchByBirthYear?birthYear=iris
 */
 async function naughtySearchBirthYear(req, res) {
     // guarding for invalid parameter values
    if (isNaN(req.query.birthYear) || isNaN(req.query.page) || isNaN(req.query.pagesize) || req.query.page <= 0 || req.query.pagesize <= 0){
        return res.json ({results :[]});
    }
    
    // guarding for invalid parameter values
    if (isNaN(req.query.birthYear) || isNaN(req.query.page) || isNaN(req.query.pagesize)){
        return res.json ({results :[]});
    }

    //1) check if query-paramter `birthYear` is a number and fetch it 
    var birthYear = null;
    if ( req.query.birthYear && !isNaN(req.query.birthYear)) {
        birthYear = req.query.birthYear;
    } else {
        birthYear = 1999; // default birthYear is 1999
    }
    
    //2) fetch Query Parameter "page" & "pagesize"
    const page = req.query.page ? req.query.page : 1 //we assume user always enters valid page range: [1~n]
    const limit = req.query.pagesize ? req.query.pagesize : 10 //default 10 rows of query result per page display
    //3) calculate offsets
    const offset = (page - 1) * limit //(page-1) since query offset is 0-based-indexing
    
    let queryStr = `
    SELECT O.title, O.attribution, O.objectID, O.endYear, ABS(${birthYear}-O.endYear) AS deviation, OI.thumbURL, OD.dimension
    FROM objects O JOIN objects_images OI JOIN objects_dimensions OD
        ON O.objectID = OI.objectID AND O.objectID = OD.objectID
    WHERE O.endYear IS NOT NULL AND OD.dimensionType = 'height'
    ORDER BY ABS(${birthYear}-O.endYear), OD.dimension DESC   
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
    FROM objects_terms OT
    WHERE OT.termType = 'Style')
    UNION
    (SELECT OT.termType, COUNT(DISTINCT OT.term) AS termVarietyCount
    FROM objects_terms OT
    WHERE OT.termType = 'School')
    UNION
    (SELECT OT.termType, COUNT(DISTINCT OT.term) AS termVarietyCount
    FROM objects_terms OT
    WHERE OT.termType = 'Theme')
    UNION
    (SELECT OT.termType, COUNT(DISTINCT OT.term) AS termVarietyCount
    FROM objects_terms OT
    WHERE OT.termType = 'Keyword')
    UNION
    (SELECT OT.termType, COUNT(DISTINCT OT.term) AS termVarietyCount
    FROM objects_terms OT
    WHERE OT.termType = 'Technique')
    UNION
    (SELECT OT.termType, COUNT(DISTINCT OT.term) AS termVarietyCount
    FROM objects_terms OT
    WHERE OT.termType = 'Place Executed');
    
    `;
    const resOverview = await connection.query(queryStr0).catch(err => {throw err});

     // 1) query for part 1 of the result
     let queryStr1= `
     SELECT OT.term AS name, COUNT(*) AS value
     FROM objects_terms OT
     WHERE OT.termType = 'Style'
     GROUP BY OT.term
     ORDER BY COUNT(*) DESC
     LIMIT 80
     ` ;
     const resStyle = await connection.query(queryStr1).catch(err => {throw err});
 
     // 2) query for part 2 of the result
     let queryStr2= `
     SELECT OT.term AS name, COUNT(*) AS value
     FROM objects_terms OT
     WHERE OT.termType = 'School'
     GROUP BY OT.term
     ORDER BY COUNT(*) DESC
     LIMIT 80
     `;
     const resSchool = await connection.query(queryStr2).catch(err => {throw err});
 
     // 3) query for part 3 of the result
     let queryStr3 = `
     SELECT OT.term AS name, COUNT(*) AS value
     FROM objects_terms OT
     WHERE OT.termType = 'Technique'
     GROUP BY OT.term
     ORDER BY COUNT(*) DESC
     LIMIT 80
     `;
     const resTechnique = await connection.query(queryStr3).catch(err => {throw err});
     
     // 4) query for part 4 of the result
     let queryStr4 = `
     SELECT OT.term AS name, COUNT(*) AS value
     FROM objects_terms OT
     WHERE OT.termType = 'Theme'
     GROUP BY OT.term
     ORDER BY COUNT(*) DESC
     LIMIT 80
     `;
     const resTheme = await connection.query(queryStr4).catch(err => {throw err});
     
     // 5) query for part 5 of the result
     let queryStr5 = `
     SELECT OT.term AS name, COUNT(*) AS value
     FROM objects_terms OT
     WHERE OT.termType = 'Keyword'
     GROUP BY OT.term
     ORDER BY COUNT(*) DESC
     LIMIT 80
     `;
     const resKeyword = await connection.query(queryStr5).catch(err => {throw err});


     // 6) query for part 5 of the result
     let queryStr6 = `
     SELECT OT.term AS name, COUNT(*) AS value
     FROM objects_terms OT
     WHERE OT.termType = 'Place Executed'
     GROUP BY OT.term
     ORDER BY COUNT(*) DESC
     LIMIT 80
     `;
     const resPlaceExecuted = await connection.query(queryStr6).catch(err => {throw err});

     // 7) return all three parts together as a JSON object
     res.json( {Style: resStyle, School: resSchool, Theme: resTheme, Technique: resTechnique, Keyword: resKeyword, PlaceExecuted: resPlaceExecuted } );

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
 * within the givne time range, find and return artworks that have their theme of contents been defined as portraits
 * front-end will ask for 5 different time-spans: 16th (1500~1599), 17th (1600~1699), 18th(1700~1799), 19th (1800~1899), 20th (1900~1999) centries
 * URL route parameter `:artworkClass`: 'painting' or 'drawing' or 'print'
 * URL query parameter `?beginYear=xxxx&endYear=xxxx&page=x&pagesize=5`
 * 
 * ex. http://localhost:8080/analysis/portraitsAcrossTime/painting?beginYear=1600&endYear=1699 
 * ex. http://localhost:8080/analysis/portraitsAcrossTime/drawing?beginYear=1600&endYear=1699&page=2&pagesize=20  

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
    naughtySearchHeight,
    naughtySearchBirthYear,
    analysisOverview,
    analysisByType,
    portraitsAcrossTime
}