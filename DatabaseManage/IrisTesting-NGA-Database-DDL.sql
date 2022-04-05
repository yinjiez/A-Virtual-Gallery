
CREATE Database DataOmni_NGA;

USE DataOmni_NGA;

/* Order of Tables Creations & Insertions
   1) objects
   2) constituents
   3) objects_images
   4) objects_constituents
   5) objects_associations
   6) objects_terms
   7) objects_dimensions
   8) objects_text_entries
 */

# IMPORTANT NOTICE : Use UTF8MB4 as characterset encoding


/* ------------------------------------------------------*/
/* 1) TABLE: objects-------------------------------------*/
/* ------------------------------------------------------*/
# DROP & RECREATE table schema
# DROP TABLE objects;

-- Size: (81842 x 15) -------------
CREATE TABLE objects(
  objectID int NOT NULL,
  title varchar(2048) NOT NULL,
  displayDate varchar(256) NULL,
  beginYear int NULL,
  endYear int NULL,
  timeSpan varchar(32) NULL,
  medium varchar(2048) NULL,
  dimensions varchar(2048) NULL,
  attributionInverted varchar(1024) NULL,
  attribution varchar(1024) NULL,
  classification varchar(32) NULL,
  parentID int NULL,
  portfolio varchar(2048) NULL,
  series varchar(850) NULL,
  volume varchar(850) NULL,
  PRIMARY KEY (objectid)
) character set utf8mb4 collate utf8mb4_bin ;
# 15 columns

-- ISSUEs & Notes -------------------------------------------------
# Missing 26 objects, tolerable !!
# Note: REMOVE FK constraint of "parentID" " FOREIGN KEY (parentid) REFERENCES objects(objectid) "
# Because CAUSE ISSUE: "Cannot add or update a child row: a foreign key constraint fails (`DataOmni_NGA`.`objects`, CONSTRAINT `objects_ibfk_1` FOREIGN KEY (`parentID`) REFERENCES `objects` (`objectID`))"
# Problem Noticed: objectID = 32572, Titled "American Flamingo" is not inserted successfully, manual insertion
# Reason: Excel-Outputted CSV file is missing the last line as an empty line (marking the END of the FILE)
-- ----------------------------------------------------------------

# CLEAR the table (without deleting the schema) -----------
# DELETE FROM objects;
# REPOPULATE the table !!!!!!!!!!!!!!!!!!!!!!!!!!!!

# CHECK the table ------------------------
#SELECT * FROM objects;
# CHECK #tuples
SELECT COUNT(objectID) FROM objects; # 81842 objectIDs

# CHECK FOR Specific objects -------------------------
SELECT * FROM objects
WHERE objectID = 32572;
#WHERE series LIKE '%The Birds of America%'; #




/* -----------------------------------------------------------*/
/* 2) TABLE: constituents-------------------------------------*/
/* -----------------------------------------------------------*/
# DROP TABLE constituents;

-- Size: ( 9941 x 9 ) ----------------
CREATE TABLE constituents (
    constituentID int NOT NULL,
    preferredDisplayName varchar(256) NULL,
    forwardDisplayName varchar(256) NULL,
    lastName varchar(256) NULL,
    displayDate varchar(256) NULL,
    beginYear int NULL,
    endYear int NULL,
    visualBrowserTimeSpan varchar(32) NULL,
    visualBrowserNationality varchar(128) NULL,
    PRIMARY KEY(constituentID)
) character set utf8mb4 collate utf8mb4_bin ;
-- ---------------------------
# 9941 tuples imported no error
-- ---------------------------

SELECT * FROM constituents;
SELECT COUNT(*) FROM constituents;


/* -----------------------------------------------------------*/
/* 3) TABLE: objects_images-----------------------------------*/
/* -----------------------------------------------------------*/
#RENAME TABLE object_images TO objects_images;

-- Size: (81912 x 7) -----------------
CREATE TABLE objects_images (
    uuid varchar(64) NOT NULL,
    objectID int NOT NULL,
    URL varchar(512) NOT NULL,
    thumbURL varchar(512) NOT NULL,
    width int NULL,
    height int NULL,
    maxpixels int NULL,
    PRIMARY KEY (uuid),
    FOREIGN KEY (objectID) REFERENCES objects(objectID)
) character set utf8mb4 collate utf8mb4_bin ;

-- ISSUEs & Notes -------------------------------------------------
# NOTICE: missing 25 objects-images (due to errors in `objects`-table, FK constraints), expected !!
-- ---------------------------------------------------------------
SELECT COUNT(*) FROM objects_images; #81912 images
SELECT COUNT(*) FROM objects JOIN objects_images oi on objects.objectID = oi.objectID; # 81912 images matched with objectID


/* -----------------------------------------------------------*/
/* 4) TABLE: objects_constituents-----------------------------*/
/* -----------------------------------------------------------*/
-- Size: ( 103004 x 5)
CREATE TABLE objects_constituents (
    objectID int,
    constituentID int,
    displayOrder int NOT NULL,
    roleType varchar(64) NOT NULL,
    role varchar(64) NOT NULL,
    PRIMARY KEY(objectID, constituentID),
    FOREIGN KEY(objectID) REFERENCES objects(objectID),
    FOREIGN KEY(constituentID) REFERENCES constituents(constituentID)
) character set utf8mb4 collate utf8mb4_bin;

-- ISSUEs & Notes -------------------------------------------------
# NOTICE: missing 49 pairs of object-constituents (due to errors in `objects`-table, i.e. FK constraints), expected !!
-- ---------------------------------------------------------------
SELECT COUNT(*) FROM objects_constituents;


/* -----------------------------------------------------------*/
/* 5) TABLE: objects_associations-----------------------------*/
/* -----------------------------------------------------------*/

-- Size: ( 915 x 3 ) --------------
CREATE TABLE objects_associations (
    parentObjectID int,
    childObjectID int,
    relationship varchar(32) NOT NULL,
    PRIMARY KEY(parentObjectID, childObjectID),
    FOREIGN KEY(parentObjectID) REFERENCES objects(objectID),
    FOREIGN KEY(childObjectID) REFERENCES objects(objectID)
) character set utf8mb4 collate utf8mb4_bin;
-- ---------------------------
# 915 tuples imported no error
-- ---------------------------

SELECT * FROM objects_associations;


/* -----------------------------------------------------------*/
/* 6) TABLE: objects_terms------------------------------------*/
/* -----------------------------------------------------------*/

-- Size: ( 187066 x 5 ) --------------
CREATE TABLE objects_terms(
    termID int,
    objectID int,
    termType varchar(64) NOT NULL,
    term varchar(256) NOT NULL,
    visualBrowserTheme varchar(32) NULL,
    PRIMARY KEY(termID, objectID),
    FOREIGN KEY(objectID) REFERENCES objects(objectID)
) character set utf8mb4 collate utf8mb4_bin;

SELECT COUNT(*) FROM objects_terms;


/* -----------------------------------------------------------*/
/* 7) TABLE: objects_dimensions-------------------------------*/
/* -----------------------------------------------------------*/

-- Size: ( 113682 x 4 ) --------------
CREATE TABLE objects_dimensions (
    objectID int,
    dimensionType varchar(32) NOT NULL,
    dimension decimal(22,10) NOT NULL,
    unitName varchar(32) NOT NULL,
    PRIMARY KEY(objectID, dimensionType),
    FOREIGN KEY(objectID) REFERENCES objects(objectID)
) character set utf8mb4 collate utf8mb4_bin;

SELECT COUNT(*) FROM objects_dimensions;

/* -----------------------------------------------------------*/
/* 8) TABLE: objects_text_entries-----------------------------*/
/* -----------------------------------------------------------*/
-- Size: ( 136397 x 4 ) ------------------
CREATE TABLE objects_text_entries (
    objectID int,
    text varchar(1024) NOT NULL,
    textType varchar(32) NOT NULL,
    year int NOT NULL,
    PRIMARY KEY(objectID, textType, year),
    FOREIGN KEY(objectID) REFERENCES objects(objectID)
) character set utf8mb4 collate utf8mb4_bin;
-- ISSUEs & Notes -------------------------------------------------
# NOTICE: missing 145 text_entries (due to errors in `objects`-table, i.e. FK constraints), expected !!
-- ---------------------------------------------------------------

SELECT COUNT(*) FROM objects_text_entries;


# ####################################################################
-- --------- Checking AWS RDS MySQL instance Storage Space ---------
# ####################################################################
USE DataOmni_NGA;

-- Size in MB ---------
SELECT table_schema AS "", SUM(data_length + index_length) / 1024 / 1024 AS "Size (MB)"
FROM information_schema.TABLES
GROUP BY table_schema;

-- Size in GB ---------
SELECT table_schema AS "Database", SUM(data_length + index_length) / 1024 / 1024 / 1024 AS "Size (GB)"
FROM information_schema.TABLES
GROUP BY table_schema;
