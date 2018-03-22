var elasticsearch = require('../repositories/elasticSearch')
var stitch = require("../repositories/mongoDb")
var express = require('express');


exports.updateElastic = function (users) {
    var bulkBody = []
    users.forEach(entry => {
        entry.id = entry._id
        delete entry._id
        var data ={}
        data.index = {
            _index:'users',
            _type:'user',
            _id:entry.id.toString(),
        }
        bulkBody.push(data)
        bulkBody.push(entry)
    })

    
    elasticsearch.bulk({
        body: bulkBody,
    }, function (err, resp) {
        if (err) { console.log(err) }
        else { //console.log(resp) 
        }
    })

}

exports.getProjectHome = function (req, res) {
    stitch.then(client => {
        if (client.authedId()) {
            elasticsearch.get({
                index: 'users',
                type: 'user',
                id: req.params.id
            }, function (error, reponse) {
                if (error) {
                    var response = {}
                    response.status = false
                    response.message = error
                    response.data = reponse
                    res.json(response)
                } else {
                    var response = {}
                    response.status = true
                    response.message = "Specified project"
                    response.data = reponse
                    //console.log(response.data._source)
                    res.render('home', response.data._source);
                }
            }
            )
        } else {
            var response = {}
            response.status = false
            response.message = "User Must Auth"
            response.data = null
            //res.json(response)
            res.render('login', {});
        }
    })
}

exports.getProjectInfo = function (req, res) {
    stitch.then(client => {
        if (client.authedId()) {
            elasticsearch.get({
                index: 'users',
                type: 'user',
                id: req.params.id
            }, function (error, reponse) {
                if (error) {
                    var response = {}
                    response.status = false
                    response.message = error
                    response.data = reponse
                    res.json(response)
                } else {
                    var response = {}
                    response.status = true
                    response.message = "Specified project"
                    response.data = reponse
                    //console.log(response.data._source)
                    res.render('information', response.data._source);
                }
            }
            )
        } else {
            var response = {}
            response.status = false
            response.message = "User Must Auth"
            response.data = null
            //res.json(response)
            res.render('login', {});
        }
    })
}


exports.getProjectActivity = function (req, res) {
    stitch.then(client => {
        if (client.authedId()) {
            elasticsearch.get({
                index: 'users',
                type: 'user',
                id: req.params.userId
            }, function (error, reponse) {
                if (error) {
                    var response = {}
                    response.status = false
                    response.message = error
                    response.data = reponse
                    res.json(response)
                } else {
                    var response = {}
                    response.status = true
                    response.message = "Specified project"
                    //console.log(reponse._source.project.activities)
                    reponse._source.project.activities.forEach(el => {
                        if(el.id == req.params.id){
                            //console.log(el)
                            response.data = el
                        }
                    });
                     
                    // response.data = activity
                     //console.log(response.data.comments)
                     if(response.data.comments){
                        var comments = sortComments(response.data.comments)
                        response.data.comments = comments
                     }
                    
                    res.render('activity', response.data);
                }
            }
            )
        } else {
            var response = {}
            response.status = false
            response.message = "User Must Auth"
            response.data = null
            //res.json(response)
            res.render('login', {});
        }
    })


}

sortComments = (commetsArray)=>{
    return commetsArray.sort((a,b)=>{
        return  b.timestamp - a.timestamp
    })
}

