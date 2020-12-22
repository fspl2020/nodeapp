const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = mongoose.model('User');

const router = express.Router();



router.post('/signup', async (req, res) => {
  const { mobile, name, password } = req.body;

  try {
    const user = new User({ mobile, name, password});
    await user.save();

    const token = jwt.sign({ userId: user._id }, 'MY_SECRET_KEY');
    res.send({ token });
  } catch (err) {
    return res.status(422).send(err.message);
  }
});






router.post('/cksignin', async (req, res) => {
  const { mobile } = req.body;
  
 
   const user = await User.findOne({ mobile });
   
  if (user) {
   
    res.send(user);
  }
 else
 {
	 	  res.send([]);	
	 	  //return res.status(422).send({ error: 'Invalid User' });
 }

});




router.post('/signin', async (req, res) => {
  const { mobile, password } = req.body;

  if (!mobile || !password) {
    return res.status(422).send({ error: 'Must provide mobile and password' });
  }

  const user = await User.findOne({ mobile });
  if (!user) {
    return res.status(422).send({ error: 'Invalid password or mobile' });
  }

  try {
    await user.comparePassword(password);
    const token = jwt.sign({ userId: user._id }, 'MY_SECRET_KEY');
    res.send({ token });
  } catch (err) {
	  console.log('aaaaaaa');
console.log(err);
console.log('bbbbbbbbb');
    return res.status(422).send({ error: 'Invalid password or mobile' });
  }
});

module.exports = router;
