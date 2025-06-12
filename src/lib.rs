use sha2::{Digest, Sha256};
use wasm_bindgen::prelude::*;

/// Импортируем console.log только при сборке в wasm32
#[cfg(target_arch = "wasm32")]
#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

/// Заглушка для остальных таргетов (тесты, нативный запуск)
#[cfg(not(target_arch = "wasm32"))]
fn log(_s: &str) {}

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
    log(&format!("Rust input: {}", input));
    match input.as_str() {
        "InputTest1" => Err(Error::MagicMistake1),
        "InputTest2" => Err(Error::OtherError2),
        _ => {
            // Вычисляем SHA-256 для всех прочих входов
            let mut hasher = Sha256::new();
            hasher.update(input.as_bytes());
            let hash_bytes = hasher.finalize();

            // Преобразуем байты в hex-строку
            let hex_hash = hash_bytes
                .iter()
                .map(|b| format!("{:02x}", b))
                .collect::<String>();
            log(&format!("Rust output: {}", hex_hash));
            Ok(hex_hash)
        }
    }
}

#[wasm_bindgen]
pub fn proceed_data(input: String) -> Result<String, JsValue> {
    proceed_data_internal(input)
        .map_err(|e| JsValue::from_str(&format!("Error occurred: {}", e)))
}

#[cfg(test)]
mod tests {
    use super::*;
    use sha2::{Digest, Sha256};

    #[test]
    fn proceed_data_internal_handles_success_and_error() {
        // 1) Обычное значение: ожидаем SHA-256 хэш
        let input = "abc".to_string();
        let result = proceed_data_internal(input.clone());
        assert!(result.is_ok(), "Должны получить Ok, а не {:?}", result);
        // Вычисляем ожидаемый хэш прямо в тесте
        let mut hasher = Sha256::new();
        hasher.update(input.as_bytes());
        let expected_bytes = hasher.finalize();
        let expected_hex = expected_bytes
            .iter()
            .map(|b| format!("{:02x}", b))
            .collect::<String>();
        assert_eq!(result.unwrap(), expected_hex);

        // 2) Спецвход, приводящий к ошибке
        let err = proceed_data_internal("InputTest1".to_string());
        assert!(matches!(err, Err(Error::MagicMistake1)),
            "Ожидается Err(Error::MagicMistake1), а получено {:?}", err);
    }
}
