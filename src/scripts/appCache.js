//-- applicationCache --//
var appCache = {
	percent:0,
	loaded:0,
	total:0
};

function handleCacheEvent(e) {
	if (e.type && (e.type==='progress' || e.type==='ProgressEvent')){
		//console.log('percent:', Math.round(e.loaded/e.total*100)+'%', 'total:', e.total, 'loaded:',e.loaded);
		appCache.percent = Math.round(e.loaded/e.total*100);
		appCache.loaded = e.loaded;
		appCache.total = e.total;

		try {
			angular.element('body').scope().$emit('appCache', appCache);
		} catch(e) { }
	}

	if (applicationCache.status === 4) {
		applicationCache.swapCache();
	}
	/*switch (applicationCache.status) {
		/*case 0: // UNCACHED == 0
				console.log('UNCACHED');
				break;
		case 1: // IDLE == 1
				console.log('IDLE');
				break;
		case 2: // CHECKING == 2
				console.log('CHECKING');
				break;
		case 3: // DOWNLOADING == 3
				console.log('DOWNLOADING');
				break;
		case 4:  // UPDATEREADY == 4
				console.log('UPDATEREADY');
				applicationCache.swapCache();
				console.log(appCache);
				// force new version
				//alert('A new version of this site is available. Load it?');
				//window.location.reload();
				// give option - for large appcache, allow user to complete current task before reload
				//if(confirm('A new version of this site is available. Load it now? Else cancel and reload when you're ready.')) {
				//	window.location.reload();
				//}
				break;
		case 5: // OBSOLETE == 5
				console.log('OBSOLETE');
				break;
		default:
			console.log('UKNOWN CACHE STATUS');
			break;
	}*/
}

/*function handleCacheError(e) {
	console.log('appCache Error');
}*/

if (!!applicationCache) {
	// ** refactor to function loop??

	// Fired after the first cache of the manifest.
	//applicationCache.addEventListener('cached', handleCacheEvent, false);

	// Checking for an update. Always the first event fired in the sequence.
	//applicationCache.addEventListener('checking', handleCacheEvent, false);

	// An update was found. The browser is fetching resources.
	//applicationCache.addEventListener('downloading', handleCacheEvent, false);

	// The manifest returns 404 or 410, the download failed,
	// or the manifest changed while the download was in progress.
	//applicationCache.addEventListener('error', handleCacheError, false);

	// Fired after the first download of the manifest.
	//applicationCache.addEventListener('noupdate', handleCacheEvent, false);

	// Fired if the manifest file returns a 404 or 410.
	// This results in the application cache being deleted.
	//applicationCache.addEventListener('obsolete', handleCacheEvent, false);

	// Fired for each resource listed in the manifest as it is being fetched.
	applicationCache.addEventListener('progress', handleCacheEvent, false);

	// Fired when the manifest resources have been newly redownloaded.
	applicationCache.addEventListener('updateready', handleCacheEvent, false);
} //else {
	// Add in appCache fallback - https://code.google.com/p/html5-gears/source/browse/trunk/src/html5_offline.js
//}
