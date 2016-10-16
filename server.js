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
		var times = [2000, 3000, 5000, 7000];
		var time = times[Math.floor(Math.random() * 4)];
		console.log(time);
		setTimeout(function() {
			fs.readFile('.' + req.url, function(err, data) {
				res.writeHead(200, {'content-type': 'text/javascript',
									 });
				res.write(data);
				res.end();
			});
		}, time);

	} else if (req.url.indexOf('.css') >= 0) {
		setTimeout(function() {
			fs.readFile('.' + req.url, function(err, data) {
				res.writeHead(200, {'content-type': 'text/css',
									'Cache-Control': 'no-cache'});
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
		} else if (req.url.indexOf(302) >= 0) {
			res.writeHead(302, {
				'Location': '/image.html'
			});
			res.end();
		} else {
			var reg = /.+\.html/g;
			var url = './templates/' + req.url.match(reg)[0];
			console.log("lala ", url);
			fs.readFile(url, function(err, data) {
				if(err) { res.end('no file') }
				res.writeHead(200, {'content-type': 'text/html',
									 });
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
		var path = './video/small.mp4';
		  var stat = fs.statSync(path);
		  var total = stat.size;
		  if (req.headers['range']) {
		    var range = req.headers.range;
		    var parts = range.replace(/bytes=/, "").split("-");
		    var partialstart = parts[0];
		    var partialend = parts[1];

		    var start = parseInt(partialstart, 10);
		    var end = partialend ? parseInt(partialend, 10) : total-1;
		    var chunksize = (end-start)+1;
		    console.log('RANGE: ' + start + ' - ' + end + ' = ' + chunksize);

		    var file = fs.createReadStream(path, {start: start, end: end});
		    res.writeHead(206, { 'Content-Range': 'bytes ' + start + '-' + end + '/' + total, 'Accept-Ranges': 'bytes', 'Content-Length': chunksize, 'Content-Type': 'video/mp4' });
		    file.pipe(res);
		  } else {
		    console.log('ALL: ' + total);
		    res.writeHead(200, { 'Content-Length': total, 'Content-Type': 'video/mp4' });
		    fs.createReadStream(path).pipe(res);
		  }
	} else if (req.url.indexOf('test.mp3') >= 0) {
		setTimeout(function() {
			fs.readFile('./audio/test.mp3', function(err, data) {
				res.writeHead(200, {'Cache-Control': 'no-cache' });
				res.write(data);
				res.end();
			});
		}, 5000);
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
									'Cache-Control': 'max-age=300000' });
				res.write(data);
				res.end();
			});
		}, 5000);
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
