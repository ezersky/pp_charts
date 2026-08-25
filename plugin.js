// Открываем графический интерфейс плагина с фиксированными размерами
penpot.ui.open("QuickChart Generator", "index.html", {
  width: 380,
  height: 540
});

// Безопасная функция для извлечения дизайн-токенов цвета из файла Penpot
function getColorTokens() {
  try {
    // Безопасная проверка существования структуры локальной библиотеки токенов Penpot
    const localLib = penpot.library && penpot.library.local;
    const tokenSets = (localLib && localLib.tokens && localLib.tokens.sets) || [];
    const colors = [];
    
    tokenSets.forEach(function(set) {
      if (set && Array.isArray(set.tokens)) {
        set.tokens.forEach(function(t) {
          // Отбираем только цветовые токены дизайн-системы
          if (t && t.type === 'color' && t.value) {
            colors.push({ 
              name: set.name + "." + t.name, 
              color: t.value 
            });
          }
        });
      }
    });
    return colors;
  } catch (e) {
    // Если метод API не поддерживается текущей версией или пуст, пишем в консоль разработчика
    console.warn("Penpot tokens API fallback triggered:", e);
    return [];
  }
}

// Слушаем сообщения от интерфейса плагина (index.html)
penpot.ui.onMessage(function(message) {
  if (!message) return;

  // Сценарий 1: Интерфейс загрузился и просит прислать доступные токены цвета
  if (message.type === "ui-ready") {
    const tokens = getColorTokens();
    penpot.ui.sendMessage({
      type: "init-tokens",
      tokens: tokens
    });
  }

  // Сценарий 2: Пользователь нажал кнопку генерации и вставки чарта
  if (message.type === "insert-chart" && message.svgCode) {
    try {
      // Превращаем сырой SVG-текст в интерактивный векторный объект Penpot
      const shape = penpot.createShapeFromSvg(message.svgCode);
      
      if (shape) {
        // Центрируем график на текущем экране дизайнера
        shape.x = penpot.viewport.center.x - (shape.width / 2);
        shape.y = penpot.viewport.center.y - (shape.height / 2);
        
        // Автоматически выделяем вставленный объект
        penpot.selection = [shape];
      }
    } catch (err) {
      console.error("Ошибка при импорте SVG на холст Penpot:", err);
    }
  }
});
