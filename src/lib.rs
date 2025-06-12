
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn proceed_data(input: String) -> String {
    format!("{} processed", input)
}


