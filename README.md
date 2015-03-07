### Welcome to the Collaborative Cloud IDE (CCIDE)

CCIDE aims to bring back the "edit-on-the-fly" times of the dark ages of web development without their creepiness. Instead of doing changes directly on FTP on the live server, you can use CCIDE on the staging/development server for a fast and easy way to do small or medium changes*. Test and deploy online on a nearly productive environment without any need for local VMs, MAMP/XAMPP environments and such.

*_for large changes and "real" development a desktop IDE like Webstorm is still recommended_

Also this platform wants to bring pair programming to a new level by adding collaborative features. Two keyboards, two mouses, two brains on one session? No problem... CCIDE fuels your pair programming.

Waking up in the middle of the night and got an incredible idea on how the code you could not get to run at business hours could get done easily? Login to CCIDE, find the environment and everything just as you left it, add the magic pease of code, hit "commit & deploy" and have a big smile over your face when you go back to your well earned sleep. CCIDE will remember everything everywhere. Code from your Tablet or even your mobile phone without installing, without configurations. Just coding. Whenever you want, wherever you want.


### How do I get this running?

There's a demo coming soon - but for now you have to build / test it yourself...

Well but it's as easy as dropping a few lines into your console:

```
$ git clone https://github.com/jbrosi/ccide
$ cd ccide
$ npm install
$ bower install
$ grunt
$ npm start
```

Or when developing / debugging use nodemon (install with `npm install -g nodemon`):
```
nodemon build/ccide_server.js
```

The ccide will run at your localhost on port 80 (default - change with --port xxx) and waiting for inputs. 
For further options see below.

### Run Options

```
--port <number>     #changes port number to <number> (default is 80)
--workspace <path>  #changes workspace to the given path. Defaults to the current directory.
--help              #shows all available help options (will disable all other cli switches when used)
```

### Is it ready for production?

_No! Don't try this yet!_

Unfortunately it is not. We're still pre-pre-alpha - don't expect anything to be stable. There will be a lot of API
changes and improvements before we can reach an almost stable beta status. Although we're trying to keep the master
branch on a relatively stable level. If you want to try it out yourself you should go there and take a look.

### How may I contribute?

We'd appreciate to see some contributions! However there's still the "we don't know yet what license to choose" thing (see chapter "So what's the license?"). So if you do want to contribute you have to send us a signed statement containing the fact that you have written the code all by yourself and that you are willing to give all the rights to the code to us.

We know that sucks and we're trying to decide very soon what license we want to keep up. As soon as this is decided we can provide a form for you for the signment and also preserve some of your rights (hopefully ;)).

When the license stuff is clear and we got your agreement... Just add a pull request :)! We'll happily merge it, if code is all well done and up to our standards.

### What if I got some problems?

Read the pages and the wiki first! If that's no help try searching the issues for the same problem or directly contact us at me@brosi.me.


### At last: What's the license?

MIT, Baby :)! Do (almost) whatever you want. If you like what we do and you use it on larger projects we'd appreciate
if you drop us a message.

The MIT License (MIT)

Copyright (c) 2015 Johannes Brosi <me@brosi.me>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.