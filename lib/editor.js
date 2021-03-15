//IMPORTS
const {ipcRenderer} = require('electron');
const remote = require('electron').remote;
const Menu = remote.Menu;
const dialog = remote.dialog;
//VARIABLES
let isSave = true;
let editor = document.getElementById('editor');
let currentFile = null;

ipcRenderer.on('action', (event, action) => {
    switch(action) {
        case 'new':
            askSaveNeed();
            initDoc();
            break;
        case 'open':
            askSaveNeed();
            openFile();
            wordsCount();
            break;
        case 'save':
            saveCurrentDoc();
            break;
        case 'save-as':
            currentFile = null;
            saveCurrentDoc();
            break;
    }
});

function initDoc() {
    currentFile = null;
    editor.value = '';
    document.title = 'Notepad - Untitled';
    isSave = true;
}

