var db = require("../models");
var axios = require("axios");

module.exports = app => {
	// GET route for BOOK page
	// curl -i -H "Content-Type: application/json" -X GET http://localhost:3000/media/book/9781781100523
	app.get("/media/:mediaType/:industryIdentifier", (req, response) => {
		var query = {};
		query.mediaType = req.params.mediaType;
		query.industryIdentifier = req.params.industryIdentifier;

		db.Medium
			.findAll({
				where: query
			})
			.then(data => {
				var dataDeliverable = JSON.parse(JSON.stringify(data[0]));

				console.log(dataDeliverable);
				response.render("book", dataDeliverable);
			});
	});

	// POST route for adding a new BOOK to the database
	// curl -H "Content-Type: application/json" -X POST -d '{"mediaType": "book", "industryIdentifier":"9780606323499"}' http://localhost:3000/api/media/new
	app.post("/api/media/new", (req, res) => {
		// console.log(req.body);

		var newMedium = {};
		newMedium.mediaType = req.body.mediaType;

		if (newMedium.mediaType === "book") {
			var isbn = req.body.industryIdentifier;
			newMedium.industryIdentifier = isbn;
		}

		var queryURL =
			"https://www.googleapis.com/books/v1/volumes?q=isbn:" + isbn;

		axios({
			method: "get",
			url: queryURL
		})
			.then(response => {
				if (response.status === 200) {
					var parsedBody = response.data;
					volumeInfo = parsedBody.items[0].volumeInfo;
					console.log(volumeInfo);

					newMedium.title = volumeInfo.title;
					newMedium.author = volumeInfo.authors[0];
					newMedium.summary = volumeInfo.description;

					if (volumeInfo.imageLinks) {
						newMedium.image = volumeInfo.imageLinks.thumbnail;
					} else {
						newMedium.image = "/assets/img/placeholder.gif";
					}

					newMedium.totalStock = 10;
					newMedium.numShelved = 10;
				}
			})
			.then(() => {
				return db.Medium.create(newMedium);
			})
			.then(data => {
				res.json(data);
			});
	}); // app.post
};
