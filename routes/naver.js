var express = require('express');
var router = express.Router();
const axios = require('axios');
require('dotenv').config();

const client_id = process.env.NAVER_CLIENT_ID;
const client_secret = process.env.NAVER_CLIENT_SECRET;

/* GET users listing. */
router.post('/search', function(req, res, next) {
  console.log("naver 검색 api 실행");
  const body = req.body;
  const query = body.local + ' '+ body.keyword;
  const sort = body.sort;
  const api_url = 'https://openapi.naver.com/v1/search/local?query=' + encodeURI(query)+'&display=5&start=1&sort='+sort; // json 결과
  console.log(api_url);

  const header = {'X-Naver-Client-Id':client_id, 'X-Naver-Client-Secret': client_secret};
  
  axios({
    method : 'get',
    url : api_url,
    headers : header
  }).then((result)=>{
    res.json(result.data);
  }).catch((error)=>{
    console.log(error);
  });

});
module.exports = router;
