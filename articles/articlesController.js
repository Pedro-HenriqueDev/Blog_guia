const express = require('express');
const router = express.Router();
const Category = require('../categories/Categories')
const Article = require('./Article')
const Slugify = require('slugify');
const { default: slugify } = require('slugify');
const adminAuth = require("../middleware/adminAuthen")

router.get('/admin/articles',adminAuth, (req,res) => {
    Article.findAll({
        include: [{model: Category}]
    }).then(articles => {
        res.render('admin/articles/articles', {articles: articles, user: req.session.user});
    }); 
});

router.post("/articles/delete", (req, res) => {
    let id = req.body.id

    if(id != undefined) {
        if(!isNaN(id)){
            Article.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect("/admin/articles")
            })
        }else {
            res.redirect("/admin/articles");
        }
    }else {
        res.redirect('/admin/articles');
    }
});

router.get('/admin/article/new',adminAuth, (req, res) => {
    Category.findAll().then(categories => {
        res.render('admin/Articles/new', {categories: categories})
    })
});

router.get('/admin/article/update/:id',adminAuth, (req,res) => {
    let id = req.params.id
    if(isNaN(id)){
        res.redirect('/admin/articles')
    }
    if(id != undefined) {
        
            Article.findByPk(id).then(article => {
                Category.findAll().then(categories => {
                    res.render("admin/articles/articleUpdate", {article: article, categories: categories})
                })
            })

    }else {
        res.redirect('/admin/articles')
    }

})
router.post('/articles/update/save', (req,res) => {
    let title = req.body.title;
    let body = req.body.body;
    let slug = Slugify(title);
    let category = req.body.category
    let id = req.body.id;

    Article.update({
            title: title,
            body: body,
            slug: slug,
            categoryId: category
        },{
            where: {id: id}
        }).then(() => {
        res.redirect('/admin/articles')
    }).catch(err => {
        res.redirect("/admin/articles")
    })
});


router.post('/articles/save', (req,res) => {
    let body = req.body.body
    let title = req.body.title
    let category = req.body.category

    Article.create({
        title: title,
        slug: Slugify(title),
        body: body,
        categoryId: category
        // Elemento criado no banco de dados pelo belongsTo() => Chave estrangeira
    }).then(() => {
        res.redirect('/admin/articles')
    })
})

router.get("/article/page/:num", (req, res) => {
    var page = req.params.num;
    var offset = 0
    
    if(isNaN(page)) {
        offset = 0;
    } else {
        offset = parseInt(page) * 4;
    }
    Article.findAndCountAll({
        limit: 4,
        offset: offset,
        order: [
            ["id", "DESC"]
        ]
        // PARTINDO DE :
    }).then(articles => {

        var next;
        if(offset + 4 >= articles.count) {
            next = false
        } else {
            next = true
        }
        var result = {
            page: parseInt(page),
            next: next,
            articles: articles
        }
        Category.findAll().then(categories => {
            res.render("admin/articles/page", {result: result, categories: categories})  
        })
        
    })
})
module.exports = router;