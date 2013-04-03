
function onBodyLoad() {
	console.log("onBodyLoad");
	if (location.href.substr(0, 4) == 'file') {
		log("isDevice");
		document.addEventListener("deviceready", onDeviceReady, false);
	} else {
	}
}
window.onload = onBodyLoad();

function onDeviceReady() {
	console.log("onDeviceReady");
	angular.bootstrap(document, ['ngView']);
	console.log("device.platform = "+device.platform);
	// set device bools
	device.android 	= false;
	device.bada 	= false;
	device.blackberry = false;
	device.ios 		= false;
	device.tizen 	= false;
	device.webos 	= false;
	device.windows 	= false;
	device.winphone = false;
	if(device.platform == 'Android') 			device.android = true;
	//else if(device.platform == 'Bada') 			device.bada = true;
	else if(device.platform == 'BlackBerry') 	device.blackberry = true;
	else if (device.platform == 'iPhone' ||
		device.platform == 'iPhone Simulator' ||
		device.platform == 'iPad' ||
		device.platform == 'iPad Simulator') 	device.ios = true;
	//else if(device.platform == 'Tizen') 		device.tizen = true;
	//else if(device.platform == 'webOS') 		device.webos = true;
	//else if(device.platform == 'Windows 8') 	device.windows = true;
	//else if(device.platform == 'Windows Phone') device.winphone = true;
	console.log("addEventListeners");
	document.addEventListener("pause", onPause, false);
	document.addEventListener("resume", onResume, false);
	document.addEventListener("online", onOnline, false);
	document.addEventListener("offline", onOffline, false);
	document.addEventListener("backbutton", onBackKeyDown, false);
	window.addEventListener("batterycritical", onBatteryCritical, false);
	window.addEventListener("batterylow", onBatteryLow, false);
	window.addEventListener("batterystatus", onBatteryStatus, false);
	document.addEventListener("menubutton", onMenuKeyDown, false);
	document.addEventListener("searchbutton", onSearchKeyDown, false);
	document.addEventListener("startcallbutton", onStartCallKeyDown, false);
	document.addEventListener("endcallbutton", onEndCallKeyDown, false);
	document.addEventListener("volumedownbutton", onVolumeDownKeyDown, false);
	document.addEventListener("volumeupbutton", onVolumeUpKeyDown, false);
	angular.element($0).scope().device = device;
}

//** Deveice Events - Cordova **//
// http://docs.phonegap.com/en/edge/cordova_events_events.md.html#Events

function onPause() {	// don't use only called on return
	// Handle the pause event
	console.log("device.onPause");
	// send stats
}

function onResume() {
	// Handle the resume event
	console.log("device.onResume");
	angular.element($0).scope().checkSession();
}

function onOnline() {
	// Handle the online event
	console.log("device.onOnline");
}

function onOffline() {
	// Handle the online event
	console.log("device.onOffline");
}

// Android, BlackBreey and Windows Hardware //
function onBackKeyDown() {
	// Handle the back button
	console.log("device.onBackKeyDown");
	back.go();
}

function onBatteryCritical() {
	console.log("device.onBatteryCritical");
}
function onBatteryLow() {
	console.log("device.onBatteryLow");
}
function onBatteryStatus() {
	console.log("device.onBatteryStatus");
}

// Android and BlackBreey Hardware //
function onMenuKeyDown() {
	// Handle the back button
	console.log("device.onMenuKeyDown");
}

// Android Hardware //
function onSearchKeyDown() {
	// Handle the search button
	console.log("device.onSearchKeyDown");
}

// BlackBerry Hardware //
function onStartCallKeyDown() {
	// Handle the start call button
	console.log("device.onStartCallKeyDown");
}

// BlackBerry Hardware //
function onEndCallKeyDown() {
	// Handle the end call button
	console.log("device.onEndCallKeyDown");
}

// BlackBerry Hardware //
function onVolumeDownKeyDown() {
	// Handle the volume down button
	console.log("device.onVolumeDownKeyDown");
}

// BlackBerry Hardware //
function onVolumeUpKeyDown() {
	// Handle the volume up button
	console.log("device.onVolumeUpKeyDown");
}

//** Functions **//
/*function openURL(url) {
	//log(url);
	if (device_ios) {
		//log('ios');
		window.plugins.childBrowser.showWebPage(url);
	} else if (device_android) {
	} else if (device_bb) {
	} else {
		window.open(url);
	}}*/
