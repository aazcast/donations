const PubNub = require('pubnub');
let finalpub = null;
let finaluuid = null;
exports.startSocket = () => {
  const uuid = PubNub.generateUUID();
  finaluuid = uuid;
  const pubnub = new PubNub({
    publishKey: process.env.PUBNUB_PUBLIC,
    subscribeKey: process.env.PUBNUB_SUBS,
    uuid: uuid
  });
  finalpub = pubnub;
  return true;
}

exports.publish = (channel, message) => {
  return new Promise((resolve, reject) => {
    const publishConfig = {
      channel: channel,
      message: {"sender": finaluuid, "content": message}
    }
    finalpub.publish(publishConfig, function(status, response) {
      if (status.error === false) {
        resolve(response);
      } else {
        reject(response);
      }
    });
  })
}
