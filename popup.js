let config = {
    colors: {
        'text': '#111111',
        'background': {
            'true': '#ffffff',
            'false': '#ffffff'
        }
    }
};

let Background = chrome.extension.getBackgroundPage();
let run = Background.isRunning();
showPlay(run);

function showPlay(toggle){
    let button = document.getElementById("toggleButton");

    if(toggle){
        document.body.style.backgroundColor = config.colors.background.true;
        button.classList.remove("btn-success");
        button.classList.add("btn-danger");
        button.innerText = "Disable";
    }
    else{
        document.body.style.backgroundColor = config.colors.background.false;
        button.classList.remove("btn-danger");
        button.classList.add("btn-success");
        button.innerText = "Enable";
    }
}

function toggle(){
    //Invert, tastier way than run = !run
    run ^= true;
    Background.toggle(run);
    showPlay(run);
}

$("#toggleButton").on('click', toggle);