var express = require('express');
var router = express.Router();
var express = require('express');
var router = express.Router();
var shortcuts = require('../global.js');
var mysql = require('mysql');
var async = require('async');
const https = require('https');


var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'skybedy',
    password : 'mk1313life',
    database : 'timechip_cz',
    charset: 'utf8mb4_czech_ci',
    multipleStatements: true
});



router.get('/:year/:race_id/:race_code', function(req, res) {
    https.get('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY', (resp) => {
        let data = '';

    // A chunk of data has been recieved.
    resp.on('data', (chunk) => {
        data += chunk;
});
});

















router.get('/:year', function(req, res) {
    console.log(req)
    var year = req.params.year;
    var sqlshortcut = new shortcuts(year);
    req.getConnection(function(err,connection){
        var sql1 = "SELECT "+sqlshortcut.zavody+".id_zavodu,"+sqlshortcut.zavody+".nazev_zavodu,"+sqlshortcut.zavody+".kod_zavodu,DATE_FORMAT("+sqlshortcut.zavody+".datum_zavodu,'%e.%c.%Y') AS datum,DATE_FORMAT("+sqlshortcut.zavody+".datum_zavodu,'%Y') AS rok_zavodu,DATE_FORMAT("+sqlshortcut.zavody+".datum_zavodu,'%e') AS den_zavodu,DATE_FORMAT("+sqlshortcut.zavody+".datum_zavodu_konec,'%e.%c.%Y') AS datum_zavodu_konec,"+sqlshortcut.zavody+".misto_zavodu FROM "+sqlshortcut.zavody+" WHERE "+sqlshortcut.zavody+".nove_vysledky IS NOT NULL";
        //console.log(sql1);
        connection.query(sql1, function (err, dbdata1) {
            if(err) console.log(err);
            if(dbdata1.length > 0){
                res.render('vysledky_list',{
                    title: 'Výsledky '+year,
                    h1: 'Výsledky '+year,
                    sql:'',
                    data:dbdata1
                })

            }
        });
    });
});



router.get('/test', function(req, res) {

    function osoba(callback) {
        var sql1 = "SELECT * FROM osoby WHERE ido = 1";
        connection.query(sql1, function (err, dbdata1) {
            callback(null,dbdata1);

        });
    }

    function tym(callback) {
        var sql1 = "SELECT * FROM tymy WHERE id_tymu = 1";
        connection.query(sql1, function (err, dbdata1) {
            callback(null,dbdata1);

        });
    }




    async.series({
        ja: osoba,
        nejaky_tym: tym
    }, function(err, data) {

        console.log("Nacitani dokonceno: ", data);
        res.render('vysledky',{
            data:data
        });

    });


});



router.get('/test1', function(req, res) {

    var rendertest = function(d,c){
        res.render('vysledky',{
            osoba: d,
            tym:c
        });
    }


    var osoba = function(tym){
        var sql1 = "SELECT * FROM osoby WHERE ido = 1";
        connection.query(sql1, function(err,dbdata1) {
            if (err) throw err
            rendertest(dbdata1,tym);
        });

    }



    var tym = function(){
        var sql1 = "SELECT * FROM tymy WHERE id_tymu = 1";
        connection.query(sql1, function(err,dbdata1) {
            if (err) throw err
            osoba(dbdata1);
        });

    }



    tym();







});











router.get('/:year/:race_id/:race_code/zaloha', function(req, res) {

    var year = req.params.year;
    var race_id = req.params.race_id;
    var race_code = req.params.race_code.replace(/-/g, "_");
    var sqlshortcut = new shortcuts(year,race_code);
    var time_order = 3;

    //var neco = test2(req,onComplete);
    //console.log(neco.jmeno);


    req.getConnection(function(err,connection){

        console.log(connection.state);


        var sql1 = "SELECT "+sqlshortcut.zavody+".nazev_zavodu FROM "+sqlshortcut.zavody+" WHERE id_zavodu = "+race_id;
        connection.query(sql1, function (err, dbdata1) {
            if(err) console.log(err);
            if(dbdata1.length > 0){
                var sql2 = "SELECT * FROM "+sqlshortcut.menu_vysledky+" WHERE id_zavodu = "+race_id;
                connection.query(sql2, function (err2, dbdata8) {
                    if (err2) console.log(err2);
                    var sql3 = "SELECT * FROM "+sqlshortcut.podzavody+" WHERE id_zavodu = "+race_id+" ORDER BY poradi_podzavodu";
                    connection.query(sql3, function (err3, dbdata3) {
                        if (err3) console.log(err3);
                        var events_list;
                        if(dbdata3.length > 1){
                            events_list = dbdata3;
                        }
                        var data = [];
                        var sql1 = "SELECT "+sqlshortcut.vysledky+".ids,"+sqlshortcut.vysledky+".ids_alias,MAX("+sqlshortcut.vysledky+".race_time) AS finish_time,"+sqlshortcut.vysledky+".rank_category,"+sqlshortcut.vysledky+".rank_gender,"+sqlshortcut.vysledky+".race_time_sec,CONCAT_WS(' ',osoby.prijmeni,osoby.jmeno) AS jmeno,osoby.rocnik,osoby.psc AS stat,osoby.pohlavi,"+sqlshortcut.kategorie+".kod_k AS kod_kategorie,tymy.nazev_tymu,5 AS time_count FROM "+sqlshortcut.vysledky+",osoby,"+sqlshortcut.zavod+","+sqlshortcut.kategorie+",tymy WHERE race_time > 0 AND "+sqlshortcut.vysledky+".time_order = '"+time_order+"' AND "+sqlshortcut.kategorie+".id_zavodu = "+race_id+" AND "+sqlshortcut.kategorie+".poradi_podzavodu = '1' AND "+sqlshortcut.zavod+".ids = "+sqlshortcut.vysledky+".ids AND "+sqlshortcut.zavod+".ido = osoby.ido AND "+sqlshortcut.kategorie+".id_kategorie = "+sqlshortcut.zavod+".id_kategorie AND tymy.id_tymu = "+sqlshortcut.zavod+".prislusnost AND "+sqlshortcut.vysledky+".false_time IS NULL AND "+sqlshortcut.vysledky+".lap_only IS NULL GROUP BY "+sqlshortcut.vysledky+".ids ORDER BY finish_time ASC";
                        //console.log(sql1);

                        connection.query(sql1, function (err, dbdata, fields) {
                            var pole = [];
                            for(var i = 0;i<dbdata.length;i++){
                                (function (row){
                                    //var sql2  = "SELECT * FROM ?? WHERE ?? = ? AND false_time IS NULL AND lap_only IS NULL ORDER BY race_time ASC LIMIT 0,"+time_order;
                                    var sql2  = "SELECT * FROM "+sqlshortcut.vysledky+" WHERE ids = "+dbdata[i].ids+" AND false_time IS NULL AND lap_only IS NULL ORDER BY race_time ASC LIMIT 0,"+time_order;
                                    //console.log(sql2);
                                    //var inserts = [sqlshortcut.vysledky, 'ids', dbdata[i].ids];

                                    //sql2 = connection.format(sql2, inserts);

                                    connection.query(sql2, function (err, dbdata2, fields) {
                                        var lap_time = [];
                                        //var missing_time = false; //nastavení proměnné pro konntrolu, jestli má závodník všecky časy
                                        for(var k = 1;k <= dbdata2.length;k++){
                                            lap_time.push(dbdata2[k-1].lap_time);
                                        }
                                        dbdata[row].lap_time = lap_time;
                                        dbdata[row].distance_overall = (dbdata2[time_order-1].distance_overall != '00:00:00.00' ? dbdata2[time_order-1].distance_overall : '-');



                                        if(row == (dbdata.length - 1)){

                                            //console.log(neco);
                                            //console.log(dbdata);
                                            res.render('vysledky',{
                                                title: 'Výsledky '+dbdata1[0].nazev_zavodu+' '+year,
                                                h1: 'Výsledky '+dbdata1[0].nazev_zavodu+' '+year,
                                                results_type_select:dbdata8,
                                                events_list: events_list,
                                                data:dbdata1,
                                                vysledky:dbdata

                                            })
                                        }




                                    });
                                })(i);
                            }
                        });

                    });

                });
            }
        });

    });

});


function test1(connection,dodelano){

    var sql1 = "SELECT * FROM osoby WHERE ido = 1";
    var neco = 'bllala';
    connection.query(sql1, function (err, dbdata1) {
        a = 500;
        dodelano(a);
    });
}


function test2(req,dodelano){
    req.getConnection(function(err,connection){
        var a;
        var sql1 = "SELECT * FROM osoby WHERE ido = 1";
        connection.query(sql1, function (err, dbdata1) {
            a = dbdata1;
            dodelano(a);
        });
    });
}

function onComplete(a){
    console.log(a);
}








function test(connection,dodelano){
    var a;
    var sql1 = "SELECT * FROM osoby WHERE ido = 1";
    connection.query(sql1, function (err, dbdata1) {
        a = 500;
        dodelano(a);
    });
}












router.get('/test', function(req, res) {
    req.getConnection(function(err,connection){


        var data = [];
        var sql1 = "SELECT "+sqlvysledky+".ids,"+sqlvysledky+".ids_alias,MAX("+sqlvysledky+".race_time) AS finish_time,"+sqlvysledky+".race_time_sec,CONCAT_WS(' ',osoby.prijmeni,osoby.jmeno) AS jmeno,osoby.rocnik,osoby.psc AS stat,kategorie_2014.kod_k AS nazev_kategorie,tymy.nazev_tymu,5 AS time_count FROM "+sqlvysledky+",osoby,"+sqlzavod+",kategorie_2014,tymy WHERE race_time > 0 AND "+sqlvysledky+".time_order = '"+time_order+"' AND kategorie_2014.id_zavodu = '39' AND kategorie_2014.poradi_podzavodu = '1' AND "+sqlzavod+".ids = "+sqlvysledky+".ids AND "+sqlzavod+".ido = osoby.ido AND kategorie_2014.id_kategorie = "+sqlzavod+".id_kategorie AND tymy.id_tymu = "+sqlzavod+".prislusnost AND "+sqlvysledky+".false_time IS NULL AND "+sqlvysledky+".lap_only IS NULL GROUP BY "+sqlvysledky+".ids ORDER BY finish_time ASC";
        connection.query(sql1, function (err, dbdata, fields) {
            var pole = [];
            for(var i = 0;i<dbdata.length;i++){
                (function (row){
                    var sql2  = "SELECT * FROM ?? WHERE ?? = ? AND false_time IS NULL AND lap_only IS NULL ORDER BY race_time ASC LIMIT 0,"+time_order;

                    var inserts = [sqlvysledky, 'ids', dbdata[i].ids];

                    sql2 = connection.format(sql2, inserts);
                    connection.query(sql2, function (err, dbdata2, fields) {
                        var lap_time = [];
                        //var missing_time = false; //nastavení proměnné pro konntrolu, jestli má závodník všecky časy
                        for(var k = 1;k <= dbdata2.length;k++){
                            lap_time.push(dbdata2[k-1].lap_time);
                        }
                        dbdata[row].lap_time = lap_time;
                        dbdata[row].distance_overall = (dbdata2[time_order-1].distance_overall != '00:00:00.00' ? dbdata2[time_order-1].distance_overall : '-');
                        if(row == (dbdata.length - 1)){
                            //res.json(dbdata);
                            res.render('vysledky',{
                                title:"Výsledky",
                                h1:"Výsledky",
                                data: dbdata
                            });
                            //res.send(dbdata);
                        }
                    });
                })(i);
            }
        });



    });
});

router.get('/2014/*', function(req, res) {
    var kod_zavodu = req.params[0];
    res.redirect('http://results.timechip.cz/vysledky/2014/'+kod_zavodu);
});

router.get('/2013/*', function(req, res) {
    var kod_zavodu = req.params[0];
    res.redirect('http://results.timechip.cz/vysledky/2013/'+kod_zavodu);
});

router.get('/2012/*', function(req, res) {
    var kod_zavodu = req.params[0];
    res.redirect('http://results.timechip.cz/vysledky/2012/'+kod_zavodu);
});

router.get('/*', function(req, res) {
    res.redirect('http://vysledky.timechip.cz');
});



    module.exports = router;