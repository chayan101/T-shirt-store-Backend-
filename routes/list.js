var express = require('express')
var router = express.Router();
const {getList, addItem, getFamlist, addFamlist, famShoppingList} = require("../controllers/list");


router.get("/list" , getList);

router.post("/list" , addItem);

router.get("/famlist" , getFamlist);

router.post("/addfam", addFamlist);

router.get("/famShoppingList/:id" , famShoppingList)

module.exports = router;
