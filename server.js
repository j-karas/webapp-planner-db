// Create express app
var express = require("express")
var app = express()
var db = require("./database.js")

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Server port
var HTTP_PORT = 8000 
// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT))
});
// Root endpoint
app.get("/", (req, res, next) => {
    res.json({"message":"Ok"})
});

// Insert here other API endpoints
app.get("/api/tasks", (req, res, next) => {
    var sql = "select * from tasks"
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
      });
});

app.post("/api/task", (req, res, next) => {
    console.log("hello")
    var errors=[]
    if (!req.body.name){
        errors.push("No task name specified");
    }
    if (!req.body.desc){
        errors.push("No task description specified");
    }
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
    var data = {
        name: req.body.name,
        desc: req.body.desc,
    }
    var sql ='INSERT INTO tasks (name, desc) VALUES (?,?)'
    var params =[data.name, data.desc]
    db.run(sql, params, function (err, result) {
        if (err){
            res.status(400).json({"error": err.message})
            return;
        }
        res.status(200).json({
            "message": "success",
            "data": data,
            "id" : this.lastID
        })
    });
})

app.post("/api/test", (req, res, next) => {
    console.log("hi", req.body)
    return res.status(200).send("hello")
});

// Default response for any other request
app.use(function(req, res){
    res.status(404);
});
