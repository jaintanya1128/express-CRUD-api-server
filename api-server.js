const express = require("express");
const users = require("./Users");
const uuid = require("uuid");

//init express
const app = express();

//setting up the port for server
const PORT = process.env.PORT || 5000;

//initialize the Body Parser Middleware
app.use(express.json()); //this will handle raw json

//to handle form submittions
app.use(express.urlencoded({ extended: false })); //extended is set to false to handle the url encoded data.

/*** will create a route : rest api with all CRUD operations  ****/

//get all the user list
app.get("/api/users", (req, res) => res.json(users));
//to test this api, u can also go to postman and make a get reqest to get the respose in json format

//get single user details
app.get("/api/users/:id", (req, res) => {
  //res.send(req.params.id)
  const found = users.some(user => user.id === parseInt(req.params.id));
  if (found) {
    res.json(users.filter(user => user.id === parseInt(req.params.id)));
  } else {
    res
      .status(400)
      .json({ msg: `No user found with the user id as ${req.params.id}` });
  }
});

//add a single user details on the server, we make a post request,
//however this will just be a dummy call as we are not actually saving the data on the server or updating the file
//we can use the same route as long as the methods are different
app.post("/api/users", (req, res) => {
  //res.send(req.body); //we do not get anything in resposnse as we need to parse the body content sent in the request.
  //earlier we needed a third party parser, however now in new express versions, we just need to initialise the inbuild body parser

  const newMember = {
    id: uuid.v4(),
    name: req.body.name,
    email: req.body.email
  };

  if (!newMember.name || !newMember.email) {
    return res.status(400).json({ msg: "Please provide name and email" });
  }

  users.push(newMember);
  res.send(users);
});

//update a user data
app.put("/api/users/:id", (req, res) => {
  const found = users.some(user => user.id === parseInt(req.params.id));
  if (found) {
    const updateUser = req.body;

    users.forEach(user => {
      if (user.id === parseInt(req.params.id)) {
        user.name = updateUser.name ? updateUser.name : user.name;
        user.email = updateUser.email ? updateUser.email : user.email;
      }

      res.json({ msg: "User details updated", user: user });
    });
  } else {
    res
      .status(400)
      .json({ msg: `No user found with the user id as ${req.params.id}` });
  }
});

//delete a user
app.delete("/api/users/:id", (req, res) => {
  //res.send(req.params.id)
  const found = users.some(user => user.id === parseInt(req.params.id));
  if (found) {
    res.json({
      msg: "user is deleted successfully",
      users: users.filter(user => user.id !== parseInt(req.params.id))
    });
  } else {
    res
      .status(400)
      .json({ msg: `No user found with the user id as ${req.params.id}` });
  }
});

//listen to the server on the port
app.listen(PORT, () => console.log(`Server is listening to ${PORT}`));
