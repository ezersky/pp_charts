  // ОБРАБОТКА ЗАПРОСА ЦВЕТОВЫХ ТОКЕНОВ (Исправлено под Темы и Наборы)
  if (message && message.type === "get-color-tokens") {
    try {
      // 1. Получаем все доступные наборы токенов (Sets) в файле
      const tokenSets = penpot.getTokenSets(); 
      let allTokens = [];

      tokenSets.forEach(function(set) {
        // Читаем цвета отдельно из каждого набора токенов (Global, Light и т.д.)
        if (set.colors) {
          set.colors.forEach(function(t) {
            // Извлекаем текстовое значение цвета (HEX/RGBA)
            var colorValue = typeof t.value === 'object' && t.value ? t.value.color : t.value;
            if (!colorValue && t.resolvedValueString) {
              colorValue = t.resolvedValueString;
            }

            allTokens.push({
              // Добавляем имя набора в путь токена, чтобы index.html правильно его разбил по папкам
              name: set.name + "/" + (t.name || "Без названия"),
              value: colorValue || "#3B82F6"
            });
          });
        }
      });

      // Если через наборы ничего не нашлось, пробуем взять обычные токены
      if (allTokens.length === 0) {
        const fallbackTokens = penpot.getColorTokens();
        allTokens = fallbackTokens.map(function(t) {
          var colorValue = typeof t.value === 'object' && t.value ? t.value.color : t.value;
          return { name: "Общие палитры/" + (t.name || "Без названия"), value: colorValue || "#3B82F6" };
        });
      }

      // Отправляем структурированный массив обратно в интерфейс
      penpot.ui.sendMessage({
        type: "response-color-tokens",
        tokens: allTokens
      });
    } catch (err) {
      console.error("Ошибка получения токенов цвета Penpot:", err);
      penpot.ui.sendMessage({ type: "response-color-tokens", tokens: [] });
    }
  }
