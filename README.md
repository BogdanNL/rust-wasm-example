# Rust WASM Example

Этот проект демонстрирует, как создать простое веб-приложение, использующее WebAssembly (WASM), скомпилированный из Rust.

## Структура проекта

```
rust-wasm-example/
├── Cargo.toml          # Конфигурация Rust проекта
├── src/
│   └── lib.rs          # Rust код для компиляции в WASM
├── index.html          # HTML страница с формой
├── styles.css          # CSS стили
├── main.js             # JavaScript для взаимодействия с WASM
├── pkg/                # Сгенерированные WASM файлы (после сборки)
└── README.md           # Этот файл
```

## Предварительные требования

1. **Rust** - язык программирования
2. **wasm-pack** - инструмент для сборки Rust в WASM
3. **Веб-сервер** - для локального тестирования (например, Python HTTP server)

## Установка зависимостей

### 1. Установка Rust

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env
```

### 2. Добавление WASM target

```bash
rustup target add wasm32-unknown-unknown
```

### 3. Установка wasm-pack

```bash
cargo install wasm-pack
```

### 4. Установка build-essential (если нужно)

```bash
sudo apt update
sudo apt install -y build-essential
```

## Сборка проекта

### 1. Компиляция Rust в WASM

```bash
wasm-pack build --target web --out-dir pkg
```

Эта команда:
- Компилирует Rust код в WASM
- Генерирует JavaScript обертки
- Создает TypeScript определения
- Помещает все в папку `pkg/`

### 2. Запуск веб-сервера

Поскольку браузеры блокируют загрузку WASM модулей через file:// протокол, нужен локальный веб-сервер:

```bash
# Используя Python 3
python3 -m http.server 8000

# Или используя Python 2
python -m SimpleHTTPServer 8000

# Или используя Node.js (если установлен npx)
npx serve .
```

### 3. Открытие в браузере

Откройте браузер и перейдите по адресу:
```
http://localhost:8000
```

## Как это работает

### Rust код (src/lib.rs)

```rust
use wasm_bindgen::prelude::*;

#[derive(Debug)]
pub enum Error {
    MagicMistake1,
    OtherError2,
}

impl std::fmt::Display for Error {
    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
        match self {
            Error::MagicMistake1 => write!(f, "MagicMistake1: Something magical went wrong!"),
            Error::OtherError2 => write!(f, "OtherError2: Another kind of error occurred."),
        }
    }
}

fn proceed_data_internal(input: String) -> Result<String, Error> {
    match input.as_str() {
        "InputTest1" => Err(Error::MagicMistake1),
        "InputTest2" => Err(Error::OtherError2),
        _ => Ok(format!("{} processed", input)),
    }
}

#[wasm_bindgen]
pub fn proceed_data(input: String) -> Result<String, JsValue> {
    proceed_data_internal(input)
        .map_err(|e| JsValue::from_str(&format!("Error occurred: {}", e)))
}
```

- `#[wasm_bindgen]` - макрос, который делает функцию доступной из JavaScript
- Функция возвращает `Result<String, JsValue>` для обработки ошибок
- При входных данных "InputTest1" и "InputTest2" генерируются специфические ошибки
- Ошибки преобразуются в `JsValue` для передачи в JavaScript

### JavaScript интеграция (main.js)

```javascript
// Загрузка WASM модуля
const wasmImport = await import('./pkg/rust_wasm_example.js');
await wasmImport.default();

// Вызов функции из WASM с обработкой ошибок
try {
    const result = wasmImport.proceed_data(inputValue);
    // Обработка успешного результата
    resultField.value = result;
} catch (error) {
    // Обработка ошибки
    resultField.value = `Ошибка: ${error}`;
}
```

### HTML форма (index.html)

- Поле ввода для данных
- Кнопка "Proceed" для обработки
- Поле результата для отображения

## Тестирование обработки ошибок

Проект включает демонстрацию обработки ошибок:

- **Обычные данные**: любой текст → результат с " processed"
- **InputTest1**: генерирует ошибку `MagicMistake1`
- **InputTest2**: генерирует ошибку `OtherError2`

Ошибки отображаются в поле результата с красной анимацией, а успешные результаты - с зеленой.

## Возможные проблемы и решения

### 1. CORS ошибки

**Проблема**: Браузер блокирует загрузку WASM модулей
**Решение**: Используйте локальный веб-сервер, не открывайте HTML файл напрямую

### 2. Модуль не найден

**Проблема**: JavaScript не может найти WASM модуль
**Решение**: Убедитесь, что папка `pkg/` существует и содержит сгенерированные файлы

### 3. Ошибки компиляции

**Проблема**: wasm-pack не может скомпилировать проект
**Решение**: Проверьте, что установлены все зависимости и Cargo.toml корректен

## Расширение проекта

Вы можете расширить этот пример:

1. **Добавить более сложную логику** в Rust функции
2. **Передавать сложные типы данных** (структуры, массивы)
3. **Использовать Rust библиотеки** для обработки данных
4. **Добавить обработку ошибок** и валидацию
5. **Оптимизировать размер WASM** модуля

## Полезные ссылки

- [Rust and WebAssembly Book](https://rustwasm.github.io/docs/book/)
- [wasm-bindgen Guide](https://rustwasm.github.io/wasm-bindgen/)
- [MDN WebAssembly](https://developer.mozilla.org/en-US/docs/WebAssembly)


## История

- Изменили алгоритм формирования результата в `proceed_data_internal` для наглядности. Теперь вместо
простого добавления "processed" к input'у, производятся вычисления sha256 хэша от input'а, который и
становится результатом.

## Live demo

Вы можете посмотреть живой пример как это работает тут: https://wasm.spasennikov.com/