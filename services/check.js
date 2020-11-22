const PeopleModel = require('../models/people');
const dayjs = require('dayjs');

exports.check = async () => {
  try {
    const people = await PeopleModel.query().select().where('status', 2);
    for (let i =0; i < people.length; i++) {
      let item = people[i];
      const date1 = dayjs(item.assigned_at);
      const now = dayjs().format();
      const date2 = dayjs(now);
      const minutes = date2.diff(date1, 'minute');
      if (minutes > 15) {
        await PeopleModel.query().update({status: 1}).where('id', item.id);
      }
    }
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}