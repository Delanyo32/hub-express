var elasticsearch = require('../repositories/elasticSearch')
var express = require('express');
const hasha = require('hasha');

exports.triggerNewUser = function (req, res) {
    console.log(req.body)
    var entry = req.body
    var bulkBody = []
    if (entry.project.activities) {
        entry.project.activities.forEach(activity => {
            if (activity.spending) {
                activity.spending.forEach(spending => {
                    spending.projectId = entry.id
                    spending.activityId = activity.id
                    spending.activityName = activity.activityName
                    var id = hasha((spending.moneySpent + spending.itemName).toString(), {
                        algorithm: 'md5'
                    })
                    var data = {}
                    data.index = {
                        _index: 'spending',
                        _type: 'spending',
                        _id: id
                    }
                    // console.log(data)

                    bulkBody.push(data)
                    bulkBody.push(spending)

                })
            }

            if (activity.volunteers) {
                activity.volunteers.forEach(volunteers => {
                    volunteers.projectId = entry.id
                    volunteers.activityId = activity.id
                    volunteers.activityName = activity.activityName
                    var id = hasha((volunteers.volunteerName + volunteers.volunteerEmail).toString(), {
                        algorithm: 'md5'
                    })
                    var data = {}
                    data.index = {
                        _index: 'volunteers',
                        _type: 'volunteers',
                        _id: id
                    }

                    bulkBody.push(data)
                    bulkBody.push(volunteers)

                })
            }

            if (activity.beneficiaries) {
                activity.beneficiaries.forEach(beneficiaries => {
                    beneficiaries.projectId = entry.id
                    beneficiaries.activityId = activity.id
                    beneficiaries.activityName = activity.activityName
                    var id = hasha((beneficiaries.beneficiaryNumber + beneficiaries.beneficiaryDemography).toString(), {
                        algorithm: 'md5'
                    })
                    var data = {}
                    data.index = {
                        _index: 'beneficiaries',
                        _type: 'beneficiaries',
                        _id: id
                    }

                    bulkBody.push(data)
                    bulkBody.push(beneficiaries)

                })
            }
        })
    }
    var data = {}
    data.index = {
        _index: 'users',
        _type: 'user',
        _id: entry.id.toString(),
    }
    bulkBody.push(data)
    bulkBody.push(entry)

    elasticsearch.bulk({
        body: bulkBody,
    }, function (err, resp) {
        if (err) {
            console.log(err)
        } else {

            console.log("Errytin good:  " + resp)
            var response = {}
            response.status = true
            response.message = "done"
            response.data = "data"
            res.json(response)

        }
    })


}


exports.triggerDelete = function (req, res) {
    console.log(req.body)
    elasticsearch.delete({
        index: 'users',
        type: 'user',
        id: req.body.id
    }, function(error,data){
        if (error) {
            var response = {}
            response.status = false
            response.message = error
            response.data = data
            res.json(response)
        } else {
            var response = {}
            response.status = true
            response.message = "project deleted"
            //response.project = data.hits.hits[0]._source
            console.log(data.hits)
            res.json(response);
        }
    })
}


