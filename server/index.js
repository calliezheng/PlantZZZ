const express = require("express");
const app = express();

const db = require("./models");
app.use(express.json());

const learnRouter = require("./routes/learn");
app.use("/learn", learnRouter);

db.sequelize.sync().then(() => {
    app.listen(3001, () => {
        console.log("Server running on port 3001");
    });
});


