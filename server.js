var http = require('http');
var fs = require('fs');

http.createServer(function(req, res) {
	req.on('error', function(err) {
		console.error(err);
		res.statusCode = 400;
		res.end();
	});
	res.on('error', function(err) {
		console.error(err);
	});
	console.log(req.url);
	if (req.url.indexOf('.js') >= 0) {
		setTimeout(function() {
			fs.readFile('.' + req.url, function(err, data) {
				res.writeHead(200, {'content-type': 'text/javascript'});
				res.write(data);
				res.end();
			});
		}, 3000);

	} else if (req.url.indexOf('.css') >= 0) {
		setTimeout(function() {
			fs.readFile('.' + req.url, function(err, data) {
				res.writeHead(200, {'content-type': 'text/css'});
				res.write(data);
				res.end();
			});
		}, 2000);
	} else if (req.url.indexOf('html') >= 0) {
		var url = './templates' + req.url;
		fs.readFile(url, function(err, data) {
			if(err) { res.end('no file') }
			res.writeHead(200, {'content-type': 'text/html'});
			res.write(data);
			res.end();
		});
	} else if (req.url.indexOf('test.jpg') >= 0) {
		setTimeout(function() {
			fs.readFile('./images/test.jpg', function(err, data) {
				res.writeHead(200, {'Content-Type': 'image/jpg',
									'Cache-Control': 'max-age=60' });
				res.write(data);
				res.end();
			});
		}, 1500);
	} else if (req.url === '/ajax') {
		setTimeout(function() {
			res.writeHead(200, { 'Content-Type': 'text/plain' });
			res.write('q');
			res.end();
		}, 1500);
	} else if (req.url.indexOf('test.ico') >= 0) {
		console.log('ooooooo');
		setTimeout(function() {
			fs.readFile('./test.ico', function(err, data) {
				res.writeHead(200);
				res.write(data);
				res.end();
			});
		}, 4000)
	} else {
		res.end('url not found');
	}
}).listen(8000);
