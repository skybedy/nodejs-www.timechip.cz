var express = require('express');
var router = express.Router();




router.get('/', function(req, res) {
    res.render('testy',{
        title: 'Testy',
        h1: 'Testy'
    })
});

router.get('/test-socket', function(req, res) {
    require('net').createServer(function(socket) {
//socket.setEncoding('UTF-8');
        socket.on('data', function(data) {
            var buf = new Buffer(data);
            var uvitani = buf.toString();
            var odpoved = 'TimeChip~Version 2013 rev 1~2\r\n';
            odpoved += 'stream-mode=push\r\n';
            odpoved += 'pushmode-ack=false\r\n';
            odpoved += 'start\r\n';
            if(uvitani == 'SimpleClient~0.5.0~CTP01\r\n'){
                res.json({
                    neco:uvitani
                });
                res.end();
                //console.log(uvitani);
                socket.write(odpoved);
            }
        });

        socket.on('end', function(data) {

        });

    }).listen(61611,'127.0.0.1');








});




module.exports = router;