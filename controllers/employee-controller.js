var db = require("../models");

module.exports = app => {
	app.get("/manage", (req, res) => {
		res.render("manage");
	});

	//GET user info
	//curl -i -H "Content-Type: application/json" http://localhost:3000/users/2
	app.get("/manage/users/:userId", (req, res) => {
		// this object is given to the front end
		let dataDeliverable = {};
		let userId = parseInt(req.params.userId);

		db.User
			// find all info for the and add it to the deliverable
			.findAll({
				where: { id: userId }
			})
			.then(data => {
				dataDeliverable.userData = JSON.parse(JSON.stringify(data[0]));
			})
			// then find all reservations made by the user and add it to the deliverable
			.then(() => {
				return db.Reservation.findAll({
					where: { UserId: req.params.userId },
					include: [db.Medium]
				});
			})
			.then(data => {
				dataDeliverable.reservations = JSON.parse(JSON.stringify(data));
			})
			// then find all items favorited by the user and add them to the deliverable
			.then(() => {
				return db.Favorite.findAll({
					where: { UserId: req.params.userId },
					include: [db.Medium]
				});
			})
			.then(data => {
				dataDeliverable.favorites = JSON.parse(JSON.stringify(data));
			})
			// then find all checkout history for the user and add it to the deliverable
			.then(() => {
				return db.CheckOutHistory.findAll({
					where: { UserId: req.params.userId },
					include: [db.Medium]
				});
			})
			.then(data => {
				dataDeliverable.checkOutHistories = JSON.parse(
					JSON.stringify(data)
				);
			})
			// then find all reviews written by the user and add them to the deliverable
			.then(() => {
				return db.Review.findAll({
					where: { UserId: req.params.userId },
					include: [db.Medium]
				});
			})
			.then(data => {
				dataDeliverable.reviews = JSON.parse(JSON.stringify(data));
			})
			.then(() => {
				// set a counter for the loop
				let counter = 0;
				var target = dataDeliverable.reservations.length;

				// for each reservation the user has made
				dataDeliverable.reservations.forEach(reservation => {
					let mediumId = reservation.MediumId;

					// find all reservations made for that item
					db.Reservation
						.findAll({ where: { MediumId: mediumId } })
						.then(data => {
							// then for each reservation find the user's position in line and add it to the deliverable
							data.forEach((item, index) => {
								if (item.UserId === userId) {
									reservation.position = index + 1;
								}
							});

							// add information to the deliverable about the user's reservation status for each item
							if (
								reservation.position >
								reservation.Medium.numReserved
							) {
								reservation.reservationStatus =
									"Position " +
									reservation.position +
									" on Waitlist";
							} else {
								reservation.reservationStatus =
									"Ready to Pick Up";
							}

							// increment the counter
							counter++;
							// if the counter has reached the target, return the deliverable to the front end and render the user page
							if (counter === target) {
								// res.json(dataDeliverable);
								res.render("manage-users", dataDeliverable);
							}
						});
				});
			});
	});

	//DELETE a user
	//Call global delete froute

	//UPDATE A USER's Information
	//comes from req.body - this should be a form that changes user information
	//PUT route for updating a user
	//CURL command:
	//curl -X PUT -H "Content-Type: application/json" -d '{"UserId": 1, "MediumId": 3}' http://localhost:3000/api/checkouthistory/checkin
	app.put("/api/users/update", (req, res) => {
		//Logic to set update Query goes here - similar to media PUT route
		var query = {};
		//fields they can update
		//last name, phone number, all address info, prof pic, is employee

		db.User
			.update(
				{
					updateQuery
				},
				{
					where: {
						id: req.body.id
					}
				}
			)
			.then(data => {
				res.json(data);
			});
	});

	// POST route for adding a new user
	// cURL command:
	// curl -X POST -H "Content-Type: application/json" -d '{"firstName": "it", "lastName":"kazhmere", "userType":"Employee", "phoneNumber":"123-456-7890", "address":"i live here", "emailAddress":"i go here", "isEmployee":false}' http://localhost:3000/api/users/new
	app.post("/api/users/create", (req, res) => {
		console.log(req.body);

		var middleNameInput;
		if (req.body.middleName) {
			middleNameInput = req.body.middleName.trim();
		}

		var isEmployeeInput = false;
		if (req.body.userType === "Employee") {
			isEmployeeInput = true;
		}

		var phoneNumberInput = req.body.phoneNumber.replace(/[^\d]/g, "");

		db.User
			.create({
				//Double check these fields are all correct per the database
				firstName: req.body.firstName.trim(),
				middleName: middleNameInput,
				lastName: req.body.lastName.trim(),
				phoneNumber: req.body.phoneNumber.trim(),
				streetAddress: req.body.streetAddress.trim(),
				city: req.body.city.trim(),
				state: req.body.state.trim(),
				zipCode: req.body.zipCode.trim(),
				emailAddress: req.body.emailAddress.trim(),
				profilePicture: req.body.profilePicture,
				isEmployee: isEmployeeInput
			})
			.then(data => {
				res.json(data);
			});
	});
};
