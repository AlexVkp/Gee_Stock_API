var express = require('express');
var router = express.Router();
const api_sales= require("../controllers/api_sales");


router.post('/Insert/Sales', api_sales.insert_sales);



module.exports = router;