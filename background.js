// Create context menu on install
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "explain-with-ai",
    title: "Explain '%s' with AI",
    contexts: ["selection"]
  });
});

// Listen for clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "explain-with-ai") {
    // Store selected text temporarily to be picked up by the side panel
    chrome.storage.local.set({ lastSelection: info.selectionText }, () => {
      // Open the side panel
      chrome.sidePanel.open({ windowId: tab.windowId });
    });
  }
});