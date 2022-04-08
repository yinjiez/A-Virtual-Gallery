USE DataOmni_NGA;

# #############################################################
# ################## Feature #1 ###############################
# #############################################################


/* -----------------------------------------------------------*/
/* --------------- Filter: by Nationality  -------------------*/
/* -----------------------------------------------------------*/
SELECT O.title, O.attribution, O.objectID, OI.thumbURL
FROM objects O JOIN objects_constituents OC
                JOIN constituents C
                JOIN objects_images OI
    ON O.objectID = OC.objectID AND OC.constituentID = C.constituentID
    AND O.objectID = OI.objectID
WHERE C.visualBrowserNationality = 'American';


/* -----------------------------------------------------------*/
/* --------------- Filter: by Artist lastName  -------------------*/
/* -----------------------------------------------------------*/
SELECT O.title, O.attribution, O.objectID, OI.thumbURL
FROM objects O JOIN objects_constituents OC
                JOIN constituents C
                JOIN objects_images OI
ON O.objectID = OC.objectID AND OC.constituentID = C.constituentID
AND O.objectID = OI.objectID
WHERE C.lastName = 'Matisse';
# WHERE C.lastName = 'Picasso';

/* -----------------------------------------------------------*/
/* --------------- Filter: by (term) Style  -------------------------*/
/* -----------------------------------------------------------*/
SELECT O.title, O.attribution, O.objectID, OI.thumbURL
FROM objects O  JOIN objects_images OI
                JOIN objects_terms OT
ON O.objectID =OI.objectID AND O.objectID =OT.objectID
#WHERE OT.term = 'French' AND OT.termType = 'Style'; # 3 art-objects of "French" Style
#WHERE OT.term = 'Qing' AND OT.termType = 'Style'; # 2 art-objects of "Qing" Style
WHERE OT.term = 'Gothic' AND OT.termType = 'Style'; # 71 art-objects of "Gothic" Style

/* -----------------------------------------------------------*/
/* --------------- Filter: by (term) School  -----------------*/
/* -----------------------------------------------------------*/
SELECT O.title, O.attribution, O.objectID, OI.thumbURL
FROM objects O JOIN objects_images OI
               JOIN objects_terms OT
    ON O.objectID = OI.objectID AND O.objectID =OT.objectID
WHERE OT.term = 'Dutch' AND OT.termType = 'School'; # 71 art-objects of "Gothic" Style
#WHERE OT.term = 'Qing' AND OT.termType = 'School'; # 71 art-objects of "Gothic" Style
#WHERE OT.term = 'Gothic' AND OT.termType = 'School'; # 71 art-objects of "Gothic" Style


/* -----------------------------------------------------------*/
/* --------------- Filter: by (term) Technique  --------------*/
/* -----------------------------------------------------------*/
SELECT O.title, O.attribution, O.objectID, OI.thumbURL
FROM objects O JOIN objects_images OI
               JOIN objects_terms OT
        ON O.objectID =OI.objectID AND O.objectID =OT.objectID
WHERE OT.term = 'painted surface' AND OT.termType = 'Technique'; # 500+ art-objects of "painted surface" techniaue
#WHERE OT.term = 'watercolor' AND OT.termType = 'Technique'; # 1 art-object of "watercolor" technique


/* -----------------------------------------------------------*/
/* --------------- Filter: Time Span  --------------*/
/* -----------------------------------------------------------*/
SELECT O.title, O.attribution, O.beginYear, O.endYear, O.objectID, OI.thumbURL
FROM objects O JOIN objects_images OI ON O.objectID =OI.objectID
WHERE O.beginYear >= 1900 AND O.endYear <= 1920;
# WHERE O.beginYear >= 700 AND O.endYear <= 800; # Edge-case year range 700~800, no art-object returned


/* -----------------------------------------------------------*/
/* -------------- Search keyword: Artist Name  --------------*/
/* -----------------------------------------------------------*/
SELECT DISTINCT O.title, O.attribution, O.endYear, O.objectID, OI.thumbURL
FROM objects O JOIN objects_constituents OC
                JOIN constituents C
                JOIN objects_images OI
    ON O.objectID = OC.objectID AND OC.constituentID = C.constituentID AND O.objectID =OI.objectID
WHERE (O.attribution LIKE '%Picasso%' OR O.attributionInverted LIKE '%Picasso%' OR C.lastName LIKE '%Picasso%'
    OR C.preferredDisplayName LIKE '%Picasso%' OR C.forwardDisplayName LIKE '%Picasso%')
ORDER BY O.attribution, C.lastName, O.endYear, O.title;


/*
SELECT O.title, O.attribution, C.beginYear, O.endYear, O.objectID, OI.thumbURL
FROM objects O JOIN objects_constituents OC
                JOIN constituents C
                JOIN objects_images OI
    ON O.objectID = OC.objectID AND OC.constituentID = C.constituentID AND O.objectID =OI.objectID
WHERE (O.attribution LIKE '%Henri%' OR O.attributionInverted LIKE '%Henri%' OR C.lastName LIKE '%Henri%'
    OR C.preferredDisplayName LIKE '%Henri%' OR C.forwardDisplayName LIKE '%Henri%')
ORDER BY C.lastName, C.beginYear, O.title;
*/


/* -----------------------------------------------------------*/
/* -------------- Search keyword: Artwork Title --------------*/
/* -----------------------------------------------------------*/
SELECT O.title, O.attribution, O.endYear, O.objectID, OI.thumbURL
FROM objects O JOIN objects_images OI ON O.objectID =OI.objectID
WHERE (O.title LIKE '%Portrait%')
ORDER BY O.title, O.attribution;


/* --------------------------------------------------------------------------*/
/* -------------- Search keyword: Artwork Title + Artist Name --------------*/
/* -------------------------------------------------------------------------*/
SELECT DISTINCT O.title, O.attribution, O.endYear, O.objectID, OI.thumbURL
FROM objects O JOIN objects_constituents OC
                JOIN constituents C
                JOIN objects_images OI
    ON O.objectID = OC.objectID AND OC.constituentID = C.constituentID AND O.objectID =OI.objectID
WHERE (O.title LIKE 'The%') AND
      (O.attribution LIKE '%Picasso%' OR O.attributionInverted LIKE '%Picasso%' OR
       C.lastName LIKE '%Picasso%' OR C.preferredDisplayName LIKE '%Picasso%' OR
       C.forwardDisplayName LIKE '%Picasso%')
ORDER BY O.attribution, C.lastName, O.endYear, O.title;

/* --------------------------------------------------------------*/
/* ------- Find Specific Artwork by its unique objectID ---------*/
/* --------------------------------------------------------------*/

/* Testing Sample:
   ex. Displaying artwork titled "American Flamingo"
   objectID = 32572
   */
/* Testing Sample 2:
   ex. Displaying artwork titled "Saint James Major"
   objectID = 0
   constituentID = 38613
   forwardDisplayName = Grifo di Tancredi
   */

-- these three queries are executed together to get the full info -------
# 1) get the info about this artwork
SELECT O.title, O.attribution, O.medium, O.dimensions, O.classification, O.series, O.portfolio, O.volume, OI.URL
FROM objects O JOIN objects_images OI ON O.objectID = OI.objectID
WHERE O.objectID = 0;
# 2) get the info of its composing artists (may be more than one)
SELECT C.preferredDisplayName,OC.displayOrder, C.displayDate, C.visualBrowserNationality
FROM objects_constituents OC JOIN constituents C ON OC.constituentID = C.constituentID
WHERE OC.objectID = 0
ORDER BY displayOrder;
# 3) get the related semantic terms to this artwork (for recommendation by similarity)
SELECT OT.termType, OT.term
FROM objects_terms OT
WHERE OT.objectID = 0
ORDER BY termType;



-- find the artist's ID ----------------------
SELECT objectID, constituentID, displayOrder
FROM objects_constituents
WHERE objectID = 32572
ORDER BY displayOrder;

/* -----------------------------------------------------------*/
/* --------------- Recommend by Similarity  ------------------*/
/* -----------------------------------------------------------*/

/* Testing Sample 1:
   ex. Displaying artwork titled "American Flamingo"
   objectID = 32572
   constituentID = 122
   forwardDisplayName = John James Audubon
   series = The Birds of America
   lastName: Audubon
   */

/* Testing Sample 2:
   ex. Displaying artwork titled "Saint James Major"
   objectID = 0
   constituentID = 38613
   forwardDisplayName = Grifo di Tancredi
   */

# Primary Recommendation
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
LIMIT 4;
# Comment: this query can run, but slow, think about a more efficient query (i.e. use UNION)
# Also

# Secondary Recommandation: if no serie/volume/porfolio/artist in common, consider secondary recommendation: by Style, School, Theme
SELECT O.title, O.attribution, O.objectID, OI.thumbURL, OT.termType, O.series, O.portfolio, O.volume
FROM objects O JOIN objects_images OI JOIN objects_terms OT
    ON O.objectID = OI.objectID AND O.objectID = OT.objectID
WHERE (O.objectID <> 0 ) AND (O.classification = 'painting') AND (
      (OT.termType = 'Style' AND OT.term = 'Gothic') OR
      (OT.termType = 'School' AND OT.term = 'Florentine') OR
      (OT.termType = 'Keyword' AND OT.term = 'James Major') OR
      (OT.termType = 'Theme' AND OT.term = 'saints') )
ORDER BY termType
LIMIT 4;


# #############################################################
# ################## Feature #2 ###############################
# #############################################################

/* -----------------------------------------------------------*/
/* --------------- Naughty Search by Height  -----------------*/
/* -----------------------------------------------------------*/

# Comment-Iris: I tested range 150 ~ 300 cm, this query is pretty good.
SELECT O.title, O.attribution, O.objectID, OI.thumbURL, OD.dimension, ABS(10-OD.dimension)
FROM objects O JOIN objects_images OI
    JOIN objects_dimensions OD
    ON O.objectID =OI.objectID AND O.objectID = OD.objectID
WHERE O.classification = 'painting' AND OD.dimensionType = 'height' AND OD.unitName = 'centimeters'
ORDER BY ABS(10-OD.dimension), O.title
LIMIT 10;

/* 2nd optimal solution (with +/- 1cm range)
SELECT O.title, O.attribution, O.objectID, OI.thumbURL, OD.dimension, ABS(195-OD.dimension)
FROM objects O JOIN objects_images OI
    JOIN objects_dimensions OD
    ON O.objectID =OI.objectID AND O.objectID = OD.objectID
WHERE (OD.dimensionType = 'height' AND OD.unitName = 'centimeters') AND
      (OD.dimension >= 195-1 AND OD.dimension <= 195+1)
ORDER BY ABS(195-OD.dimension), O.title;
 */

/* LEAST optimal solution
SELECT O.title, O.attribution, O.objectID, OI.thumbURL, OD.dimension
FROM objects O JOIN objects_images OI
    JOIN objects_dimensions OD
    ON O.objectID =OI.objectID AND O.objectID = OD.objectID
WHERE (OD.dimensionType = 'height' AND OD.unitName = 'centimeters') AND
      (OD.dimension >= 195-1 AND OD.dimension <= 195+1)
ORDER BY OD.dimension, O.title;
 */

/* ----------------------------------------------------------------------------*/
/* --- Naughty Search by birthYear (backing 100, 200, 300 years.)--------------*/
/* ----------------------------------------------------------------------------*/

SELECT O.title, O.attribution, O.objectID, O.endYear, ABS(1997-100-O.endYear), OI.thumbURL, OD.dimension
FROM objects O JOIN objects_images OI JOIN objects_dimensions OD
    ON O.objectID =OI.objectID AND O.objectID = OD.objectID
WHERE O.endYear IS NOT NULL AND OD.dimensionType = 'height'
ORDER BY ABS(1997-100-O.endYear), OD.dimension DESC ;
# can ask user to select if want to see backing how many years ago: i.e. 100? 200? 300? yrs ago

SELECT O.title, O.attribution, O.objectID, O.endYear, ABS(1989-0-O.endYear), OI.thumbURL, OD.dimension
FROM objects O JOIN objects_images OI JOIN objects_dimensions OD
    ON O.objectID =OI.objectID AND O.objectID = OD.objectID
WHERE O.endYear IS NOT NULL AND OD.dimensionType = 'height'
ORDER BY ABS(1989-0-O.endYear), OD.dimension DESC ;

# #############################################################
# ################## Feature #3 ###############################
# #############################################################
/* -----------------------------------------------------------*/
/* --------------- Analysis Types Overview------------------*/
/* -----------------------------------------------------------*/
-- 1) showing term counts for each category of analysis. i.e. Style, School, Theme, Technique, Keyword, Place Executed,
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


-- This is showing how many artworks are associated with each Big analysis category
SELECT OT.termType, OT.term, COUNT(*) AS termTypeCounts
FROM objects O JOIN objects_terms OT ON O.objectID = OT.objectID
GROUP BY OT.termType, OT.term
ORDER BY OT.termType, COUNT(OT.term) DESC;


-- 2) showing top 5 popular words under each category
(
    SELECT OT.term, COUNT(*) AS StyleCounts
    FROM objects O JOIN objects_terms OT ON O.objectID = OT.objectID
    WHERE OT.termType = 'Style'
    GROUP BY OT.term
    ORDER BY COUNT(*) DESC
    LIMIT 5
)
UNION
(
    SELECT OT.term, COUNT(*) AS SchoolCounts
    FROM objects O JOIN objects_terms OT ON O.objectID = OT.objectID
    WHERE OT.termType = 'School'
    GROUP BY OT.term
    ORDER BY COUNT(*) DESC
    LIMIT 5
)
UNION
(
    SELECT OT.term, COUNT(*) AS TechniqueCounts
    FROM objects O JOIN objects_terms OT ON O.objectID = OT.objectID
    WHERE OT.termType = 'Technique'
    GROUP BY OT.term
    ORDER BY COUNT(*) DESC
    LIMIT 5
)
UNION
(
    SELECT OT.term, COUNT(*) AS ThemeCounts
    FROM objects O JOIN objects_terms OT ON O.objectID = OT.objectID
    WHERE OT.termType = 'Theme'
    GROUP BY OT.term
    ORDER BY COUNT(*) DESC
    LIMIT 5
)
UNION
(
    SELECT OT.term, COUNT(*) AS KeywordCounts
    FROM objects O JOIN objects_terms OT ON O.objectID = OT.objectID
    WHERE OT.termType = 'Keyword'
    GROUP BY OT.term
    ORDER BY COUNT(*) DESC
    LIMIT 5
)
UNION
(
    SELECT OT.term, COUNT(*) AS PlaceExecutedCounts
    FROM objects O JOIN objects_terms OT ON O.objectID = OT.objectID
    WHERE OT.termType = 'Place Executed'
    GROUP BY OT.term
    ORDER BY COUNT(*) DESC
    LIMIT 5
);




/* -----------------------------------------------------------*/
/* --------------- Semantic Analysis: Style ------------------*/
/* -----------------------------------------------------------*/
SELECT OT.term, COUNT(*) AS StyleCounts
FROM objects O JOIN objects_terms OT ON O.objectID = OT.objectID
WHERE OT.termType = 'Style'
GROUP BY OT.term
ORDER BY COUNT(*) DESC;


/* -----------------------------------------------------------*/
/* --------------- Semantic Analysis: School------------------*/
/* -----------------------------------------------------------*/
SELECT OT.term, COUNT(*) AS SchoolCounts
FROM objects O JOIN objects_terms OT ON O.objectID = OT.objectID
WHERE OT.termType = 'School'
GROUP BY OT.term
ORDER BY COUNT(*) DESC;


/* -----------------------------------------------------------*/
/* --------------- Semantic Analysis: Technique---------------*/
/* -----------------------------------------------------------*/
SELECT OT.term, COUNT(*) AS TechniqueCounts
FROM objects O JOIN objects_terms OT ON O.objectID = OT.objectID
WHERE OT.termType = 'Technique'
GROUP BY OT.term
ORDER BY COUNT(*) DESC;


/* -----------------------------------------------------------*/
/* --------------- Semantic Analysis: Theme ------------------*/
/* -----------------------------------------------------------*/
SELECT OT.term, COUNT(*) AS ThemeCounts
FROM objects O JOIN objects_terms OT ON O.objectID = OT.objectID
WHERE OT.termType = 'Theme'
GROUP BY OT.term
ORDER BY COUNT(*) DESC;

/* -----------------------------------------------------------*/
/* --------------- Semantic Analysis: Keyword ------------------*/
/* -----------------------------------------------------------*/
SELECT OT.term, COUNT(*) AS KeywordCounts
FROM objects O JOIN objects_terms OT ON O.objectID = OT.objectID
WHERE OT.termType = 'Keyword'
GROUP BY OT.term
ORDER BY COUNT(*) DESC;


/* -----------------------------------------------------------------*/
/* --------------- Semantic Analysis: PlaceExecuted------------------*/
/* -----------------------------------------------------------------*/
SELECT OT.term, COUNT(*) AS PlaceExecutedCounts
FROM objects O JOIN objects_terms OT ON O.objectID = OT.objectID
WHERE OT.termType = 'Place Executed'
GROUP BY OT.term
ORDER BY COUNT(*) DESC;


/* -----------------------------------------------------------------*/
/* --------------- Semantic Analysis: Portrait Across Time------------------*/
/* -----------------------------------------------------------------*/

/*
WITH portrait1500 AS (SELECT O.title, O.attribution, O.classification, O.objectID, OI.thumbURL, O.endYear
        FROM objects O JOIN objects_images OI
                JOIN objects_terms OT
        ON O.objectID =OI.objectID AND O.objectID = OT.objectID
        WHERE OT.term = 'portrait' AND ( O.endYear <= 1599 AND O.endYear >= 1500)
        ORDER BY O.endYear
        LIMIT 5),
portrait1600 AS (SELECT O.title, O.attribution, O.classification,O.objectID, OI.thumbURL, O.endYear
        FROM objects O JOIN objects_images OI
                JOIN objects_terms OT
        ON O.objectID =OI.objectID AND O.objectID = OT.objectID
        WHERE OT.term = 'portrait' AND ( O.endYear <= 1699 AND O.endYear >= 1600)
        ORDER BY O.endYear
        LIMIT 5),
portrait1700 AS (SELECT O.title, O.attribution, O.classification, O.objectID, OI.thumbURL, O.endYear
        FROM objects O JOIN objects_images OI
                JOIN objects_terms OT
        ON O.objectID =OI.objectID AND O.objectID = OT.objectID
        WHERE OT.term = 'portrait' AND ( O.endYear <= 1799 AND O.endYear >= 1700)
        ORDER BY O.endYear
        LIMIT 5),
portrait1800 AS (SELECT O.title, O.attribution, O.classification, O.objectID, OI.thumbURL, O.endYear
        FROM objects O JOIN objects_images OI
                JOIN objects_terms OT
        ON O.objectID =OI.objectID AND O.objectID = OT.objectID
        WHERE OT.term = 'portrait' AND ( O.endYear <= 1899 AND O.endYear >= 1800)
        ORDER BY O.endYear
        LIMIT 5),
portrait1900 AS (SELECT O.title, O.attribution, O.classification, O.objectID, OI.thumbURL, O.endYear
        FROM objects O JOIN objects_images OI
                JOIN objects_terms OT
        ON O.objectID =OI.objectID AND O.objectID = OT.objectID
        WHERE OT.term = 'portrait' AND ( O.endYear <= 1999 AND O.endYear >= 1900)
        ORDER BY O.endYear
        LIMIT 5),
portrait2000 AS (SELECT O.title, O.attribution, O.classification, O.objectID, OI.thumbURL, O.endYear
        FROM objects O JOIN objects_images OI
                JOIN objects_terms OT
        ON O.objectID =OI.objectID AND O.objectID = OT.objectID
        WHERE OT.term = 'portrait' AND ( O.endYear <= 2099 AND O.endYear >= 2000)
        ORDER BY O.endYear
        LIMIT 5)
SELECT title, attribution, classification, objectID, thumbURL, endYear FROM portrait1500
    UNION
SELECT title, attribution, classification, objectID, thumbURL, endYear FROM portrait1600
    UNION
SELECT title, attribution, classification, objectID, thumbURL, endYear FROM portrait1700
    UNION
SELECT title, attribution, classification, objectID, thumbURL, endYear FROM portrait1800
    UNION
SELECT title, attribution, classification, objectID, thumbURL, endYear FROM portrait1900
    UNION
SELECT title, attribution, classification, objectID, thumbURL, endYear FROM portrait2000;
 */

-- if query every time period specifically -----------
SELECT O.title, O.attribution, O.classification, O.objectID, OI.thumbURL, O.endYear
        FROM objects O JOIN objects_images OI JOIN objects_terms OT
        ON O.objectID =OI.objectID AND O.objectID = OT.objectID
        WHERE OT.visualBrowserTheme = 'portrait' AND ( O.endYear <= 1599 AND O.endYear >= 1500) AND classification = 'painting'
        ORDER BY O.endYear
        LIMIT 5;


-- if want to query across all centries together (we will probably display this query result as a general overview -------
-- Portrait across time: Paintings ---------------
(SELECT O.title, O.attribution, O.classification, O.objectID, OI.thumbURL, O.endYear
        FROM objects O JOIN objects_images OI JOIN objects_terms OT
        ON O.objectID =OI.objectID AND O.objectID = OT.objectID
        WHERE OT.visualBrowserTheme = 'portrait' AND ( O.endYear <= 1599 AND O.endYear >= 1500) AND classification = 'painting'
        ORDER BY O.endYear
        LIMIT 5)
 UNION
(SELECT O.title, O.attribution, O.classification,O.objectID, OI.thumbURL, O.endYear
        FROM objects O JOIN objects_images OI JOIN objects_terms OT
        ON O.objectID =OI.objectID AND O.objectID = OT.objectID
        WHERE OT.visualBrowserTheme = 'portrait' AND ( O.endYear <= 1699 AND O.endYear >= 1600) AND classification = 'painting'
        ORDER BY O.endYear
        LIMIT 5)
UNION
(SELECT O.title, O.attribution, O.classification, O.objectID, OI.thumbURL, O.endYear
        FROM objects O JOIN objects_images OI JOIN objects_terms OT
        ON O.objectID =OI.objectID AND O.objectID = OT.objectID
        WHERE OT.visualBrowserTheme = 'portrait' AND ( O.endYear <= 1799 AND O.endYear >= 1700) AND classification = 'painting'
        ORDER BY O.endYear
        LIMIT 5)
UNION
(SELECT O.title, O.attribution, O.classification, O.objectID, OI.thumbURL, O.endYear
        FROM objects O JOIN objects_images OI JOIN objects_terms OT
        ON O.objectID =OI.objectID AND O.objectID = OT.objectID
        WHERE OT.visualBrowserTheme = 'portrait' AND ( O.endYear <= 1899 AND O.endYear >= 1800) AND classification = 'painting'
        ORDER BY O.endYear
        LIMIT 5)
UNION
(SELECT O.title, O.attribution, O.classification, O.objectID, OI.thumbURL, O.endYear
        FROM objects O JOIN objects_images OI JOIN objects_terms OT
        ON O.objectID =OI.objectID AND O.objectID = OT.objectID
        WHERE OT.visualBrowserTheme = 'portrait' AND ( O.endYear <= 1999 AND O.endYear >= 1900) AND classification = 'painting'
        ORDER BY O.endYear
        LIMIT 5)
UNION
(SELECT O.title, O.attribution, O.classification, O.objectID, OI.thumbURL, O.endYear
        FROM objects O JOIN objects_images OI JOIN objects_terms OT
        ON O.objectID =OI.objectID AND O.objectID = OT.objectID
        WHERE OT.visualBrowserTheme = 'portrait' AND ( O.endYear <= 2099 AND O.endYear >= 2000) AND classification = 'painting'
        ORDER BY O.endYear
        LIMIT 5);


-- Portrait across time: Prints ---------------
(SELECT O.title, O.attribution, O.classification, O.objectID, OI.thumbURL, O.endYear
        FROM objects O JOIN objects_images OI JOIN objects_terms OT
        ON O.objectID =OI.objectID AND O.objectID = OT.objectID
        WHERE OT.visualBrowserTheme = 'portrait' AND ( O.endYear <= 1599 AND O.endYear >= 1500) AND classification = 'print'
        ORDER BY O.endYear
        LIMIT 5)
 UNION
(SELECT O.title, O.attribution, O.classification,O.objectID, OI.thumbURL, O.endYear
        FROM objects O JOIN objects_images OI JOIN objects_terms OT
        ON O.objectID =OI.objectID AND O.objectID = OT.objectID
        WHERE OT.visualBrowserTheme = 'portrait' AND ( O.endYear <= 1699 AND O.endYear >= 1600) AND classification = 'print'
        ORDER BY O.endYear
        LIMIT 5)
UNION
(SELECT O.title, O.attribution, O.classification, O.objectID, OI.thumbURL, O.endYear
        FROM objects O JOIN objects_images OI JOIN objects_terms OT
        ON O.objectID =OI.objectID AND O.objectID = OT.objectID
        WHERE OT.visualBrowserTheme = 'portrait' AND ( O.endYear <= 1799 AND O.endYear >= 1700) AND classification = 'print'
        ORDER BY O.endYear
        LIMIT 5)
UNION
(SELECT O.title, O.attribution, O.classification, O.objectID, OI.thumbURL, O.endYear
        FROM objects O JOIN objects_images OI JOIN objects_terms OT
        ON O.objectID =OI.objectID AND O.objectID = OT.objectID
        WHERE OT.visualBrowserTheme = 'portrait' AND ( O.endYear <= 1899 AND O.endYear >= 1800) AND classification = 'print'
        ORDER BY O.endYear
        LIMIT 5)
UNION
(SELECT O.title, O.attribution, O.classification, O.objectID, OI.thumbURL, O.endYear
        FROM objects O JOIN objects_images OI JOIN objects_terms OT
        ON O.objectID =OI.objectID AND O.objectID = OT.objectID
        WHERE OT.visualBrowserTheme = 'portrait' AND ( O.endYear <= 1999 AND O.endYear >= 1900) AND classification = 'print'
        ORDER BY O.endYear
        LIMIT 5)
UNION
(SELECT O.title, O.attribution, O.classification, O.objectID, OI.thumbURL, O.endYear
        FROM objects O JOIN objects_images OI JOIN objects_terms OT
        ON O.objectID =OI.objectID AND O.objectID = OT.objectID
        WHERE OT.visualBrowserTheme = 'portrait' AND ( O.endYear <= 2099 AND O.endYear >= 2000) AND classification = 'print'
        ORDER BY O.endYear
        LIMIT 5);


# #############################################################
# ################## Feature #4 ###############################
# #############################################################

SELECT classification, count(*) as artworkCounts
FROM objects
GROUP BY classification;


