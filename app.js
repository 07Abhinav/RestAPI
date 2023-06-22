const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view enjine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/wikiDB", {useNewUrlParser: true});

const articleSchema = {
    title: String,
    content: String
}

const Article = mongoose.model("Article", articleSchema);

app.route("/articles")
.get(function(req, res){
    Article.find().then(function(err, foundArticles){
        if(!err){
            res.send(foundArticles);
        }
        else{
            res.send(err);
        }
    });
})
.post(function(req, res){
    console.log();
    console.log();

    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });
    newArticle.save().then(function(err){
        if(!err){
            res.send("Successfully added a new articles.");
        } else{
            res.send(err);
        }
    });
})
.delete(function(req, res){
    Article.deleteMany().then(function(err){
        if(!err){
            res.send("Successfully deleted all articles.");
        } else{
            res.send(err);
        }
    });
});

///////////////////////////Requests targeting a specific article///////////
app.route("/articles/:articleTitle")

.get(function(req, res){
    Article.findOne({title: req.params.articleTitle}).then(function(foundArticle){
        if(foundArticle){
            res.send(foundArticle);
        } else{
            res.send("Article is not found");
        }
    });
})
.delete(function(req, res){
    Article.deleteOne({title: req.params.articleTitle}).then(function(err){
        if(!err){
            res.send("Succesfully deleted");
        } else{
            res.send(err);
        }
    });
})
.put(async function (req, res) {
    Article.findOneAndUpdate(
        {title: req.params.articleTitle}, 
        {title: req.body.title, content: req.body.content},
        {overwite: true}
        ).then(function(err) {
        if (!err) {
          res.send("Successfully updated article");
        } 
      });
    
})
.patch(async function (req, res) {
    Article.findOneAndUpdate(
        {title: req.params.articleTitle}, 
        {$set: req.body}
        ).then(function(err) {
        if (!err) {
          res.send("Succesfully updated article");
        } else{
            res.send(err);
        }
    });
});

app.listen(3000, function(){
    console.log("Server is started on port 3000");
});
