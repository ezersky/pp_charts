penpot.ui.open("QuickChart Generator", "index.html", {
  width: 380,
  height: 540
});

// Просто перенаправляем SVG-код из UI на холст
penpot.ui.onMessage(function(message) {
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
