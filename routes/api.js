var express = require('express');
var authenication_controller = require("../controllers/authentication")
var projects_controller = require("../controllers/projects")
var elasticsearch_controller = require('../controllers/elasticUpdate') 
var elastic_aggs_controller = require('../controllers/elasticAggregates')
var router = express.Router();

/* GET users listing. */
router.post('/login', authenication_controller.login);

router.post('/projects',projects_controller.getProjects )

router.post('/getProjects',projects_controller.getProjectsApi)

router.post('/getProjectById',elastic_aggs_controller.getAggregationsApi)

router.delete('/deleteProjectById', projects_controller.deleteProject)

//router.post('/getProject' , elasticsearch_controller.getProject)

router.post('/addComment' , projects_controller.addcomment)

router.post('/updateProject', projects_controller.updateProject)

router.post('/getAggregations' , elastic_aggs_controller.getAggregations)


router.post('/getBeneficiariesOverTime' , elastic_aggs_controller.getBeneficiariesOverTime)

router.post('/getSpendingOverTime' , elastic_aggs_controller.getSpendingOverTime)

router.post('/getVolunteersOverTime' , elastic_aggs_controller.getVolunteersOverTime)



router.post('/rangeBeneficiariesOverTime' , elastic_aggs_controller.rangeBeneficiariesOverTime)

router.post('/rangeSpendingOverTime' , elastic_aggs_controller.rangeSpendingOverTime)

router.post('/rangeVolunteersOverTime' , elastic_aggs_controller.rangeVolunteersOverTime)



router.post('/beneficiariesBreakdown' , elastic_aggs_controller.beneficiariesBreakdown)

router.post('/spendingBreakdown' , elastic_aggs_controller.spendingBreakdown)

router.post('/volunteersBreakdown' , elastic_aggs_controller.volunteersBreakdown)

module.exports = router;
