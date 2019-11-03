require("dotenv").config();
let express = require("express");
let logger = require("morgan");
let mongoose = require("mongoose");
let axios = require("axios");
let cheerio = require("cheerio");

let db = require("./models");
console.log(db.Article);

let PORT = process.env.PORT || 3000;


let app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

let mongoUrl = `mongodb+srv://${process.env.mongoUser}:${process.env.mongoPassword}@${process.env.mongoUser}-w02nq.mongodb.net/${process.env.mongoDb}?retryWrites=true&w=majority`;

mongoose.connect(mongoUrl, { useNewUrlParser: true });
// Routes


axios.get("https://www.nyt.com").then(function (response) {

    var $ = cheerio.load(response.data);

    $("article").each(function (i, element) {
        var result = {};

        result.title = $(element).text();
        result.link = "https//nytimes.com/" + $(this).find("a").attr("href");
        // var title = $(element).text();
        // var link = "https//nytimes.com/" + $(this).find("a").attr("href");

        db.Article.create(result).then(function (dbArticle) {
            console.log(dbArticle);
        })
            .catch(function (err) {
                console.log(err)

            });
        
        $('.storiesDiv').append(
            $('<tr>'),
            $('<td>').text(result.title),
            $('<td').text(result.link)
        )
    });

    // Log the results once you've looped through each of the elements found with cheerio
    console.log(results);
})
    .catch(function (err) {
        console.log(err);
    });
// Start the server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});
