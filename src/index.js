const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const colors = require("colors");

//setting up the app
const app = express();

//configuring dotenv
dotenv.config();

//importing routes
const dashboard = require("./routes/dashboard");

//app middlewear
app.use(cors());
app.use("/api/dashboard", dashboard);

//listening to the app
app.listen(process.env.PORT || process.env.LOCAL, () =>
	console.log(
		colors.yellow.bold(`🚀 Server is running on`),
		colors.yellow.underline(`http://localhost:${process.env.LOCAL}`)
	)
);
