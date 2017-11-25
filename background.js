let loadInBackground = true;
let lastActiveTabId = 0;

browser.storage.local.get("loadInBackground", function(res) {
	if (res.loadInBackground === undefined) {
		loadInBackground = true;

		browser.storage.local.set({
			"loadInBackground": true
		});
	} else {
		loadInBackground = res.loadInBackground;
	}
});

browser.storage.onChanged.addListener(function(changes) {
	if (changes["loadInBackground"]) {
		loadInBackground = changes["loadInBackground"].newValue;
	}
});

browser.tabs.onActivated.addListener(function(activeInfo) {
	lastActiveTabId = activeInfo.tabId;
});

browser.tabs.onCreated.addListener(function(tab) {
	browser.tabs.move(tab.id, {
		index: -1
	}, function() {
		// in all cases scroll tab bar to the right
		browser.tabs.update(tab.id, { active: true });
		
		if (loadInBackground) {
			browser.tabs.update(lastActiveTabId, { active: true });
		}
	});
});
