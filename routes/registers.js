const express = require('express');
const router = express.Router();
const Registers = require('../models/Registers');

router.get('/', async (req, res) => {
  try {
    const getRegisterData = await Registers.find().exec();
    res.send(getRegisterData);
  } catch (error) {
    res.status(500).send({ message: error });
  }
});

router.post('/', async (req, res) => {
  const register = new Registers({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  });
  try {
    const saveRegisterData = await register.save();
    res.json(saveRegisterData);
  } catch (error) {
    response.status(500).json({ message: error });
  }
});

// router.get('/:postId', async (req, res) => {
//   try {
//     const getByPostId = await Post.findById(req.params.postId);
//     res.json(getByPostId);
//   } catch (error) {
//     res.status(500).json({ message: error });
//   }
// });

// router.delete('/:postId', async (req, res) => {
//   try {
//     const deleteByPostId = await Post.deleteOne({ _id: req.params.postId });
//     res.json(deleteByPostId);
//   } catch (error) {
//     res.status(500).json({ message: error });
//   }
// });

// router.patch('/:postId', async (req, res) => {
//   try {
//     const findByPostId = await Post.findById(req.params.postId);
//     findByPostId.set(req.body);
//     const result = await findByPostId.save();
//     res.send(result);
//   } catch (error) {
//     res.status(500).json({ message: error });
//   }
// });

module.exports = router;