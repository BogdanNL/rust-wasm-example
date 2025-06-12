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

#[wasm_bindgen]
pub fn proceed_data(input: String) -> String {
    format!("{} processed", input)
}
```

- `#[wasm_bindgen]` - макрос, который делает функцию доступной из JavaScript
- Функция принимает строку и возвращает строку с добавленным " processed"

### JavaScript интеграция (main.js)

```javascript
// Загрузка WASM модуля
const wasmImport = await import('./pkg/rust_wasm_example.js');
await wasmImport.default();

// Вызов функции из WASM
const result = wasmImport.proceed_data(inputValue);
```

### HTML форма (index.html)

- Поле ввода для данных
- Кнопка "Proceed" для обработки
- Поле результата для отображения

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

