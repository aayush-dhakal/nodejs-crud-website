const express = require('express')
const mongoose = require('mongoose')
const articleRouter = require('./routes/articles')
const Article = require('./models/article')
const methodOverride = require('method-override')

const app = express()

mongoose.connect('mongodb://localhost/blog1', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,   // these are all shown in the console to put in here
    useCreateIndex: true
})

// set() have predetermined effects that are described in the Express doc and work like configuration options whereas app.use() registers a middleware callback that will be part of the request handler chain for incoming http requests.

app.set('view engine', 'ejs')

// this is to access the data from web form. if not included then req.body will return undefined
// what this esssentially is saying that we can actually access all of the different parameters from our article form inside of our article route in ./routes/articles.js by just accessing req.body, for title req.body.title
// this has to be above articles route
app.use(express.urlencoded({ extended: false }))

// we can only access GET and POST request from the form so inorder to access PATCH or DELETE we have to use third pary package method-overirde
app.use(methodOverride('_method'))


app.get('/', async (req, res) => {
    // fins all the articles in db
    const articles = await Article.find().sort({ createdAt: 'desc' })

    res.render('articles/index', {
        articles
    })
})

// setting routes for articles. ie if the url begins with /articles then articleRouter will handle the request for it
app.use('/articles', articleRouter)

app.listen(3000)