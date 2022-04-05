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
//promise wrapper to enable async await with MYSQL
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
            const strWelcome = `Welcome to DataOmni's Virtual Gallery (powered by National Gallery of Art)!`
            res.json({ msg: strWelcome, results: results })
        }
    });
}

/** **************************************
 * Route 2 (handler) - 
 * ***************************************
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

}

// ********************************************
//               GENERAL ROUTES
// ********************************************

// ***** TASK 4 *******************************
// Route 3 (handler)
async function all_matches(req, res) {
    
    // Parameterized Routes (server.js): app.get('/matches/:league', routes.all_matches)

    // TODO: TASK 4: implement and test, potentially writing your own (ungraded) tests
    // We have partially implemented this function for you to parse in the league encoding:
    // this is how you would use the ternary operator to set a variable to a default value
    // we didn't specify this as the default value for league, and you could change it if you want! 
    // in reality, league will never be undefined since URLs will need to match matches/:league for the request to be routed here... 
    // meaning if you try to open URL "http://localhost:8080/matches" in Browser, it returns ERORRR msg "Cannot GET /matches"
   
    //1) fetch Route Paramter from {URL parameter portion}
    const league = req.params.league ? req.params.league : 'D1'
    // use this league encoding in your query to furnish the correct results
    //2) fetch Query Parameter "page" & "pagesize"
    const page = req.query.page //we assume user always enters valid page range: [1~n]
    const limit = req.query.pagesize ? req.query.pagesize : 10 //default 10 rows of query result per page display
    //3) calculate offsets
    const offset = (page - 1) * limit //(page-1) since query offset is 0-based-indexing

    if (req.query.page && !isNaN(req.query.page)) {
        // This is the case where page is defined.
        // TODO: query and return results here:
        connection.query(
            `SELECT MatchId, Date, Time, HomeTeam AS Home, AwayTeam AS Away, FullTimeGoalsH AS HomeGoals, FullTimeGoalsA AS AwayGoals  
            FROM Matches 
            WHERE Division = '${league}'
            ORDER BY HomeTeam, AwayTeam
            LIMIT ${offset}, ${limit}`, 
        function (error, results, fields) {
            // if the query action results in ERORR rising, output the error message to console display
            if (error) {
                console.log(error)
                res.json({ error: error })
            // if there is legit query reusults returned, diplay the result
            } else if (results) {
                res.json({ results: results })
            }
        });
    } else {
        // if "page" is not defined (even if "pagesize" is defined, this block of code will get executed)
        // we have implemented this for you to see how to return results by querying the database
        connection.query(
            `SELECT MatchId, Date, Time, HomeTeam AS Home, AwayTeam AS Away, FullTimeGoalsH AS HomeGoals, FullTimeGoalsA AS AwayGoals  
            FROM Matches 
            WHERE Division = '${league}'
            ORDER BY HomeTeam, AwayTeam`, 
        function (error, results, fields) {
            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                res.json({ results: results })
            }
        });
    }
}

// ***** TASK 5 *******************************
// Route 4 (handler)
async function all_players(req, res) {

    // Parameterized Routes (server.js): app.get('/players', routes.all_players)
    // TODO: TASK 5: implement and test, potentially writing your own (ungraded) tests
    // The SQL schema has the attribute OverallRating, but modify it to match spec! 
    
    //1) fetch Query Parameter "page" & "pagesize"
    const page = req.query.page //we assume user always enters valid page range: [1~n]
    const limit = req.query.pagesize ? req.query.pagesize : 10 //default 10 rows of query result per page display
    //3) calculate offsets
    const offset = (page - 1) * limit //(page-1) since query offset is 0-based-indexing

    if (req.query.page && !isNaN(req.query.page)) {
        // This is the case where page is defined.
        connection.query(
            `SELECT  PlayerId, Name, Nationality, OverallRating as Rating, Potential, Club, Value
            FROM Players
            ORDER BY Name
            LIMIT ${offset}, ${limit}`, 
        function (error, results, fields) {
            // if the query action results in ERORR rising, output the error message to console display
            if (error) {
                console.log(error)
                res.json({ error: error })
            // if there is legit query reusults returned, display the result
            } else if (results) {
                res.json({ results: results })
            }
        });

        // totalRes = res1+ res2 + res3
        
    } else {
        // if "page" is not defined (even if "pagesize" is defined, this block of code will get executed)
        connection.query(
            `SELECT  PlayerId, Name, Nationality, OverallRating as Rating, Potential, Club, Value
            FROM Players
            ORDER BY Name`, 
        function (error, results, fields) {
            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                res.json({ results: results })
            }
        });
    }
}


// ********************************************
//             MATCH-SPECIFIC ROUTES
// ********************************************

// ***** TASK 6 *******************************
// Route 5 (handler)
async function match(req, res) {
    // Parameterized Routes (server.js): app.get('/match', routes.match)
    // TODO: TASK 6: implement and test, potentially writing your own (ungraded) tests

    //1) fetch Query Parameter "id"
    const MatchID = req.query.id //we assume user always enters valid page range: [1~n]

    if (req.query.id && !isNaN(req.query.id)) {
        // This is the case where query-param "id" is defined.
        connection.query(
            `SELECT MatchId, Date, Time, HomeTeam as Home, AwayTeam as Away, FullTimeGoalsH as HomeGoals, FullTimeGoalsA as AwayGoals, HalfTimeGoalsH as HTHomeGoals, HalfTimeGoalsA as HTAwayGoals, ShotsH as ShotsHome, ShotsA as ShotsAway, ShotsOnTargetH as ShotsOnTargetHome,  ShotsOnTargetA as ShotsOnTargetAway, FoulsH as FoulsHome, FoulsA as FoulsAway, CornersH as CornersHome, CornersA as CornersAway, YellowCardsH as YCHome, YellowCardsA as YCAway, RedCardsH as RCHome, RedCardsA as RCAway
            FROM Matches
            WHERE MatchId = ${MatchID}`, 
        function (error, results, fields) {
            // if the query action results in ERORR rising, output the error message to console display
            if (error) {
                console.log(error)
                res.json({ error: error })
            // if there is legit query reusults returned, display the result
            } else if (results) {
                res.json({ results: results })
            }
        });
    } else {
        // if "id" is not defined OR it is not a number
        return res.json({error: "MatchID is not defined OR it is not a number"})
    }
}

// ********************************************
//            PLAYER-SPECIFIC ROUTES
// ********************************************

// ***** TASK 7 *******************************
// Route 6 (handler)
async function player(req, res) {
    // Parameterized Routes (server.js): app.get('/player', routes.player)
    // TODO: TASK 7: implement and test, potentially writing your own (ungraded) tests
    
    //1) fetch Query Parameter "id"
    const PlayerID = req.query.id //we assume 

    //2) This is the case where query-param "id" is defined and it's value is NOT NaN
    if (req.query.id && !isNaN(req.query.id)) {
        connection.query(
            `SELECT *
            FROM Players
            WHERE PlayerID = ${PlayerID}`, 
        function (error, results, fields) {
            
            //3) if the query action results in ERORR rising, output the error message to console display
            if (error) {
                console.log(error)
                res.json({ error: error })
            
            //4) if the Player's best position is GoalKeeper (GK), display the extra GK-related attributes
            /********************************************
             * Note: the "results" object is returned as an array of tuples i.e. [tp1, tp2, tp3, ... tpn]
             * and each tuple is represented as a map with attributes & values as key:value pairs 
             * i.e. [ {"name": "Iris", "height": 175, "weight": 63, "location": toronto}, {"name": "Apple", "height": 100, "weight": 5, "location": London}, {"name": "Bob", "height": 160, "weight": 60, "location": Beijing} ....]
             * so we can access the specific value of a tuple by using index[] operator & deferencing dot with attributename
             * i.e. results[0].name => would give "Iris"
             */
            } else if (results.length>0 && results[0].BestPosition == 'GK') {
                // NOTE: important to sanity check if query result is empty, otherwise this server-app-program will crash when handling invalid "id" entry
                connection.query(
                    `SELECT PlayerId, Name, Age, Photo, Nationality, Flag, OverallRating as Rating, Potential, Club, ClubLogo, Value, Wage, InternationalReputation, Skill, JerseyNumber, ContractValidUntil, Height, Weight, BestPosition, BestOverallRating, NULLIF(ReleaseClause,'') as ReleaseClause, GKPenalties, GKDiving, GKHandling, GKKicking, GKPositioning, GKReflexes
                    FROM Players
                    WHERE PlayerId = ${PlayerID};`, 
                function (error, results, fields) {
                    // if the query action results in ERORR rising, output the error message to console display
                    if (error) {
                        console.log(error);
                        res.json({ error: error });
                    // if there is legit query reusults returned, display the result
                    } else if (results) {
                        res.json({ results: results });
                    }
                });

            //5) if the player's best position is non-GK, display the extra nonGK-attributes
            } else {
                connection.query(
                    `SELECT PlayerId, Name, Age, Photo, Nationality, Flag, OverallRating as Rating, Potential, Club, ClubLogo, Value, Wage, InternationalReputation, Skill, JerseyNumber, ContractValidUntil, Height, Weight, BestPosition, BestOverallRating, NULLIF(ReleaseClause,'') as ReleaseClause, NPassing, NBallControl, NAdjustedAgility, NStamina, NStrength, NPositioning
                    FROM Players
                    WHERE PlayerId = ${PlayerID};`, 
                function (error, results, fields) {
                    // if the query action results in ERORR rising, output the error message to console display
                    if (error) {
                        console.log(error)
                        res.json({ error: error })
                    // if there is legit query reusults returned, display the result
                    } else if (results) {
                        res.json({ results: results })
                    }
                });
            }
        });
    //6) if "id" is not defined OR it is not a number
    } else {
        return res.json({error: "PlayerID is not defined OR it is not a number"})
    }
}


// ********************************************
//             SEARCH ROUTES
// ********************************************

// ***** TASK 8 *******************************
// Route 7 (handler)
async function search_matches(req, res) {
    // TODO: TASK 8: implement and test, potentially writing your own (ungraded) tests
    // IMPORTANT: in your SQL LIKE matching, use the %query% format to match the search query to substrings, not just the entire string

    //1) fetch query params
    const home = req.query.Home ? req.query.Home: '%'; // use `%` as wild-card, param not specified
    const away = req.query.Away ? req.query.Away: '%';
    //2) fetch Query Parameter "page" & "pagesize"
    const page = req.query.page //we assume user always enters valid page range: [1~n]
    const limit = req.query.pagesize ? req.query.pagesize : 10 //default 10 rows of query result per page display
    //3) calculate offsets
    const offset = (page - 1) * limit //(page-1) since query offset is 0-based-indexing

    //4) This is the case where query-param "page" is defined and it is a number.
    if (req.query.page && !isNaN(req.query.page)) {
        
        connection.query(
            `SELECT MatchId, Date, Time, HomeTeam as Home, AwayTeam as Away, FullTimeGoalsH as HomeGoals, FullTimeGoalsA as AwayGoals
            FROM Matches
            WHERE HomeTeam LIKE '%${home}%' AND AwayTeam LIKE '%${away}%'
            ORDER BY HomeTeam, AwayTeam 
            LIMIT ${offset}, ${limit}`, 
        function (error, results, fields) {
            // if the query action results in ERORR rising, output the error message to console display
            if (error) {
                console.log(error)
                res.json({ error: error })
            // if there is legit query reusults returned, display the result
            } else if (results) {
                res.json({ results: results })
            }
        });
    } else {
        // if "page" is not defined OR it is not a number, return all valid entries
        connection.query(
            `SELECT MatchId, Date, Time, HomeTeam as Home, AwayTeam as Away, FullTimeGoalsH as HomeGoals, FullTimeGoalsA as AwayGoals
            FROM Matches
            WHERE HomeTeam LIKE '%${home}%' AND AwayTeam LIKE '%${away}%'
            ORDER BY HomeTeam, AwayTeam`, 
        function (error, results, fields) {
            // if the query action results in ERORR rising, output the error message to console display
            if (error) {
                console.log(error)
                res.json({ error: error })
            // if there is legit query reusults returned, display the result
            } else if (results) {
                res.json({ results: results })
            }
        });
    }


}

// ***** TASK 9 *******************************
// Route 8 (handler)
async function search_players(req, res) {
    // TODO: TASK 9: implement and test, potentially writing your own (ungraded) tests
    // IMPORTANT: in your SQL LIKE matching, use the %query% format to match the search query to substrings, not just the entire string
    
        //1) fetch query params
        const name = req.query.Name ? req.query.Name: '%';
        const nationality = req.query.Nationality ? req.query.Nationality: '%';
        const club = req.query.Club ? req.query.Club: '%' ;
        const RLow = req.query.RatingLow ? req.query.RatingLow: 0;
        const RHigh = req.query.RatingHigh? req.query.RatingHigh : 100;
        const PLow = req.query.PotentialLow ? req.query.PotentialLow : 0;
        const PHigh = req.query.PotentialHigh ? req.query.PotentialHigh : 100;
        //2) fetch Query Parameter "page" & "pagesize"
        const page = req.query.page //we assume user always enters valid page range: [1~n]
        const limit = req.query.pagesize ? req.query.pagesize : 10 //default 10 rows of query result per page display
        //3) calculate offsets
        const offset = (page - 1) * limit //(page-1) since query offset is 0-based-indexing
    
        //4) This is the case where query-param "page" is defined and it is a number.
        if (req.query.page && !isNaN(req.query.page)) {
            
            // DON't worry about failing this test, if the test result shows "PlayerId" should not be included
            // in Autograder(Gradescope), "PlayerId" is included in the test, it needs to be outputed as defined in TASK 7 instruction
            // here, Prof didn't include it b.c. she didn't want student to hardcode the ID values.
            connection.query(
                `SELECT PlayerId, Name, Nationality, OverallRating as Rating, Potential, Club, Value
                FROM Players
                WHERE Name LIKE '%${name}%' AND Nationality LIKE '%${nationality}%' AND Club LIKE '%${club}%'
                  AND (Potential >= ${PLow} AND Potential <= ${PHigh})
                  AND (OverallRating >= ${RLow} AND OverallRating <= ${RHigh})
                ORDER BY Name
                LIMIT ${offset}, ${limit}`, 
            function (error, results, fields) {
                // if the query action results in ERORR rising, output the error message to console display
                if (error) {
                    console.log(error)
                    res.json({ error: error })
                // if there is legit query reusults returned, display the result
                } else if (results) {
                    res.json({ results: results })
                }
            });
        } else {
            // if "page" is not defined OR it is not a number, return all valid entries
            connection.query(
                `SELECT PlayerId, Name, Nationality, OverallRating as Rating, Potential, Club, Value
                FROM Players
                WHERE Name LIKE '%${name}%' AND Nationality LIKE '%${nationality}%' AND Club LIKE '%${club}%'
                  AND (Potential >= ${PLow} AND Potential <= ${PHigh})
                  AND (OverallRating >= ${RLow} AND OverallRating <= ${RHigh})
                ORDER BY Name`, 
            function (error, results, fields) {
                // if the query action results in ERORR rising, output the error message to console display
                if (error) {
                    console.log(error)
                    res.json({ error: error })
                // if there is legit query reusults returned, display the result
                } else if (results) {
                    res.json({ results: results })
                }
            });
        }
}

module.exports = {
    galleryOverview,
    artworkInfo
}