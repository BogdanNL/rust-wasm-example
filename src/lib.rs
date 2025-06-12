use sha2::{Digest, Sha256};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

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


