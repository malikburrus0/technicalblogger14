const router = require("express").Router();
const { User, Blog,} = require("../models");
const authorization = require("../utils/auth");

router.get("/", async (req, res) => {
    try {
      const blogData = await Blog.findAll({
        include: [
          {
            model: User,
            attributes: ["email"]
          },
        ],
      });
      const blogs = blogData.map((blog) => project.get({ plain: true }));

      res.render("homepage", {
        blogs,
        logged_in: req.session.logged_in,
      });
    } catch (err) {
      res.status(500).json(err);
    }
  });

router.get("/blog/:id", async (req, res) => {
    try {
      const blogData = await Blog.findByPk(req.params.id, {
        include: [
          {
            model: User,
            attributes: ["email"]
          },
        ],
      });
      const blog = blogData.get({ plain: true });

      res.render("blog", {
        ...blog,
        logged_in: req.session.logged_in,
      });
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

router.get("/profile", authorization, async (req, res) => {
    try {
      const userData = await User.findByPk(req.session.user_id, {
        attributes: { exclude: ["password"] },
        include: [{ model: Blog }],
      });
      const user = userData.get({ plain: true });

      res.render("profile", {
        ...user,
        logged_in: true,
      });
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

router.get("/login", (req, res) => {
    if (req.session.logged_in) {
      res.redirect("/profile");
      return;
    }
    res.render("login");
  }
);

module.exports = router;