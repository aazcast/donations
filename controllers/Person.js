const PeopleModel = require('../models/people');

exports.getPerson = async (req, res, next) => {
  try {
    res.json({success: true}).status(201);
  } catch (err) {
    next(err);
  }
}

exports.importPerson = async (req, res, next) => {
  try {
    let data = req.body;
    for (let i = 0; i < data.length; i++) {
      let item = data[i];
      let finalitem = {};
      let name = item.name;
      let firstname = name.split(" ")[0];
      let lastname = name.replace(firstname, '');

      finalitem.name = firstname;
      finalitem.lastname = lastname;
      finalitem.years = item.year;
      finalitem.type = item.type;
      if (item.shoes !== "") {
        finalitem.shoes_size = item.shoes;
      }
      if (item.shoes !== "") {
        finalitem.shirt_size = item.shirt;
      }
      if (item.shoes !== "") {
        finalitem.pants_size = item.pants;
      }
      await PeopleModel.query().insertGraph(finalitem);
    }
    res.json({success: true}).status(201);
  } catch (err) {
    next(err);
  }
}