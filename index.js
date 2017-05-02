var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');

var url = process.argv[2];
var recipe = {};
request(url, function(err, res, html){
	if(!err){
  	var $ = cheerio.load(html);
  	recipe.ingredients = [];
    $('#zlrecipe-ingredients-list li').map(function(index, item){
    	recipe.ingredients.push($(item).text());
    });
    recipe.title = $('.entry-title').text();
    recipe.ttime = $('#zlrecipe-total-time span').text();
    recipe.yield = $('#zlrecipe-yield span').text();
    recipe.image = $($('img.photo')['1']).attr('src');
    recipe.url = $('meta[property="og:url"]').attr('content');
    
    var filename = recipe.url.replace('http://ohmyveggies.com/','').replace('/','');
    fs.writeFile('data/'+filename+'.json', JSON.stringify(recipe, null, 4), function(err){
    	console.log('recipe successfully written!');
    })
  }
});   
