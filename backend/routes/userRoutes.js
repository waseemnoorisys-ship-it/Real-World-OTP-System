const express = require("express")

const verifyJWT = require("../middleware/verifyJWT")

const { getMe } = require("../controllers/userController")

const router = express.Router()

router.get("/me", verifyJWT, getMe)

module.exports = router