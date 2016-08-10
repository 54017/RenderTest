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
				res.writeHead(200, {'content-type': 'text/javascript',
									'Cache-Control': 'no-cache' });
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
		}, 5000);
	} else if (req.url.indexOf('.html') >= 0) {
		if (req.url.indexOf('chunked') >= 0) {
			    res.setHeader('Content-Type', 'text/html; charset=UTF-8');
			    res.setHeader('Transfer-Encoding', 'chunked');

			    var html =
			        '<!DOCTYPE html>' +
			        '<html lang="en">' +
			            '<head>' +
			                '<meta charset="utf-8">' +
			                '<title>Chunked transfer encoding test</title>' +
			            '</head>' +
			            '<body>';

			    res.write(html);

			    html = '<h1>Chunked transfer encoding test</h1>'

			    res.write(html);

			    setTimeout(function(){
			        html = '<h5>This is a chunked response after 5 seconds. The server should not close the stream before all chunks are sent to a client.</h5>'

			        res.write(html);

			        html =
			            '</body>' +
			                '</html';

			        res.end(html);

			    }, 10000);

			    setTimeout(function(){
			        html = '<h5>This is a chunked response after 2 seconds. Should be displayed before 5-second chunk arrives.</h5>'

			        res.write(html);

			    }, 5000);
		} else {
			var reg = /.+\.html$/g;
			var url = './templates/' + req.url.match(reg)[0];
			fs.readFile(url, function(err, data) {
				if(err) { res.end('no file') }
				res.writeHead(200, {'content-type': 'text/html',
									'Cache-Control': 'no-cache' });
				res.write(data);
				res.end();
			});
		}
	} else if (req.url.indexOf('test.jpg') >= 0) {
		setTimeout(function() {
			fs.readFile('./images/test.jpg', function(err, data) {
				res.writeHead(200, {'Content-Type': 'image/jpg',
									'Cache-Control': 'no-cache' });
				res.write(data);
				res.end();
			});
		}, 1500);
	} else if (req.url.indexOf('video') >= 0) {
		setTimeout(function() {
			fs.readFile('./video/movie.ogg', function(err, data) {
				res.writeHead(200, {'Cache-Control': 'no-cache' });
				res.write(data);
				res.end();
			});
		}, 10000);
	} else if (req.url === '/ajax') {
		setTimeout(function() {
			res.writeHead(200, { 'Content-Type': 'text/plain' });
			res.write('q');
			res.end();
		}, 10000);
	} else if (req.url.indexOf('image') >= 0) {
		setTimeout(function() {
			fs.readFile('./images/test.jpg', function(err, data) {
				res.writeHead(200, {'Content-Type': 'image/jpg',
									'Cache-Control': 'max-age=300' });
				res.write(data);
				res.end();
			});
		}, 1000);
	} else if (req.url.indexOf('test.ico') >= 0) {
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
