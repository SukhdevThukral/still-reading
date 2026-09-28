/* tslint:disable */
/* eslint-disable */

export class DocumentState {
    free(): void;
    [Symbol.dispose](): void;
    get_escalation(): number;
    constructor(is_returning: boolean);
    reset_idle(): void;
    tick_idle(): void;
    update_scroll(depth: number, scrolled_up: boolean): void;
    escalation_level: number;
    idle_seconds: number;
    is_returning: boolean;
    scroll_depth: number;
    times_scrolled_up: number;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
    readonly memory: WebAssembly.Memory;
    readonly __wbg_documentstate_free: (a: number, b: number) => void;
    readonly __wbg_get_documentstate_escalation_level: (a: number) => number;
    readonly __wbg_get_documentstate_idle_seconds: (a: number) => number;
    readonly __wbg_get_documentstate_is_returning: (a: number) => number;
    readonly __wbg_get_documentstate_scroll_depth: (a: number) => number;
    readonly __wbg_get_documentstate_times_scrolled_up: (a: number) => number;
    readonly __wbg_set_documentstate_escalation_level: (a: number, b: number) => void;
    readonly __wbg_set_documentstate_idle_seconds: (a: number, b: number) => void;
    readonly __wbg_set_documentstate_is_returning: (a: number, b: number) => void;
    readonly __wbg_set_documentstate_scroll_depth: (a: number, b: number) => void;
    readonly __wbg_set_documentstate_times_scrolled_up: (a: number, b: number) => void;
    readonly documentstate_get_escalation: (a: number) => number;
    readonly documentstate_new: (a: number) => number;
    readonly documentstate_reset_idle: (a: number) => void;
    readonly documentstate_tick_idle: (a: number) => void;
    readonly documentstate_update_scroll: (a: number, b: number, c: number) => void;
    readonly __wbindgen_externrefs: WebAssembly.Table;
    readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;

/**
 * Instantiates the given `module`, which can either be bytes or
 * a precompiled `WebAssembly.Module`.
 *
 * @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
 *
 * @returns {InitOutput}
 */
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
 *
 * @returns {Promise<InitOutput>}
 */
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
