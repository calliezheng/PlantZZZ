const express = require("express");
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors());

const db = require("./models");

const homeRouter = require("./routes/home");
app.use("/home", homeRouter);

const learnRouter = require("./routes/learn");
app.use("/learn", learnRouter);

const profileRouter = require("./routes/profile");
app.use("/profile", profileRouter);

const plantRouter = require("./routes/plant");
app.use("/plant", plantRouter);

db.sequelize.sync().then(() => {
    app.listen(3001, () => {
        console.log(`Server running on port 3001`);
});
});


