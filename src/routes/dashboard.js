const router = require("express").Router();
const fetch = require("node-fetch");

const getEquipments = async (req, res) => {
	try {
		const max = 100;
		let last = 0;
		let isNotEmpty = true;
		let data = [];

		while (isNotEmpty) {
			//fetching equipment data from the external api
			const response = await fetch(
				`http://ivivaanywhere.ivivacloud.com/api/Asset/Asset/All?apikey=${process.env.API_KEY}&max=${max}&last=${last}`,
				{
					method: "GET",
					headers: { "Content-Type": "application/json" },
				}
			);

			const responseData = await response.json();
			isNotEmpty = responseData.length !== 0;

			if (isNotEmpty) {
				data = data.concat(responseData);
				last = responseData[responseData.length - 1].__rowid__;
			}

			console.log("last", last);
			console.log("isNotEmpty", isNotEmpty);
		}

		res.json({
			success: true,
			msg: "Data fetched successfully!",
			length: data.length,
			data: data,
		});
	} catch (error) {
		console.log(error);
		res.json({
			success: false,
			msg: "Server error, Please contact support",
			data: error,
		});
	}
};

router.get("/", getEquipments);

module.exports = router;
