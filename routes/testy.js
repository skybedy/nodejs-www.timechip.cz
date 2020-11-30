var express = require('express');
var router = express.Router();

var shortcuts = require('../global.js');
var moment = require('moment');

//takhle koncipované je to sampozøejmì tak, že v novém roce se musí restartovats server, aby byl korektnì current year

var current_year = moment().year();
var sqlshortcut = new shortcuts(current_year);
var async = require('async');



















router.get('/', function(req, res) {
    var locals = {
        title : "Hlavní strana",
        h1 : "Hlavní strana"
    };
    var today = moment().format('YYYY-MM-DD');
    req.getConnection(function(err,connection){
        async.parallel([
            function(callback) {
                var sql1 = "SELECT "+sqlshortcut.zavody+".nazev_zavodu,"+sqlshortcut.zavody+".web,DATE_FORMAT("+sqlshortcut.zavody+".datum_zavodu,'%e.%c.%Y') AS datum,DATE_FORMAT("+sqlshortcut.zavody+".datum_zavodu,'%e') AS den_zavodu,DATE_FORMAT("+sqlshortcut.zavody+".datum_zavodu_konec,'%e.%c.%Y') AS datum_zavodu_konec,"+sqlshortcut.zavody+".misto_zavodu,typ_zavodu.typ_zavodu,typ_zavodu.icon FROM "+sqlshortcut.zavody+",typ_zavodu WHERE "+sqlshortcut.zavody+".id_typu_zavodu = typ_zavodu.id_typ_zavodu AND zverejneni IS NOT NULL AND datum_zavodu > '"+today+"' ORDER BY datum_zavodu LIMIT 0,4";
                connection.query(sql1, function (err, dbdata1) {
                    locals.next_events = dbdata1;
                    if(dbdata1.length < 4){
                        var limit_next_year = 4 - dbdata1.length;
                        var next_year = current_year + 1;
                        var sql2 = "SELECT zavody_"+next_year+".nazev_zavodu,zavody_"+next_year+".web,DATE_FORMAT(zavody_"+next_year+".datum_zavodu,'%e.%c.%Y') AS datum,DATE_FORMAT(zavody_"+next_year+".datum_zavodu,'%e') AS den_zavodu,DATE_FORMAT(zavody_"+next_year+".datum_zavodu_konec,'%e.%c.%Y') AS datum_zavodu_konec,zavody_"+next_year+".misto_zavodu,typ_zavodu.typ_zavodu,typ_zavodu.icon FROM zavody_"+next_year+",typ_zavodu WHERE zavody_"+next_year+".id_typu_zavodu = typ_zavodu.id_typ_zavodu AND zverejneni IS NOT NULL AND datum_zavodu > '"+today+"' ORDER BY datum_zavodu LIMIT 0,"+limit_next_year;
                        connection.query(sql2, function (err, dbdata2) {
                            for(i = 0;i < dbdata2.length;i++){
                                locals.next_events.push(dbdata2[i]);
                            }
                        });
                    }
                    callback();
                });
            },
            function(callback) {
                var sql1 = "SELECT "+current_year+" AS year,"+sqlshortcut.zavody+".nazev_zavodu,"+sqlshortcut.zavody+".id_zavodu,DATE_FORMAT("+sqlshortcut.zavody+".datum_zavodu,'%e.%c.%Y') AS datum,DATE_FORMAT("+sqlshortcut.zavody+".datum_zavodu,'%e') AS den_zavodu,DATE_FORMAT("+sqlshortcut.zavody+".datum_zavodu_konec,'%e.%c.%Y') AS datum_zavodu_konec,"+sqlshortcut.zavody+".misto_zavodu,typ_zavodu.typ_zavodu,typ_zavodu.icon FROM "+sqlshortcut.zavody+",typ_zavodu WHERE "+sqlshortcut.zavody+".id_typu_zavodu = typ_zavodu.id_typ_zavodu AND zverejneni IS NOT NULL AND datum_zavodu < '"+today+"' AND nove_vysledky IS NOT NULL ORDER BY datum_zavodu DESC LIMIT 0,4;";
                connection.query(sql1, function (err, dbdata1) {
                    locals.last_results = dbdata1;
                    if(dbdata1.length < 4){
                        var limit_last_year = 4 - dbdata1.length;
                        var last_year = current_year - 1;
                        var sql2 = "SELECT "+last_year+" AS year,zavody_"+last_year+".nazev_zavodu,zavody_"+last_year+".id_zavodu,DATE_FORMAT(zavody_"+last_year+".datum_zavodu,'%e.%c.%Y') AS datum,DATE_FORMAT(zavody_"+last_year+".datum_zavodu,'%e') AS den_zavodu,DATE_FORMAT(zavody_"+last_year+".datum_zavodu_konec,'%e.%c.%Y') AS datum_zavodu_konec,zavody_"+last_year+".misto_zavodu,typ_zavodu.typ_zavodu,typ_zavodu.icon FROM zavody_"+last_year+",typ_zavodu WHERE zavody_"+last_year+".id_typu_zavodu = typ_zavodu.id_typ_zavodu AND zverejneni IS NOT NULL AND datum_zavodu < '"+today+"' AND nove_vysledky IS NOT NULL ORDER BY datum_zavodu DESC LIMIT 0,"+limit_last_year;
                        connection.query(sql2, function (err, dbdata2) {
                            for(i = 0;i < dbdata2.length;i++){
                                locals.last_results.push(dbdata2[i]);
                            }
                        });
                    }
                    callback();
                });
            },
            function(callback) {
                var sql1 = "SELECT title,link FROM rss WHERE CHAR_LENGTH(title) > 35 AND tema = '1' ORDER BY pubDate DESC LIMIT 0,10;";
                var sql2 = "SELECT title,link FROM rss WHERE CHAR_LENGTH(title) > 35 AND tema = '2' ORDER BY pubDate DESC LIMIT 0,10;";
                var sql3 = "SELECT title,link FROM rss WHERE CHAR_LENGTH(title) > 35 AND tema = '3' ORDER BY pubDate DESC LIMIT 0,10;";
                var sql4 = "SELECT title,link FROM rss WHERE CHAR_LENGTH(title) > 35 AND tema = '4' ORDER BY pubDate DESC LIMIT 0,10;";
                var sql5 = "SELECT twitter_list.user_name,twitter_list.screen_name,twitter_tweets.text,twitter_tweets.retweeted FROM twitter_list,twitter_tweets WHERE twitter_list.list = 1 AND twitter_list.user_id = twitter_tweets.user_id ORDER BY twitter_tweets.created_at DESC LIMIT 0,10;";
                var sql6 = "SELECT twitter_list.user_name,twitter_list.screen_name,twitter_tweets.text,twitter_tweets.retweeted FROM twitter_list,twitter_tweets WHERE twitter_list.list = 2 AND twitter_list.user_id = twitter_tweets.user_id ORDER BY twitter_tweets.created_at DESC LIMIT 0,10";
                connection.query(sql1+sql2+sql3+sql4+sql5+sql6,function (err, dbdata) {
                    locals.rssTriatlon = dbdata[1];
                    locals.rssCyklistika = dbdata[2];
                    locals.rssBeh = dbdata[3];
                    locals.rssEnglish = dbdata[4];
                    locals.tweets_czech = dbdata[5];
                    locals.tweets_foreign = dbdata[6];
                    callback();
                });
            }
        ], function(err) { //This is the final callback
            console.log(locals);

            res.render('testy',locals);

        });
    });
});










module.exports = router;






