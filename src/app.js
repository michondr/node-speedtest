import express from 'express'
import { sendCurrentData } from "./websockets.js";

export const app = express()

app.set('view engine', 'ejs')

app.use(express.static('public'))
app.use(express.urlencoded({extended: true}))

app.get('/', async (req, res) => {
  const asd = 'das' //TODO: target url

  res.render('index', {
    title: `What is your speed to ${asd} ?`,
    sliderCurrentFileSize: 10,
  })
})

app.post('/', async (req, res) => {
  const maxSizePowerOf2 = req.body.maxFileSize;

  console.log(maxSizePowerOf2)

  res.render('index', {
    title: `What is the speed?`,
    sliderCurrentFileSize: maxSizePowerOf2,
  })
})

app.get('/data', async (req, res) => {


  sendCurrentData()

  res.end()
})

app.use((req, res) => {
  res.status(404)
  res.send()
})

