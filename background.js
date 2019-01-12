var run = true;

function isRunning(){
    return run;
}

function toggle(running){
    run = running;

    if(running){
        chrome.browserAction.setIcon({path:"images/icon128.png"});
    }

    else{
        chrome.browserAction.setIcon({path:"images/icongray128.png"});
    }
}

chrome.commands.onCommand.addListener(function(command){
    if(run){
        //Move tab left
        if(command === "tableft"){
            moveTab('left');
        }

        //Move tab right
        else if(command === "tabright"){
            moveTab('right');
        }

        //Move to left end
        else if(command === "maxleft"){
            moveToEnd('left');
        }

        //Move to right end
        else if(command === "maxright"){
            moveToEnd('right');
        }
    }
});

async function getMaxTabIndex(){
    return new Promise(resolve => {
        chrome.tabs.getAllInWindow(function(tabObj){
            console.dir(tabObj);
            resolve(tabObj.length--);
        });
    });
}

async function moveToEnd(direction){
    if (direction !== 'left' && direction !== 'right'){
        console.error("Invalid direction parameter \"" + direction + "\"");
    }

    else{
        let tab = await getCurrentTab();
        let idx = await getMaxTabIndex();
        console.dir(tab);

        if (direction === 'left')
            idx = 0;

        chrome.tabs.move(tab.id, {index: idx}, function(){
            console.log("moved to end");
        });
    }
}

async function moveTab(direction){
    if (direction !== 'left' && direction !== 'right') {
        console.error("Invalid direction parameter \"" + direction + "\"");
    }

    else{
        let tab = await getCurrentTab();
        console.dir(tab);

        if (direction === 'left')
            tab.index--;

        else if (direction === 'right') {
            tab.index++;
        }

        chrome.tabs.move(tab.id, {index: tab.index}, function(){
            console.log("moved tab");
        });

        getMaxTabIndex().then(function(resp){
            if(resp === tab.index)
            //When hit right end move to left
                chrome.tabs.move(tab.id, {index: 0}, function(){
                    console.log("right end reached, move to left end!");
                });
        });
    }
}

async function getCurrentTab(){
    return new Promise(resolve => {
        chrome.tabs.getSelected(function(tab){
            resolve({id: tab.id, index: tab.index});
        });
    });
}