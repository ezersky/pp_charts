penpot.ui.open("QuickChart Generator", "index.html", {
  width: 380,
  height: 540
});

// Слушаем сообщения из UI плагина
penpot.ui.onMessage(function(message) {
  
  // ОБРАБОТКА ЗАПРОСА ЦВЕТОВЫХ ТОКЕНОВ
  if (message && message.type === "get-color-tokens") {
    try {
      const tokens = penpot.getColorTokens(); 
      
      const formattedTokens = tokens.map(function(t) {
        // Защита: извлекаем чистую строку (HEX/RGBA) из объекта Penpot
        var colorValue = typeof t.value === 'object' && t.value ? t.value.color : t.value;
        
        // Если значение всё еще объект, пробуем взять строковое представление
        if (!colorValue && t.resolvedValueString) {
          colorValue = t.resolvedValueString;
        }

        return {
          name: t.name || "Без названия",
          value: colorValue || "#3B82F6" // Резервный синий, если цвет не прочитался
        };
      });

      // Отправляем обратно в UI
      penpot.ui.sendMessage({
        type: "response-color-tokens",
        tokens: formattedTokens
      });
    } catch (err) {
      console.error("Ошибка получения токенов цвета Penpot:", err);
      penpot.ui.sendMessage({ type: "response-color-tokens", tokens: [] });
    }
  }

  // ВСТАВКА SVG НА ХОЛСТ
  if (message && message.type === "insert-chart" && message.svgCode) {
    try {
      var shape = penpot.createShapeFromSvg(message.svgCode);
      if (shape) {
        shape.x = penpot.viewport.center.x - (shape.width / 2);
        shape.y = penpot.viewport.center.y - (shape.height / 2);
        penpot.selection = [shape];
      }
    } catch (err) {
      console.error("Ошибка импорта SVG:", err);
    }
  }
});
