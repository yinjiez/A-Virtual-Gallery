
/* -----------------------------------------------------------*/
/* Go into DataOmni_NGA Database*/
/* -----------------------------------------------------------*/
USE DataOmni_NGA;


-- ##################################################################################
-- ############### Status Overviews of tables in DB="DataOmni_NGA" ##################
-- ##################################################################################
SHOW TABLES FROM DataOmni_NGA;
/* Tables NOT used in Web-Application:
   1) objects_text_entries,
   2) objects_associations
 */

/* Table 1) objects ######################################## */
DESCRIBE objects;
select TABLE_SCHEMA, TABLE_NAME, INDEX_SCHEMA, INDEX_TYPE, INDEX_NAME, SEQ_IN_INDEX, COLUMN_NAME, CARDINALITY
FROM information_schema.STATISTICS
WHERE TABLE_NAME = 'objects';
-- PK (objectID) ==> BTREE(objectID)

/* Table 2) constituents ######################################## */
DESCRIBE constituents;
select TABLE_SCHEMA, TABLE_NAME, INDEX_SCHEMA, INDEX_TYPE, INDEX_NAME, SEQ_IN_INDEX, COLUMN_NAME, CARDINALITY
FROM information_schema.STATISTICS
WHERE TABLE_NAME = 'constituents';
-- PK (constituentID) ==> BTREE(constituentID)

/* Table 3) objects_constituents ################################# */
DESCRIBE objects_constituents;
select TABLE_SCHEMA, TABLE_NAME, INDEX_SCHEMA, INDEX_TYPE, INDEX_NAME, SEQ_IN_INDEX, COLUMN_NAME, CARDINALITY
FROM information_schema.STATISTICS
WHERE TABLE_NAME = 'objects_constituents';
-- PK (objectID, constituentID) ==> BTREE (objectID), BTREE(constituentID)
-- FK (constituentID) ref constituents(constituentID) ===> BTREE(constituentID)


/* Table 4) objects_images ######################################## */
DESCRIBE objects_images;
select TABLE_SCHEMA, TABLE_NAME, INDEX_SCHEMA, INDEX_TYPE, INDEX_NAME, SEQ_IN_INDEX, COLUMN_NAME, CARDINALITY
FROM information_schema.STATISTICS
WHERE TABLE_NAME = 'objects_images';
-- PK (uuid) ==> BTREE on (uuid)
-- FK (objectID) ref objects(objectID) ==> BTREE (objectID)

/* Table 5) objects_terms ######################################## */
DESCRIBE objects_terms;
select TABLE_SCHEMA, TABLE_NAME, INDEX_SCHEMA, INDEX_TYPE, INDEX_NAME, SEQ_IN_INDEX, COLUMN_NAME, CARDINALITY
FROM information_schema.STATISTICS
WHERE TABLE_NAME = 'objects_terms';
-- PK (termID, objectID) => BTREE(termID), BTREE(objectID)
-- FK (objectID) ref objects(objectID) => BTREE(objectID)



-- ##################################################################################
-- ######################## Individual Query Optimization ###########################
-- ##################################################################################


/* ============================================================ */
/* --------- route handler #1 -- galleryOverview()  -----------*/
/* ============================================================ */

-- 1)
EXPLAIN ANALYZE
SELECT classification, count(*) as artworkCounts
FROM objects GROUP BY classification;
/* Query Cost ******************
    * Scan Type: Total Table Scan
    * Can be Optimized ? : not really, need to go through the entire table to count # of tuples under each classification
*/

-- 2)
EXPLAIN ANALYZE
SELECT visualBrowserNationality AS nationality, COUNT(DISTINCT O.objectID) AS artworkCounts
    FROM objects O JOIN objects_constituents OC JOIN constituents C
        ON O.objectID = OC.objectID AND OC.constituentID = C.constituentID
    GROUP BY C.visualBrowserNationality
    ORDER BY COUNT(*) DESC;

/* ============================================================ */
/* --------- route handler #2 -- artworkInfo()  --------------- */
/* ============================================================ */

/* Example:
   objectID = 32572
   Artwork Title = "American Flamingo"
*/

-- 1)
EXPLAIN ANALYZE
SELECT O.title, O.attribution, O.medium, O.dimensions, O.classification, O.series, O.portfolio, O.volume, OI.URL
    FROM objects O JOIN objects_images OI ON O.objectID = OI.objectID
    WHERE O.objectID = 32572;

-- 2)
EXPLAIN ANALYZE
SELECT C.preferredDisplayName,OC.displayOrder, C.displayDate, C.visualBrowserNationality
    FROM objects_constituents OC JOIN constituents C ON OC.constituentID = C.constituentID
    WHERE OC.objectID = 32572
    ORDER BY displayOrder;

-- 3)
EXPLAIN ANALYZE
SELECT OT.termType, OT.term
    FROM objects_terms OT
    WHERE OT.objectID = 32572
    ORDER BY termType;



/* -----------------------------------------------------------*/
/* --------- route handler #3 -- similarArtwork()  -----------*/
/* -----------------------------------------------------------*/
/* Example:
   objectID = 32572
   Artwork Title = "American Flamingo"
*/

-- 0) retrieve infos for recommendation
-- info of artwork itself ==> Primary Recommendation
EXPLAIN ANALYZE
SELECT O.title, O.attribution, O.classification, O.series, O.portfolio, O.volume, OI.URL
    FROM objects O JOIN objects_images OI ON O.objectID = OI.objectID
    WHERE O.objectID = 32572;
-- info of artist ==> Primary Recommendation
EXPLAIN ANALYZE
SELECT objectID, constituentID, displayOrder
    FROM objects_constituents
    WHERE objectID = 32572
    ORDER BY displayOrder;
-- info of analysis terms ==> Secondary Recommendation
EXPLAIN ANALYZE
SELECT OT.termType, OT.term
    FROM objects_terms OT
    WHERE OT.objectID = 32572
    ORDER BY termType;

-- 1) Primary Recommendation
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
    LIMIT 4;

-- 2) Secondary Recommendation
SELECT DISTINCT O.title, O.attribution, O.objectID, OI.thumbURL, OT.termType, O.series, O.portfolio, O.volume
    FROM objects O JOIN objects_images OI JOIN objects_terms OT
        ON O.objectID = OI.objectID AND O.objectID = OT.objectID
    WHERE (O.objectID <> ${objectID}) AND (O.classification = '${artworkClass}') AND (
          (OT.termType = 'Style' AND OT.term = '${style}') OR
          (OT.termType = 'School' AND OT.term = '${school}') OR
          (OT.termType = 'Keyword' AND OT.term = '${keyword}') OR
          (OT.termType = 'Theme' AND OT.term = '${theme}') )
    ORDER BY termType
    LIMIT 4;

/* -----------------------------------------------------------*/
/* --------- route handler #4 -- filterSearch()  -----------*/
/* -----------------------------------------------------------*/

-- Nationality + Style
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

-- Style
SELECT DISTINCT O.title, O.attribution, O.endYear, O.objectID, OI.thumbURL
        FROM objects O JOIN objects_images OI JOIN objects_terms OT
                    ON O.objectID =OI.objectID AND O.objectID =OT.objectID
        WHERE (LOWER(OT.term) LIKE LOWER('%${style}%') AND OT.termType = 'Style') AND
                        (O.beginYear >= ${beginYear} AND O.endYear <= ${endYear}) AND
                        (LOWER(O.classification) LIKE LOWER('%${classification}%'))
        ORDER BY O.endYear, O.title, O.attribution
        LIMIT ${offset}, ${limit};


-- Nationality
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

-- basic
SELECT DISTINCT O.title, O.attribution, O.endYear, O.objectID, OI.thumbURL
        FROM objects O JOIN objects_images OI ON O.objectID =OI.objectID
        WHERE (O.beginYear >= ${beginYear} AND O.endYear <= ${endYear}) AND
                (LOWER(O.classification) LIKE LOWER('%${classification}%'))
        ORDER BY O.endYear, O.title, O.attribution
        LIMIT ${offset}, ${limit};

/* -----------------------------------------------------------*/
/* --------- route handler #5 -- similarArtwork()  -----------*/
/* -----------------------------------------------------------*/



/* -----------------------------------------------------------*/
/* --------- route handler #6 -- naughtySearchHeight()  -----------*/
/* -----------------------------------------------------------*/
SELECT O.title, O.attribution, O.objectID, OI.thumbURL, OD.dimension, ABS(${height}-OD.dimension) AS deviation
    FROM objects O JOIN objects_images OI
    JOIN objects_dimensions OD
    ON O.objectID =OI.objectID AND O.objectID = OD.objectID
    WHERE O.classification = 'painting' AND OD.dimensionType = 'height' AND OD.unitName = 'centimeters'
    ORDER BY ABS(${height}-OD.dimension), O.title
    LIMIT ${offset}, ${limit};

/* -----------------------------------------------------------*/
/* --------- route handler #7 -- naughtySearchBirthYear()  -----------*/
/* -----------------------------------------------------------*/
SELECT O.title, O.attribution, O.objectID, O.endYear, ABS(${birthYear}-O.endYear) AS deviation, OI.thumbURL, OD.dimension
    FROM objects O JOIN objects_images OI JOIN objects_dimensions OD
        ON O.objectID = OI.objectID AND O.objectID = OD.objectID
    WHERE O.endYear IS NOT NULL AND OD.dimensionType = 'height'
    ORDER BY ABS(${birthYear}-O.endYear), OD.dimension DESC
    LIMIT ${offset}, ${limit};


/* -----------------------------------------------------------*/
/* --------- route handler #8 -- analysisOverview()  -----------*/
/* -----------------------------------------------------------*/
SELECT OT.termType, COUNT(DISTINCT OT.term) AS termVarietyCount
FROM objects_terms OT
WHERE OT.termType <> 'Systematic Catalogue Volume'
GROUP BY OT.termType;


-- ===========================================================
-- Style
(SELECT OT.term AS name, COUNT(*) AS value
     FROM objects_terms OT WHERE OT.termType = 'Style'
     GROUP BY OT.term ORDER BY COUNT(*) DESC
     LIMIT 80)
UNION
-- School
(SELECT OT.term AS name, COUNT(*) AS value
     FROM objects_terms OT WHERE OT.termType = 'School'
     GROUP BY OT.term ORDER BY COUNT(*) DESC
     LIMIT 80)
UNION
-- Technique
(SELECT OT.term AS name, COUNT(*) AS value
     FROM objects_terms OT WHERE OT.termType = 'Technique'
     GROUP BY OT.term ORDER BY COUNT(*) DESC
     LIMIT 80)
UNION
-- Theme
(SELECT OT.term AS name, COUNT(*) AS value
     FROM objects_terms OT WHERE OT.termType = 'Theme'
     GROUP BY OT.term ORDER BY COUNT(*) DESC
     LIMIT 80)
UNION
-- Keywords
(SELECT OT.term AS name, COUNT(*) AS value
     FROM objects_terms OT WHERE OT.termType = 'Keyword'
     GROUP BY OT.term ORDER BY COUNT(*) DESC
     LIMIT 80)
UNION
-- Place Executed
(SELECT OT.term AS name, COUNT(*) AS value
     FROM objects_terms OT WHERE OT.termType = 'Place Executed'
     GROUP BY OT.term ORDER BY COUNT(*) DESC
     LIMIT 80);

-- ===========================================================

-- Style
SELECT OT.term AS name, COUNT(*) AS value
     FROM objects_terms OT WHERE OT.termType = 'Style'
     GROUP BY OT.term ORDER BY COUNT(*) DESC
     LIMIT 80;

-- School
SELECT OT.term AS name, COUNT(*) AS value
     FROM objects_terms OT WHERE OT.termType = 'School'
     GROUP BY OT.term ORDER BY COUNT(*) DESC
     LIMIT 80;

-- Technique
SELECT OT.term AS name, COUNT(*) AS value
     FROM objects_terms OT WHERE OT.termType = 'Technique'
     GROUP BY OT.term ORDER BY COUNT(*) DESC
     LIMIT 80;

-- Theme
SELECT OT.term AS name, COUNT(*) AS value
     FROM objects_terms OT WHERE OT.termType = 'Theme'
     GROUP BY OT.term ORDER BY COUNT(*) DESC
     LIMIT 80;

-- Keywords
SELECT OT.term AS name, COUNT(*) AS value
     FROM objects_terms OT WHERE OT.termType = 'Keyword'
     GROUP BY OT.term ORDER BY COUNT(*) DESC
     LIMIT 80;

-- Place Executed
SELECT OT.term AS name, COUNT(*) AS value
     FROM objects_terms OT WHERE OT.termType = 'Place Executed'
     GROUP BY OT.term ORDER BY COUNT(*) DESC
     LIMIT 80;


/* -----------------------------------------------------------*/
/* --------- route handler #9 -- similarArtwork()  -----------*/
/* -----------------------------------------------------------*/
SELECT OT.term AS name, COUNT(*) AS value
        FROM objects O JOIN objects_terms OT ON O.objectID = OT.objectID
        WHERE OT.termType = '${analysisType}'
        GROUP BY OT.term
        ORDER BY COUNT(*) DESC
        LIMIT ${offset}, ${limit};

/* -----------------------------------------------------------*/
/* --------- route handler #10 -- portraitsAcrossTime()  -----------*/
/* -----------------------------------------------------------*/
SELECT O.title, O.attribution, O.classification, O.objectID, OI.thumbURL, O.endYear
        FROM objects O JOIN objects_images OI JOIN objects_terms OT
        ON O.objectID =OI.objectID AND O.objectID = OT.objectID
        WHERE OT.visualBrowserTheme = 'portrait' AND ( O.endYear <= ${endYear} AND O.endYear >= ${beginYear}) AND classification = '${artworkClass}'
        ORDER BY O.endYear
        LIMIT ${offset}, ${limit};
/* -----------------------------------------------------------*/