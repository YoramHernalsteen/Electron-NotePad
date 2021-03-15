//IMPORTS
const remote = require('@electron/remote');
const dialog = remote.dialog;
//VARIABLES
let saved = true;
let editor = document.getElementById('editor');
let currentFile = null;

editor.oninput = (e) => {
    saved = false;
};

ipcRenderer.on('action', (event, args) => {
    switch(args) {
        case 'new':
            askToSave();
            initializeDocument();
            console.log("new");
            break;
        case 'open':
            askToSave();
            openFile();
            console.log("open");
            break;
        case 'save':
            saveCurrentDoc();
            console.log("save");
            break;
        case 'save-as':
            currentFile = null;
            saveCurrentDoc();
            console.log("save-as");
            break;
        case 'close' :
            askToSave();
            currentFile =null;
            editor.value = '';
            console.log('saved');
            break;
    }
});

function initializeDocument() {
    currentFile = null;
    editor.value = '';
    document.title = 'Notepad - Untitled';
    saved = true;
}

function openFile() {
    const options = {
        filters: [
            { name: 'Text Files', extensions: ['txt', 'js', 'html', 'md'] },
            { name: 'All Files', extensions: ['*'] }
        ],
        properties: ['openFile']
    };
    const file = dialog.showOpenDialogSync(remote.getCurrentWindow(), options);
    if(file) {
        currentFile = file[0];
        editor.value = readText(currentFile);
        document.title = 'Notepad - ' + currentFile;
        saved = true;
    }
}
function readText(file) {
    const fs = require('fs');
    return fs.readFileSync(file, 'utf8');
}
function askToSave() {
    if (saved) {
        return;
    }
    const options = {
        type: 'question',
        message: 'Would you like to save the current document?',
        buttons: [ 'Yes', 'No']
    };
    const selection = dialog.showMessageBoxSync(remote.getCurrentWindow(), options);
    if (selection === 0) {
        saveCurrentDoc();
    } else if(selection === 1) {
        console.log('Cancel and Quit!');
    }
}
function saveCurrentDoc() {
    if(!currentFile) {
        const options = {
            title: 'Save',
            filters: [
                { name: 'Text Files', extensions: ['txt', 'js', 'html', 'md'] },
                { name: 'All Files', extensions: ['*'] }
            ]
        };
        const paths = dialog.showSaveDialogSync(remote.getCurrentWindow(), options);
        if(paths) {
            currentFile = paths;
        }
    }
    if(currentFile) {
        const txtSave = editor.value;
        saveText(currentFile, txtSave);
        saved = true;
        document.title = "Notepad - " + currentFile;
    }

}

function saveText( file, text ) {
    const fs = require('fs');
    fs.writeFileSync( file, text );
}

