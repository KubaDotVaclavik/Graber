var jsonfile = require('jsonfile')
var cheerio = require('cheerio')
var fetchUrl = require("fetch").fetchUrl;
var request = require('sync-request');


var data = jsonfile.readFileSync('./data.json')
var newData = []

var idx = 320,
    length = data.length,
    interval = null;

var doWork = function(){
    var d = data[idx];
    
    try{
        var res = request('GET', d.link);
        var $ = cheerio.load(res.getBody().toString())

        var Vitez = $($('.rf-edt-c-cnt')[1]).text()
        var Cena = $('#smlouvniCenaProPrehled').text().split('s DPH')[0]

        d.Cena = Cena || 'null';
        d.Vitez = Vitez || 'null';
        
        switch(true){
            case(d.Kod.indexOf('MV') > -1):
                d.ProKoho = 'MV ČR';
                break;
            case(d.Kod.indexOf('MPSV') > -1):
                d.ProKoho = 'MPSV ČR';
                break;
            case(d.Kod.indexOf('CUZK') > -1):
                d.ProKoho = 'Český úřad zeměměřičský a katastrální';
                break;
            case(d.Kod.indexOf('MD') > -1):
                d.ProKoho = 'MD ČR';
                break;
            case(d.Kod.indexOf('MZP') > -1):
                d.ProKoho = 'MŽP';
                break;
        }

        newData.push(d)

    }catch(e){
        console.error(e)
        clearInterval(interval)
        jsonfile.writeFileSync('./output_' + idx + '.json', newData)
    }


    if(idx === 321){
        clearInterval(interval)
        jsonfile.writeFileSync('./output_' + idx + '.json', newData)
    }
    idx++
}

interval = setInterval(doWork, 1300);
