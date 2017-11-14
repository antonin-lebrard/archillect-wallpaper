# Archillect Live Wallpaper

Fetch the last archillect image and set it as a wallpaper. Refresh it each 10 minutes (current post interval of the archillect bot)

Should support macOS, Linux and Windows.

No unnecessary dependancy, only depends on the [wallpaper](https://www.npmjs.com/package/wallpaper) 
npm module for the multi-platform support, so very small dependency and code footprint.

If you want to change way the wallpaper is displayed (fill, fit, strech, center), you may do so [here](https://github.com/antonin-lebrard/archillect-wallpaper/blob/master/index.js#L117).

And if you're behind a proxy you manually can set the ip and port 
[here](https://github.com/antonin-lebrard/archillect-wallpaper/blob/master/index.js#L49) and
[here](https://github.com/antonin-lebrard/archillect-wallpaper/blob/master/index.js#L50), 
you will also need to set to true the variable ```isBehindProxy``` [here](https://github.com/antonin-lebrard/archillect-wallpaper/blob/master/index.js#L102)
