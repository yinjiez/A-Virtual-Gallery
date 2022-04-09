import config from './config.json'

//****************************
//***** HomePage.js **********
//****************************

// Fetcher 1
const getOverview = async () => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/home`, {
        method: 'GET',
    })
    return res.json()
}

//****************************
//**** ArtworkPage.js ********
//****************************

// Fetcher 2
const getArtwork = async (objectID) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/artwork?id=${objectID}`, {
        method: 'GET',
    })
    return res.json()
}

// Fetcher 3
const getSimilarArtworks = async (objectID) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/artwork/similarArtworks?id=${objectID}`, {
        method: 'GET',
    })
    return res.json()
}

//****************************
//**** SearchPage.js *********
//****************************

// Fetcher 4
const getSearchByFilter = async (nationality, style, beginYear, endYear, classification, page, pagesize) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/search/byFilter?nationality=${nationality}&style=${style}&beginYear=${beginYear}&endYear=${endYear}&classification=${classification}&page=${page}&pagesize=${pagesize}`, {
        method: 'GET',
    })
    return res.json()
}

// Fetcher 5
const getSearchByKeyword = async (artworkTitle, artistName, page, pagesize) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/search/byKeyword?artworkTitle=${artworkTitle}&artistName=${artistName}&page=${page}&pagesize=${pagesize}`, {
        method: 'GET',
    })
    return res.json()
}

// Fetcher 6
const getNaughtyByHeight = async (height, page, pagesize) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/search/naughtySearchByHeight?height=${height}&page=${page}&pagesize=${pagesize}`, {
        method: 'GET',
    })
    return res.json()
}

// Fetcher 7
const getNaughtyByBirthYear = async (birthYear, page, pagesize) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/search/naughtySearchByBirthYear?birthYear=${birthYear}&page=${page}&pagesize=${pagesize}`, {
        method: 'GET',
    })
    return res.json()
}

//****************************
//**** AnalysisPage.js *******
//****************************

// Fetcher 8
const getAnalysisOverview = async () => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/analysis/analysisOverview`, {
        method: 'GET',
    })
    return res.json()
}

// Fetcher 9
const getAnalysisByType = async (analysisType, page, pagesize) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/analysis/analysisByType/${analysisType}?page=${page}&pagesize=${pagesize}`, {
        method: 'GET',
    })
    return res.json()
}

// Fetcher 10
const getPortraitsAcrossTime = async (artworkClass, beginYear, endYear, page, pagesize) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/analysis/portraitsAcrossTime/${artworkClass}?beginYear=${beginYear}&endYear=${endYear}&page=${page}&pagesize=${pagesize}`, {
        method: 'GET',
    })
    return res.json()
}

export {
    getOverview,
    getArtwork,
    getSimilarArtworks,
    getSearchByFilter,
    getSearchByKeyword,
    getNaughtyByHeight,
    getNaughtyByBirthYear,
    getAnalysisOverview,
    getAnalysisByType,
    getPortraitsAcrossTime
}