// Открываем графический интерфейс плагина
penpot.ui.open("QuickChart Generator", "index.html", {
  width: 380,
  height: 540
});

// Безопасная функция для извлечения цветов (Assets -> Colors) из локальной библиотеки Penpot
function getColorTokens() {
  var colorsList = [];
  try {
    // По спецификации Penpot API: цвета лежат в массиве penpot.library.local.colors
    if (penpot && penpot.library && penpot.library.local && Array.isArray(penpot.library.local.colors)) {
      var localColors = penpot.library.local.colors;
      for (var i = 0; i < localColors.length; i++) {
        var c = localColors[i];
        if (c && c.name && c.color) {
          colorsList.push({
            name: c.name,
            color: c.color
          });
        }
      }
    }
  } catch (e) {
    console.warn("Не удалось прочитать локальные цвета Penpot API, используем фоллбек-палитру:", e);
  }
  return colorsList;
}

// Слушаем сообщения от интерфейса плагина (index.html)
penpot.ui.onMessage(function(message) {
  if (!message) return;

  // 1. Интерфейс загрузился и запрашивает цвета макета
  if (message.type === "ui-ready") {
    var tokens = getColorTokens();
    penpot.ui.sendMessage({
      type: "init-tokens",
      tokens: tokens
    });
  }

  // 2. Вставка сгенерированного SVG на холст Penpot
  if (message.type === "insert-chart" && message.svgCode) {
    try {
      var shape = penpot.createShapeFromSvg(message.svgCode);
      if (shape) {
        // Центрируем элемент на экране дизайнера
        shape.x = penpot.viewport.center.x - (shape.width / 2);
        shape.y = penpot.viewport.center.y - (shape.height / 2);
        // Выделяем созданный объект на холсте
        penpot.selection = [shape];
      }
    } catch (err) {
      console.error("Ошибка импорта SVG на холст Penpot:", err);
    }
  }
});
