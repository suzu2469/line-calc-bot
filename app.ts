import * as line from '@line/bot-sdk'
import * as express from 'express'
import * as dotenv from 'dotenv'

process.env.NODE_ENV === 'production' ? null : dotenv.config()
const config: line.ClientConfig = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET
}

const app = express()
app.post('/webhook', (req, res, next) => {
  return Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result));
})

const client = new line.Client(config)
const handleEvent = (event: line.WebhookEvent) => {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve
  }

  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: event.message.text
  })
}

app.listen(parseInt(process.env.PORT) || 3000)