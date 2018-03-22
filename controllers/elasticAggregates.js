var elasticsearch = require('../repositories/elasticSearch')
var stitch = require("../repositories/mongoDb")
var express = require('express');

//get amount spent 

exports.getAggregations = function(req , res){
    stitch.then(client => {
        if (client.authedId()) {
            elasticsearch.search({
                index:'users',
                type:'user',
                body:{
                    query:{
                        match:{
                            id:req.params.id
                        }
                    },
                    aggs:{
                        "amount_spent":{"sum":{"field":"project.activities.spending.moneySpent"}},
                        "beneficiary_number":{"sum":{"field":"project.activities.beneficiaries.beneficiaryNumber"}},
                        "number_of_activities":{"value_count":{"field":"project.activities.id"}}
                        
                    }
                }
                
                
            },function (error, data) {
                if (error) {
                    var response = {}
                    response.status = false
                    response.message = error
                    response.data = data
                    res.json(response)
                } else {
                    var response = {}
                    response.status = true
                    response.message = "project"
                    response.project = data.hits.hits[0]._source
                    response.aggs = data.aggregations
                    console.log(data.hits.hits[0]._source)
                    res.render('home', response);
                }
              })

        }else {
            var response = {}
            response.status = false
            response.message = "User Must Auth"
            response.data = null
            //res.json(response)
            res.render('login', {});
        }
    })

}

exports.getBeneficiariesOverTime = function(req , res){
    stitch.then(client => {
        if (client.authedId()) {
            elasticsearch.search({
                index:'beneficiaries',
                type:'beneficiaries',
                body:{
                    "query": {
                        "match": {
                            "projectId": req.body.id
                        }
                    },
                    "aggs": {
                        "beneficiaries_over_time": {
                            "date_histogram": {
                                "field": "timestamp",
                                "interval": "month"
                            },
                            "aggs":{
                                "beneficiary_sum":{
                                    "sum":{ "field": "beneficiaryNumber" }
                                }
                            }
                        }
                    }
                }
            },function (error, data) {
                if (error) {
                    var response = {}
                    response.status = false
                    response.message = error
                    response.data = data
                    res.json(response)
                } else {
                    var response = {}
                    response.status = true
                    response.message = "Beneficiaries Over time"
                    response.data = data.aggregations.beneficiaries_over_time.buckets
                    res.json(response)
                }
              })

        }else {
            var response = {}
            response.status = false
            response.message = "User Must Auth"
            response.data = null
            //res.json(response)
            res.render('login', {});
        }
    })
}

exports.getSpendingOverTime = function(req , res){
    stitch.then(client => {
        if (client.authedId()) {
            elasticsearch.search({
                index:'spending',
                type:'spending',
                body:{
                    "query": {
                        "match": {
                            "projectId": req.body.id
                        }
                    },
                    "aggs": {
                        "spending_over_time": {
                            "date_histogram": {
                                "field": "timestamp",
                                "interval": "month"
                            },
                            "aggs":{
                                "spending_sum":{
                                    "sum":{ "field": "moneySpent" }
                                }
                            }
                        }
                    }
                }
            },function (error, data) {
                if (error) {
                    var response = {}
                    response.status = false
                    response.message = error
                    response.data = data
                    res.json(response)
                } else {
                    var response = {}
                    response.status = true
                    response.message = "Spending Over time"
                    response.data = data.aggregations.spending_over_time.buckets
                    res.json(response)
                }
              })

        }else {
            var response = {}
            response.status = false
            response.message = "User Must Auth"
            response.data = null
            //res.json(response)
            res.render('login', {});
        }
    })
}

exports.getVolunteersOverTime = function(req , res){
    stitch.then(client => {
        if (client.authedId()) {
            elasticsearch.search({
                index:'volunteers',
                type:'volunteers',
                body:{
                    "query": {
                        "match": {
                            "projectId": req.body.id
                        }
                    },
                    "aggs": {
                        "volunteers_over_time": {
                            "date_histogram": {
                                "field": "timestamp",
                                "interval": "month"
                            },
                            "aggs":{
                                "volunteers_count":{
                                    "value_count":{ "field": "volunteerName" }
                                }
                            }
                        }
                    }
                }
            },function (error, data) {
                if (error) {
                    var response = {}
                    response.status = false
                    response.message = error
                    response.data = data
                    res.json(response)
                } else {
                    var response = {}
                    response.status = true
                    response.message = "Volunteers Over time"
                    response.data = data.aggregations.volunteers_over_time.buckets
                    res.json(response)
                }
              })

        }else {
            var response = {}
            response.status = false
            response.message = "User Must Auth"
            response.data = null
            //res.json(response)
            res.render('login', {});
        }
    })
}




