// server.js

    // set up =====================
    var express  = require('express');
    var app      = express();                               // create our app w/ express
    var mongoose = require('mongoose');                     // mongoose for mongodb
    var morgan = require('morgan');             // log requests to the console (express4)
    var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
    var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)

    // configuration ===============

    mongoose.connect('mongodb://localhost:27017/');

    app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
    app.use(morgan('dev'));                                         // log every request to the console
    app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
    app.use(bodyParser.json());                                     // parse application/json
    app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
    app.use(methodOverride());

    // listen (start app with node server.js) ======================================
    app.listen(8080);
    console.log("App listening on port 8080");

    // define model =================
    var Todo = mongoose.model('Todo', {
        text: String

    });
// routes ======================================================================

    // api ---------------------------------------------------------------------
    // get all todos
    app.get('/api/todos', function(request, response) {

        // use mongoose to get all todos in the database
        Todo.find(function(error, todos){

            //if there is an error retrieving, send the error. Nothing after res.send(error) will execute
            if (error)
                response.send(error)

            response.json(todos) //return all todos in JSON format

        })
    })

    //create todo and send back all todos after creation
    app.post('/api/todos', function(request,response){

        // create a todo, information comes from AJAX request from Angular
        Todo.create({
            text : request.body.text,
            done : false
        }, function(error, todo) {
            if (error)
                response.send(error)

            // get and return all the todos after you create another
            Todo.find(function(error, todos){
                if (error)
                    response.send(error)
                response.json(todos)
            })
        })

    })

    // delete a todo
    app.delete('/api/todos/:todo_id', function(request, response){
        Todo.remove({
            _id : request.params.todo_id
        }, function(error, todo) {
            if (error)
                response.send(error)

            // get and return all the todos after you create another
            Todo.find(function(error, todos){
                if (error)
                    response.send(error)
                response.json(todos)
            })
        })
    })


    // application -------------------------------------------------------------
    app.get('/', function(request, response){
        response.sendfile('./public/index.html') // load the single view file (angular will handle the page changes on the front-end)
    })
