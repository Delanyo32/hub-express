var express = require('express');
var router = express.Router();
var projects = require("../controllers/projects")
var elastic = require("../controllers/elasticUpdate")
var aggregation = require("../controllers/elasticAggregates")

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', {});
});


router.get('/projects',projects.getProjects);

router.get('/home/:id', aggregation.getAggregations);

router.get('/info/:id', elastic.getProjectInfo);

router.get('/activity/:userId/:id', elastic.getProjectActivity);

module.exports = router;
