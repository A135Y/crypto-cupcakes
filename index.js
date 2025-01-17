require('dotenv').config('.env');
const cors = require('cors');
const express = require('express');
const app = express();
const morgan = require('morgan');
const { PORT = 3000 } = process.env;
const { User, Cupcake } = require('./db');
const { SECRET, BASE_URL, ISSUER_BASE_URL, CLIENT_ID } = process.env;
const { auth, requiresAuth } = require('express-openid-connect');
const { getUser } = require("./middleware/getUser")

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: SECRET,
  baseURL: BASE_URL,
  clientID: CLIENT_ID,
  issuerBaseURL: ISSUER_BASE_URL
};

// middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(auth(config))
app.use(getUser);

app.get("/", (req, res, next) => {
  try {
    res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
  }
  catch (error) {
    console.log(error)
    next(error)
  }
}
);


app.get("/profile", requiresAuth(), (req, res, next) => {
  try {
    console.log(req.user)
    res.send(req.user)
  }
  catch (error) {
    console.log(error)
    next(error)
  }
})



app.get('/cupcakes', async (req, res, next) => {
  try {
    const cupcakes = await Cupcake.findAll();
    console.log(cupcakes)
    res.send(cupcakes);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

app.use((error, req, res, next) => {
  console.error('SERVER ERROR: ', error);
  if (res.statusCode < 400) res.status(500);
  res.send({ error: error.message, name: error.name, message: error.message });
});

app.listen(PORT, () => {
  console.log(`Cupcakes are ready at http://localhost:${PORT}`);
});



// auth router attaches /login, /logout, and /callback routes to the baseURL

// req.isAuthenticated is provided from the auth router



/* *********** YOUR CODE HERE *********** */
// follow the module instructions: destructure config environment variables from process.env
// follow the docs:
// define the config object
// attach Auth0 OIDC auth router
// create a GET / route handler that sends back Logged in or Logged out

// error handling middleware
