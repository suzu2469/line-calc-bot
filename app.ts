import * as line from '@line/bot-sdk'
import * as express from 'express'
import * as dotenv from 'dotenv'

process.env.NODE_ENV === 'production' ? null : dotenv.config()
const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET
}

const app = express()
app.post('/callback', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

const client = new line.Client(config)
const handleEvent = (event: line.WebhookEvent) => {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve
  }

  const message = event.message.text
  const numberMatch = message.match(/[0-9]+/g)
  const sum = numberMatch.reduce((p, n) => (parseInt(p) + parseInt(n)).toString())

  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: sum
  })
}

app.listen(parseInt(process.env.PORT) || 3000)