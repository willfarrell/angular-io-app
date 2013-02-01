# Angular.io - AngularJS + Bootstrap

## build
Requires: Yeoman

$ sh **build:** runs yeoman and creates dist folders

$ sh **build test:** runs build, followed by yeoman test

$ sh **build update:** updates bower packages, then runs build

$ sh **build clean:** removes all folders created by build

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


### Filepicker
#### Supports
- file upload (single / multi) via select or drag and drop.
- image upload with resizing and cropping before saving.
#### To Do
- AWS CORS support
- upload file from URL (requires proxy server due to browser security)
- support upload from third party services
- file download
- refactor code - seperate pages into services, remove controller.
- Connect into camerea to take photo
#### Bugs
- When panning an image it snaps to the center (low priority)
