
// BrowserDetect.browser
var BrowserDetect = {
	init: function () {
		this.name = this.searchString(this.dataBrowser) || "An unknown browser";
		this.version = this.searchVersion(navigator.userAgent)
			|| this.searchVersion(navigator.appVersion)
			|| "an unknown version";
		this.OS = this.searchString(this.dataOS) || "an unknown OS";
		this.latest = this.isLatest();
		this.plugins = this.checkPlugins();
	},
	searchString: function (data) {
		for (var i=0,l=data.length;i<l;i++)	{
			var dataString = data[i].string;
			var dataProp = data[i].prop;
			this.versionSearchString = data[i].versionSearch || data[i].identity;
			if (data[i].versionMinimum) this.versionMinimum = data[i].versionMinimum;
			if (dataString) {
				if (dataString.indexOf(data[i].subString) != -1)
					return data[i].identity;
			}
			else if (dataProp)
				return data[i].identity;
		}
	},
	searchVersion: function (dataString) {
		var index = dataString.indexOf(this.versionSearchString);
		if (index == -1) return;
		return /([\d\.]+)/.exec(dataString.substring(index+this.versionSearchString.length+1))[0];
		//return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
	},
	isLatest: function() {
		var min = BrowserDetectMinVersion[this.name].split(","),
			has = this.version.split(".");
		for (var i = 0, ml = min.length, hl = has.length; i < ml && i < hl; i++) {
			if (has[i] < min[i]) return false;
			else if (has[i] > min[i]) return true;
		}
		return true;
	},
	checkPlugins: function() {
		var plugins = {};
		for (var plugin in PluginDetectMinVersion) {
			plugins[plugin.toLowerCase()] = (PluginDetect.isMinVersion(plugin, PluginDetectMinVersion[plugin]) >= -0.1);
		}
		return plugins;
	},
	dataBrowser: [
		{
			string: navigator.userAgent,
			subString: "Chrome",
			identity: "Chrome"
		},
		{
			string: navigator.userAgent,
			subString: "OmniWeb",
			versionSearch: "OmniWeb/",
			identity: "OmniWeb"
		},
		{
			string: navigator.vendor,
			subString: "Apple",
			identity: "Safari",
			versionSearch: "Version"
		},
		{
			prop: window.opera,
			identity: "Opera",
			versionSearch: "Version"
		},
		{
			string: navigator.vendor,
			subString: "iCab",
			identity: "iCab"
		},
		{
			string: navigator.vendor,
			subString: "KDE",
			identity: "Konqueror"
		},
		{
			string: navigator.userAgent,
			subString: "Firefox",
			identity: "Firefox"
		},
		{
			string: navigator.vendor,
			subString: "Camino",
			identity: "Camino"
		},
		{		// for newer Netscapes (6+)
			string: navigator.userAgent,
			subString: "Netscape",
			identity: "Netscape",
			versionMinimum:"9.0.0.6"
		},
		{		// for older Netscapes (4-)
			string: navigator.userAgent,
			subString: "Mozilla",
			identity: "Netscape",
			versionSearch: "Mozilla"
		},
		{
			string: navigator.userAgent,
			subString: "Gecko",
			identity: "Mozilla",
			versionSearch: "rv"
		},
		{
			string: navigator.userAgent,
			subString: "MSIE",
			identity: "Explorer",
			versionSearch: "MSIE"
		}
	],
	dataOS : [
		{
			string: navigator.platform,
			subString: "Win",
			identity: "Windows"
		},
		{
			string: navigator.platform,
			subString: "Mac",
			identity: "Mac"
		},
		{
			string: navigator.userAgent,
			subString: "iPhone",
			identity: "iPhone/iPod"
		},
		{
			string: navigator.platform,
			subString: "Linux",
			identity: "Linux"
		}
	]

};
BrowserDetect.init();