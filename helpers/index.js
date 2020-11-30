var hlprs = function(){
    var hbs = require('hbs');
    hbs.registerPartial('head',fs.readFileSync(template_path + 'head.hbs',encode));
    hbs.registerPartial('navbar',fs.readFileSync(template_path + 'navbar.hbs',encode));
    hbs.registerPartial('underbar',fs.readFileSync(template_path + 'underbar.hbs',encode));
    hbs.registerPartial('footer',fs.readFileSync(template_path + 'footer.hbs',encode));
    hbs.registerPartials(__dirname + '/views/partials/content');

    hbs.registerHelper("inc", function(value, options){
        return parseInt(value) + 1;
    });
    hbs.registerHelper("StringShorter", function(value){
        return value.replace(/^(.{45}[^\s]*).*/, "$1" + "...");
    });

}

module.exports = hlprs;