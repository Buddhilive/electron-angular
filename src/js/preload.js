const { ipcRenderer } = require("electron");

window.onload = () => {
    const controlElements = {
        openFileBtn: document.querySelector('#aside-action-open')
    };

    controlElements.openFileBtn.addEventListener('click', async () => {
        const fileInfo = await ipcRenderer.invoke('dialog:open');
        console.log(fileInfo.filePaths);
    });
}