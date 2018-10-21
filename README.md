# lyric-get

[![npm version](https://badge.fury.io/js/better-lyric-get.svg)](https://badge.fury.io/js/better-lyric-get)

Module for fetching lyrics from lyrics.wikia.com using artist name and song.
While it <u>is</u> illegal to use this:

> [...]not use any robot, spider, scraper or other automated means to access the Site for any purpose without our express written permission[...]

for those of you who don't care here it is!

# Installation

`npm install better-lyric-get`

# Usage

```js
var l = require("better-lyric-get");

l.get("John Lennon", "Imagine", (err, res) => {
    if(err) {
        console.log(err); // "Song not found"
    } else {
        console.log(res); // { lyrics: "...", author: "John Lennon", title: "Imagine" }
    }
});
```
