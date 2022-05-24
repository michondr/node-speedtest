import 'dotenv/config'
import express from 'express'
import crypto from 'crypto'

export const app = express()

app.locals.appUrl = process.env.APP_URL
app.set('view engine', 'ejs')

app.get('/', async (req, res) => {
  res.render('index', {
    title: `What is your speed to ${process.env.TARGET} ?`,
    sliderCurrentFileSize: 10,
  })
})

app.get('/download/:bytesLength', async (req, res) => {

  // const data = crypto.randomBytes(
  //   Number(req.params.bytesLength),
  // )

  const data = Buffer.alloc(Number(req.params.bytesLength));

  res.send(data)
  res.end()
})

app.post('/upload', express.raw({limit: '1gb'}), async (req, res) => {

  const bitesReceived = req.body.length / 8

  res.send({bitesReceived})
})

app.use((req, res) => {
  res.status(404)
  res.send()
})

