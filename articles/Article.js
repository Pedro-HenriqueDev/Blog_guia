const Sequelize = require('sequelize');
const connection = require('../database/database');
const Category = require('../categories/Categories')

const Article = connection.define('articles', {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    }, slug: {
        type: Sequelize.STRING,
        allowNull: false
    }, body: {
        type: Sequelize.TEXT,
        allowNull: false
    }
});

// Article.sync({force: false});



// RELACIONAMENTOS

// 1-p-M => hasMany => tem vários...
Category.hasMany(Article) // Uma categoria tem muitos artigos

// 1-p-1 => belongsTo() => Pertence á...
Article.belongsTo(Category) // Um artigo pertence a uma categoria


// EXPORTS
module.exports = Article;