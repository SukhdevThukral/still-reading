use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct DocumentState {
    pub escalation_level: u32,
    pub idle_seconds: u32,
    pub scroll_depth: f64,
    pub is_returning: bool,
    pub times_scrolled_up: u32,
}

#[wasm_bindgen]
impl DocumentState {
    #[wasm_bindgen(constructor)]
    pub fn new(is_returning: bool) -> DocumentState {
        DocumentState { escalation_level: 0, idle_seconds: 0, scroll_depth: 0.0, is_returning, times_scrolled_up: 0 }
    }

    pub fn update_scroll(&mut self, depth: f64, scrolled_up: bool) {
        self.scroll_depth = depth;
        if scrolled_up {
            self.times_scrolled_up += 1
        }
        self.recalculate_escalation();
    }

    pub fn tick_idle(&mut self) {
        self.idle_seconds += 1;
        self.recalculate_escalation();
    }

    pub fn reset_idle(&mut self){
        self.idle_seconds = 0;
    }

    fn recalculate_escalation(&mut self) {

        let new_level = if self.scroll_depth > 0.85 && self.idle_seconds >= 10 {
            5
        } else if self.scroll_depth > 0.85 {
            4
        } else if self.scroll_depth > 0.7 {
            3
        } else if self.times_scrolled_up >= 1 && self.scroll_depth>0.3 {
            2
        } else if self.scroll_depth > 0.25{
            1
        } else if self.is_returning {
            1
        } else {
            0
        };

        if new_level > self.escalation_level {
            self.escalation_level = new_level;
        }

    }

    pub fn get_escalation(&self) -> u32 {
        self.escalation_level
    }
}