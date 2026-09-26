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
        self.escalation_level = match (
            self.scroll_depth,
            self.times_scrolled_up,
            self.idle_seconds,
            self.is_returning,
        ) {
            (_, _, _, true) => self.escalation_level.max(1),
            (d, _, _, _) if d > 0.3 => self.escalation_level.max(1),
            (_,u, _, _) if u >= 1 => self.escalation_level.max(2),
            (d, _, _, _) if d > 0.6 => self.escalation_level.max(2),
            (_, _, i, _) if i >= 5 => self.escalation_level.max(3),
            (d, _, _, _) if d > 0.9 => self.escalation_level.max(4),
            (d, _, i, _) if d > 0.9 && i >= 15 => self.escalation_level.max(5),
            _ => self.escalation_level,
        };
    }

    pub fn get_escalation(&self) -> u32 {
        self.escalation_level
    }
}