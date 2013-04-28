# Angular.io - AngularJS + Bootstrap [![Build Status](https://travis-ci.org/willfarrell/angular-io-app.png?branch=master)](https://travis-ci.org/willfarrell/angular-io-app)
## Usage
As few brew requirements if not installed:
```
brew install git git-flow closure-compiler openssl scrypt gpgme
```

If you don't have Yeoman 1.0 Beta install:
```
npm install -g yo grunt-cli bower karma
```

First make a new directory, and `cd` into it:
```
mkdir my-new-project && cd $_
```

Then fetch `angular-io-app`:
```
curl -OLk https://github.com/willfarrell/angular-io-app/tarball/master
```

Then extract `angular-io-app`:
```
tar -zxvf master && rm master
cp -rf willfarrell-angular-io-.../* ./ && rm -rf willfarrell-angular-io-...
```

Finally, install npm and bower dependencies:
```
npm install && bower install --dev
```

Build project:
```
grunt icon_convert
grunt
grunt deploy
grunt phonegap
```

## To Do
- build as generator (generator-angular-io)

## build folders
### dist-web
CDN ready dist.
- index.web.html
- crossdomain.xml
- robots.txt

### dist-phonegap
PhoneGap ready dist.
- index.device.html
- config.xml

### dist-api
API ready dist.
- index.php
- php/

## Plugins
### Follow

### Massaging
#### To Do
- message compose
- scroll to load more

#### Wishlist
- encrypt client side, unreadable by web app. PGP?

### Filepicker
#### Supports
- file upload (single / multi) via select or drag and drop.
- image upload with resizing and cropping before saving.

#### To Do
- AWS CORS support
- upload file from URL (requires proxy server due to browser security)
- support upload from third party services
- refactor code - seperate pages into services, remove controller.
- Connect into camerea to take photo

#### Bugs
- 

#### Wishlist
- User side encryption (for file upload).  Mega?


#### grunt
Use `willfarrell/grunt-usemin` and `willfarrell/html-minifier` -> `grunt/grunt-contrib-htmlmin`. 1 Apr 2013
