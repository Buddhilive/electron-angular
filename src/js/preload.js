const { ipcRenderer } = require("electron");

window.onload = () => {
    const controlElements = {
        openFileBtn: document.querySelector('#aside-action-open'),
        saveFileBtn: document.querySelector('#aside-action-save')
    };

    controlElements.openFileBtn.addEventListener('click', async () => {
        const fileInfo = await ipcRenderer.invoke('dialog:open');
        console.log(fileInfo.filePaths);
    });

    controlElements.saveFileBtn.addEventListener('click', async () => {
        const fileInfo = await ipcRenderer.invoke('dialog:save');
        console.log(fileInfo);
    });
}