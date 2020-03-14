const fetch = require('node-fetch');
const slackValidateRequest = require('validate-slack-request');
const querystring = require('querystring');

const SLACK_API_URL = 'https://slack.com/api/';
const SLACK_TOKEN = process.env.SLACK_TOKEN;
const SLACK_SIGNING_SECRET = process.env.SLACK_SIGNING_SECRET;

async function callMethod(method, params) {
  const response = await fetch(`${SLACK_API_URL}${method}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    body: querystring.stringify({
      token: SLACK_TOKEN,
      ...params
    })
  });

  return response.json();
}

async function getChannelHistory(channelId) {
  return callMethod('conversations.history', {
    channel: channelId
  });
}

function validateRequest(event) {
  // assembles an Express.js style request object which the validator expects
  const req = new Map(Object.entries(event.headers));
  req.body = querystring.parse(event.body);

  return slackValidateRequest(SLACK_SIGNING_SECRET, req);
}

exports.getChannelHistory = getChannelHistory;
exports.validateRequest = validateRequest;
