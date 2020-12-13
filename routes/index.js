const router = require("express").Router();
const checkAuth = require("../middleware/checkAuth");

console.log("HOME");

router.get("/", require("../controllers/home").get);
router.get("/login", require("../controllers/login").get);
router.post("/login", require("../controllers/login").post);
router.post("/logout", require("../controllers/logout").post);
router.get("/chat", checkAuth, require("../controllers/chat").get);

module.exports = router;
