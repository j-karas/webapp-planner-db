// Create express app
var express = require("express")
var app = express()
var db = require("./database.js")
var cors = require("cors")

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());
app.options('*', cors());
app.use(express.json())
app.use(express.urlencoded());

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
        res.json(rows
        )
      });
});

app.post("/api/task", (req, res, next) => {
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

app.delete("/api/task/:id", (req, res, next) => {
    console.log("DELETE CALLED");
    errors=[]
    if (!req.params.id){
        errors.push("No id specified");
    }
    var sql = 'DELETE FROM tasks WHERE id = ?'
    db.run(sql, req.params.id, function (err, result) {
        if (err){
            res.status(400).json({"error": err.message})
            return;
        }
        res.status(200).json({
            "message": "success",
            "id": req.params.id
        })
    });
})

// Default response for any other request
app.use(function(req, res){
    res.status(404);
});
