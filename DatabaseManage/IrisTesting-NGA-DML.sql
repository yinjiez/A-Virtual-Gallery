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
    ON O.objectID =OI.objectID AND O.objectID =OT.objectID
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
SELECT O.title, O.attribution, C.beginYear, O.endYear, O.objectID, OI.thumbURL
FROM objects O JOIN objects_constituents OC
                JOIN constituents C
                JOIN objects_images OI
    ON O.objectID = OC.objectID AND OC.constituentID = C.constituentID AND O.objectID =OI.objectID
WHERE (O.attribution LIKE '%Picasso%' OR O.attributionInverted LIKE '%Picasso%' OR C.lastName LIKE '%Picasso%'
    OR C.preferredDisplayName LIKE '%Picasso%' OR C.forwardDisplayName LIKE '%Picasso%')
ORDER BY O.attribution, C.lastName, C.beginYear, O.title;


SELECT O.title, O.attribution, C.beginYear, O.endYear, O.objectID, OI.thumbURL
FROM objects O JOIN objects_constituents OC
                JOIN constituents C
                JOIN objects_images OI
    ON O.objectID = OC.objectID AND OC.constituentID = C.constituentID AND O.objectID =OI.objectID
WHERE (O.attribution LIKE '%Henri%' OR O.attributionInverted LIKE '%Henri%' OR C.lastName LIKE '%Henri%'
    OR C.preferredDisplayName LIKE '%Henri%' OR C.forwardDisplayName LIKE '%Henri%')
ORDER BY C.lastName, C.beginYear, O.title;

/* -----------------------------------------------------------*/
/* -------------- Search keyword: Artwork Title --------------*/
/* -----------------------------------------------------------*/
SELECT O.title, O.attribution, O.endYear, O.objectID, OI.thumbURL
FROM objects O JOIN objects_images OI ON O.objectID =OI.objectID
WHERE (O.title LIKE '%Portrait%')
ORDER BY O.title, O.attribution;


/* -----------------------------------------------------------*/
/* --------------- Recommend by Similarity  ------------------*/
/* -----------------------------------------------------------*/

/* Testing Sample:
   ex. Displaying artwork titled "American Flamingo"
   objectID = 32572
   constituentID = 122
   forwardDisplayName = John James Audubon
   lastName: Audubon
   */

# this primary recommandation
SELECT  O.title, O.attribution, O.objectID, OI.thumbURL
FROM objects O JOIN objects_constituents OC
        JOIN constituents C
        JOIN objects_images OI
        JOIN objects_terms OT
    ON O.objectID = OC.objectID AND OC.constituentID = C.constituentID
    AND O.objectID = OI.objectID AND O.objectID = OT.objectID
WHERE (O.objectID <> 32572 ) AND
      ( (C.constituentID = 122) OR
        (O.portfolio = '%The Birds of America%') OR
        (O.series LIKE '%The Birds of America%') OR
        (O.volume LIKE '%The Birds of America%') )
ORDER BY O.series, O.portfolio, O.attribution;
# Comment: this query can run, but slow, think about a more efficient query (i.e. use UNION)
# Also if no serie/volumn/porfolio/artist in common, consider secondary recommendation: by Style, School, Theme


# #############################################################
# ################## Feature #2 ###############################
# #############################################################

/* -----------------------------------------------------------*/
/* --------------- Naughty Search by Height  -----------------*/
/* -----------------------------------------------------------*/

SELECT O.title, O.attribution, O.objectID, OI.thumbURL, OD.dimension
FROM objects O JOIN objects_images OI
    JOIN objects_dimensions OD
    ON O.objectID =OI.objectID AND O.objectID = OD.objectID
WHERE (OD.dimensionType = 'height' AND OD.unitName = 'centimeters') AND
      (OD.dimension >= 195-1 AND OD.dimension <= 195+1)
ORDER BY OD.dimension, O.title;
# Comment I tested range 150 ~ 200 cm, this query is pretty good.
# think of a more precise way to query for the exact height, may use nested subQuery

/* ----------------------------------------------------------------------------*/
/* --- Naughty Search by birthYear (backing 100, 200, 300 years.)--------------*/
/* ----------------------------------------------------------------------------*/

SELECT O.title, O.attribution, O.objectID, O.endYear, OI.thumbURL, OD.dimension
FROM objects O JOIN objects_images OI
    JOIN objects_dimensions OD
    ON O.objectID =OI.objectID AND O.objectID = OD.objectID
WHERE O.endYear >= 1997 - 100 AND O.endYear <= 1997 AND OD.dimensionType = 'height'
ORDER BY O.endYear, OD.dimension DESC;
# can ask user to select if want to see backing how many years ago: i.e. 100? 200? 300? yrs ago


# #############################################################
# ################## Feature #3 ###############################
# #############################################################

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


/* -----------------------------------------------------------*/
/* --------------- Semantic Analysis: PlaceExecuted------------------*/
/* -----------------------------------------------------------*/
SELECT OT.term, COUNT(*) AS PlaceExecutedCounts
FROM objects O JOIN objects_terms OT ON O.objectID = OT.objectID
WHERE OT.termType = 'Place Executed'
GROUP BY OT.term
ORDER BY COUNT(*) DESC;



