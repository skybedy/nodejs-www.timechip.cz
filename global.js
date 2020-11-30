
var shortcuts = function(year,kod_zavodu){
    this.zavod = 'zavod_'+kod_zavodu+'_'+year;
    this.kategorie = 'kategorie_'+year;
    this.zavody = 'zavody_'+year;
    this.vysledky = 'vysledky_'+kod_zavodu+'_'+year+'_test';
    this.menu_vysledky = 'menu_vysledky_'+year;
    this.podzavody = 'podzavody_'+year;
}

module.exports = shortcuts;
