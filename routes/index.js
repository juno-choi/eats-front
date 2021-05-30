var express = require('express');
var router = express.Router();
const axios = require('axios');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET login page. */
router.get('/login', function(req, res, next) {
  res.render('login');
});
/* GET join page. */
router.get('/join', function(req, res, next) {
  res.render('join');
});

/* POST join. */
router.post('/join', function(req, res, next) {
  const params = req.body.params;
  axios.post('http://localhost:8081/v1/join', {
    memberId: params.id,
    email : params.email,
    pw : params.pw
  }).then((result)=>{
    const data = result.data;
    console.log(data);
    res.json(data);
  });
});

/* POST login. */
router.post('/login', function(req, res, next) {
  const params = req.body.params;
  console.log(params);
  axios.post('http://localhost:8081/v1/login', {
    memberId: params.id,
    pw : params.pw
  }).then((result)=>{
    const data = result.data;
    console.log(data);
    res.json(data);
  });
});

module.exports = router;
