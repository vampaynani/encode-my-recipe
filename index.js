var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');

var url = process.argv[2];
var recipe = {};
request(url, function(err, res, html){
	if(!err){
  	var $ = cheerio.load(html);
  	recipe.ingredients = [];
    $('.recipe-block ul li').map(function(index, item){
    	recipe.ingredients.push($(item).text());
    });
    recipe.title = $('.content-block h1').text();
    recipe.ttime = $('.recipe-info__item:nth-child(3) span').text();
    recipe.yield = $('.recipe-info__item:nth-child(4) span').text();
    recipe.image = $('.content-block img').attr('src');
    recipe.url = $('meta[property="og:url"]').attr('content');
    
    var filename = recipe.url.replace('https://ohmyveggies.com/','').replace('/','');
    console.log(filename);
    fs.writeFile('data/'+filename+'.json', JSON.stringify(recipe, null, 4), function(err){
    	console.log('recipe successfully written!');
    })
  }
});   
