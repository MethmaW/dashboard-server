const router = require("express").Router();
const fetch = require("node-fetch");

const getEquipments = async (req, res) => {
	try {
		const response = await fetch(
			"http://ivivaanywhere.ivivacloud.com/api/Asset/Asset/All?apikey=SC:demo:64a9aa122143a5db&max=10&last=0",
			{
				method: "GET",
				headers: { "Content-Type": "application/json" },
			}
		);

		const data = await response.json();

		res.json({
			success: true,
			msg: "Data fetched successfully!",
			data: data,
		});
	} catch (error) {
		res.json({
			success: false,
			msg: "Server error, Please contact support",
		});
	}
};

router.get("/", getEquipments);

module.exports = router;
