var stitch = require("../repositories/mongoDb")
var elastic_update = require('../controllers/elasticUpdate')
var express = require('express');
var auth = require("./authentication")


function updateElasticMongo (){
    stitch.then(client => {
        if (client.authedId()) {
            client.executeFunction("getProjects", client.authedId()).then((result) => {
                if(result){
                    elastic_update.updateElastic(result)
                }
            })
        }
    })
}


exports.getProjects = function (req, res) {
    stitch.then(client => {
        if (client.authedId()) {
            client.executeFunction("getProjects", client.authedId()).then((result) => {
                if (result) {
                    var response = {}
                    response.status = true
                    response.message = "List of all Projects"
                    response.data = result
                    elastic_update.updateElastic(result)
                    res.render('projects',{data:result});
                } else {
                    var response = {}
                    response.status = false
                    response.message = "No projects Returned"
                    response.data = result
                    res.json(response)
                }
            })
        }else{
            var response = {}
            response.status = false
            response.message = "User Must Auth"
            response.data = null
            res.render('login',{});
        }

    }).catch((error) => {
        var response = {}
        response.status = false
        response.message = error.message
        response.data = null
        res.json(response)
    })
}

exports.getProjectsApi = function (req, res) {
    stitch.then(client => {
        if (client.authedId()) {
            client.executeFunction("getProjects", client.authedId()).then((result) => {
                if (result) {
                    var response = {}
                    response.status = true
                    response.message = "List of all Projects"
                    response.data = result
                    //elastic_update.updateElastic(result)
                    //res.render('projects',{data:result});
                    res.json(response)
                } else {
                    var response = {}
                    response.status = false
                    response.message = "No projects Returned"
                    response.data = result
                    res.json(response)
                }
            })
        }else{
            var response = {}
            response.status = false
            response.message = "User Must Auth"
            response.data = null
            res.json(response);
        }

    }).catch((error) => {
        var response = {}
        response.status = false
        response.message = error.message
        response.data = null
        res.json(response)
    })
}


exports.addcomment = function (req, res) {

    stitch.then(client => {
        if (client.authedId()) {
            let db = client.service("mongodb", "mongodb-atlas").db("hub");

            let users = db.collection("users");

            users.find({ "owner_id": client.authedId() }, null).execute().then((data) => {
                var newcomment = {
                    comment:req.body.comment,
                    date:new Date().toDateString(),
                    userName:data[0].fullName,
                    timestamp:Date.now()
                }
                
                var activity = data[0].project.activities.find(function(element){
                    return element.id = req.body.activityId
                })
                //console.log(activity)
                if(activity.comments){
                    activity.comments.push(newcomment)
                    data[0].project.activities.forEach(el=>{
                        if(el.id === req.body.activityId){
                            el = activity
                        }
                    })
                    
                }else{
                    var array = []
                    array.push(newcomment)
                    activity['comments'] = array

                    data[0].project.activities.forEach(el=>{
                        if(el.id === req.body.activityId){
                            el = activity
                        }
                    })
                }

                users.updateOne({ owner_id: client.authedId() }, { $set: { project: data[0].project } }).then((ret) => {
                    updateElasticMongo()
                    //console.log(data[0])
                    var activityData = {
                        userId:data[0]._id,
                        id:req.body.activityId,
                        comment:newcomment

                    }
                    var response = {}
                    response.status = true
                    response.message = "Comment Added"
                    response.data = activityData
                    //console.log(activity)
                    //res.render('activity', activity);
                    res.json(response)
                });
            })
        }else{
            var response = {}
            response.status = false
            response.message = "User Must Auth"
            response.data = null
            res.render('login',{});
        }

    }).catch((error) => {
        var response = {}
        response.status = false
        response.message = error.message
        response.data = null
        res.json(response)
    })

}