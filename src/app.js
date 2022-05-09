;import express from 'express'

export const app = express()

app.set('view engine', 'ejs')

app.use(express.static('public'))
app.use(express.urlencoded({extended: true}))

app.get('/', async (req, res) => {
  const todos = []

  res.render('index', {
    title: 'What is your speed?',
    todos,
  })
})

app.use((req, res) => {
  console.log('404', req.method, req.url)

  res.render('404')
})

