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
    let tabs = (await getSelectedTabs()).reverse();
    let shifted = false;

    for (let i = 0, tab = tabs[i]; i < tabs.length; i++, tab = tabs[i]) {
        if (!shifted) {
            let index = tab.index;
            let newIndex = await getNextSlot(index);
            move(tab.id, newIndex);
            if (newIndex < index) {
                shifted = true;
            }
        }
    }
}

async function jumpLeft() {
    let tabs = (await getSelectedTabs());
    for (let i = 0, tab = tabs[i]; i < tabs.length; i++, tab = tabs[i]) {
        move(tab.id, i);
    }
}

async function jumpRight() {
    let tabs = (await getSelectedTabs()).reverse();
    let lastIndex = (await getAllTabs()).length - 1;
    for (let i = 0, tab = tabs[i]; i < tabs.length; i++, tab = tabs[i]) {
        move(tab.id, lastIndex--);
    }
}

async function getPreviousSlot(index) {
    if (index - 1 < 0) {
        return (await getAllTabs()).length - 1;
    }
    return index -1;
}

async function getNextSlot(index) {
    let lastIndex = (await getAllTabs()).length - 1;
    if (index + 1 > lastIndex) {
        return 0;
    }
    return index + 1;
}