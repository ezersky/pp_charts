penpot.ui.open("QuickChart Generator", "index.html", {
  width: 380,
  height: 540
});

function getColorTokens() {
  var colorsList = [];
  try {
    if (penpot && penpot.library && penpot.library.local && Array.isArray(penpot.library.local.colors)) {
      var localColors = penpot.library.local.colors;
      for (var i = 0; i < localColors.length; i++) {
        var c = localColors[i];
        if (c && c.name && c.color) {
          colorsList.push({ name: c.name, color: c.color });
        }
      }
    }
  } catch (e) {
    console.warn("Ошибка чтения цветов Penpot:", e);
  }
  return colorsList;
}

penpot.ui.onMessage(function(message) {
  if (!message) return;

  if (message.type === "ui-ready") {
    var tokens = getColorTokens();
    penpot.ui.sendMessage({ type: "init-tokens", tokens: tokens });
  }

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
