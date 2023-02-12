var express = require('express');
// const { fstat } = require('fs');
var fs = require('fs')
var router = express.Router();
var request = require('request');
const env = require('dotenv').config();
const USER_NAME = env.parsed.USER_NAME
const API_KEY = env.parsed.API_KEY
const CLIENT_ID = env.parsed.CLIENT_ID
const ENVIRONMENT_URL = env.parsed.ENVIRONMENT_URL

const updateJson = (category, date, total) => {
    let data = require('../data.json')
    if(!data[category]) data[category] = {}
    data[category][date] = total
    console.log(JSON.stringify(data))
    fs.writeFile('./data.json', JSON.stringify(data), 'utf8', (res) => {
        console.log(res)
    })
}

/* GET home page. */
router.post('/', function(req, res, next) {
    const reciept = (req.body.reciept.substring(23, req.body.reciept.length))
    let jsonData = {
        file_data: reciept,
        file_name: 'reciept.json',
        boost_mode: true
    };
    let options = {
        method: "POST",
        uri: 'https://' + ENVIRONMENT_URL + '/api/v8/partner/documents/',
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "CLIENT-ID": CLIENT_ID,
            "AUTHORIZATION": `apikey ${USER_NAME}:${API_KEY}`
        },
        json: jsonData
    };
    
    request(options, function(error, response, body) {
        // console.log(body);
        // res.send(body)
        // body.category
        updateJson(body.category, body.date, body.total)
        res.send(require('../data.json'))
    });

    // res.send({message: "API is working properly"});
});

module.exports = router;
