const http = require('http');
const querystring = require('querystring');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
	res.writeHead(200, {
		"Content-Type": 'tapplication/plain',
		'charset': 'utf-8',
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS'
	});
	var alldata = "";
	req.on('data', function(chunk) {
		alldata += chunk;
	});
	req.on("end", function() {
		var dataString = alldata.toString(), //将字符串转换位一个对象
			dataObj = querystring.parse(dataString); //将接收到的字符串转换位为json对象
		res.end(JSON.stringify({
			"message": dataObj
		}));
	})
});

server.listen(port, hostname, () => {
	console.log(`服务器运行在 http://${hostname}:${port}/`);
});