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

exports.getAggregationsApi = function(req , res){
    stitch.then(client => {
        if (client.authedId()) {
            elasticsearch.search({
                index:'users',
                type:'user',
                body:{
                    query:{
                        match:{
                            id:req.body.id
                        }
                    },
                    aggs:{
                        "amount_spent":{"sum":{"field":"project.activities.spending.moneySpent"}},
                        "beneficiary_number":{"sum":{"field":"project.activities.beneficiaries.beneficiaryNumber"}},
                        "number_of_activities":{"value_count":{"field":"project.activities.id.keyword"}}
                        
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
                    //console.log(data.hits.hits[0]._source)
                    res.json(response);
                }
              })

        }else {
            var response = {}
            response.status = false
            response.message = "User Must Auth"
            response.data = null
            //res.json(response)
            res.json(response);
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
            res.json(response)
            //res.render('login', {});
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
                                    "value_count":{ "field": "volunteerName.keyword" }
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


exports.rangeBeneficiariesOverTime = function(req , res){
    stitch.then(client => {
        if (client.authedId()) {
            elasticsearch.search({
                index:'beneficiaries',
                type:'beneficiaries',
                body:{
                    "query": {
                      "bool": {
                        "must": [
                          {
                            "range": {
                              "timestamp": {
                                "gte": req.body.min,
                                "lte": req.body.max
                              }
                            }
                          },
                          {
                            "match": {
                              "projectId": req.body.id
                            }
                          }
                        ]
                      }
                    },
                    "aggs": {
                      "beneficiaries_over_time": {
                        "date_histogram": {
                          "field": "timestamp",
                          "interval": "month"
                        },
                        "aggs": {
                          "beneficiary_sum": {
                            "sum": {
                              "field": "beneficiaryNumber"
                            }
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
                    response.message = `Beneficiaries Over time in range ${req.body.min} - ${req.body.max}`
                    response.data = {
                        aggregations:data.aggregations.beneficiaries_over_time.buckets,
                        list:data.hits.hits
                    }
                    
                    res.json(response)
                }
              })

        }else {
            var response = {}
            response.status = false
            response.message = "User Must Auth"
            response.data = null
            res.json(response)
            //res.render('login', {});
        }
    })
}

exports.rangeVolunteersOverTime = function(req , res){
    stitch.then(client => {
        if (client.authedId()) {
            elasticsearch.search({
                index:'volunteers',
                type:'volunteers',
                body:{
                    "query": {
                      "bool": {
                        "must": [
                          {
                            "range": {
                              "timestamp": {
                                "gte": req.body.min,
                                "lte": req.body.max
                              }
                            }
                          },
                          {
                            "match": {
                              "projectId": req.body.id
                            }
                          }
                        ]
                      }
                    },
                    "aggs": {
                      "volunteers_over_time": {
                        "date_histogram": {
                          "field": "timestamp",
                          "interval": "month"
                        },
                        "aggs": {
                          "volunteers_count": {
                            "value_count": {
                              "field": "volunteerName.keyword"
                            }
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
                    response.message = `Volunteers Over time in range ${req.body.min} - ${req.body.max}`
                    response.data ={
                        aggregations:data.aggregations.volunteers_over_time.buckets,
                        list:data.hits.hits
                    } 
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

exports.rangeSpendingOverTime = function(req , res){
    stitch.then(client => {
        if (client.authedId()) {
            elasticsearch.search({
                index:'spending',
                type:'spending',
                body:{
                    "query": {
                      "bool": {
                        "must": [
                          {
                            "range": {
                              "timestamp": {
                                "gte": req.body.min,
                                "lte": req.body.max
                              }
                            }
                          },
                          {
                            "match": {
                              "projectId": req.body.id
                            }
                          }
                        ]
                      }
                    },
                    "aggs": {
                      "spending_over_time": {
                        "date_histogram": {
                          "field": "timestamp",
                          "interval": "month"
                        },
                        "aggs": {
                          "spending_sum": {
                            "sum": {
                              "field": "moneySpent"
                            }
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
                    response.message = `Spending Over time range ${req.body.min} - ${req.body.max}`
                    response.data = {
                        aggregations: data.aggregations.spending_over_time.buckets,
                        list:data.hits.hits
                    }
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


exports.spendingBreakdown = function(req , res){
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
                      "activities": {
                        "terms": {
                          "field": "activityName.keyword"
                        },
                        "aggs": {
                          "spending_sum": {
                            "sum": {
                              "field": "moneySpent"
                            }
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
                    response.message = "Spending Breakdown"
                    response.data = data.aggregations.activities.buckets
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

exports.volunteersBreakdown = function(req , res){
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
                      "activities": {
                        "terms": {
                          "field": "activityName.keyword"
                        },
                        "aggs": {
                          "volunteers_count": {
                            "value_count": {
                              "field": "volunteerName.keyword"
                            }
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
                    response.message = "Volunteers Breakdown"
                    response.data = data.aggregations.activities.buckets
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


exports.beneficiariesBreakdown = function(req , res){
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
                      "activities": {
                        "terms": {
                          "field": "activityName.keyword"
                        },
                        "aggs": {
                          "beneficiary_sum": {
                            "sum": {
                              "field": "beneficiaryNumber"
                            }
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
                    response.message = "Beneficiaries Breakdown"
                    response.data = data.aggregations.activities.buckets
                    res.json(response)
                }
              })

        }else {
            var response = {}
            response.status = false
            response.message = "User Must Auth"
            response.data = null
            res.json(response)
            //res.render('login', {});
        }
    })
}