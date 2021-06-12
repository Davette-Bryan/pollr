const models = require("../models/pollModels");
const bcrypt = require ('bcrypt');

const userController = {};

userController.createUser = (req, res, next) => {
  try {
    console.log('req.body', req.body);
    const saltRounds = 10;
    const password = req.body.password;
    bcrypt.hash(password, saltRounds, async function(err, hash) {
      if(err) return console.log('Got bcrypt error :', err);
      const user = {
        username : req.body.username,
        password : hash,
        pollCreator : false,
        pollsList: [] 
      }
        //create new user with username and pass
        const newUser = await models.User.create(user);
        //check on this later
        res.locals.user = newUser._id;
        next();
      })
  }
  catch(err) {
    next({log: 'ERROR from userController.createUser',
  message: {err: `Did not create user properly ERROR: ${err}`}})
  }
};

userController.verifyUser = async (req, res, next) => {
    try{
      const {username, password} = req.body;
      //(find) checks for user with input username
      const user = await models.User.find({username: username});
      //compare plaintext input password with password in db
      const hashedPassword = user[0].password;
      console.log('user', user)
      bcrypt.compare(password, hashedPassword, (err, results) => {
        if (err) console.log(`bcrypt error ${err}`)
        res.locals.verified = results;
        console.log('results', results);
        next();
      })
    }
    catch(err){
        next({log: 'ERROR from userController.verifyUser',
        message: {err: `Could not verify user ERROR: ${err}`}
      })
    }
}

module.exports = userController;