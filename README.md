# scriptchat-bot

## Setup

```bash
git clone https://github.com/BadIdeaFactory/scriptchat-bot.git
cd scriptchat-bot
npm ci
```

## Deploy

In order to deploy the endpoint run:

```bash
npx serverless deploy
```

To set up an app in Slack,
1. Create an app here: https://api.slack.com/apps
2. Set up as a bot
3. Add a Slash command
4. Set up permissions. Needs: `channels:history`, `commands`, `groups:history`, `im:history`, `mpim:history`, `users:read`
5. Add to a test Slack

You will need an authenticated aws-cli. The default behavior is to use a profile named "personal."

This uses AWS Secret Manager parameters to store secrets. Get the OAuth token from the OAuth & Permissions tab on the Slack App admin and the signing secret from Basic Information tab, then create a scriptchat-bot secret with SLACK_TOKEN and SLACK_SIGNING_SECRET.
