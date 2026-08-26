penpot.ui.open("QuickChart Generator", "index.html", {
  width: 380,
  height: 540
});

// Слушаем сообщения из UI плагина
penpot.ui.onMessage(function(message) {
  
  // 1. ОБРАБОТКА ЗАПРОСА ЦВЕТОВЫХ ТОКЕНОВ (Новый функционал)
  if (message && message.type === "get-color-tokens") {
    try {
      // Получаем все нативные дизайн-токены цвета из текущего файла Penpot
      const tokens = penpot.getColorTokens(); 
      
      // Форматируем токены в простой плоский массив объектов { name, value }
      const formattedTokens = tokens.map(function(t) {
        return {
          name: t.name,    // Название токена, например "Brand/Primary" или "Colors/Success"
          value: t.value   // HEX или RGBA значение цвета, например "#3B82F6"
        };
      });

      // Отправляем массив токенов обратно в iframe (в index.html)
      penpot.ui.sendMessage({
        type: "response-color-tokens",
        tokens: formattedTokens
      });
    } catch (err) {
      console.error("Ошибка получения токенов цвета Penpot:", err);
      // Если токенов в файле нет или произошла ошибка, возвращаем пустой массив
      penpot.ui.sendMessage({ type: "response-color-tokens", tokens: [] });
    }
  }

  // 2. ВСТАВКА SVG НА ХОЛСТ (Ваш оригинальный рабочий код)
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
