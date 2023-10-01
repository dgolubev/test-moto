var express = require('express');
var router = express.Router();

router.get('/', function(_req, res, _next) {
  return res.json({
    title: 'Express'
  });
});

module.exports = router;
