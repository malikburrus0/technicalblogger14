const router = require("express").Router();
const Blog = require("../../models/Blog");
const authorization = require("../../utils/auth")

router.get("/", authorization, async (req, res) => {
  try {
    const blogData = await Blog.findAll();
    res.status(200).json(blogData);
  } catch (err) {
    res.status(500).json(err);
  }
});


router.post("/", authorization, async(req, res) =>{
  try {
    const newBlog = await Blog.create({
      ...req.body,
      user_id: req.session.user_id
    })

    res.status(200).json(newBlog)
  } catch (error) {
    res.status(400).json(error)
  }
});

router.put("/:id", authorization, async(req, res) => {
  try {
    Blog.update({
      ...req.body
    },
    {
      where: {
        id: req.params.id,
        user_id: req.params.user_id,
      },
    },
  )
  .then((updatedBlog) => {
    res.json(updatedBlog)
  });

  } catch (error) {
    res.json(error)
  };
});

router.delete("/:id", authorization, async(req, res) =>{
  try {
    const blogData = await Blog.destroy({
      where: {
        id: req.params.id,
        user_id: req.params.user_id,
      },
    });

  if (!blogData) {
    res.status(404).json({message: "No blog found with this id!"});
    return
  }
  res.status(200).json(blogData)
  } catch (error) {
    res.status(500).json(err)
  }
})

module.exports = router;