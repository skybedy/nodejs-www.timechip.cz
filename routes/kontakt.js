var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
router.get('/', function(req, res) {
    res.render('kontakt',{
        title: 'Kontakt',
        h1: 'Kontakt'
    })
});
router.get('/kontaktni-formular', function(req, res) {

    var transport = nodemailer.createTransport(smtpTransport({
        host: 'smtp.timechip.cz',
        port: 25
    }));

    var mailOptions = {
        from: req.query.jmeno+'<'+req.query.email+'>', // sender address
        to: 'info@timechip.cz', // list of receivers
        //subject: 'Zpráva z webu - '+req.query.telefon, // Subject line
        subject: 'Zpráva z webového formuláře',
        text: req.query.zprava,
        html: '<b>'+req.query.zprava+'</b>'
    };

// send mail with defined transport object
    transport.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(error);
            res.json({
                zprava: 'Zpráva nebyla z nějakého důvodu odeslána, kontaktujte nás prosím běžneým e-mailem, nebo telefonicky, díky.'
            })
        }else{
            //console.log('Message sent: ' + info.response);
            res.json({
                zprava:'Díky, vaše zpráva byla odeslána a budeme vás co nejdříve kontaktovat.'
            })

        }
    });
});



module.exports = router;