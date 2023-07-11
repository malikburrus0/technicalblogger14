const router = require("express").Router();
const User = require("../../models/User");

router.get("/", async (req, res) => {
  try {
    const userData = await User.findAll();
    res.status(200).json(userData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/:id", async( req,res) =>{
  try {
    const userData = await User.findAll();
    if(!userData) {
      res.status(404).json({message: "No user found"});
      return;
    };

  res.status(200).json(userData);
  } catch (error) {
    res.status(500).json(error)
  }
});

router.post('/', async(req,res) =>{
  try {
    const userData = await User.create(req.body);

    req.session.save(() =>{
      req.session.user_id = userData.id;
      req.session.logged_in = true;

      res.status(200).json(userData)
    });
  } catch (error) {
    res.status(400).json(error)
  }
});

router.post("/login", async (req, res) => {
  try {
    const userData = await User.findOne({ where: { email: req.body.email} });

    if (!userData) {
      res.status(400).json({ message: "Incorrect email address and/or password, please try again."});
      return;
    }

    const validPassword = await userData.checkPassword(req.body.password);

    if (!validPassword) {
      res.status(400).json({ message: "Incorrect email address and/or password, please try again."})
      return;
    }

    req.session.save(() =>{
      req.session.user_id = userData.id,
      req.session.logged_in = true;

      res.json({ user: userData, message: "You have logged in!"});
    });
  } catch (error) {
    res.status(400).json(error);
  }
});

router.post("/logout", (req, res) =>{
  if (req.session.logged_in) {
    req.session.destroy(() =>{
      res.status(200).end("You have succesfully logged out!");
    });
  }else {
    res.status(404).end();
  }
});

router.delete("/:id", async(req, res) =>{
  try {
    const userData = await User.destroy({
      where: {
        id: req.params.id
      },
    });

    if (!userData) {
      res.status(404).json({ message: "No user found with this id!"});
      return;
    }

    res.status(200).json(userData);
  } catch (error) {
    res.status(500),json(error);
  }
})


module.exports = router;