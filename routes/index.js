const express = require('express');
const router = express.Router();

//Controllers
const Person = require('../controllers/Person');

//Person routes -
router.post('/getperson', Person.getPerson);

module.exports = router;
