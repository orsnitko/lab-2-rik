const { app, BrowserWindow, dialog, ipcMain } = require('electron'); // імпортуємо модулі
const path = require('path'); // для роботи зі шляхаом до файлу
const fs = require('fs'); // для роботи з файлами

let isModified = false; // змінна для відстеження змін в документі

function createWindow() { // функція для створення вікна
  var win = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 300,
    minHeight: 300,
    webPreferences: {
      // вказуємо шлях до файлу preload.js
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  // прибираємо меню
  win.setMenuBarVisibility(false);
  //win.openDevTools();
  // завантажуємо файл index.html
  win.loadFile('index.html'); 
  // встановлюємо змінну для відстеження змін в документі 
  ipcMain.on('set-modified', (event, modified) => {
    isModified = modified;
  });

  // відстежуємо закриття вікна
  win.on('close', (e) => {
    if (isModified) {
      // якщо документ має незбережені зміни, показуємо вікно з вибором 
      const choice = dialog.showMessageBoxSync(win, {
        type: 'warning',
        buttons: ['Скасувати', 'Вийти'],
        defaultId: 0,
        cancelId: 0,
        message: 'Документ має незбережені зміни. Вийти без збереження?'
      });

      if (choice === 0) {
        e.preventDefault();
      }
    }
  });
}
// створюємо вікно при завантаженні програми
app.whenReady().then(createWindow);
// створюємо файл при натисканні на кнопку "Створити" 
ipcMain.on('create-file', () => {
  createFileWindow();
});

// відкриваємо файл при натисканні на кнопку "Відкрити" 
ipcMain.handle('open-file', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [{ name: 'Text Files', extensions: ['txt'] }]
  });

  if (canceled) return { canceled: true };

  const content = fs.readFileSync(filePaths[0], 'utf-8');
  return { canceled: false, content, path: filePaths[0] };
});
// зберігаємо файл при натисканні на кнопку "Зберегти" 
ipcMain.handle('save-file', async (_, { filePath, content }) => {
  try {
    fs.writeFileSync(filePath, content);
    return { success: true };
  } 
  catch (err) {
    return { success: false, error: err.message };
  }
});
// зберігаємо файл при натисканні на кнопку "Зберегти як"   
ipcMain.handle('show-save-dialog', async () => {
  const { canceled, filePath } = await dialog.showSaveDialog({
    title: 'Зберегти файл як',
    defaultPath: 'Безімені.txt',
    filters: [{ name: 'Text Files', extensions: ['txt'] }]
  });

  if (canceled) {
    return { canceled: true };
  }

  return { canceled: false, filePath };
});
