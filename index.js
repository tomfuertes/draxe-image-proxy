var express = require('express');
var app = express();
var httpProxy = require('http-proxy');
var proxy = httpProxy.createProxyServer();
var fs = require('fs');
var mkpath = require('mkpath');
var rimraf = require('rimraf');

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

app.route('/nuke$').all(function(req, res) { // proxy all requests
  rimraf.sync(__dirname + '/public/s');
  fs.unlinkSync('./public/favicon.ico');
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.write('nuking...');
  res.end();
});

app.route('/*$').all(function(req, res) { // proxy all requests
  proxy.web(req, res, {
    target: 'http://cdn.shopify.com/',
    changeOrigin: true
  }); //sandbox
});

proxy.on('proxyRes', function (proxyRes, req, res){
  var localPath = __dirname + '/public' + req._parsedUrl.path;
  var pathArray = localPath.split('/');
  pathArray.pop(); // remove filename
  var dir = pathArray.join('/');
  console.log('localPath:', localPath);
  console.log('dir:', dir);
  mkpath.sync(dir);
  var writeStream = fs.createWriteStream(localPath);
  proxyRes.pipe(writeStream);
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
