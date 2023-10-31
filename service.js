chrome.commands.onCommand.addListener(command => {
    debug(command);
});

async function debug(command) {
    let selectedTabs = await chrome.tabs.query({
        highlighted: true
    });
    let index = selectedTabs[0].index;
    chrome.tabs.move(selectedTabs[0].id, {
        index: index + 1
    });
}