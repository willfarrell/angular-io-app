# Angular.io - AngularJS + Bootstrap

## Terminal
Requires: Yeoman

$ sh **run -b:** runs yeoman and creates dist folders

$ sh **run -t:** runs build, followed by yeoman test

$ sh **run -u:** updates bower packages, then runs build

$ sh **run -c:** removes all folders created by build

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
- restyle css
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



