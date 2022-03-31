const { expect } = require("@jest/globals");
//****** Node.js-npm 's built-in test objects/functions ******* */
const supertest = require("supertest");
// Note: "supertest" is a npm package/module
//************************************************************* */
const { number } = require("yargs");
const results = require("./results.json")
const app = require('../server');

// **********************************
//         BASIC ROUTES TESTS
// **********************************


/** **********************************************
 * Test cases for hello() route handler function
 *************************************************/
test("GET /hello no parameters", async () => {
    await supertest(app).get("/hello?")
      .expect(200)
      .then((response) => {
        // Check text 
        expect(response.text).toBe("Hello! Welcome to the FIFA server!")
      });
});

test("GET /hello with name", async () => {
  
    await supertest(app).get("/hello?name=Steve")
      .expect(200)
      .then((response) => {
        // Check text 
        expect(response.text).toBe("Hello, Steve! Welcome to the FIFA server!")
      });
});

/** **********************************************
 * Test cases for jersey() route handler function
 *************************************************/
test("GET /jersey color without name", async () => {

    //Note: this for-loop is used to make 5 GET-request call to the given URL
    //b.c. we are involking Math.random(), we want to examine if subsequent calls will generate different random numbers 
    for (var i = 0; i < 5; i++) {
    await supertest(app).get("/jersey/color")
      .expect(200)
      .then((response) => {
        expect(response.body.message).toBe('Hello, player!')
        expect(response.body.jersey_color).not.toBe('white')
      });
    }
});

test("GET /jersey color with name", async () => {
  
    for (var i = 0; i < 5; i++) {
    await supertest(app).get("/jersey/color?name=Lauder")
      .expect(200)
      .then((response) => {
        expect(response.body.message).toBe('Hello, Lauder!')
        expect(response.body.jersey_color).not.toBe('white')
        expect(response.body.jersey_color == 'red' || response.body.jersey_color == 'blue').toBeTruthy()
      });
    }
});

test("GET /jersey number without name", async () => {
  for (var i = 0; i < 5; i++) {
    await supertest(app).get("/jersey/number")
      .expect(200)
      .then((response) => {
        expect(response.body.message).toBe('Hello, player!')
        expect(isNaN(response.body.jersey_number)).toBe(false)
        expect(response.body.jersey_number).toBeGreaterThanOrEqual(1)
        expect(response.body.jersey_number).toBeLessThanOrEqual(20)
        
      });
    }
});

test("GET /jersey number with name", async () => {
  for (var i = 0; i < 5; i++) {
    await supertest(app).get("/jersey/number?name=Lauder")
      .expect(200)
      .then((response) => {
        expect(response.body.message).toBe('Hello, Lauder!')
        expect(isNaN(response.body.jersey_number)).toBe(false)
        expect(response.body.jersey_number).toBeGreaterThanOrEqual(1)
        expect(response.body.jersey_number).toBeLessThanOrEqual(20)
      });
    }
});

test("GET /jersey other value with no name", async () => {
    await supertest(app).get("/jersey/non")
      .expect(200)
      .then((response) => {
        expect(response.body.message).toBe('Hello, player, we like your jersey!')
      });
});


// **********************************
//        GENERAL ROUTES TESTS
// **********************************

/** **********************************************
 * Test cases for players() route handler function
 *************************************************/
test("GET /players no pagination", async () => {
  await supertest(app).get("/players")
    .expect(200)
    .then((response) => {
      expect(response.body.results.length).toEqual(1263)
    });
});

/** **********************************************
 * Test cases for matches() route handler function
 *************************************************/
test("GET /matches no pagination", async () => {
  await supertest(app).get("/matches/D1")
    .expect(200)
    .then((response) => {
      expect(response.body.results.length).toEqual(306)
    });
});

// **********************************
//        MATCH TESTS
// **********************************

test("GET /match basic", async () => {
  await supertest(app).get("/match?id=132")
    .expect(200)
    .then((response) => {
      expect(response.body.results.length).toEqual(1)
      expect(response.body.results).toStrictEqual(results.match1)

    });
});


// **********************************
//        PLAYER ROUTES TESTS
// **********************************
// ***** Testing TASK 7 *******************************
test("GET /player basic 1 - N", async () => {
  await supertest(app).get("/player?id=20801")
    .expect(200)
    .then((response) => {
      expect(response.body.results.length).toEqual(1)
      expect(response.body.results).toStrictEqual(results.player1N)

    });
});

// Testing this query record contains "ReleaseClause" as null
test("GET /player basic 2 - GK", async () => {
  await supertest(app).get("/player?id=51539")
    .expect(200)
    .then((response) => {
      expect(response.body.results.length).toEqual(1)
      expect(response.body.results).toStrictEqual(results.player1GK)

    });
});


// **********************************
//        SEARCH ROUTES TESTS
// **********************************
// ***** Testing TASK 8 *******************************
test("GET /search/matches basic 1", async () => {
  await supertest(app).get("/search/matches?Home=Bay&Away=Hertha")
    .expect(200)
    .then((response) => {
      expect(response.body.results.length).toEqual(1)
      expect(response.body.results).toStrictEqual(results.match_search1)

    });
});

// DON't worry about failing this test, if the test result shows "PlayerId" should not be included
// in Autograder(Gradescope), "PlayerId" is included in the test, it needs to be outputed as defined in TASK 7 instruction
// here, Prof didn't include it b.c. she didn't want student to hardcode the ID values.
test("GET /search/players basic 1", async () => {
  await supertest(app).get("/search/players?Name=Pepe&Nationality=Spain&Club=Lazio")
    .expect(200)
    .then((response) => {
      expect(response.body.results.length).toEqual(1)
      expect(response.body.results).toStrictEqual(results.player_search1)

    });
});