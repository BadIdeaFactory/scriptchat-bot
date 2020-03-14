'use strict';

const s3 = require('./lib/s3');
const slack = require('./lib/slack');
const querystring = require('querystring');

function respond(code, payload) {
  return {
    statusCode: code,
    body: JSON.stringify(payload)
  };
}

module.exports.handler = async event => {
  try {
    // validate request
    if (!slack.validateRequest(event)) {
      throw new Error('Slack request validation failed.');
    }

    // parse request
    const request = querystring.parse(event.body);

    // get history
    const history = await slack.getChannelHistory(request.channel_id);

    // make file name
    const file = `${request.team_id}-${request.channel_id}-${
      history.messages[0].ts
    }-${history.messages[history.messages.length - 1].ts}.json`;

    // put history
    await s3.putData(file, history);

    // get signed key
    const key = s3.getSignedKey(file);

    // respond to user
    return respond(200, {
      // response_type: 'in_channel',
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `I made this into <https://test.com?key=${key}|a script>.`
          }
        }
      ]
    });
  } catch (e) {
    console.error(e);

    return respond(200, {
      text: 'Sorry! Something went wrong with the script making.'
    });
  }
};
