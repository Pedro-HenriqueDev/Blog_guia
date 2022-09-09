const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connection =  require('./database/database')
const session = require('express-session');

const categoriesControler = require('./categories/categoriesController')
const articleController = require('./articles/articlesController')
const usersController = require("./users/userController")

const Article = require('./articles/Article')
const Category = require('./categories/Categories')
const User = require("./users/User")
// view engine
app.set('view engine', 'ejs');

// Session
app.use(session({
    secret: '2C44-4D44-WppQ38S',
    cookie: {maxge: 1000 * 60},
    resave: false,
    saveUninitialized: false
}));


// Static files
app.use(express.static('public'));

// Body parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Database
connection
    .authenticate()
    .then(() => {
        console.log("Conexão estabelecida")
    }).catch((err) => {
        console.log("Erro" + err)
    });

app.get('/', (req,res) => {
    Article.findAll({
        order: [
            ["id", "DESC"]
        ],
        limit: 4
    }).then(articles => {
        Category.findAll().then(category => {
            res.render('index', {articles: articles, categories: category})
        })
        
    })
});
app.get('/:slug', (req, res) => {
    let slug = req.params.slug

    Article.findOne({
        where: {
            slug: slug
        }
    }).then(article => {
        if(article != undefined){
            Category.findAll().then(category => {
                res.render('article', {articles: article, categories: category})
            })
        }
    })
})

app.get("/category/:slug", (req,res) => {
    let slug = req.params.slug;

    Category.findOne({
        where: {slug: slug},
        include: [{model: Article}]

    }).then(category => {
        if(category != undefined)  {
            Category.findAll().then(categories => {
                res.render('index', {
                    articles: category.articles,
                    categories: categories
                })
            })
        } else {
            res.redirect('/');
        }
    }).catch( err => {
        res.redirect('/')
    })
})
    // Usar rotas desse arquiv0
app.use('/', categoriesControler);
app.use('/', articleController);
app.use('/', usersController);

app.listen(8080, () => {
    console.log('Server is runniging on port 8080');
});