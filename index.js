var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');

var url = process.argv[2];

if(url == 'index'){
  parseIndex();
}else{
  getRecipe(url, true);
}

function parseIndex(){
  var recipes = [];
  request('https://ohmyveggies.com/oh-my-veggies-recipe-index/', function(err, res, html){
    if(!err){
      var $ = cheerio.load(html);
      $('.recipe-index-page p').map(function(index, item){
        var anchors = $(item).find('a');
        if(anchors.length > 1){
          anchors.map(function(index, item){
            var itemText = $(item).text();
            var itemURL = $(item).attr('href');
            if(itemText !== ''){
              var recipe = getRecipe(itemURL, false);
              console.log(recipe);
              //recipes.push(getRecipe(itemURL, false));
            }
          });
        }
      });
      console.log(recipes);
    }
  }); 
}

function getRecipe(url, isFile){
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
      
      if(isFile){
        var filename = recipe.url.replace('https://ohmyveggies.com/','').replace('/','');
        fs.writeFile('data/'+filename+'.json', JSON.stringify(recipe, null, 4), function(err){
      	 console.log('recipe successfully written!');
        });
      }else{
        return recipe;
      }
    }
  }); 
}  
