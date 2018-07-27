var stitch = require("../repositories/mongoDb")
var elastic_update = require('../controllers/elasticUpdate')
var express = require('express');
var auth = require("./authentication")
var elasticsearch = require('../repositories/elasticSearch')

function updateElasticMongo() {
    stitch.then(client => {
        if (client.authedId()) {
            client.executeFunction("getProjects", client.authedId()).then((result) => {
                if (result) {
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
                    res.render('projects', { data: result });
                } else {
                    var response = {}
                    response.status = false
                    response.message = "No projects Returned"
                    response.data = result
                    res.json(response)
                }
            })
        } else {
            var response = {}
            response.status = false
            response.message = "User Must Auth"
            response.data = null
            res.render('login', {});
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
                    //console.log(result)
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
        } else {
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

            users.find({ "owner_id": req.body.id }, null).execute().then((data) => {

                var newcomment = {
                    comment: req.body.comment,
                    date: new Date().toDateString(),
                    userName: "Admin",
                    timestamp: Date.now()
                }

                var activity = data[0].project.activities.find(function (element) {
                    return element.id = req.body.activityId
                })
                console.log(activity.id)
                if (activity.comments) {
                    activity.comments.push(newcomment)
                    data[0].project.activities.forEach(el => {
                        if (el.id === req.body.activityId) {
                            el = activity
                        }
                    })
                    console.log("has comments")
                } else {
                    console.log("no comments")
                    var array = []
                    array.push(newcomment)
                    activity['comments'] = array
                    console.log(activity)

                    data[0].project.activities.forEach(el => {
                        if (el.id === req.body.activityId) {
                            el = activity
                        }
                    })

                    //console.log(data[0].project.activities)
                }

                users.updateOne({ owner_id: req.body.id }, { $set: { project: data[0].project } }).then((ret) => {
                    //updateElasticMongo()
                    //console.log(data[0].project)

                    var activityData = {
                        userId: req.body.id,
                        id: req.body.activityId,
                        comment: newcomment

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
        } else {
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

exports.updateProject = function (req, res) {

    stitch.then(client => {
        if (client.authedId()) {
            let db = client.service("mongodb", "mongodb-atlas").db("hub");

            let users = db.collection("users");

            users.updateOne({ owner_id: req.body.owner_id }, { $set: { project: req.body.project } }).then((ret) => {

                var response = {}
                response.status = true
                response.message = "Project Updated"
                response.data = req.body
                res.json(response)
            });
        } else {
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

exports.deleteProject = function(req, res){
    stitch.then(client => {
        if (client.authedId()){
            let db = client.service("mongodb", "mongodb-atlas").db("hub");
            let users = db.collection("users");

            users.deleteOne({_id:req.body._id}).then((result) => {
                if (result) {
                    elasticsearch.delete({
                        index: 'users',
                        type: 'user',
                        id: req.body._id
                    }, function(error,data){
                        if (error) {
                            var response = {}
                            response.status = false
                            response.message = error
                            response.data = data
                            //res.json(response)
                        } else {
                            var response = {}
                            response.status = true
                            response.message = "project deleted"
                            //response.project = data.hits.hits[0]._source
                            console.log(data.hits)
                            res.json(response);
                        }
                    })
                } else {
                    var response = {}
                    response.status = false
                    response.message = "No projects Deleted"
                    response.data = result
                    res.json(response)
                }
            })
        } else {
            var response = {}
            response.status = false
            response.message = "User Must Auth"
            response.data = null
            res.render('login', {});
        }
    }).catch((error) => {
        var response = {}
        response.status = false
        response.message = error.message
        response.data = null
        res.json(response)
    })
}

// exports.getProjectsSummary = function (req, res){
//     stitch.then(client =>{
//         if (client.authedId()) {
//             client.executeFunction("getProjects", client.authedId()).then((result) => {
//                 if (result) {
//                     var response = {}
//                     response.status = true
//                     response.message = "List of all Projects"
//                     response.data = result;
//                     summary = response.data;
//                     var sum = [];
//                     for (let i = 0; i<summary.length;i++){
//                         var data = {};
//                         data.projectName = summary[i].project.projectName;
//                         data.ProjectId = summary[i]._id;
//                         data.ProjectOwner = summary[i].fullName;
//                         sum.push(data);   
//                     }
//                     res.json(sum)
//                 } else {
//                     var response = {}
//                     response.status = false
//                     response.message = "No projects Returned"
//                     response.data = result
//                     res.json(response)
//                 }
//             })
//         } else {
//             var response = {}
//             response.status = false
//             response.message = "User Must Auth"
//             response.data = null
//             res.json(response);
//         }
//     }).catch((error) =>{
//         var response = {}
//         response.status = false
//         response.message = error.message
//         response.data = null
//         res.json(response)
//     })
// }
exports.getProjectsSummary = function (req,res) {
    stitch.then(client => {
        if(client.authedId()) {
            elasticsearch.search({
                index: "users",
                type: "user",
                _sourceInclude: ["fullName","project.projectName"]
            },function(error,data){
                if (error) {
                    var response = {}
                    response.status = false
                    response.message = error
                    response.data = data
                    res.json(response)
                } else{
                    var response = {}
                    response.status = true
                    response.message = "projects summary"
                    response.projects = data.hits.hits
                    res.json(response);
                }
            })
        } else{
            var response = {}
            response.status = false
            response.message = "User Must Auth"
            response.data = null
            res.json(response);
        }
    }).catch((error) =>{
        var response = {}
        response.status = false
        response.message = error.message
        response.data = null
        res.json(response)
    })
}