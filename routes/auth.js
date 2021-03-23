var express = require('express')
var router = express.Router();
const{signupMethod, signinMethod} = require("../controllers/auth");


const { body, validationResult } = require('express-validator');

router.post("/signup", body('email').isEmail(),body('password').isLength({ min: 5 }),body('name').isLength({ min: 2 }) , signupMethod);

router.post("/signin", body('email').isEmail(),body('password').isLength({ min: 5 }), signinMethod);

module.exports = router;
