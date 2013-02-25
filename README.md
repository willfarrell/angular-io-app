# Angular.io - AngularJS + Bootstrap
Requires: >= Yeoman 1.0 Beta

## Init
npm install generator-angular-io generator-testacular  # install generators
yo angular-io                  # scaffold out a AngularJS project
npm install && bower install   # install default dependencies
#bower install angular-ui      # install a dependency for your project from Bower
grunt test                     # test your app
grunt server                   # preview your app
grunt 						   # build app for distribution

## To Do
- build as generator (generator-angular-io)

## build folders
### dist-web
CDN ready dist.
- index.web.html
- crossdomain.xml
- robots.txt

### dist-device
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



