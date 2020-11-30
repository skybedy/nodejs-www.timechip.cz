var express = require('express');
var router = express.Router();

var sqlzavod = 'zavod_testovaci_2014';
var sqlzavod = 'zavod_machacsky_pohodar_2014';
var sqlvysledky = 'vysledky_machacsky_pohodar_2014_test';
var sqlzavody = 'zavody_2014';
var time_order = 5;
var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'skybedy',
  password : 'mk1313life',
  database:'timechip_cz'
});





/* GET users listing. */
router.get('/', function(req, res) {
  var data = [];
  var sql1 = "SELECT "+sqlvysledky+".ids,"+sqlvysledky+".ids_alias,MAX("+sqlvysledky+".race_time) AS finish_time,"+sqlvysledky+".race_time_sec,CONCAT_WS(' ',osoby.prijmeni,osoby.jmeno) AS jmeno,osoby.rocnik,osoby.psc AS stat,kategorie_2014.kod_k AS nazev_kategorie,tymy.nazev_tymu,5 AS time_count FROM "+sqlvysledky+",osoby,"+sqlzavod+",kategorie_2014,tymy WHERE race_time > 0 AND "+sqlvysledky+".time_order = '"+time_order+"' AND kategorie_2014.id_zavodu = '39' AND kategorie_2014.poradi_podzavodu = '1' AND "+sqlzavod+".ids = "+sqlvysledky+".ids AND "+sqlzavod+".ido = osoby.ido AND kategorie_2014.id_kategorie = "+sqlzavod+".id_kategorie AND tymy.id_tymu = "+sqlzavod+".prislusnost AND "+sqlvysledky+".false_time IS NULL AND "+sqlvysledky+".lap_only IS NULL GROUP BY "+sqlvysledky+".ids ORDER BY finish_time ASC";
  connection.query(sql1, function (err, dbdata, fields) {
    var pole = [];
    for(var i = 0;i<dbdata.length;i++){
      (function (row){
        var sql2  = "SELECT * FROM ?? WHERE ?? = ? AND false_time IS NULL AND lap_only IS NULL ORDER BY race_time ASC LIMIT 0,"+time_order;

        //var sql = "SELECT * FROM ?? WHERE ?? = ?";
        //var inserts = ['users', 'id', userId];
        var inserts = [sqlvysledky, 'ids', dbdata[i].ids];
        sql2 = mysql.format(sql2, inserts);


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

router.get('/alt', function(req, res) {
  var str = '';
  var data = [];
  var sql1 = "SELECT "+sqlvysledky+".ids,"+sqlvysledky+".ids_alias,MAX("+sqlvysledky+".race_time) AS finish_time,"+sqlvysledky+".race_time_sec,CONCAT_WS(' ',osoby.prijmeni,osoby.jmeno) AS jmeno,osoby.rocnik,osoby.psc AS stat,kategorie_2014.kod_k AS nazev_kategorie,tymy.nazev_tymu,5 AS time_count FROM "+sqlvysledky+",osoby,"+sqlzavod+",kategorie_2014,tymy WHERE race_time > 0 AND "+sqlvysledky+".time_order = '"+time_order+"' AND kategorie_2014.id_zavodu = '39' AND kategorie_2014.poradi_podzavodu = '1' AND "+sqlzavod+".ids = "+sqlvysledky+".ids AND "+sqlzavod+".ido = osoby.ido AND kategorie_2014.id_kategorie = "+sqlzavod+".id_kategorie AND tymy.id_tymu = "+sqlzavod+".prislusnost AND "+sqlvysledky+".false_time IS NULL AND "+sqlvysledky+".lap_only IS NULL GROUP BY "+sqlvysledky+".ids ORDER BY finish_time ASC";
  connection.query(sql1, function (err, dbdata, fields) {
    console.log(dbdata);



    var pole = [];
    for(var i = 0;i<dbdata.length;i++){
      (function (row){
        var sql2  = "SELECT * FROM ?? WHERE ?? = ? AND false_time IS NULL AND lap_only IS NULL ORDER BY race_time ASC LIMIT 0,"+time_order;

        str += '<tr>';
        str += '<td>'+dbdata[i].ids+'</td>';
        str += '<td>'+dbdata[i].jmeno+'</td>';
        str += '<td>'+dbdata[i].rocnik+'</td>';
        str += '<td>'+dbdata[i].nazev_kategorie+'</td>';
        str += '</tr>';




        //var sql = "SELECT * FROM ?? WHERE ?? = ?";
        //var inserts = ['users', 'id', userId];
        var inserts = [sqlvysledky, 'ids', dbdata[i].ids];
        sql2 = mysql.format(sql2, inserts);


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









            res.render('vysledky-alt',{
              title:"Výsledky",
              h1:"Výsledky",
              data: str
            });

            //res.send(dbdata);

          }
        });
      })(i);

    }
  });
});






module.exports = router;
