// main.js - Основной JavaScript файл для взаимодействия с WASM

let wasmModule = null;

// Инициализация WASM модуля
async function initWasm() {
    try {
        // Импортируем WASM модуль
        const wasmImport = await import('./pkg/rust_wasm_example.js');
        await wasmImport.default();
        wasmModule = wasmImport;
        
        console.log('WASM модуль успешно загружен');
        
        // Показываем, что модуль готов
        updateStatus('WASM модуль загружен и готов к работе', 'success');
        
    } catch (error) {
        console.error('Ошибка загрузки WASM модуля:', error);
        updateStatus('Ошибка загрузки WASM модуля. Убедитесь, что модуль собран.', 'error');
    }
}

// Обновление статуса
function updateStatus(message, type = 'info') {
    // Можно добавить элемент статуса в HTML если нужно
    console.log(`[${type.toUpperCase()}] ${message}`);
}

// Обработка формы
function setupForm() {
    const form = document.getElementById('wasm-form');
    const inputField = document.getElementById('input-field');
    const resultField = document.getElementById('result-field');
    const proceedBtn = document.getElementById('proceed-btn');
    const loadingSpinner = document.getElementById('loading-spinner');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Проверяем, загружен ли WASM модуль
        if (!wasmModule) {
            alert('WASM модуль еще не загружен. Пожалуйста, подождите.');
            return;
        }
        
        const inputValue = inputField.value.trim();
        
        if (!inputValue) {
            alert('Пожалуйста, введите данные для обработки.');
            inputField.focus();
            return;
        }
        
        // Показываем состояние загрузки
        proceedBtn.disabled = true;
        proceedBtn.classList.add('loading');
        resultField.value = '';
        
        try {
            // Имитируем небольшую задержку для демонстрации
            await new Promise(resolve => setTimeout(resolve, 300));
            
            // Вызываем функцию из WASM модуля
            const result = wasmModule.proceed_data(inputValue);
            
            // Отображаем результат с анимацией
            resultField.value = result;
            resultField.classList.add('success-animation');
            resultField.classList.remove('error-animation');
            
            // Убираем класс анимации через некоторое время
            setTimeout(() => {
                resultField.classList.remove('success-animation');
            }, 600);
            
            console.log(`Обработка завершена: "${inputValue}" -> "${result}"`);
            
        } catch (error) {
            console.error('Ошибка при обработке данных:', error);
            
            // Отображаем ошибку в поле результата
            resultField.value = `Ошибка: ${error}`;
            resultField.classList.add('error-animation');
            resultField.classList.remove('success-animation');
            
            // Убираем класс анимации через некоторое время
            setTimeout(() => {
                resultField.classList.remove('error-animation');
            }, 600);
            
            console.log(`Ошибка обработки: "${inputValue}" -> "${error}"`);
            
        } finally {
            // Убираем состояние загрузки
            proceedBtn.disabled = false;
            proceedBtn.classList.remove('loading');
        }
    });
    
    // Обработка Enter в поле ввода
    inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !proceedBtn.disabled) {
            form.dispatchEvent(new Event('submit'));
        }
    });
    
    // Автофокус на поле ввода
    inputField.focus();
}

// Добавляем дополнительные интерактивные эффекты
function setupInteractiveEffects() {
    const proceedBtn = document.getElementById('proceed-btn');
    
    // Эффект ripple при клике
    proceedBtn.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
    
    // Добавляем CSS для анимации ripple
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
        
        .proceed-btn {
            position: relative;
            overflow: hidden;
        }
    `;
    document.head.appendChild(style);
}

// Функция для демонстрации возможностей
function addDemoFeatures() {
    const inputField = document.getElementById('input-field');
    
    // Добавляем примеры для быстрого тестирования
    const examples = [
        'Hello World',
        'Rust WASM',
        'InputTest1',
        'InputTest2',
        'Тестовые данные'
    ];
    
    // Создаем кнопки с примерами
    const examplesContainer = document.createElement('div');
    examplesContainer.className = 'examples-container';
    examplesContainer.innerHTML = `
        <p style="margin: 10px 0 5px 0; font-size: 0.9rem; color: var(--text-secondary);">
            Быстрые примеры:
        </p>
    `;
    
    examples.forEach(example => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = example;
        btn.className = 'example-btn';
        
        // Добавляем специальный класс для примеров ошибок
        if (example === 'InputTest1' || example === 'InputTest2') {
            btn.classList.add('error-example');
        }
        
        btn.style.cssText = `
            margin: 2px 5px 2px 0;
            padding: 4px 8px;
            font-size: 0.8rem;
            background: var(--background);
            border: 1px solid var(--border);
            border-radius: 6px;
            cursor: pointer;
            transition: var(--transition);
        `;
        
        btn.addEventListener('click', () => {
            inputField.value = example;
            inputField.focus();
        });
        
        btn.addEventListener('mouseenter', () => {
            if (btn.classList.contains('error-example')) {
                btn.style.background = '#dc2626';
                btn.style.color = 'white';
            } else {
                btn.style.background = 'var(--primary-color)';
                btn.style.color = 'white';
            }
        });
        
        btn.addEventListener('mouseleave', () => {
            if (btn.classList.contains('error-example')) {
                btn.style.background = '#fee2e2';
                btn.style.color = '#dc2626';
            } else {
                btn.style.background = 'var(--background)';
                btn.style.color = 'var(--text-primary)';
            }
        });
        
        examplesContainer.appendChild(btn);
    });
    
    // Вставляем после поля ввода
    const inputGroup = inputField.closest('.input-group');
    inputGroup.appendChild(examplesContainer);
}

// Инициализация приложения
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Инициализация Rust WASM приложения...');
    
    // Настраиваем форму
    setupForm();
    
    // Добавляем интерактивные эффекты
    setupInteractiveEffects();
    
    // Добавляем демо-функции
    addDemoFeatures();
    
    // Инициализируем WASM модуль
    await initWasm();
});

// Экспортируем функции для возможного использования в консоли
window.rustWasmApp = {
    initWasm,
    wasmModule: () => wasmModule
};

