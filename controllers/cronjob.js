var schedule = require('node-schedule');
var elasticsearch = require('../repositories/elasticSearch')
var stitch = require("../repositories/mongoDb")
const hasha = require('hasha');


var rule = new schedule.RecurrenceRule();

rule.minute = new schedule.Range(0, 59, 1);

var key = "yoo0eddYi3aECftllDDAZjwbyakdCWivfmZ2Daeg4kRFkpJqTO7y9dfSCnyYcZtQ"

schedule.scheduleJob(rule, function () {
    console.log("started")
    stitch.then(client => {
        client.authenticate('apiKey', key).then((data) => {
            client.executeFunction("getProjects", client.authedId()).then((result) => {
                if (result) {
                    var bulkBody = []
                    result.forEach(entry => {
                        entry.id = entry._id
                        delete entry._id


                        if (entry.project.activities)
                            entry.project.activities.forEach(activity => {
                                try {
                                    activity["range-picker"].startsAt = activity["range-picker"].startsAt.toString()
                                    activity["range-picker"].endsAt = activity["range-picker"].endsAt.toString()
                                    activity["range-picker"].createdAt = activity["range-picker"].createdAt.toString()
                                } catch (e) {
                                   // console.log(activity["range-picker"])
                                }

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

                        var data = {}
                        data.index = {
                            _index: 'users',
                            _type: 'user',
                            _id: entry.id,
                        }
                        bulkBody.push(data)
                        bulkBody.push(entry)
                    })


                    elasticsearch.bulk({
                        body: bulkBody,
                    }, function (err, resp) {
                        if (err) {
                            console.log(err)
                        } else {
                            resp.items.forEach(element => {
                                if (element.index.status >= 200) {
                                    console.log(element.index)
                                }

                            });
                            console.log("Done")
                        }
                    })
                } else {
                    console.log("could not get projects")
                }
            })
        })
    })
})