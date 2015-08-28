var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log(res.req.headers.host);
  res.render('layout', {title: 'User Page', body: '<input id=loc value='+ req.headers.host + '><script src=js/main.js></script>', changehost: req.headers.host});
});

module.exports = router;
