const path = require("path");
const express = require("express");
const session = require("express-session");
const routes = require("./controllers");
const sequelize = require("./config/connection");

const app = express();
const PORT = process.env.PORT || 3001;

const SequelizeStore = require("connect-session-sequelize")(session.Store);

const sess = {
  secret: "secret",
  cookie: {
    maxAge: 10,
    httpOnly: true,
    secure: false,
    sameSite: "strict",
  },
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize,
  }),
};
app.use(session(sess));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log(`Listening at http://localhost:${PORT}`));
});