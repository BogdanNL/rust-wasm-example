#!/bin/bash

# build.sh - Скрипт для сборки Rust WASM проекта

set -e  # Остановить выполнение при ошибке

echo "🦀 Сборка Rust WASM проекта..."

# Проверяем наличие wasm-pack
if ! command -v wasm-pack &> /dev/null; then
    echo "❌ wasm-pack не найден. Установите его с помощью:"
    echo "   cargo install wasm-pack"
    exit 1
fi

# Проверяем наличие WASM target
if ! rustup target list --installed | grep -q "wasm32-unknown-unknown"; then
    echo "📦 Добавляем WASM target..."
    rustup target add wasm32-unknown-unknown
fi

# Очищаем предыдущую сборку
if [ -d "pkg" ]; then
    echo "🧹 Очищаем предыдущую сборку..."
    rm -rf pkg
fi

# Собираем проект
echo "🔨 Компилируем Rust в WASM..."
wasm-pack build --target web --out-dir pkg

# Проверяем результат
if [ -d "pkg" ] && [ -f "pkg/rust_wasm_example.js" ]; then
    echo "✅ Сборка завершена успешно!"
    echo "📁 WASM файлы находятся в папке pkg/"
    echo ""
    echo "🚀 Для запуска проекта:"
    echo "   python3 -m http.server 8000"
    echo "   Затем откройте http://localhost:8000"
else
    echo "❌ Ошибка сборки. Проверьте логи выше."
    exit 1
fi

