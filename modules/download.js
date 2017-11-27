(function(global, factory) {
	"use strict";
	if (typeof module === "object" && typeof module.exports === "object") {
		module.exports = global.document ? factory(global, true) : function(w) {
			if (!w.document) {
				throw new Error("download requires a window with a document");
			}
			return factory(w);
		};
	} else {
		factory(global);
	}
})(typeof window !== "undefined" ? window : this, function(window, noGlobal) {
	function download(url, data) {
		var iframe = document.createElement("iframe");
		if (data) {
			var form = document.createElement("form");
			form.setAttribute("action", url);
			for ( var p in data) {
				var input = document.createElement("input");
				input.setAttribute("type", "hidden");
				input.setAttribute("name", p);
				input.setAttribute("value", data[p]);
				form.append(input);
			}
			iframe.append(form);
			document.body.append(iframe);
			form.submit();
		} else {
			iframe.setAttribute("src", url);
			document.body.append(iframe);
		}
		iframe.remove();
	}
	window.download = download;
	if (typeof define === "function" && define.amd) {
		define("download", [], function() {
			return download;
		});
	}
});
