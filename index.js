var request    = require('request');
var cheerio    = require('cheerio');
var _          = require('underscore');


module.exports = {
	get: function(artist, song, callback) {

		var lyrics = "";

		url = 'http://lyrics.wikia.com/wiki/' + artist + ':' + song;


		request(url, function(error, response, html) {
	        if(error)
	        {
	       		callback(error, null);
	        }
	        else
	        {

		        var $ = cheerio.load(html);
		        $('script').remove();
		        var lyrics = ($('.lyricbox').html());
						var title = ($(".page-header__title").text().replace(" Lyrics", "").split(":"))

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
				// replace newlines
				lyrics = lyrics.replace(/<br>/g, '\n');
				// remove all tags
				lyrics = lyrics.replace(/<[^>]*>/g, '');

				//console.log(lyrics);
				if (lyrics == "Unfortunately, we are not licensed to display the full lyrics for this song at the moment. Hopefully we will be able to in the future. Until then... how about a random page?") {
					callback("The lyrics were not able to be found because they were unlicensed", null)
				} else if (lyrics != "") {
		      callback(null, { lyrics, title: title[1], author: title[0] });
		    } else {
		      callback("Song not found", null);
		    }
		  }
		});
	}
}
