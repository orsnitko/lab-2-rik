const { contextBridge, ipcRenderer } = require('electron');
// створюємо API для взаємодії між main і renderer процесами  
contextBridge.exposeInMainWorld('api', {  
  // відкриваємо файл при натисканні на кнопку "Відкрити" 
  openFile: () => ipcRenderer.invoke('open-file'),
  // зберігаємо файл при натисканні на кнопку "Зберегти" 
  saveFile: (filePath, content) => ipcRenderer.invoke('save-file', { filePath, content }),
  // зберігаємо файл при натисканні на кнопку "Зберегти як"   
  showSaveDialog_as: () => ipcRenderer.invoke('show-save-dialog_as'),
  // встановлюємо змінну для відстеження змін в документі 
  setModified: (value) => ipcRenderer.send('set-modified', value)
});
