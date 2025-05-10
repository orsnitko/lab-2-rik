let PathToFile = null; // змінна для зберігання шляху до файлу
let originalContent = ''; // змінна для зберігання оригінального вмісту файлу
let isModified = false; // змінна для відстеження змін в документі

// відстежуємо введення тексту в редактор
document.getElementById('editor').addEventListener('input', () => {
  const content = document.getElementById('editor').value;
  // встановлюємо змінну для відстеження змін в документі 
  window.api.setModified(isModified);
  updateTitle();
});

// якщо натискаємо на кнопку "Відкрити"
document.getElementById('open').addEventListener('click', async () => {
  if(originalContent != document.getElementById('editor').value){
    confirmOpen = confirm("Внесені зміни не буде збережено")
    if (!confirmOpen) return;
  }
  // відкриваємо файл
    const result = await window.api.openFile();
    if (!result.canceled) {
      // відображаємо вміст файлу в редактор
      document.getElementById('editor').value = result.content;
      //шлях до файлу
      PathToFile = result.path;
      // зберігаємо оригінальний вміст файлу
      originalContent = result.content;
      // назва файлу в головній частині вікна
      document.getElementById('openFileName').textContent = "Текстовий редактор: " + PathToFile;
      // оновлюємо змінну для відстеження змін в документі
      isModified = false;
      // оновлюємо заголовок вікна
      updateTitle();
    }
});

// якщо натискаємо на кнопку "Зберегти"
document.getElementById('save').addEventListener('click', async () => {
  const content = document.getElementById('editor').value;
  // перевіряємо, чи відкрито файл
  if (!PathToFile) { // якщо файл не відкрито
    // відкриваємо діалогове вікно для збереження файлу
    const result = await window.api.showSaveDialog();
    if (result.canceled) return;
    else{
      // встановлюємо шлях до файлу
      PathToFile = result.filePath;
      document.getElementById('openFileName').textContent = "Текстовий редактор: " + PathToFile;
      originalContent = document.getElementById('editor').value;
      isModified = false;
      // оновлюємо заголовок вікна
      window.api.setModified(false);
      updateTitle();
    }
    
  }
  // якщо файл відкрито
  else{
    // зберігаємо файл
    const result = await window.api.saveFile(PathToFile, content);
    originalContent = document.getElementById('editor').value;
    isModified = false;
    // оновлюємо заголовок вікна
    window.api.setModified(false);
    updateTitle();
  }
});
// якщо натискаємо на кнопку "Зберегти як"
document.getElementById('save_as').addEventListener('click', async () => {
  const content = document.getElementById('editor').value;
  // відкриваємо діалогове вікно для збереження файлу
    const result = await window.api.showSaveDialog();
    if (result.canceled) return;
    PathToFile = result.filePath;
    document.getElementById('openFileName').textContent = "Текстовий редактор: " + PathToFile;
    originalContent = document.getElementById('editor').value;
    // оновлюємозмінну для відстеження змін в документі
    isModified = false;
    updateTitle();
  const saveResult = await window.api.saveFile(PathToFile, content);
});
// якщо натискаємо на кнопку "Закрити"
document.getElementById('closeOpened').addEventListener('click', async () => {
  if (document.getElementById('editor').value !== originalContent) {
    const confirmClose = confirm('Документ має незбережені зміни. Вийти без збереження?');
    if (!confirmClose) return;
  }
  //document.getElementById('editor').value = "";
  PathToFile = null;
  //originalContent = '';
  //document.getElementById('openFileName').textContent = "Текстовий редактор";

  if (!PathToFile) {
    window.close();
  }
});
// якщо натискаємо на кнопку "Створити"
document.getElementById('create').addEventListener('click', async () => {
  if (originalContent !== document.getElementById('editor').value){
    const confirmCreate = confirm('Внесені зміни не буде збережено');
    if (!confirmCreate) return;
  }
  document.getElementById('editor').value = "";
  PathToFile = null;
  originalContent = '';
  document.getElementById('openFileName').textContent = "Текстовий редактор";
});
// оновлюємо заголовок вікна разом з символом * якщо є зміни в документі
function updateTitle() {
  const title = document.getElementById('openFileName');
  if (isModified) {
    title.textContent = "Текстовий редактор: *" + PathToFile;
    window.api.setModified(true);
  } 
  else {
    title.textContent = "Текстовий редактор: " + PathToFile;
    window.api.setModified(false);
  }
}
// відстежуємо введення тексту в редактор
document.getElementById('editor').addEventListener('input', () => {
  const content = document.getElementById('editor').value;
  isModified = content !== originalContent;
  updateTitle();
});
