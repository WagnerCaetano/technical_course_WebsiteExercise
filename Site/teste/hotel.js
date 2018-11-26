function criarServer(){


var express = require('express');
var app = express();


app.get('/', function (req, res) {
   
    var sql = require("mssql");

    // config for your database
    var config = {
        user: 'Admin',
        password: '20092001',
        server: 'localhost', 
        database: 'WebSiteHoteis' 
    };

    // connect to your database
    sql.connect(config, function (err) {
    
        if (err) console.log(err);
        // create Request object
        var request = new sql.Request();
           
        // query to the database and get the records
        request.input("param",3)
        request.query('select * from WHotel where HotelId = @param', function (err, recordset) {
            
            if (err) console.log(err)

            // send records as a response
            res.send(recordset);
            
            
        });
    });

    
});


var server = app.listen(5000, function () {
    console.log('Server is running..');
});

}