import express from 'express'
import { sendCurrentData } from "./websockets.js";

export const app = express()

app.set('view engine', 'ejs')

app.use(express.static('public'))
app.use(express.urlencoded({extended: true}))

app.get('/', async (req, res) => {
  res.render('index', {
    title: 'What is your speed?',
  })
})

app.post('/', async (req, res) => {
  const url = req.body.formUrl;

  res.render('index', {
    title: `What is the speed of ${url}`,
  })
})

app.get('/data', async (req, res, next) => {
  sendCurrentData()

  res.end()
})

app.use((req, res) => {
  res.status(404)
  res.send()
})

