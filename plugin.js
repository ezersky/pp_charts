  // ОБРАБОТКА ЗАПРОСА ЦВЕТОВЫХ ТОКЕНОВ (Универсальный парсинг для Sets и Themes)
  if (message && message.type === "get-color-tokens") {
    try {
      let allTokens = [];

      // 1. Попытка собрать токены через Token Sets (для вашей структуры Темы / Наборы)
      if (typeof penpot.getTokenSets === "function") {
        const tokenSets = penpot.getTokenSets();
        
        if (tokenSets && tokenSets.length > 0) {
          tokenSets.forEach(function(set) {
            // В Penpot токены внутри набора могут лежать в массиве .tokens или .colors
            const items = set.tokens || set.colors || [];
            
            items.forEach(function(t) {
              // Нам нужны только токены типа "color"
              if (t.type === "color" || t.value) {
                var colorValue = typeof t.value === 'object' && t.value ? t.value.color : t.value;
                if (!colorValue && t.resolvedValueString) {
                  colorValue = t.resolvedValueString;
                }

                // Формируем красивую структуру: "Набор токенов / Имя цвета"
                allTokens.push({
                  name: (set.name || "Набор") + "/" + (t.name || "Без названия"),
                  value: colorValue || "#3B82F6"
                });
              }
            });
          });
        }
      }

      // 2. Если через наборы пусто, вытягиваем базовые плоские токены
      if (allTokens.length === 0 && typeof penpot.getColorTokens === "function") {
        const fallbackTokens = penpot.getColorTokens();
        if (fallbackTokens && fallbackTokens.length > 0) {
          allTokens = fallbackTokens.map(function(t) {
            var colorValue = typeof t.value === 'object' && t.value ? t.value.color : t.value;
            return { 
              name: "Глобальные токены/" + (t.name || "Без названия"), 
              value: colorValue || "#3B82F6" 
            };
          });
        }
      }

      // 3. Крайний случай: если токенов нет вообще, пробуем прочесть Assets палитры (локальную библиотеку файла)
      if (allTokens.length === 0 && typeof penpot.getLibraryColors === "function") {
        const libColors = penpot.getLibraryColors();
        if (libColors && libColors.length > 0) {
          allTokens = libColors.map(function(c) {
            return { name: "Библиотека файла/" + (c.name || "Цвет"), value: c.color || "#3B82F6" };
          });
        }
      }

      // Отправляем итоговый массив в UI (index.html)
      penpot.ui.sendMessage({
        type: "response-color-tokens",
        tokens: allTokens
      });

    } catch (err) {
      console.error("Критическая ошибка получения токенов Penpot:", err);
      // Защита от зависания UI: отправляем пустой массив
      penpot.ui.sendMessage({ type: "response-color-tokens", tokens: [] });
    }
  }
