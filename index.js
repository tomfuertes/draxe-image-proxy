var express = require('express');
var app = express();
var httpProxy = require('http-proxy');
var proxy = httpProxy.createProxyServer();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

app.route('/*$').all(function(req, res) { // proxy all requests
  proxy.web(req, res, {
    target: 'http://cdn.shopify.com/',
    changeOrigin: true
  }); //sandbox
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
