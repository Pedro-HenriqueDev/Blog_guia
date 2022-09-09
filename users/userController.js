const express = require('express');
const router = express.Router();
const User = require("./User");
const bcrypt = require("bcryptjs")
const adminAuth = require("../middleware/adminAuthen")
const session = require('express-session');

router.get("/admin/users", (req, res) => {
    User.findAll().then(users => {
        res.render("admin/users/index", {users: users})
    })
});
router.get("/admin/users/create", (req,res) => {
    res.render("admin/users/create", {error: false});
})

router.post("/users/create", (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    User.findOne({where:{email: email}}).then(user =>{
        if(user == undefined){
            let salt = bcrypt.genSaltSync(10);
            let hash = bcrypt.hashSync(password, salt);

            User.create({
                email: email,
                password: hash
            }).then(() => {
                res.redirect("/admin/categories");
            }).catch((err) => {
                res.redirect("/");
            });
        } else {
            res.render('admin/users/create',{error: true});
        }
    })

});
router.get("/users/login", (req, res) => {
    res.render("admin/users/login", {error: false});
})
router.post("/users/authenticate", (req,res) => {
    let email = req.body.email;
    let password = req.body.password;

    User.findOne({where: {email: email}}).then(user => {
        if(user != undefined) {
            //  Validar senha
            let correct = bcrypt.compareSync(password, user.password);
            if(correct) {
                req.session.user = {
                    id: user.id,
                    email: user.email
                }
                res.redirect("/admin/categories")
            } else {
                res.render("admin/users/login", {error: true});
            }
        } else {
            res.render("admin/users/login", {error: true});
        }
    })
})
router.get("/users/logout",adminAuth, (req,res) => {
    req.session.user = undefined
    res.redirect("/");
})
router.post("/users/delete", (req,res) => {
    let idUser = req.body.id;
    
    User.destroy({
        where: {id: idUser}
    }).then(() => {
        res.redirect("/")
    })
})
module.exports = router;
