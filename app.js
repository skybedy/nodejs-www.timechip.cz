var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var hbs = require('hbs');
//var hbs = require('./helpers/index');
var routes = require('./routes/index');
var vysledky = require('./routes/vysledky_zal');
var zavody = require('./routes/zavody');
var kontakt = require('./routes/kontakt');
var about = require('./routes/about');
var fs = require('fs');
var template_path = __dirname + '/views/partials/template/';
var encode = 'utf8';
var Autolinker = require('autolinker');
var mysql = require('mysql');
var myConnection = require('express-myconnection');
var app = express();
var moment = require('moment');
var form_validation =  require('handlebars-form-helpers');
var Twitter = require('twitter');
var testy = require('./routes/testy');

var client = new Twitter({
    consumer_key: 'obSVSRdXoLVi8Tuob2BxQBcEn',
    consumer_secret: '1DCGf549WRp702my9Q35NNEfKajg1EuP006pTwp2ccjiwQWibV',
    access_token_key: '199484124-hLTtRF5k7Tpj3BvCjyFli51oKg7eNvOOt85F83Y8',
    access_token_secret: 'AN4AttUNdtAhszzkQAuwcLHBEDsuazhGfF8M4elpBjEBt'
});


var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'skybedy',
    password : 'mk1313life',
    database : 'timechip_cz',
    charset: 'utf8mb4_czech_ci',
    multipleStatements: true
});




var dbOptions = {
    host: 'localhost',
    user: 'skybedy',
    password: 'mk1313life',
    port: 3306,
    database: 'timechip_cz',
    multipleStatements: true
};



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.locals.pagetitle = 'Aweseome webpage';

hbs.registerPartial('head',fs.readFileSync(template_path + 'head.hbs',encode));
hbs.registerPartial('navbar',fs.readFileSync(template_path + 'navbar.hbs',encode));
hbs.registerPartial('underbar',fs.readFileSync(template_path + 'underbar.hbs',encode));
hbs.registerPartial('resultsbar',fs.readFileSync(template_path + 'resultsbar.hbs',encode))
hbs.registerPartial('footer',fs.readFileSync(template_path + 'footer.hbs',encode));
hbs.registerPartials(__dirname + '/views/partials/content');



hbs.registerHelper("StringShorter", function(value){
    return value.replace(/^(.{45}[^\s]*).*/, "$1" + "...");
});

hbs.registerHelper("ToDash", function(value){
    return value.replace(/_/g, "-");
});
hbs.registerHelper("PlusOne", function(value, options){
    return parseInt(value) + 1;
});

hbs.registerHelper("autolinker",function(value){
    return Autolinker.link(value);
});

hbs.registerHelper('list-twitter', function(items, options) {
    var out = '<li class="list-group-item-heading clearfix"><h4>'+options.hash.nadpis+'</h4><span class="fontello icon-'+options.hash.icon+'"></span></li>';
    for(var i=0, l=items.length; i<l; i++) {
        out = out + '<li class="list-group-item '+options.hash.class+'">' + options.fn(items[i]) + '</li>';
    }
    return out;
});

hbs.registerHelper('LapTimes', function(items, options) {
    var out = '';
    for(var i=0;i<=4; i++) {
        out = out + '<td>items</td>';
    }
    return out;
});




hbs.registerHelper("form_validation",function(value){
    return form_validation;
});






// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));

//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(myConnection(mysql, dbOptions, 'single'));

/*
//ponechat do rezervy
app.use('/zavody/:year', function (req, res, next) {
    global.sqlzavody = 'zavody_'+req.params.year;
    next();
})
*/


app.use('/', routes);
app.use('/zavody', zavody);
app.use('/vysledky', vysledky);
app.use('/kontakt', kontakt);
app.use('/about', about);
app.use('/testy', testy);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}


// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


/*
 //client.get('/lists/statuses.json',{list_id:188661547,slug:'czech',count:50},function(err,tweet){
 client.get('/lists/statuses.json',{list_id:188673194,slug:'foreign',count:50},function(err,tweet) {
 //console.log(tweet);
 var reportfile = JSON.stringify(tweet,'NULL','\t');
 fs.writeFile('report.txt',reportfile);
 connection.connect();
 for(var i=1;i<=tweet.length;i++){
 var text = connection.escape(tweet[i-1].text);
 var retweeted = 'NULL';
 var created_at = moment(tweet[i-1].created_at,'ddd MMM DD HH:mm:ss ZZ YYYY');
 if(tweet[i-1].retweeted_status){
 text = connection.escape(tweet[i-1].retweeted_status.text);
 retweeted = connection.escape(tweet[i-1].retweeted_status.user.screen_name);

 }

 //var sql = "INSERT INTO twitter_tweets VALUES ("+tweet[i-1].id+",tweet[i-1].id_str.toString()","+tweet[i-1].user.id+","+connection.escape(neco)+",NOW());";
 var sql = "INSERT INTO twitter_tweets VALUES ("+tweet[i-1].id+","+tweet[i-1].id_str.toString()+","+tweet[i-1].user.id+","+tweet[i-1].user.id_str.toString()+","+retweeted+","+text+","+created_at+");";
 //console.log(sql);
 connection.query(sql,function(err, rows, fields) {
 if (err) throw err;
 });
 }
 connection.end();
 })



 client.get('/lists/members.json',{list_id:188673194,slug:'foreign',count:100},function(err,members) {
 //client.get('/lists/members.json',{list_id:188661547,slug:'czech',count:100},function(err,members) {
 var reportfile = JSON.stringify(members,'NULL','\t');
 fs.writeFile('report.txt',reportfile);
 for(var i=1;i<=members.users.length;i++){
 var user_name = connection.escape(members.users[i-1].name);
 var screen_name = connection.escape(members.users[i-1].screen_name);
 var user_id_str = connection.escape(members.users[i-1].id_str);

 var sql = "INSERT INTO twitter_list VALUES ("+members.users[i-1].id_str+","+user_id_str+","+user_name+","+screen_name+",2)";
 console.log(sql);
 connection.query(sql);
 }
 });

 */

/*
 client.stream('statuses/filter',{follow: us}, function(stream) {
 stream.on('data', function(tweet) {
 if(tweet.created_at){
 var text = connection.escape(tweet.text);
 var retweeted = 'NULL';
 var created_at = moment(tweet.created_at,'ddd MMM DD HH:mm:ss ZZ YYYY');
 if(tweet.retweeted_status){
 text = connection.escape(tweet.retweeted_status.text);
 retweeted = connection.escape(tweet.retweeted_status.user.screen_name);
 }
 var sql = "INSERT INTO twitter_tweets VALUES ("+tweet.id+","+tweet.id_str.toString()+","+tweet.user.id+","+tweet.user.id_str.toString()+","+retweeted+","+text+","+created_at+");";
 connection.query(sql, function(err) {
 if (err) throw err
 console.log(sql);
 });

 }

 if(tweet.delete){
 var id_str = tweet.delete.status.id_str.toString();
 var sql = "DELETE FROM twitter_tweets WHERE id_str LIKE '"+id_str+"'";
 connection.query(sql, function(err) {
 if (err) throw err
 console.log(sql);
 });
 }
 });
 })
 */

/*
 var sql0 = "SELECT * FROM twitter_list";
 var us = [];
 var str = '';
 connection.query(sql0, function(err, users) {
 if (err) throw err
 for(var k=1;k<=users.length;k++){
 //us.push(users[k-1].user_id_str);
 str += users[k-1].user_id_str + ',';
 }

 client.stream('statuses/filter',{follow: str}, function(stream) {
 stream.on('data', function(tweet) {
 if(tweet.created_at){
 var sql1 = "SELECT user_id_str FROM twitter_list WHERE user_id_str = '"+tweet.user.id_str.toString()+"'";
 //console.log(sql1);
 connection.query(sql1, function(err,rows) {
 if (err) throw err
 if(rows.length > 0){
 //console.log(rows);
 var text = connection.escape(tweet.text);
 var retweeted = 'NULL';
 var created_at = moment(tweet.created_at,'ddd MMM DD HH:mm:ss ZZ YYYY');
 if(tweet.retweeted_status){
 text = connection.escape(tweet.retweeted_status.text);
 retweeted = connection.escape(tweet.retweeted_status.user.screen_name);
 }
 var sql2 = "INSERT INTO twitter_tweets VALUES ("+tweet.id+","+tweet.id_str.toString()+","+tweet.user.id+","+tweet.user.id_str.toString()+","+retweeted+","+text+","+created_at+");";
 connection.query(sql2, function(err) {
 if (err) throw err
 //console.log(sql2);
 });
 }
 });
 }

 if(tweet.delete){
 var id_str = tweet.delete.status.id_str.toString();
 var sql = "DELETE FROM twitter_tweets WHERE id_str LIKE '"+id_str+"'";
 connection.query(sql, function(err) {
 if (err) throw err
 console.log(sql);
 });
 }
 });
 })
 });

*/




app.listen(process.env.PORT || 1313);
console.log('Jsem jako na trní co bude a na portu 1313');
module.exports = app;
