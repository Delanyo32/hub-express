var stitch = require("../repositories/mongoDb")


exports.login = function (req, res) {
    console.log(req.body)
    stitch.then(client => {
        client.login(req.body.email, req.body.password).then((data) => {

            client.executeFunction("isAdmin", data).then((result) => {
                if (result) {
                    var response = {}
                    response.status = true
                    response.message = "all good"
                    response.data = data
                    res.json(response)
                } else {
                    var response = {}
                    response.status = false
                    response.message = "Not an Admin"
                    response.data = null
                    res.json(response)
                }

            })

        }).catch((error) => {
            var response = {}
            response.status = false
            response.message = error.message
            response.data = null
            res.json(response)
        })
    })

}

