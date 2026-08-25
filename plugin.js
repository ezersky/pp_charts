// Открываем UI плагина с заданными размерами
penpot.ui.open("QuickChart Generator", "?theme=" + penpot.theme, {
    width: 360,
    height: 520,
});
// Функция сбора цветовых токенов из файла
function getColorTokens() {
    var colors = penpot.library.getColors(); // Получаем глобальные стили цвета
    return colors.map(function (cls) { return ({
        name: cls.name,
        id: cls.id,
        color: cls.color
    }); });
}
// Отправляем токены в UI сразу после загрузки
penpot.ui.sendMessage({
    type: "init-tokens",
    tokens: getColorTokens()
});
// Слушаем сообщения из UI (index.html)
penpot.ui.onMessage(function (message) {
    if (message.type === "insert-chart") {
        var svgCode = message.svgCode;
        // Импортируем SVG-код в Penpot как полноценный векторный объект
        var shape = penpot.createShapeFromSvg(svgCode);
        if (shape) {
            // Позиционируем по центру текущего экрана/вьюпорта
            shape.x = penpot.viewport.center.x - (shape.width / 2);
            shape.y = penpot.viewport.center.y - (shape.height / 2);
            // Выделяем созданный объект на холсте
            penpot.selection = [shape];
        }
    }
});
