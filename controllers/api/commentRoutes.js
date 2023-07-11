const router = require("express").Router();
const Comment = require("../../models/Comment");
const authorization = require("../../utils/auth");

router.get("/", authorization, async (req, res) => {
  try {
    const commentData = await Comment.findAll();
    res.status(200).json(commentData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/", authorization, async (req, res) =>{
  try {
    const newComment = await Comment.create({
      ...req.body,
      user_id: req.session.user_id,
      review_id: req.session.review_id,
    });

    res.status(200).json(newComment);
  } catch (error) {
    res.status(400).json(error);
  }
});

router.put("/", authorization, async(req,res) =>{
  try {
    Comment.update(
      {
        ...req.body
      },
      {
        where: {
          id: req.params.id,
          user_id: req.session.user_id,
          review_id: req.session.review_id,
        },
      }
    ).then((updatedComment) =>{
      res.status(200).json(updatedComment);
    })
  } catch (error) {
    res.status(500).json(error);
  }
});

router.delete(":/id", authorization, async(req,res) =>{
  try {
    const commentData = await Comment.destroy({
      where: {
        id: req.params.user_id,
        user_id: req.session.user_id,
        review_id: req.session.review_id,
      },
    });
    if(!commentData){
      res.status(404).json({message: "No comment found"});
    }

    res.status(200).json(commentData)
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;