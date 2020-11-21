const PeopleModel = require('../models/people');
const UserModel = require('../models/users');
const UserGiftsModel = require('../models/users_gifts');
const dayjs = require('dayjs');
const { raw } = require('objection');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

const emailHandler = require('../handlers/email');


exports.getRandomPerson = async (req, res, next) => {
  try {
    const type = req.body.type;
    const person = await PeopleModel.query().select().where('type', type).andWhere('status', 1).orderBy(raw('random()')).limit(1);
    let success = true;
    if (person[0]) {
      await PeopleModel.query().update({status: 2, assigned_at: dayjs().format()}).where('id', person[0].id);
    } else {
      success = false
    }
    res.json({success, person}).status(201);
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

exports.assignPerson = async (req, res, next) => {
  try {
    const data = req.body;
    //crear user
    let user = {
      name: data.user.name,
      email: data.user.email,
      phone: data.user.phone
    }
    const userCreated = await UserModel.query().insertGraph(user);
    //assign person
    await UserGiftsModel.query().insertGraph({user_id: userCreated.id, person_id: data.person.id});
    await PeopleModel.query().update({status: 3, assigned_at: dayjs().format() }).where('id', data.person.id)
    const theperson = await PeopleModel.query().findOne({'id' : data.person.id});

    //send email to user
    const dataEmail = {
      template: 'confirmation',
      template_data: {
        person: theperson,
        name: data.user.name
      },
      mail_details: {
        to: data.user.email,
        subject: 'Confirmación de Donación'
      }
    }
    await emailHandler.sendEmail(dataEmail);
    //send sms
    await client.messages
      .create({
        body: `Gracias por apoyar en esta Navidad! Recuerda llevar el regalo con el # de identificador: ${data.person.id}`,
        from: '+13614901812',
        to: data.user.phone
      });

    res.json({success: true}).status(201);
  } catch (err) {
    next(err);
  }
}