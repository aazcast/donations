const express = require('express');
const router = express.Router();

//Controllers
const Person = require('../controllers/Person');


//Import Person
router.post('/import', Person.importPerson)
//Person routes -
router.post('/getperson', Person.getPerson);

module.exports = router;
