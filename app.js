const express = require("express");
const app = express();
var request = require('request');
const  bodyParser = require('body-parser');
const cors = require('cors')
const  path = require('path');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.listen(8081, function () {
  console.log('Weather app listening on port 8081!');
});

app.use(express.static(path.join(__dirname, 'dist/weatherapp')));

app.all("/*", function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    next();
});

app.get('/api/cityAutoComplete', (req, res) => {
  var cityObj = req.body;
  var city = req.query.city;
  console.log('https://maps.googleapis.com/maps/api/place/autocomplete/json?input='+city+'&types=(cities)&language=en&key=<YOUR_GOOGLE_API_KEY>');
  request('https://maps.googleapis.com/maps/api/place/autocomplete/json?input='+city+'&types=(cities)&language=en&key=<YOUR_GOOGLE_API_KEY>', function(error, response, body){
     res.json(response.body);
  });
});


app.get('/api/searchResults', (req,res) => {
  var address = req.body;
  var street = req.query.q1;
  var city = req.query.q2;
  var state = req.query.q3;
  console.log('https://maps.googleapis.com/maps/api/geocode/json?address='+street+','+city+','+state+'&key=<YOUR_GOOGLE_API_KEY>');
  request('https://maps.googleapis.com/maps/api/geocode/json?address='+street+','+city+','+state+'&key=<YOUR_GOOGLE_API_KEY>', function(error, response, body){
    res.json(response.body);
 });
});

app.get('/api/currentWeather', (req,res) =>{
  // var latlong = req.body;
  // console.log(latlong);
  var lat = req.query.lat;
  var long = req.query.lng;
  console.log('https://api.darksky.net/forecast/5840eecd438f883cec8b3d5118901da0/'+lat+','+long+'');
  request('https://api.darksky.net/forecast/5840eecd438f883cec8b3d5118901da0/'+lat+','+long+'', function(error, response, body){
    //res.json(response.body);
    res.json(response.body);
 });
});

app.get('/api/stateSeal', (req,res) =>{
  var state = req.query.state;
  console.log(state);
  console.log('https://www.googleapis.com/customsearch/v1?q='+state+'%20State%20Seal&cx=007310180503979522556:afldbckvcur&imgSize=huge&imgType=news&num=1&searchType=image&key=<YOUR_GOOGLE_API_KEY>');
  request('https://www.googleapis.com/customsearch/v1?q='+state+'%20State%20Seal&cx=007310180503979522556:afldbckvcur&imgSize=huge&imgType=news&num=1&searchType=image&key=<YOUR_GOOGLE_API_KEY>', function(error, response, body){
    //res.json(response.body);
    res.json(response.body);
 });
})

app.get('/api/weeklyWeather', (req,res) =>{
  var lat = req.query.lat;
  var long = req.query.lng;
  var time = req.query.time
  console.log('here');
  console.log('https://api.darksky.net/forecast/5840eecd438f883cec8b3d5118901da0/'+lat+','+long+','+time+'');
  request('https://api.darksky.net/forecast/5840eecd438f883cec8b3d5118901da0/'+lat+','+long+','+time+'', function(error, response, body){
    //res.json(response.body);
    res.json(response.body);
 });
});

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'dist/weatherapp/index.html'));
});
module.exports = app;
