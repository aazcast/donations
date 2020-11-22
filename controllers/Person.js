const PeopleModel = require('../models/people');
const UserModel = require('../models/users');
const UserGiftsModel = require('../models/users_gifts');
const dayjs = require('dayjs');
const { raw } = require('objection');
const _ = require('lodash');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

const emailHandler = require('../handlers/email');
const Pubnub = require('../handlers/pubnub');

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
    user.name = _.trim(user.name);
    user.email = _.trim(user.email);
    user.phone = _.trim(user.phone);
    let phone = user.phone;
    phone = phone.replace('-','');
    user.phone = '+506' + phone;
    const userCreated = await UserModel.query().insertGraph(user);
    //assign person
    await UserGiftsModel.query().insertGraph({user_id: userCreated.id, person_id: data.person.id});
    await PeopleModel.query().update({status: 3, assigned_at: dayjs().format() }).where('id', data.person.id)
    const theperson = await PeopleModel.query().findOne({'id' : data.person.id});

    //send email to user
    let isfemenino = false;
    let ismasculino = false;
    if (theperson.type === 'F') {
      isfemenino = true;
    }
    if (theperson.type === 'M') {
      ismasculino = true;
    }
    const dataEmail = {
      template: 'confirmation',
      template_data: {
        ismasculino,
        isfemenino,
        person: theperson,
        name: data.user.name
      },
      mail_details: {
        to: data.user.email,
        subject: `Confirmación de Donación #${theperson.id}`
      }
    }
    await emailHandler.sendEmail(dataEmail);
    //send sms
    client.messages
      .create({
        body: `Gracias ${data.user.name} por apoyar en esta Navidad! Lleva el regalo con el # identificador: ${data.person.id}, revisa tu email`,
        from: '+13614901812',
        to: user.phone
      });
    const percent = await _requestPercent();
    await Pubnub.publish('update_people', percent);
    res.json({success: true}).status(201);
  } catch (err) {
    next(err);
  }
}

exports.getPercent = async (req, res, next) => {
  try {
    const percent = await _requestPercent();
    res.json({success: true, percent}).status(201);
  } catch (err) {
    next(err);
  }
}

const _requestPercent = async () => {
  try {
    const count = await UserGiftsModel.query().count();
    let total = 101;
    let precount = count[0].count;
    let percent = (precount / 101) * 100;
    percent = percent.toFixed(2);
    return percent;
  } catch (err) {
    throw err;
  }
}