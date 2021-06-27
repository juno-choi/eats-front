var express = require('express');
var router = express.Router();
const axios = require('axios');
const apiUrl = 'http://localhost:8081/v1';
require('dotenv').config();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

/* GET login page. */
router.get('/login', function(req, res, next) {
  res.render('login');
});

/* GET join page. */
router.get('/join', function(req, res, next) {
  res.render('join');
});

/* GET eats page. */
router.get('/eats', function(req, res, next) {
  axios.get('https://dapi.kakao.com/v2/maps/sdk.js?appkey='+process.env.KAKAO_API_KEY)
  .then((result)=>{
    const data = result.data;
    const kakaoMap = {data:data};
    res.render('eats', {kakaoMap : kakaoMap});
  }).catch((error)=>{
    if (error.response) {
      console.log(error.response.data);
      const data = {success : false};
      res.json(data);
    }
  });
  
 

});

/* POST join. */
router.post(apiUrl+'/join', function(req, res, next) {
  const params = req.body.params;
  axios.post('/join', {
    memberId: params.id,
    email : params.email,
    pw : params.pw
  }).then((result)=>{
    const data = result.data;
    console.log(data);
    res.json(data);
  }).catch((error)=>{
    console.log(error);
  });
});

/* POST login. */
router.post('/login', function(req, res, next) {
  const params = req.body.params;
  axios.post(apiUrl+'/login', {
    memberId: params.id,
    pw : params.pw
  }).then((result)=>{
    const data = result.data;
    console.log(data);
    res.json(data);
  }).catch((error)=>{
    if (error.response) {
      console.log(error.response.data);
      const data = {success : false};
      res.json(data);
    }
  });
});


module.exports = router;
