const mongodb = require("./db");
const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const cookieparser = require("cookie-parser");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 8000;
require("dotenv").config({ path: "./process.env" });

mongodb()
  .then(() => {
    app.use(
      cors({
        origin: 'https://rentify-frontend-taupe.vercel.app',
        credentials:true
      })
    );
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(cookieparser());
    app.get("/", (req, res) => {
      res.send("Hello World!");
    });

    // Routes

    app.listen(port, () => {
      console.log(`Rentify is listening on port ${port}`);
    });
    app.use("/api", require("./Routes/register"));
    app.use("/api", require("./Routes/login"));
    app.use("/api", require("./Routes/logout"));
    app.use("/api", require("./Routes/authstatus"));
  })
  .catch((err) => {
    console.log(err);
  });
