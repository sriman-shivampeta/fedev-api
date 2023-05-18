const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

router.get('/', async (req, res) => {
  // res.send('We are on posts');
  try {
    const getAllPosts = await Post.find().exec();
    res.send({status: 200, data: getAllPosts});
  } catch (error) {
    res.status(500).send({ message: error });
  }
});

router.post('/', async (req, res) => {
  const post = new Post({
    title: req.body.title,
    description: req.body.description
  });

  try {
    const savePostData = await post.save();
    res.json(savePostData);
  } catch (error) {
    response.status(500).json({ message: error });
  }
});

router.get('/:postId', async (req, res) => {
  try {
    const getByPostId = await Post.findById(req.params.postId);
    res.json(getByPostId);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

router.delete('/:postId', async (req, res) => {
  try {
    const deleteByPostId = await Post.deleteOne({ _id: req.params.postId });
    res.json(deleteByPostId);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

router.put('/:postId', async (req, res) => {
  try {
    const findByPostId = await Post.findById(req.params.postId);
    findByPostId.set(req.body);
    const result = await findByPostId.save();
    res.send(result);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

module.exports = router;