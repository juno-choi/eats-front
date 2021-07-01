var express = require('express');
var router = express.Router();
const axios = require('axios');
require('dotenv').config();

const api_key = process.env.GOOGLE_SECRET_API_KEY;

/* GET users listing. */
router.post('/search', function(req, res, next) {
  const body = req.body;
  const lat = body.lat;
  const lon = body.lon;
  const keyword = body.keyword;
  const radius = body.radius;
  const opennow = body.opennow;
  const type = 'restaurant';
  let api_url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?'
                  +'location='+lat+','+lon
                  +'&language=ko'
                  +'&radius='+radius
                  +'&type='+type
                  +'&name=' + encodeURI(keyword)
                  //+'&keyword=' + encodeURI(keyword)
                  +'&keyword=restaurant'
                  +'&key='+api_key; // json 결과
  if(opennow == 'Y'){
    api_url += '&opennow';
  }
  console.log(api_url);
  axios({
    method : 'get',
    url : api_url
  }).then((result)=>{
    res.json(result.data);
  }).catch((error)=>{
    console.log(error);
  });

});
module.exports = router;
