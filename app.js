const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 3000;

const app = express();

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

mongoose.connect('mongodb://localhost:27017/wikiDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
// Article Schema
const articleSchema = mongoose.Schema({
  title: String,
  content: String,
});
// Create model
const Article = mongoose.model('Article', articleSchema);

//Requests targetting all Articles
app
  .route('/articles')
  .get(function (req, res) {
    Article.find(function (err, foundArticles) {
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }
    });
  })
  .post(function (req, res) {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });
    newArticle.save(function (err) {
      if (!err) {
        res.send('Succesfully added a new article.');
      } else {
        res.send(err);
      }
    });
  })
  .delete(function (req, res) {
    Article.deleteMany(function (err) {
      if (!err) {
        res.send('Succesfully delete all articles');
      } else {
        res.send(err);
      }
    });
  });

//Requests targetting a specific Article
app
  .route('/articles/:articleTitle')
  .get(function (req, res) {
    Article.findOne({ title: req.params.articleTitle }, function (
      err,
      foundArticle
    ) {
      if (foundArticle) {
        res.send(foundArticle);
      } else {
        res.send('No articles matching that title was found.');
      }
    });
  })
  // PUT replace whole document
  .put(function (req, res) {
    Article.update(
      { title: req.params.articleTitle },
      { title: req.body.title, content: req.body.content },
      { overwrite: true },
      function (err, results) {
        if (!err) {
          res.send('Successfully updated the selected article (whole)');
        } else {
          res.send(err);
        }
      }
    );
  })
  // PATCH replace only specific fields
  .patch(function (req, res) {
    Article.update(
      { title: req.params.articleTitle },
      { $set: req.body },
      function (err) {
        if (!err) {
          res.send('Successfully updated the selected article (partly)');
        } else {
          res.send(err);
        }
      }
    );
  })
  .delete(function (req, res) {
    Article.deleteOne({ title: req.params.articleTitle }, function (err) {
      if (!err) {
        res.send('Article deleded successfully!');
      } else {
        res.send(err);
      }
    });
  });

app.listen(PORT, function () {
  console.log(`Server started on port ${PORT}`);
});
