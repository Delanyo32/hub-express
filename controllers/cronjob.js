var schedule = require('node-schedule');
var elasticsearch = require('../repositories/elasticSearch')
var stitch = require("../repositories/mongoDb")
const hasha = require('hasha');


var rule = new schedule.RecurrenceRule();

rule.minute = new schedule.Range(0, 59, 1);


schedule.scheduleJob(rule, function() {
    console.log("started")
    stitch.then(client => {
        client.login("daborchie@gmail.com", "digimonmonsters").then((data) => {
            client.executeFunction("getProjects", client.authedId()).then((result) => {
                if(result){
                    var bulkBody = []
                    result.forEach(entry => {

                        entry.id = entry._id
                        delete entry._id
                        var entrySpending = []
                        var entryBeneficiaries = []
                        var entryVolunteers = []

                        if(entry.project.activities)
                        entry.project.activities.forEach(activity=>{
                            if(activity.spending){
                                activity.spending.forEach(spending=>{
                                    spending.projectId = entry.id
                                    spending.activityId = activity.id
                                    var id = hasha(spending.moneySpent+spending.itemName,{algorithm: 'md5'})
                                    var data ={}
                                    data.index = {
                                        _index:'spending',
                                        _type:'spending',
                                        _id:id
                                    }
                                    // console.log(data)
                                    
                                    entrySpending.push(data)
                                    entrySpending.push(spending)
    
                                })
                            }
                          
                            if(activity.volunteers){
                                activity.volunteers.forEach(volunteers=>{
                                    volunteers.projectId = entry.id
                                    volunteers.activityId = activity.id
                                    var id = hasha(volunteers.volunteerName+volunteers.volunteerEmail,{algorithm: 'md5'})
                                    var data ={}
                                    data.index = {
                                        _index:'volunteers',
                                        _type:'volunteers',
                                        _id:id
                                    }
    
                                    entryVolunteers.push(data)
                                    entryVolunteers.push(volunteers)
    
                                })
                            }
                         
                            if(activity.beneficiaries){
                                activity.beneficiaries.forEach(beneficiaries=>{
                                    beneficiaries.projectId = entry.id
                                    beneficiaries.activityId = activity.id
                                    var id = hasha(beneficiaries.beneficiaryNumber+beneficiaries.beneficiaryDemography,{algorithm: 'md5'})
                                    var data ={}
                                    data.index = {
                                        _index:'beneficiaries',
                                        _type:'beneficiaries',
                                        _id:id
                                    }
    
                                    entryBeneficiaries.push(data)
                                    entryBeneficiaries.push(beneficiaries)
                   
                                })
                            }
                        })

                        if(entrySpending.length>0){
                            
                        elasticsearch.bulk({
                            body: entrySpending,
                        }, function (err, resp) {
                            if (err) { console.log(err) }
                            else { 
                                console.log("Spending Index Update Successful")
                            }
                        })
                    }
                        if(entryVolunteers.length>0){
                         
                        elasticsearch.bulk({
                            body: entryVolunteers,
                        }, function (err, resp) {
                            if (err) { console.log(err) }
                            else { 
                                console.log("Volunteers Index Update Successful")
                            }
                        })
                    }

                        if(entryBeneficiaries.length>0){
                         
                        elasticsearch.bulk({
                            body: entryBeneficiaries,
                        }, function (err, resp) {
                            if (err) { console.log(err) }
                            else { 
                                console.log("Beneficiaries Index Update Successful")
                            }
                        })
                    }

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
                else{
                    console.log("could not get projects")
                }
            })
        })
    })
})