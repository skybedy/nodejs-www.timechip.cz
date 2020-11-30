var express = require('express');
var router = express.Router();
var shortcuts = require('../global.js');

router.get('/:year', function(req, res) {
    var year = req.params.year;
    var sqlshortcut = new shortcuts(year);
    req.getConnection(function(err,connection){
        var sql1 = "SELECT "+sqlshortcut.zavody+".nazev_zavodu,DATE_FORMAT("+sqlshortcut.zavody+".datum_zavodu,'%e. %c') AS datum,DATE_FORMAT("+sqlshortcut.zavody+".datum_zavodu,'%e') AS den_zavodu,DATE_FORMAT("+sqlshortcut.zavody+".datum_zavodu_konec,'%e. %c') AS datum_zavodu_konec,"+sqlshortcut.zavody+".misto_zavodu,"+sqlshortcut.zavody+".web,"+sqlshortcut.zavody+".prihlasky,"+sqlshortcut.zavody+".nove_vysledky,"+sqlshortcut.zavody+".id_zavodu,typ_zavodu.typ_zavodu,"+year+" AS year FROM "+sqlshortcut.zavody+",typ_zavodu WHERE "+sqlshortcut.zavody+".typ_zavodu = typ_zavodu.id_typ_zavodu AND zverejneni > 0 ORDER BY datum_zavodu,nazev_zavodu";
        if(year < 2014){
            var sql1 = "SELECT "+sqlshortcut.zavody+".nazev_zavodu,DATE_FORMAT("+sqlshortcut.zavody+".datum_zavodu,'%e. %c') AS datum,DATE_FORMAT("+sqlshortcut.zavody+".datum_zavodu,'%e') AS den_zavodu,DATE_FORMAT("+sqlshortcut.zavody+".datum_zavodu_konec,'%e. %c') AS datum_zavodu_konec,"+sqlshortcut.zavody+".misto_zavodu,"+sqlshortcut.zavody+".id_zavodu,typ_zavodu.typ_zavodu,"+year+" AS year FROM "+sqlshortcut.zavody+",typ_zavodu WHERE "+sqlshortcut.zavody+".typ_zavodu = typ_zavodu.id_typ_zavodu AND zverejneni IS NOT NULL ORDER BY datum_zavodu,nazev_zavodu";
        }
        console.log(sql1);
        connection.query(sql1, function (err, rows) {
            res.render('zavody',{
                title: 'Závody '+year,
                h1: 'Závody '+year,
                sql:'',
                data:rows
            })
        });
    });
});

module.exports = router;
