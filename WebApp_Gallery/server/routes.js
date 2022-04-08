const config = require('./config.json')
const mysql = require('mysql');
const util = require("util"); // NEW FEATURE!!
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
    let queryStr1= `
    SELECT O.title, O.attribution, O.medium, O.dimensions, O.classification, O.series, O.portfolio, O.volume, OI.URL
    FROM objects O JOIN objects_images OI ON O.objectID = OI.objectID
    WHERE O.objectID = 0;` ;
    const p1 = await connection.query(queryStr1).catch(err => {throw err});

    // 2) query for part 2 of the result
    let queryStr2= `
    SELECT C.preferredDisplayName,OC.displayOrder, C.displayDate, C.visualBrowserNationality
    FROM objects_constituents OC JOIN constituents C ON OC.constituentID = C.constituentID
    WHERE OC.objectID = 0
    ORDER BY displayOrder;` ;
    const p2 = await connection.query(queryStr2).catch(err => {throw err});

    // 3) query for part 3 of the result
    let queryStr3 = `
    SELECT OT.termType, OT.term
    FROM objects_terms OT
    WHERE OT.objectID = 0
    ORDER BY termType;` ;

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
    let queryStr1 = `
    SELECT DISTINCT O.title, O.attribution, O.objectID, OI.thumbURL, O.series, O.portfolio, O.volume
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
    LIMIT 4;`;
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
    LIMIT 4;` ;
    const same2 = await connection.query(queryStr2).catch(err => {throw err});
    
    // 4) return all three parts together as a JSON object
    res.json( {results_P1 : same1, results_P2: same2});
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
 * Route 5.1 (handler) - naughtySearch_height
 * ***************************************
 * naughty search by height
 * ex. URL http://localhost:8080/search/naughtySearchByHeight?height=170
 * ex. URL (pagination) http://localhost:8080/search/naughtySearchByHeight?height=170&page=2&pageszie=10
 */
async function naughtySearchHeight(req, res) {
    //1) fetch Route Paramter from {URL parameter portion}
    const height = req.params.height ? req.params.height : 170 // default height is 170
    //2) fetch Query Parameter "page" & "pagesize"
    const page = req.query.page //we assume user always enters valid page range: [1~n]
    const limit = req.query.pagesize ? req.query.pagesize : 10 //default 10 rows of query result per page display
    //3) calculate offsets
    const offset = (page - 1) * limit //(page-1) since query offset is 0-based-indexing


    if (req.query.page && !isNaN(req.query.page)) {
        // This is the case where page is defined.
        let queryStr = `
        SELECT O.title, O.attribution, O.objectID, OI.thumbURL, OD.dimension, ABS('${height}'-OD.dimension)
        FROM objects O JOIN objects_images OI
        JOIN objects_dimensions OD
        ON O.objectID =OI.objectID AND O.objectID = OD.objectID
        WHERE O.classification = 'painting' AND OD.dimensionType = 'height' AND OD.unitName = 'centimeters' 
        ORDER BY ABS('${height}'-OD.dimension), O.title   
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
        SELECT O.title, O.attribution, O.objectID, OI.thumbURL, OD.dimension, ABS('${height}'-OD.dimension)
        FROM objects O JOIN objects_images OI
        JOIN objects_dimensions OD
        ON O.objectID =OI.objectID AND O.objectID = OD.objectID
        WHERE O.classification = 'painting' AND OD.dimensionType = 'height' AND OD.unitName = 'centimeters' 
        ORDER BY ABS('${height}'-OD.dimension), O.title;
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
// ############# YINJIE ##################
// #######################################
/** **************************************
 * Route 5.2 (handler) - naughtySearch_birthYear
 * ***************************************
 * naughty search by birthYear
 * ex. URL http://localhost:8080/search/naughtySearchByBirthYear?birthYear=1999
 * ex. URL (pagination) http://localhost:8080/search/naughtySearchByBirthYear?birthYear=1999&backYear=100&page=2&pageszie=10
 */
 async function naughtySearchBirthYear(req, res) {
    //1) fetch Route Paramter from {URL parameter portion}
    const birthYear = req.params.birthYear ? req.params.birthYear : 1999 // default birthYear is 1999
    //2) fetch backyear from client end
    const backYear = req.params.backYear ? req.params.backYear : 100 // default backYear is -100
    //3) calculate year difference
    const yearDif = birthYear - backYear
    //4) fetch Query Parameter "page" & "pagesize"
    const page = req.query.page //we assume user always enters valid page range: [1~n]
    const limit = req.query.pagesize ? req.query.pagesize : 10 //default 10 rows of query result per page display
    //5) calculate offsets
    const offset = (page - 1) * limit //(page-1) since query offset is 0-based-indexing


    if (req.query.page && !isNaN(req.query.page)) {
        // This is the case where page is defined.
        let queryStr = `
        SELECT O.title, O.attribution, O.objectID, O.endYear, ABS('${yearDif}'-O.endYear), OI.thumbURL, OD.dimension
        FROM objects O JOIN objects_images OI JOIN objects_dimensions OD
        ON O.objectID =OI.objectID AND O.objectID = OD.objectID
        WHERE O.endYear IS NOT NULL AND OD.dimensionType = 'height'
        ORDER BY ABS('${yearDif}'-O.endYear), OD.dimension DESC   
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
        SELECT O.title, O.attribution, O.objectID, O.endYear, ABS('${yearDif}'-O.endYear), OI.thumbURL, OD.dimension
        FROM objects O JOIN objects_images OI JOIN objects_dimensions OD
        ON O.objectID =OI.objectID AND O.objectID = OD.objectID
        WHERE O.endYear IS NOT NULL AND OD.dimensionType = 'height'
        ORDER BY ABS('${yearDif}'-O.endYear), OD.dimension DESC;
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

/** **************************************
 * Route 6 (handler) - analysisOverview
 * ***************************************
 * 
 */
 async function analysisOverview(req, res) {
    let queryStr = `
    SELECT OT.termType, COUNT(*) AS termTypeCounts
    FROM objects O JOIN objects_terms OT ON O.objectID = OT.objectID
    GROUP BY OT.termType
    ORDER BY COUNT(*) DESC;
    `;
    
    // a GET request to URL: /home
    connection.query( queryStr, 
            function (error, results, fields) {
            // if the query action results in ERORR rising, output the error message to console display
            if (error) {
                console.log(error)
                res.json({ error: error })
            // if there is legit query reusults returned, diplay the result
            } else if (results) {
                res.json({ results: results })
            }
        }
    );
};


/** **************************************
 * Route 7 (handler) - analysisByType
 * ***************************************
 * front-end will prompt user to specify whcih type of analysis he/she wants to check
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
    naughtySearchHeight,
    naughtySearchBirthYear,
    analysisOverview,
    analysisByType,
    portraitsAcrossTime
}