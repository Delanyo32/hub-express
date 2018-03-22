var express = require('express');
var authenication_controller = require("../controllers/authentication")
var projects_controller = require("../controllers/projects")
var elasticsearch_controller = require('../controllers/elasticUpdate') 
var elastic_aggs_controller = require('../controllers/elasticAggregates')
var router = express.Router();

/* GET users listing. */
router.post('/login', authenication_controller.login);

router.post('/projects',projects_controller.getProjects )

//router.post('/getProject' , elasticsearch_controller.getProject)

router.post('/addComment' , projects_controller.addcomment)

router.post('/getAggregations' , elastic_aggs_controller.getAggregations)

router.post('/getBeneficiariesOverTime' , elastic_aggs_controller.getBeneficiariesOverTime)

router.post('/getSpendingOverTime' , elastic_aggs_controller.getSpendingOverTime)

router.post('/getVolunteersOverTime' , elastic_aggs_controller.getVolunteersOverTime)

module.exports = router;
