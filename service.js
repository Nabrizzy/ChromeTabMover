chrome.commands.onCommand.addListener(command => {
    switch (command) {
        case "moveLeft":
            moveLeft();
            break;
        case "moveRight":
            moveRight();
            break;
        case "jumpLeft":
            jumpLeft();
            break;
        case "jumpRight":
            jumpRight();
            break;
    }
});

async function getAllTabs() {
    let windowId = (await chrome.windows.getCurrent()).id;
    return await chrome.tabs.query({
        windowId: windowId
    });
}

async function getSelectedTabs() {
    return await chrome.tabs.query({
        highlighted: true
    });
}

function move(tabId, index) {
    chrome.tabs.move(tabId, { index: index });
}

async function debug(command) {
    let selectedTabs = await chrome.tabs.query({
        highlighted: true
    });
    let index = selectedTabs[0].index;
    chrome.tabs.move(selectedTabs[0].id, {
        index: index + 1
    });
}

async function moveLeft() {
    let tabs = (await getSelectedTabs());
    let shifted = false;

    for (let i = 0, tab = tabs[i]; i < tabs.length; i++, tab = tabs[i]) {
        if (!shifted) {
            let index = tab.index;
            let newIndex = await getPreviousSlot(index);
            move(tab.id, newIndex);
            if (newIndex > index) {
                shifted = true;
            }
        }
    }
}

async function moveRight() {

}

async function jumpLeft() {

}

async function jumpRight() {

}

async function getPreviousSlot(index) {
    if (index - 1 < 0) {
        return (await getAllTabs()).length - 1;
    }
    return index -1;
}