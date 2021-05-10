const router = require("express").Router();
const fetch = require("node-fetch");
const redis = require("redis");

//creating redis client
const client = redis.createClient({
	port: process.env.REDIS_PORT,
	host: process.env.REDIS_HOST,
	password: process.env.REDIS_PASSWORD,
});

//getting chached equipemnt data
const getChacheData = (req, res, next) => {
	const { max, last } = req.params;

	//checking if the max value is equal to cached max value
	(() => {
		client.get("max", (err, data) => {
			if (err) throw err;
			if (data == null) next();
			if (data !== max) next();

			if (data === max) {
				getLastValue();
			}
		});
	})();

	//checking if the last value is equal to cached last value
	const getLastValue = () => {
		client.get("last", (err, data) => {
			if (err) throw err;
			if (data == null) next();
			if (data !== last) next();

			if (data === last) {
				getAllEquipemnts();
			}
		});
	};

	//getting equipment data if chached max value and last value are equal to current max and last value
	const getAllEquipemnts = () => {
		client.get(`allEquipments`, (err, data) => {
			if (err) throw err;
			if (data == null) next();
			if (data !== null) {
				const par = JSON.parse(data);
				res.json({
					success: true,
					msg: "Fetched cached data successfully!",
					data: par,
				});
			}
		});
	};
};

const getEquipments = async (req, res) => {
	try {
		const { max, last } = req.params;

		//fetching equipment data from the external api
		const response = await fetch(
			`http://ivivaanywhere.ivivacloud.com/api/Asset/Asset/All?apikey=${process.env.API_KEY}&max=${max}&last=${last}`,
			{
				method: "GET",
				headers: { "Content-Type": "application/json" },
			}
		);

		const data = await response.json();
		const redisValue = JSON.stringify(data);

		//setting max value in redis
		client.set(`max`, max, function (err, reply) {
			if (err) throw err;
			//console.log("Saved max status: ", reply);
		});

		//setting last value in redis
		client.set(`last`, last, function (err, reply) {
			if (err) throw err;
			//console.log("Saved last status: ", reply);
		});

		//setting equipment data in redis
		client.set(`allEquipments`, redisValue, function (err, reply) {
			if (err) throw err;
			//console.log("Saved data status: ", reply);
		});

		res.json({
			success: true,
			msg: "Data fetched successfully!",
			data: data,
		});
	} catch (error) {
		res.json({
			success: false,
			msg: "Server error, Please contact support",
			data: error,
		});
	}
};

router.get("/:max/:last", getChacheData, getEquipments);

module.exports = router;
