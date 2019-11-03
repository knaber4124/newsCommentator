let getStories = require("./server")


$(".getStories").on("click", function () {
    getStories();
    console.log("firing");
});