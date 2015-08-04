// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var request    = require('request');
var cheerio    = require('cheerio');
var _          = require('underscore');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});


// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to lyric-api!\nuse /find/artist/song' });   
});

// more routes for our API will happen here

router.route('/find/:artist/:song')

	.get(function(req,res) {
		
		var lyrics = "";

		request('http://lyrics.wikia.com/api.php?artist='+ req.params.artist +'&title='+ req.params.song +'&fmt=realjson', 
			function(error, response, body) {
				song = JSON.parse(body);

				request(song.url, function(error, response, html) {
			        var $ = cheerio.load(html);
			        $('script').remove();
			        var lyrics = ($('.lyricbox').html());

					/**
					 * Override default underscore escape map
					 */
					var escapeMap = {
					  '&': '&amp;',
					  '<': '&lt;',
					  '>': '&gt;',
					  '"': '&quot;',
					  "'": '&#x27;',
					  "'": '&apos;',
					  '`': '&#x60;',
					  '' : '\n'
					};
					var unescapeMap = _.invert(escapeMap);
					var createEscaper = function(map) {
					  var escaper = function(match) {
					    return map[match];
					  };

					  var source = '(?:' + _.keys(map).join('|') + ')';
					  var testRegexp = RegExp(source);
					  var replaceRegexp = RegExp(source, 'g');
					  return function(string) {
					    string = string == null ? '' : '' + string;
					    return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
					  };
					};
					_.escape = createEscaper(escapeMap);
					_.unescape = createEscaper(unescapeMap);

					// replace html codes with punctuation
					lyrics = _.unescape(lyrics);
					// remove everything between brackets
					lyrics = lyrics.replace(/\[[^\]]*\]/g, '');
					// remove html comments
					lyrics = lyrics.replace(/(<!--)[^-]*-->/g, '');
					// remove all tags
					lyrics = lyrics.replace(/<[^>]*>/g, ' ');


			        res.json(lyrics);
			    });
			});
	});


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);