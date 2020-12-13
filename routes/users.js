const router = require("express").Router();

/* GET users listing. */
router.get("/", require("../controllers/users").get);
router.get("/:id", require("../controllers/users").getById);

module.exports = router;
