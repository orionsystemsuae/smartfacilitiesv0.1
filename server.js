"use strict" /* always for Node.JS, never global in the browser */;

// logging ************
// you should consider using the packages debug and console-stamp to
// incorporate standard logging with node-red logging

// The TCP port for this systems web interface - picked up from env, package.json or fixed value
const http_port =
  process.env.HTTPPORT || process.env.npm_package_config_http_port || 3000;
const use_https =
  process.env.USEHTTPS ||
  process.env.npm_package_config_use_https == "true" ||
  false;
const listening_address =
  process.env.LISTENINGADDRESS ||
  process.env.npm_package_config_listening_address ||
  "0.0.0.0";

const http = use_https ? require("https") : require("http");

require('rootpath')();
var express = require('express');
var app = express();
var path = require('path');
var session = require('express-session');
var bodyParser = require('body-parser');
var expressJwt = require('express-jwt'); 
var config = require('config.json');
//const RED = require("node-red");
var nrSettings = require("./settings.js"); // Node-Red settings file
const fs = require("fs");

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');


//add static paths of global public folder
//app.use(express.static(path.join(__dirname, 'public')));
//app.use('/scripts', express.static(__dirname + '/node_modules/bootstrap/dist/'));
//app.use('/public', express.static(__dirname + '/node_modules/bootstrap/dist/'));

// app.use('/angular-bootstrap-nav-tree', express.static(__dirname + '/node_modules/angular-bootstrap-nav-tree'));
// app.use('/angular-bootstrap-colorpicker', express.static(__dirname + '/node_modules/angular-bootstrap-colorpicker'));
app.use('/angular-slick', express.static(__dirname + '/node_modules/angular-slick'));
app.use('/app-modules', express.static(__dirname + '/node_modules'));



app.use(express.static('public'));
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
app.use(bodyParser.json({limit:'50mb'})); 
app.use(bodyParser.urlencoded({extended:true, limit:'50mb'}));
app.use(session({ secret: config.secret, resave: false, saveUninitialized: true }));

// use JWT auth to secure the api
app.use('/api', expressJwt({ secret: config.secret }).unless({ path: ['/api/users/authenticate', '/api/users/register', '/api/users/reset'] }));

// routes - EJS LOGIN/REGISTER/RESET
app.use('/login', require('./controllers/login.controller'));
app.use('/register', require('./controllers/register.controller'));
app.use('/reset', require('./controllers/reset.controller'));
// routes - AngularJS
app.use('/app', require('./controllers/app.controller'));
// routes - API
app.use('/api/clients', require('./controllers/api/clients.controller'));
app.use('/api/dashboards', require('./controllers/api/dashboards.controller'));
app.use('/api/visualboards', require('./controllers/api/visualboards.controller'));
app.use('/api/metrics', require('./controllers/api/metrics.controller'));
app.use('/api/sites', require('./controllers/api/sites.controller'));
app.use('/api/users', require('./controllers/api/users.controller'));


// make '/app' default route
app.get('/', function (req, res) {
    return res.redirect('/app');
});


// start server
// var server = app.listen(3000, function () {
//     console.log(path.join(__dirname, 'public'));
//     console.log('Server listening at http://' + server.address().address + ':' + server.address().port);
// });

// you can set a default credential secret for storing node's credentials within node red
// normally this is secret is generated randomly and stored in the user directory (config)
// if you are sharing your flows over different systems  (e.g. windows, linux etc)
// and want to keep your used credentials used within your flow, it more convenient to setup
// a fixed secret here
if (
    !(process.env.npm_package_config_nr_credentialsecret === undefined ||
      process.env.npm_package_config_nr_credentialsecret === null)
  )
    nrSettings.credentialSecret =
      process.env.npm_package_config_nr_credentialsecret;
  
  if (process.env.npm_package_config_nr_userfolder)
    nrSettings.userDir = process.env.npm_package_config_nr_userfolder;
  
  if (process.env.npm_package_config_nr_flowfile)
    nrSettings.flowFile = process.env.npm_package_config_nr_flowfile;
  
  if (process.env.npm_package_config_nr_title) {
    nrSettings.editorTheme.page.title = nrSettings.editorTheme.header.title =
      process.env.npm_package_config_nr_title;
  }

// Create the http(s) server
if (use_https) {
    var privateKey = fs.readFileSync("./server.key", "utf8");
    var certificate = fs.readFileSync("./server.crt", "utf8");
    var credentials = {
      key: privateKey,
      cert: certificate
    };
  }
var httpServer = use_https
  ? http.createServer(credentials, app)
  : http.createServer(app);

// Initialise the runtime with a server and settings
// @see http://nodered.org/docs/configuration.html
//RED.init(httpServer, nrSettings);

// Serve the editor UI from /admin
//app.use(nrSettings.httpAdminRoot, RED.httpAdmin);

// Serve the http nodes from /
//app.use(nrSettings.httpNodeRoot, RED.httpNode);

httpServer.listen(http_port, listening_address, function() {
  console.info(
    "Express 4 https server listening on http%s://%s:%d%s, serving node-red",
    use_https ? "s" : "",
    httpServer.address().address.replace("0.0.0.0", "localhost"),
    httpServer.address().port,
    nrSettings.httpAdminRoot
  );
});

// Start the runtime
// RED.start().then(function() {
//   console.info("------ Engine started! ------");
// });

