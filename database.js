var sqlite3 = require('sqlite3').verbose()

const DBSOURCE = "database.sqlite"

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    }else{
        console.log('Connected to the SQLite database.')
        db.run(`CREATE TABLE tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name text, 
            desc text
            )`,
        (err) => {
            if (err) {
                // Table already created
            }else{
                // Table just created, creating some rows
                var insert = 'INSERT INTO tasks (name, desc) VALUES (?,?)'
                db.run(insert, ["test1", "test one"])
                db.run(insert, ["test2", "test two"])
            }
        });  
    }
});


module.exports = db

