// *********************************************************************************
// html-routes.js - this file offers a set of routes for sending users to the various html pages
// *********************************************************************************

// Dependencies
// =============================================================
var path = require("path");
var db = require("../models");
var getBookInfoByISBN = require("./test-google-books-api.js");

// Routes
// =============================================================
module.exports = function(app) {
    //curl -i -H "Content-Type: application/json" -X GET http://localhost:3000/popular
    app.get("/index", (req, res) => {
        var dataObject = {};

        db.Medium
            .findAll({
                limit: 10,
                order: [["totalNumCheckouts", "DESC"]]
            })
            .then(data => {
                // data is an array of objects
                // deep clone it into a deliverable variable
                dataObject.popular = JSON.parse(JSON.stringify(data));

                db.Medium
                    .findAll({
                        limit: 10,
                        order: [["createdAt", "DESC"]]
                    })
                    .then(data => {
                        // data is an array of objects
                        // deep clone it into a deliverable variable
                        dataObject.new = JSON.parse(JSON.stringify(data));

                        // Promise(
                        getBookInfoByISBN(dataObject, res);
                        // ).then(dataDeliverable => {
                        // console.log(dataDeliverable);
                        // });
                    });
                // .then(() => {
                //     res.json(dataObject);
                // });
            });
    });

    app.get("/book", (req, res) => {
        var dataObject = {};

        db.Medium
            .findAll({
                limit: 10,
                order: [["totalNumCheckouts", "DESC"]]
            })
            .then(data => {
                // data is an array of objects
                // deep clone it into a deliverable variable
                dataObject.popular = JSON.parse(JSON.stringify(data));

                db.Medium
                    .findAll({
                        limit: 10,
                        order: [["createdAt", "DESC"]]
                    })
                    .then(data => {
                        // data is an array of objects
                        // deep clone it into a deliverable variable
                        dataObject.new = JSON.parse(JSON.stringify(data));

                        // Promise(
                        getBookInfoByISBN(dataObject, res);
                        // ).then(dataDeliverable => {
                        // console.log(dataDeliverable);
                        // });
                    });
                // .then(() => {
                //     res.json(dataObject);
                // });
            });
    });
};
