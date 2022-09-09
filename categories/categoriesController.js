const express = require('express');
const router = express.Router();
const Category = require('./Categories')
const slugify = require('slugify')
const adminAuth = require("../middleware/adminAuthen")
const session = require('express-session');

router.get('/admin/categories/new',adminAuth, (req,res) => {
    res.render('admin/categories/new')
});
router.post('/categories/save', (req, res) => {
    let title = req.body.title
        if(title != undefined) {
            Category.create({
                title: title,
                slug: slugify(title)
            }).then(() => {
                res.redirect("/admin/categories");
            });
        } else {
            res.redirect("/admin/categories/new")
        }
});

router.get("/admin/categories",adminAuth, (req, res) => {
    Category.findAll().then(category => {
        res.render("admin/categories/index", {
            categories: category,
            user: req.session.user
        });
    });
});

router.post("/categories/delete", (req, res) => {
    let id = req.body.id

    if(id != undefined) {
        if(!isNaN(id)){
            Category.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect("/admin/categories")
            })
        }else {
            res.redirect("/admin/caategories");
        }
    }else {
        res.redirect('/admin/categories');
    }
});

router.get('/admin/categories/edit/:id',adminAuth, (req,res) => {
    let id = req.params.id
    
    if(isNaN(id)) {
        res.redirect("/admin/categories")
    }
    
    Category.findByPk(id).then(category => {
        if(category != undefined){
            res.render('admin/categories/edit',{
                category: category
            })
        }else {
            res.redirect("/admin/categories")
        }
    }).catch(err => {
        res.redirect("/admin/categories")
    })
});

router.post("/categories/update", (req,res) => {
    let id = req.body.id;
    let title = req.body.title;

    Category.update({title: title, slug: slugify(title)},{
        where: {
            id: id
        }
    }).then(() => {
        res.redirect("/admin/categories")
    })
})

module.exports = router;


// Slug é uma versãao "URLizada de uma  string: Meu nome
// Slug: Meu-nome"