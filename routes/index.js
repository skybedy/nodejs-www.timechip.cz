var express = require('express');
var router = express.Router();
var shortcuts = require('../global.js');
var moment = require('moment');
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
        async.series([
            function(callback) {
                var sql1 = "SELECT "+sqlshortcut.zavody+".nazev_zavodu,"+sqlshortcut.zavody+".web,DATE_FORMAT("+sqlshortcut.zavody+".datum_zavodu,'%e.%c.%Y') AS datum,DATE_FORMAT("+sqlshortcut.zavody+".datum_zavodu,'%e') AS den_zavodu,DATE_FORMAT("+sqlshortcut.zavody+".datum_zavodu_konec,'%e.%c.%Y') AS datum_zavodu_konec,"+sqlshortcut.zavody+".misto_zavodu,typ_zavodu.typ_zavodu,typ_zavodu.icon FROM "+sqlshortcut.zavody+",typ_zavodu WHERE "+sqlshortcut.zavody+".typ_zavodu = typ_zavodu.id_typ_zavodu AND zverejneni > 0 AND datum_zavodu > '"+today+"' ORDER BY datum_zavodu LIMIT 0,4";
                connection.query(sql1, function (err, dbdata1) {
                    locals.next_events = dbdata1;
                    if(dbdata1.length < 4){
                        var limit_next_year = 4 - dbdata1.length;
                        var next_year = current_year + 1;
                        var sql2 = "SELECT zavody_"+next_year+".nazev_zavodu,zavody_"+next_year+".web,DATE_FORMAT(zavody_"+next_year+".datum_zavodu,'%e.%c.%Y') AS datum,DATE_FORMAT(zavody_"+next_year+".datum_zavodu,'%e') AS den_zavodu,DATE_FORMAT(zavody_"+next_year+".datum_zavodu_konec,'%e.%c.%Y') AS datum_zavodu_konec,zavody_"+next_year+".misto_zavodu,typ_zavodu.typ_zavodu,typ_zavodu.icon FROM zavody_"+next_year+",typ_zavodu WHERE zavody_"+next_year+".typ_zavodu = typ_zavodu.id_typ_zavodu AND zverejneni IS NOT NULL AND datum_zavodu > '"+today+"' ORDER BY datum_zavodu LIMIT 0,"+limit_next_year;
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
                var sql1 = "SELECT "+current_year+" AS year,"+sqlshortcut.zavody+".nazev_zavodu,"+sqlshortcut.zavody+".id_zavodu,DATE_FORMAT("+sqlshortcut.zavody+".datum_zavodu,'%e.%c.%Y') AS datum,DATE_FORMAT("+sqlshortcut.zavody+".datum_zavodu,'%e') AS den_zavodu,DATE_FORMAT("+sqlshortcut.zavody+".datum_zavodu_konec,'%e.%c.%Y') AS datum_zavodu_konec,"+sqlshortcut.zavody+".misto_zavodu,typ_zavodu.typ_zavodu,typ_zavodu.icon FROM "+sqlshortcut.zavody+",typ_zavodu WHERE "+sqlshortcut.zavody+".typ_zavodu = typ_zavodu.id_typ_zavodu AND zverejneni IS NOT NULL AND datum_zavodu <= '"+today+"' AND nove_vysledky > 0 ORDER BY datum_zavodu DESC LIMIT 0,4;";
                connection.query(sql1, function (err, dbdata1) {
                    locals.last_results = dbdata1;
                    if(dbdata1.length < 4){
                        var limit_last_year = 4 - dbdata1.length;
                        var last_year = current_year - 1;
                        var sql2 = "SELECT "+last_year+" AS year,zavody_"+last_year+".nazev_zavodu,zavody_"+last_year+".id_zavodu,DATE_FORMAT(zavody_"+last_year+".datum_zavodu,'%e.%c.%Y') AS datum,DATE_FORMAT(zavody_"+last_year+".datum_zavodu,'%e') AS den_zavodu,DATE_FORMAT(zavody_"+last_year+".datum_zavodu_konec,'%e.%c.%Y') AS datum_zavodu_konec,zavody_"+last_year+".misto_zavodu,typ_zavodu.typ_zavodu,typ_zavodu.icon FROM zavody_"+last_year+",typ_zavodu WHERE zavody_"+last_year+".typ_zavodu = typ_zavodu.id_typ_zavodu AND zverejneni IS NOT NULL AND datum_zavodu <= '"+today+"' AND nove_vysledky > 0 ORDER BY datum_zavodu DESC LIMIT 0,"+limit_last_year;
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
                    locals.rssTriatlon = dbdata[0];
                    locals.rssCyklistika = dbdata[1];
                    locals.rssBeh = dbdata[2];
                    locals.rssEnglish = dbdata[3];
                    locals.tweets_czech = dbdata[4];
                    locals.tweets_foreign = dbdata[5];
                    callback();
                });
            }
        ], function(err) { //This is the final callback
            //console.log(locals);
            res.render('index',locals);
        });
    });
});








router.get('/xxxxxxxxx', function(req, res) {
    var today = moment().format('YYYY-MM-DD');
    req.getConnection(function(err,connection){
        var sql0 = "SELECT "+sqlshortcut.zavody+".nazev_zavodu,"+sqlshortcut.zavody+".web,DATE_FORMAT("+sqlshortcut.zavody+".datum_zavodu,'%e.%c.%Y') AS datum,DATE_FORMAT("+sqlshortcut.zavody+".datum_zavodu,'%e') AS den_zavodu,DATE_FORMAT("+sqlshortcut.zavody+".datum_zavodu_konec,'%e.%c.%Y') AS datum_zavodu_konec,"+sqlshortcut.zavody+".misto_zavodu,typ_zavodu.typ_zavodu,typ_zavodu.icon FROM "+sqlshortcut.zavody+",typ_zavodu WHERE "+sqlshortcut.zavody+".typ_zavodu = typ_zavodu.id_typ_zavodu AND zverejneni IS NOT NULL AND datum_zavodu > '"+today+"' ORDER BY datum_zavodu LIMIT 0,4;";
        //console.log(sql0);
        var sql1 = "SELECT "+current_year+" AS year,"+sqlshortcut.zavody+".nazev_zavodu,"+sqlshortcut.zavody+".id_zavodu,DATE_FORMAT("+sqlshortcut.zavody+".datum_zavodu,'%e.%c.%Y') AS datum,DATE_FORMAT("+sqlshortcut.zavody+".datum_zavodu,'%e') AS den_zavodu,DATE_FORMAT("+sqlshortcut.zavody+".datum_zavodu_konec,'%e.%c.%Y') AS datum_zavodu_konec,"+sqlshortcut.zavody+".misto_zavodu,typ_zavodu.typ_zavodu,typ_zavodu.icon FROM "+sqlshortcut.zavody+",typ_zavodu WHERE "+sqlshortcut.zavody+".typ_zavodu = typ_zavodu.id_typ_zavodu AND zverejneni IS NOT NULL AND datum_zavodu < '"+today+"' AND nove_vysledky IS NOT NULL ORDER BY datum_zavodu DESC LIMIT 0,4;";
        //var sql2 = "SELECT title,link FROM rss WHERE tema = '1' ORDER BY pubDate DESC LIMIT 0,6;";
        //var sql3 = "SELECT title,link FROM rss WHERE tema = '2' ORDER BY pubDate DESC LIMIT 0,6;";
        //var sql4 = "SELECT title,link FROM rss WHERE tema = '3' ORDER BY pubDate DESC LIMIT 0,6;";
        //var sql5 = "SELECT title,link FROM rss WHERE tema = '4' ORDER BY pubDate DESC LIMIT 0,6";
        var sql2 = "SELECT title,link FROM rss WHERE CHAR_LENGTH(title) > 35 AND tema = '1' ORDER BY pubDate DESC LIMIT 0,10;";
        var sql3 = "SELECT title,link FROM rss WHERE CHAR_LENGTH(title) > 35 AND tema = '2' ORDER BY pubDate DESC LIMIT 0,10;";
        var sql4 = "SELECT title,link FROM rss WHERE CHAR_LENGTH(title) > 35 AND tema = '3' ORDER BY pubDate DESC LIMIT 0,10;";
        var sql5 = "SELECT title,link FROM rss WHERE CHAR_LENGTH(title) > 35 AND tema = '4' ORDER BY pubDate DESC LIMIT 0,10;";
        var sql6 = "SELECT twitter_list.user_name,twitter_list.screen_name,twitter_tweets.text,twitter_tweets.retweeted FROM twitter_list,twitter_tweets WHERE twitter_list.list = 1 AND twitter_list.user_id = twitter_tweets.user_id ORDER BY twitter_tweets.created_at DESC LIMIT 0,10;";
        var sql7 = "SELECT twitter_list.user_name,twitter_list.screen_name,twitter_tweets.text,twitter_tweets.retweeted FROM twitter_list,twitter_tweets WHERE twitter_list.list = 2 AND twitter_list.user_id = twitter_tweets.user_id ORDER BY twitter_tweets.created_at DESC LIMIT 0,10";
        //console.log(sql6);


        connection.query(sql0+sql1+sql2+sql3+sql4+sql5+sql6+sql7 , function (err, rows) {
            console.log(rows);
            //console.log(typeof rows);
            var next_events = rows[0];
            var last_results = rows[1];
            if(rows[1].length < 4){ //pokud je zatím méně než 3 výsledky v roce
                var limit_max = 4-rows[1].length;
                var zavody_last_year = 'zavody_'+(current_year-1);
                var sql3 = "SELECT "+(current_year-1)+" AS year,"+zavody_last_year+".nazev_zavodu,"+zavody_last_year+".id_zavodu,DATE_FORMAT("+zavody_last_year+".datum_zavodu,'%e.%c.%Y') AS datum,DATE_FORMAT("+zavody_last_year+".datum_zavodu,'%e') AS den_zavodu,DATE_FORMAT("+zavody_last_year+".datum_zavodu_konec,'%e.%c.%Y') AS datum_zavodu_konec,"+zavody_last_year+".misto_zavodu,typ_zavodu.typ_zavodu,typ_zavodu.icon FROM "+zavody_last_year+",typ_zavodu WHERE "+zavody_last_year+".typ_zavodu = typ_zavodu.id_typ_zavodu AND zverejneni IS NOT NULL AND datum_zavodu < '"+today+"' AND nove_vysledky IS NOT NULL ORDER BY datum_zavodu DESC LIMIT 0,"+limit_max;
                var last_results_beetween_years = [];
                connection.query(sql3, function (err, rows1) {
                    for(var k = 1;k <= last_results.length;k++){
                        last_results_beetween_years.push(last_results[k-1]);
                    }
                    for(var i = 1;i <= rows1.length;i++){
                        last_results_beetween_years.push(rows1[i-1]);
                    }
                    //client.get('/lists/statuses.json',{list_id:188661547,slug:'czech',count:15},function(err,tweets_czech){
                        //client.get('/lists/statuses.json',{list_id:188673194,slug:'foreign',count:15},function(err,tweets_foreign) {
                        res.render('index',{
                                title: 'Hlavní strana',
                                h1: 'Hlavní strana',
                                sql:'',
                                next_events: next_events,
                                last_results:last_results_beetween_years,
                                rssTriatlon:rows[2],
                                rssCyklistika:rows[3],
                                rssBeh:rows[4],
                                rssEnglish:rows[5],
                                tweets_czech: rows[6],
                                tweets_foreign:rows[7]
                            })

                        //})

                    //})

                });
            }
            else{
                res.render('index',{
                    title: 'Hlavní strana',
                    h1: 'Hlavní strana',
                    next_events: next_events,
                    last_results:last_results,
                    rssTriatlon:rows[2],
                    rssCyklistika:rows[3],
                    rssBeh:rows[4],
                    rssEnglish:rows[5],
                    tweets_czech: rows[6],
                    tweets_foreign:rows[7]
                })

            }
        });
    });
});

module.exports = router;