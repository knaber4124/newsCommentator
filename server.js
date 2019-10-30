let express = require("express");
let logger = require("morgan");
let mongoose = require("mongoose");
let axios = require("axios");
let cheerio = require("cheerio");


let db = require("./models");

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

// Connect to the Mongo DB
mongoose.connect(`mongodb+srv://${process.env.mongoUser}:${process.env.mongoPassword}@${process.env.mongoUser}-w02nq.mongodb.net/${process.env.mongoDb}?retryWrites=true&w=majority`, { useNewUrlParser: true });

// Routes

// A GET route for scraping the echoJS website
axios.get("https://www.nyt.com").then(function (response) {

    // Load the Response into cheerio and save it to a variable
    // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
    var $ = cheerio.load(response.data);


    // An empty array to save the data that we'll scrape
    var results = [];

    // With cheerio, find each p-tag with the "title" class
    // (i: iterator. element: the current element)
    $("article").each(function (i, element) {

        // Save the text of the element in a "title" variable
        var title = $(element).text();

        // In the currently selected element, look at its child elements (i.e., its a-tags),
        // then save the values for any "href" attributes that the child elements may have
        var link = "https//nytimes.com/" + $(this).find("a").attr("href");

        // Save these results in an object that we'll push into the results array we defined earlier
        results.push({
            title: title,
            link: link
        });
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
