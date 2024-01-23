require("dotenv").config();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.auth = async (req, res, next) => {
  //This auth middleware checks for the authorization header, take the
  //token out of the authorization header, verify that it's valid, if its valid, the data is going to be equal to the
  //to the data to create the token(ID of the user), then we'll take that and use it to find the user of the database if it existed,
  //and store inside req.user so that we can use it in subsequent functions.
  try {
    const token = req.header("Authorization").replace("Bearer ", ""); //The space is to get to the actual token
    const data = jwt.verify(token, process.env.SECRET);
    const user = await User.findOne({ _id: data._id }); //We are taking the id that that's inside line 9 data
    if (!user) {
      throw new Error("bad credentials");
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: error.message }); //the message will say 'bad credentials' from line 12
  }
}; // This is used as a middleware function to verify that the user is authorized to do something

exports.createUser = async (req, res) => {
  try {
    const user = new User(req.body); //The user sends their req.body and we get it in express. Adn then we use the req.body to make the new user in the database. Then we get that data back and it gets saved inside the user, and then we save it to the database. Then we'll generate an auth token, then we'll send back the user data and the token data back to the user. And if we got an error along the way, we'll send back the errror message. //This is the user document. We made a new instance of user to create a document
    //which then saves the documents to the database.
    await user.save();
    const token = await user.generateAuthToken(); //We make the token and use that token to send it back as a response
    res.json({ user, token }); //we're sending back an object with 2 keys. the user and the token.
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });//Looking the user up by email in the database
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
      //compare password that user gives us with hashed password in the database. If its good, we're fine, but if not, it'll throw an error message.
      throw new Error("Invalid Login Credentials");
    } else {
      const token = await user.generateAuthToken();//making a new token for the user that we found after we looked up the user and verified that the password is correct.
      res.json({ user, token });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateUser = async (req, res) => {
    try {
        const updates = Object.keys(req.body)
        updates. forEach(update => req.user(update) = req.body(update)) //req.user is from auth. We are making an array of all the keys, the we call forEach on that array. For each particular thing on the user that we watn to update, we are going to take the corresponding key for the user and change it for the new data inside of req.body. For example, if req.body(password) was new, then we will change req.user(password) to reflect. 
        await req.user.save()
        res.json(user)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

exports.deleteUser = async (req, res) => {
    try {
        await req.user.deleteOne()
        res.sendStatus(204)//204 means it's empty
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}