
/* -----------------------------------------------------------*/
/* Go into DataOmni_NGA Database*/
/* -----------------------------------------------------------*/
USE DataOmni_NGA;

-- ##################################################################################
-- ############### Status Overviews of tables in DB="DataOmni_NGA" ##################
-- ##################################################################################
SHOW TABLES FROM DataOmni_NGA;
-- ----------------------------------------------
/* Tables NOT used in Web-Application:          |
   1) objects_text_entries,                     |
   2) objects_associations                      |
   -- -------------------------------------------
 */

-- ##################################################################################
/* Table 1) objects ############################################################## */
-- ##################################################################################
DESCRIBE objects;
select TABLE_SCHEMA, TABLE_NAME, INDEX_SCHEMA, INDEX_TYPE, INDEX_NAME, SEQ_IN_INDEX, COLUMN_NAME, CARDINALITY
FROM information_schema.STATISTICS
WHERE TABLE_NAME = 'objects';
-- PK (objectID) ==> BTREE(objectID)

-- Additional Indexing =======================================
-- endYear, beginYear, classification | FAILED: title, attribution
CREATE INDEX idx_endYear ON objects (endYear); -- CREATED
CREATE INDEX idx_beginEndYr ON objects (beginYear, endYear); -- CREATED
CREATE INDEX idx_classification ON objects (classification); -- CREATED
-- CREATE INDEX idx_title ON objects (title); -- FAILED, key is too long (max 3072 bytes for index)
-- CREATE INDEX idx_attribution ON objects (attribution); -- FAILED, key is too long (max 3072 bytes for index)
-- CREATE INDEX idx_attributionInvert ON objects (attributionInverted); -- FAILED, key is too long (max 3072 bytes for index)

-- American Flamingo --
SELECT *
FROM objects
WHERE objectID = 32572;
-- ----------------------

-- ##################################################################################
/* Table 2) constituents ######################################################### */
-- ##################################################################################
DESCRIBE constituents;
select TABLE_SCHEMA, TABLE_NAME, INDEX_SCHEMA, INDEX_TYPE, INDEX_NAME, SEQ_IN_INDEX, COLUMN_NAME, CARDINALITY
FROM information_schema.STATISTICS
WHERE TABLE_NAME = 'constituents';
-- PK (constituentID) ==> BTREE(constituentID)

-- Additional Indexing =======================================
-- visualBrowserNationality, preferredDisplayName, lastName, forwardDisplayName, preferredDisplayName
CREATE INDEX idx_nationality ON constituents (visualBrowserNationality); -- CREATED
CREATE INDEX idx_lastN ON constituents (lastName); -- CREATED
CREATE INDEX idx_forwardDisplayN ON constituents (forwardDisplayName); -- CREATED
CREATE INDEX idx_preferDisplayN ON constituents (preferredDisplayName); -- CREATED

-- John James Audubon --
SELECT *
FROM constituents
WHERE constituentID = 122;
-- ------------------------

-- ##################################################################################
/* Table 3) objects_constituents ################################################# */
-- ##################################################################################
DESCRIBE objects_constituents;
select TABLE_SCHEMA, TABLE_NAME, INDEX_SCHEMA, INDEX_TYPE, INDEX_NAME, SEQ_IN_INDEX, COLUMN_NAME, CARDINALITY
FROM information_schema.STATISTICS
WHERE TABLE_NAME = 'objects_constituents';
-- PK (objectID, constituentID) ==> BTREE (objectID), BTREE(constituentID)
-- FK (constituentID) ref constituents(constituentID) ===> BTREE(constituentID)


-- ##################################################################################
/* Table 4) objects_images ####################################################### */
-- ##################################################################################
DESCRIBE objects_images;
select TABLE_SCHEMA, TABLE_NAME, INDEX_SCHEMA, INDEX_TYPE, INDEX_NAME, SEQ_IN_INDEX, COLUMN_NAME, CARDINALITY
FROM information_schema.STATISTICS
WHERE TABLE_NAME = 'objects_images';
-- PK (uuid) ==> BTREE on (uuid)
-- FK (objectID) ref objects(objectID) ==> BTREE (objectID)


-- ##################################################################################
/* Table 5) objects_terms ######################################################## */
-- ##################################################################################
DESCRIBE objects_terms;
select TABLE_SCHEMA, TABLE_NAME, INDEX_SCHEMA, INDEX_TYPE, INDEX_NAME, SEQ_IN_INDEX, COLUMN_NAME, CARDINALITY
FROM information_schema.STATISTICS
WHERE TABLE_NAME = 'objects_terms';
-- PK (termID, objectID) => BTREE(termID), BTREE(objectID)
-- FK (objectID) ref objects(objectID) => BTREE(objectID)

-- Additional Indexing =======================================
-- termType, term, visualBrowserTheme
CREATE INDEX idx_termType_term ON objects_terms (termType, term);    -- CREATED
CREATE INDEX idx_browserTheme ON objects_terms (visualBrowserTheme); -- CREATED


-- ##################################################################################
/* Table 6) objects_dimensions #################################################### */
-- ##################################################################################
DESCRIBE objects_dimensions;
select TABLE_SCHEMA, TABLE_NAME, INDEX_SCHEMA, INDEX_TYPE, INDEX_NAME, SEQ_IN_INDEX, COLUMN_NAME, CARDINALITY
FROM information_schema.STATISTICS
WHERE TABLE_NAME = 'objects_dimensions';
-- PK (objectID, dimensionType) => BTREE(objectID), BTREE(dimensionType)

-- Additional Indexing =======================================
-- (dimensionType, uniteName), dimension
CREATE INDEX idx_typeUnit ON objects_dimensions (dimensionType, unitName); -- CREATED
CREATE INDEX idx_dimension ON objects_dimensions (dimension); -- CREATED



-- ##################################################################################
-- ######################## Individual Query Optimization ###########################
-- ##################################################################################


/* ============================================================ */
/* --------- route handler #1 -- galleryOverview()  -----------*/
/* ============================================================ */

-- 1) ====================================================
EXPLAIN ANALYZE
SELECT classification, count(*) as artworkCounts
FROM objects
GROUP BY classification;
-- WITHOUT INDEX ---------------------------------
EXPLAIN ANALYZE
SELECT classification, count(*) as artworkCounts
FROM objects IGNORE INDEX (idx_classification)
GROUP BY classification;


-- 2) ====================================================
EXPLAIN ANALYZE
SELECT visualBrowserNationality AS nationality, COUNT(DISTINCT O.objectID) AS artworkCounts
    FROM objects O JOIN objects_constituents OC JOIN constituents C
        ON O.objectID = OC.objectID AND OC.constituentID = C.constituentID
    GROUP BY C.visualBrowserNationality
    ORDER BY COUNT(*) DESC;
-- WITHOUT INDEX ---------------------------------
EXPLAIN ANALYZE
SELECT visualBrowserNationality AS nationality, COUNT(DISTINCT O.objectID) AS artworkCounts
    FROM objects O JOIN objects_constituents OC JOIN constituents C IGNORE INDEX (idx_nationality)
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
-- -----------------------------------------------------------------
-- Query Optiimzation Notes:
-- Already optimized by having "objectID=xx" as WHERE-predicate
-- ObjectID is PK, and FK on all tables, default indexing
-- ------------------------------------------------------------------

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
   Artist = John James Audubon (ID = 122)
   series = "The Birds of America: Plate CCCCXXXI"
   portfolio = "The Birds of America: Plate CCCCXXXI"
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
-- -----------------------------------------------------------------
-- Query Optiimzation Notes:
-- Already optimized by having "objectID=xx" as WHERE-predicate
-- ObjectID is PK, and FK on all tables, default indexing
-- ------------------------------------------------------------------


-- 1) Primary Recommendation
EXPLAIN ANALYZE
SELECT DISTINCT O.title, O.attribution, O.objectID, OI.thumbURL, O.series, O.portfolio, O.volume
    FROM objects O JOIN objects_constituents OC
            JOIN constituents C
            JOIN objects_images OI
        ON O.objectID = OC.objectID AND
           OC.constituentID = C.constituentID AND
           O.objectID = OI.objectID
    WHERE (O.objectID <> 32572 ) AND (O.classification = 'painting') AND
          ( (O.portfolio LIKE 'The Birds of America: Plate CCCCXXXI') OR
            (O.series LIKE 'The Birds of America: Plate CCCCXXXI') OR
            (O.volume LIKE 'The Birds of America: Plate CCCCXXXI') OR
            (C.constituentID = 122) )
    ORDER BY O.series, O.portfolio, O.volume, O.attribution
    LIMIT 4;
-- WITHOUT INDEX ---------------------------------
EXPLAIN ANALYZE
SELECT DISTINCT O.title, O.attribution, O.objectID, OI.thumbURL, O.series, O.portfolio, O.volume
    FROM objects O IGNORE INDEX (idx_classification)
        JOIN objects_constituents OC
        JOIN constituents C
        JOIN objects_images OI
        ON O.objectID = OC.objectID AND
           OC.constituentID = C.constituentID AND
           O.objectID = OI.objectID
    WHERE (O.objectID <> 32572 ) AND (O.classification = 'painting') AND
          ( (O.portfolio LIKE 'The Birds of America: Plate CCCCXXXI') OR
            (O.series LIKE 'The Birds of America: Plate CCCCXXXI') OR
            (O.volume LIKE 'The Birds of America: Plate CCCCXXXI') OR
            (C.constituentID = 122) )
    ORDER BY O.series, O.portfolio, O.volume, O.attribution
    LIMIT 4;


-- 2) Secondary Recommendation
EXPLAIN ANALYZE
SELECT DISTINCT O.title, O.attribution, O.objectID, OI.thumbURL, OT.termType, O.series, O.portfolio, O.volume
    FROM objects O
        JOIN objects_images OI
        JOIN objects_terms OT
        ON O.objectID = OI.objectID AND O.objectID = OT.objectID
    WHERE (O.objectID <> 32572) AND (O.classification = 'painting') AND (
          (OT.termType = 'Style' AND OT.term = '') OR
          (OT.termType = 'School' AND OT.term = 'American') OR
          (OT.termType = 'Keyword' AND OT.term = '') OR
          (OT.termType = 'Theme' AND OT.term = '') )
    ORDER BY termType
    LIMIT 4;
-- WITHOUT INDEX ---------------------------------
EXPLAIN ANALYZE
SELECT DISTINCT O.title, O.attribution, O.objectID, OI.thumbURL, OT.termType, O.series, O.portfolio, O.volume
    FROM objects O IGNORE INDEX (idx_classification)
        JOIN objects_images OI
        JOIN objects_terms OT IGNORE INDEX (idx_termType_term)
        ON O.objectID = OI.objectID AND O.objectID = OT.objectID
    WHERE (O.objectID <> 32572) AND (O.classification = 'painting') AND (
          (OT.termType = 'Style' AND OT.term = '') OR
          (OT.termType = 'School' AND OT.term = 'American') OR
          (OT.termType = 'Keyword' AND OT.term = '') OR
          (OT.termType = 'Theme' AND OT.term = '') )
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
/* --------- route handler #5 -- keywordSearch()  -----------*/
/* -----------------------------------------------------------*/
/* Example:
   objectID = 32572
   Artwork Title = "American Flamingo"
   artist = John James Audubon
   series = "The Birds of America: Plate CCCCXXXI"
   portfolio = "The Birds of America: Plate CCCCXXXI"
*/
EXPLAIN ANALYZE
SELECT DISTINCT O.title, O.attribution, O.endYear, O.objectID, OI.thumbURL
        FROM objects O JOIN objects_constituents OC JOIN constituents C JOIN objects_images OI
        ON O.objectID = OC.objectID AND OC.constituentID = C.constituentID AND O.objectID =OI.objectID
        WHERE (LOWER(O.title) LIKE LOWER('%American Flamingo%')) AND (
            LOWER(O.attribution) LIKE LOWER('%John James Audubon%') OR
            LOWER(O.attributionInverted) LIKE LOWER('%John James Audubon%') OR
            LOWER(C.lastName) LIKE LOWER('%John James Audubon%') OR
            LOWER(C.forwardDisplayName) LIKE LOWER('%John James Audubon%') OR
            LOWER(C.preferredDisplayName) LIKE LOWER('%John James Audubon%') )
        ORDER BY O.title, O.attribution, C.preferredDisplayName, O.endYear
        LIMIT 0, 10;
-- WITHOUT INDEX ---------------------------------
EXPLAIN ANALYZE
SELECT DISTINCT O.title, O.attribution, O.endYear, O.objectID, OI.thumbURL
        FROM objects O
            JOIN objects_constituents OC
            JOIN constituents C IGNORE INDEX (idx_lastN, idx_forwardDisplayN, idx_preferDisplayN)
            JOIN objects_images OI
        ON O.objectID = OC.objectID AND OC.constituentID = C.constituentID AND O.objectID =OI.objectID
        WHERE (LOWER(O.title) LIKE LOWER('%American Flamingo%')) AND (
            LOWER(O.attribution) LIKE LOWER('%John James Audubon%') OR
            LOWER(O.attributionInverted) LIKE LOWER('%John James Audubon%') OR
            LOWER(C.lastName) LIKE LOWER('%John James Audubon%') OR
            LOWER(C.forwardDisplayName) LIKE LOWER('%John James Audubon%') OR
            LOWER(C.preferredDisplayName) LIKE LOWER('%John James Audubon%') )
        ORDER BY O.title, O.attribution, C.preferredDisplayName, O.endYear
        LIMIT 0, 10;


/* -----------------------------------------------------------*/
/* --------- route handler #6 -- naughtySearchHeight()  -----------*/
/* -----------------------------------------------------------*/
EXPLAIN ANALYZE
SELECT O.title, O.attribution, O.objectID, OI.thumbURL, OD.dimension, ABS(175-OD.dimension) AS deviation
    FROM objects O JOIN objects_images OI JOIN objects_dimensions OD
    ON O.objectID =OI.objectID AND O.objectID = OD.objectID
    WHERE O.classification = 'painting' AND OD.dimensionType = 'height' AND OD.unitName = 'centimeters'
    ORDER BY ABS(175-OD.dimension), O.title
    LIMIT 0, 3;
-- WITHOUT INDEX ---------------------------------
EXPLAIN ANALYZE
SELECT O.title, O.attribution, O.objectID, OI.thumbURL, OD.dimension, ABS(175-OD.dimension) AS deviation
    FROM objects O IGNORE INDEX (idx_classification)
        JOIN objects_images OI
        JOIN objects_dimensions OD IGNORE INDEX (idx_typeUnit, idx_dimension)
    ON O.objectID =OI.objectID AND O.objectID = OD.objectID
    WHERE O.classification = 'painting' AND OD.dimensionType = 'height' AND OD.unitName = 'centimeters'
    ORDER BY ABS(175-OD.dimension), O.title
    LIMIT 0, 3;


/* -------------------------------------------------------------------*/
/* --------- route handler #7 -- naughtySearchBirthYear()  -----------*/
/* -------------------------------------------------------------------*/
EXPLAIN ANALYZE
SELECT O.title, O.attribution, O.objectID, O.endYear, ABS(1900-O.endYear) AS deviation, OI.thumbURL, OD.dimension
    FROM objects O JOIN objects_images OI JOIN objects_dimensions OD
        ON O.objectID = OI.objectID AND O.objectID = OD.objectID
    WHERE O.endYear IS NOT NULL AND OD.dimensionType = 'height'
    ORDER BY ABS(1900-O.endYear), OD.dimension DESC
    LIMIT 0, 3;
-- WITHOUT INDEX ------------------------------------------------------
EXPLAIN ANALYZE
SELECT O.title, O.attribution, O.objectID, O.endYear, ABS(1900-O.endYear) AS deviation, OI.thumbURL, OD.dimension
    FROM objects O IGNORE INDEX (idx_endYear, idx_beginEndYr)
        JOIN objects_images OI
        JOIN objects_dimensions OD IGNORE INDEX (idx_dimension)
        ON O.objectID = OI.objectID AND O.objectID = OD.objectID
    WHERE O.endYear IS NOT NULL AND OD.dimensionType = 'height'
    ORDER BY ABS(1900-O.endYear), OD.dimension DESC
    LIMIT 0, 3;

/* -----------------------------------------------------------*/
/* --------- route handler #8 -- analysisOverview()  -----------*/
/* -----------------------------------------------------------*/

EXPLAIN ANALYZE
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

-- WITHOUT INDEX ------------------------------------------------
EXPLAIN ANALYZE
-- Style
(SELECT OT.term AS name, COUNT(*) AS value
     FROM objects_terms OT IGNORE INDEX (idx_termType_term)
    WHERE OT.termType = 'Style'
     GROUP BY OT.term ORDER BY COUNT(*) DESC
     LIMIT 80)
UNION
-- School
(SELECT OT.term AS name, COUNT(*) AS value
     FROM objects_terms OT IGNORE INDEX (idx_termType_term)
    WHERE OT.termType = 'School'
     GROUP BY OT.term ORDER BY COUNT(*) DESC
     LIMIT 80)
UNION
-- Technique
(SELECT OT.term AS name, COUNT(*) AS value
     FROM objects_terms OT IGNORE INDEX (idx_termType_term)
    WHERE OT.termType = 'Technique'
     GROUP BY OT.term ORDER BY COUNT(*) DESC
     LIMIT 80)
UNION
-- Theme
(SELECT OT.term AS name, COUNT(*) AS value
     FROM objects_terms OT IGNORE INDEX (idx_termType_term)
    WHERE OT.termType = 'Theme'
     GROUP BY OT.term ORDER BY COUNT(*) DESC
     LIMIT 80)
UNION
-- Keywords
(SELECT OT.term AS name, COUNT(*) AS value
     FROM objects_terms OT IGNORE INDEX (idx_termType_term)
    WHERE OT.termType = 'Keyword'
     GROUP BY OT.term ORDER BY COUNT(*) DESC
     LIMIT 80)
UNION
-- Place Executed
(SELECT OT.term AS name, COUNT(*) AS value
     FROM objects_terms OT IGNORE INDEX (idx_termType_term)
    WHERE OT.termType = 'Place Executed'
     GROUP BY OT.term ORDER BY COUNT(*) DESC
     LIMIT 80);


/* -----------------------------------------------------------*/
/* --------- route handler #9 -- analysisByType()  -----------*/
/* -----------------------------------------------------------*/
EXPLAIN ANALYZE
SELECT OT.term AS name, COUNT(*) AS value
        FROM objects O JOIN objects_terms OT ON O.objectID = OT.objectID
        WHERE OT.termType = 'Style'
        GROUP BY OT.term
        ORDER BY COUNT(*) DESC
        LIMIT 0, 15;
-- WITHOUT INDEX -----------------------------------------------
EXPLAIN ANALYZE
SELECT OT.term AS name, COUNT(*) AS value
    FROM objects O
    JOIN objects_terms OT IGNORE INDEX (idx_termType_term)
        ON O.objectID = OT.objectID
        WHERE OT.termType = 'Style'
        GROUP BY OT.term
        ORDER BY COUNT(*) DESC
        LIMIT 0, 15;

/* -----------------------------------------------------------*/
/* --------- route handler #10 -- portraitsAcrossTime()  -----------*/
/* -----------------------------------------------------------*/
EXPLAIN
SELECT O.title, O.attribution, O.classification, O.objectID, OI.thumbURL, O.endYear
        FROM objects O JOIN objects_images OI JOIN objects_terms OT
        ON O.objectID =OI.objectID AND O.objectID = OT.objectID
        WHERE OT.visualBrowserTheme = 'portrait' AND ( O.endYear <= ${endYear} AND O.endYear >= ${beginYear}) AND classification = 'painting'
        ORDER BY O.endYear
        LIMIT ${offset}, ${limit};

-- WITHOUT INDEX ------------------------------------------------------
EXPLAIN ANALYZE
SELECT O.title, O.attribution, O.classification, O.objectID, OI.thumbURL, O.endYear
        FROM objects O
            JOIN objects_images OI
            JOIN objects_terms OT IGNORE INDEX (idx_browserTheme)
        ON O.objectID =OI.objectID AND O.objectID = OT.objectID
        WHERE OT.visualBrowserTheme = 'portrait' AND ( O.endYear <= ${endYear} AND O.endYear >= ${beginYear}) AND classification = 'painting'
        ORDER BY O.endYear
        LIMIT ${offset}, ${limit};

/* -----------------------------------------------------------*/