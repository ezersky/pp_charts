penpot.ui.open("QuickChart Generator", "index.html", {
  width: 380,
  height: 540
});

// Слушаем сообщения из UI плагина (index.html)
penpot.ui.onMessage(function(message) {
  if (!message) return;
  // Блок А: ОБРАБОТКА ЗАПРОСА ЦВЕТОВЫХ ТОКЕНОВ (Супер-безопасная версия ES5)
  if (message.type === "get-color-tokens") {
    try {
      var allTokens = [];

      if (typeof penpot.getTokenSets === "function") {
        var tokenSets = penpot.getTokenSets() || [];
        for (var i = 0; i < tokenSets.length; i++) {
          var set = tokenSets[i];
          var items = set.tokens || set.colors || [];
          for (var j = 0; j < items.length; j++) {
            var t = items[j];
            var colorValue = typeof t.value === 'object' && t.value ? t.value.color : t.value;
            if (!colorValue && t.resolvedValueString) {
              colorValue = t.resolvedValueString;
            }
            allTokens.push({
              name: (set.name || "Палитра") + "/" + (t.name || "Цвет"),
              value: colorValue || "#3B82F6"
            });
          }
        }
      }

      if (allTokens.length === 0 && typeof penpot.getColorTokens === "function") {
        var fallbackTokens = penpot.getColorTokens() || [];
        for (var k = 0; k < fallbackTokens.length; k++) {
          var ft = fallbackTokens[k];
          var fColor = typeof ft.value === 'object' && ft.value ? ft.value.color : ft.value;
          allTokens.push({
            name: "Глобальные токены/" + (ft.name || "Цвет"),
            value: fColor || "#3B82F6"
          });
        }
      }

      penpot.ui.sendMessage({
        type: "response-color-tokens",
        tokens: allTokens
      });

    } catch (err) {
      console.error("Ошибка сбора токенов:", err);
      penpot.ui.sendMessage({ type: "response-color-tokens", tokens: [] });
    }
  }

  // Блок Б: ВСТАВКА SVG НА ХОЛСТ (Ваш оригинальный рабочий код)
  if (message.type === "insert-chart" && message.svgCode) {
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
