<script lang="ts">
    import { onMount} from 'svelte';
    import {getParagraphs} from '$lib/document'
    import '../styles/document.css';

    const ORIGINAL_TITLE = 'DEPARTMENT OF UNRESOLVED CASES';
    const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ█▓▒░';
    const SCROLL_UP_THRESHOLD = 150;

    let escalation = $state(0);
    let idleSeconds = $state(0);
    let isReturning = $state(false);
    let currentTime = $state(new Date().toLocaleTimeString());
    let timeOnPage = $state(0);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let wasmState = $state<any>(null);
    let showLanding = $state(true);
    let landingStage = $state<'warning' | 'typing'>('warning');
    let landingText = $state('');
    let reducedMotion = $state(false);
    let glitching = $state(false);
    let blackout = $state(false);
    let titleScramble = $state(ORIGINAL_TITLE);
    let ghostCursorX = $state(0);
    let ghostCursorY = $state(0);
    let showGhostCursor = $state(false);
    let showJumpscare = $state(false);

    const paragraphs = $derived(getParagraphs(escalation, currentTime, timeOnPage));

    let prevEscalation = 0;
    let scareFired = false;
    let typewriterId: ReturnType<typeof setInterval> | undefined;
    
    const timers = new Set<ReturnType<typeof setTimeout>>();
    const later = (fn: () => void, ms: number) => {
        const id = setTimeout(() => {
            timers.delete(id);
            fn();
        }, ms);
        timers.add(id);
    }

    const pulseGlitch = () => {
        if (reducedMotion) return;
        glitching =true;
        later(() => {glitching = false}, 400);
    };

    const begin = (reduce: boolean) => {
        if (landingStage !== 'warning') return;
        if (reduce) reducedMotion = true;
        landingStage = 'typing';

        const fullText = `This document was filed on ${new Date().toLocaleDateString()} at  ${new Date().toLocaleTimeString()}`;

        let i = 0;
        typewriterId = setInterval(() => {
            landingText = fullText.slice(0, i);
            i++;
            if (i > fullText.length) clearInterval(typewriterId);
        }, 40);
        later(() => {showLanding = false;}, 3500);
    };

    $effect(() => {
        if (escalation > prevEscalation ) {
            prevEscalation = escalation;
            pulseGlitch();
        }
    });

    $effect(() => {
        if (escalation < 5 || reducedMotion ) return;
        const id = setInterval(pulseGlitch, 7000);
        return () => clearInterval(id);
    });

    $effect(() => {
        if (escalation < 5 || reducedMotion || scareFired) return;
        const id = setTimeout(() => {
            scareFired = true;
            blackout = true;
            later(() => {
                blackout = false;
                showJumpscare = true;
                later(() => {showJumpscare = false;}, 120);
            }, 400);
        }, 4000 + Math.random() * 8000);
        return() => clearTimeout(id);
    });

    $effect(() => {
        if (escalation < 3 || reducedMotion) return;
        let iterations = 0;
        const id = setInterval(() => {
            titleScramble = ORIGINAL_TITLE.split('').map((char, i) => {
                if (char === ' ') return ' ';
                if (i < iterations) return char;
                return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
            }).join('');
            iterations += 1;
            if (iterations > ORIGINAL_TITLE.length) {
                clearInterval(id);
                titleScramble = ORIGINAL_TITLE;
            }
        }, 40)
        return () => {
            clearInterval(id);
            titleScramble = ORIGINAL_TITLE;
        };
    });

    $effect(() => {
        if (escalation < 4 || reducedMotion) {
            showGhostCursor = false;
            return;
        }
        const id = setInterval(() => {
            showGhostCursor = true;
            ghostCursorX = Math.random() * window.innerWidth;
            ghostCursorY = Math.random() * window.innerHeight;
        }, 3000);
        return () => clearInterval(id);
    });

    $effect(() => {
        const tick  = setInterval(() => {
            currentTime = new Date().toLocaleTimeString();
            timeOnPage += 1;
        }, 1000);
        return() => clearInterval(tick);
    });

    onMount(() => {

        let destroyed = false;
        let idleTick: ReturnType<typeof setInterval> | undefined;
        let localMax = 0;

        reducedMotion = window.matchMedia('(prefers=reduced-motion: reduce)').matches;

        try {
            isReturning = !localStorage.getItem('still-reading-visited');
            localStorage.setItem('still-reading-visited', 'true');
        } catch {
            //storage blocked (priv mode etc.): treat as first visit
        }

        (async () => {
            const wasm = await import('wasm-core');
            await wasm.default();
            if (destroyed) return;

            wasmState = new wasm.DocumentState(isReturning);
            if(isReturning) escalation = 1;

            idleTick = setInterval(() => {
                if (!wasmState) return;
                wasmState.tick_idle();
                idleSeconds = wasmState.idle_seconds;
                escalation = wasmState.get_escalation();
            }, 1000);
        })();

        const handleScroll = () => {
            if (!wasmState) return;
            const y  = window.scrollY;
            const total = document.body.scrollHeight - window.innerHeight;
            const depth = total > 0 ? Math.min(1, Math.max(0, y / total)): 0;

            let scrolledUp = false;
            if (y > localMax) {
                localMax = y;
            } else if (localMax - y > SCROLL_UP_THRESHOLD) {
                scrolledUp = true;
                localMax = y;
            }
            
            wasmState.update_scroll(depth, scrolledUp);
            wasmState.reset_idle();
            idleSeconds =  0;
            escalation = wasmState.get_escalation();
        };

        window.addEventListener('scroll', handleScroll, {passive: true});

        return () => {
            destroyed = true;
            clearInterval(idleTick);
            clearInterval(typewriterId);
            timers.forEach(clearTimeout);
            timers.clear();
            window.removeEventListener('scroll', handleScroll);
            wasmState?.free();
            wasmState = null;
        };
    });
</script>

{#if showLanding}
    <div class="landing">
        <span class="typewriter">{landingText}{#if landingText.length > 0}<span class="cursor">|</span>{/if}</span>
    </div>
{/if}


{#if !showLanding}

    <div class="debug">
        ESC: {escalation} | IDLE: {idleSeconds}s
    </div>

    {#if showGhostCursor && escalation >= 4}
        <div class="ghost-cursor" style="left: {ghostCursorX}px; top: {ghostCursorY}px;"></div>
    {/if}

    {#if blackout}
        <div class="blackout-overlay"></div>
    {/if}

    {#if showJumpscare}
        <div class="jumpscare"></div>
    {/if}
    <main class="page" class:escalated={escalation >= 3} class:corrupted={escalation >= 5} class:glitch={glitching}>
        <div class="doc-page">
            <div class="doc-header">
                <div class="header-top">
                    <div class="seal-slot">
                        <img src={escalation >= 4 ? '/assets/seal-corrupted.png' : '/assets/seal.png'} alt="D.U.C Seal" class="seal-img" class:corrupted-seal={escalation >= 4}/>
                    </div>
                    <div class="header-text">
                        <div class="agency-name">{titleScramble}</div>
                        <div class="form-number">FORM 17-C - ACTIVE SURVEILLANCE REPORT</div>
                        <div class="agency-address">
                            Bureau of Missing of Missing & Displaced Persons<br/>
                            P.O. Box ████, [REDACTED], DC 000∞<br/>
                            Tel: ███-████ • Ref: DUC/17-C/∞
                        </div>
                    </div>
                </div>
                <div class="case-meta">
                    <span>CASE NO: DUC-2024-∞ </span>
                    <span>STATUS: {escalation < 3 ? 'ACTIVE' : 'ESCALATED'}</span>
                    <span>FILED: {currentTime}</span>
                </div>
            </div>
            <div class="fields">
                <div class="field-row">
                    <span class="field-label">SUBJECT NAME:</span>
                    <span class="redacted" class:revealed={escalation >= 2}>CLASSIFIED</span>
                </div>
                <div class="field-row">
                    <span class="field-label">LAST KNOWN LOCATION:</span>
                    <span class="redacted" class:revealed={escalation>=3}>THIS DEVICE</span>
                </div>
                <div class="field-row">
                    <span class="field-label">FILED BY:</span>
                    <span class="redacted" class:revealed={escalation>=4}>[REDACTED]</span>
                </div>
                <div class="field-row">
                    <span class="field-label">TIME ON RECORD:</span>
                    <span class="live">{timeOnPage}s and counting</span>
                </div>
                <div class="field-row">
                    <span class="field-label">CASE REFERENCE:</span>
                    <span>DUC-2024-∞</span>
                </div>
                <div class="field-row">
                    <span class="field-label">CLASSIFICATION:</span>
                    <span class="live">RESTRICTED - INTERNAL USE ONLY</span>
                </div>
            </div>

            <hr class="divider"/>

            <p class="doc-para">
                This report has been compiled in accordance with Surveillance Protocol 17-C 
                as issued by the Department of Unresolved Cases. All observations contained 
                herein have been considered active, recent and ongoing. This document is 
                not supposed to be shared, reproduced beyond the duration of the current 
                session.
            </p>

            <p class="doc-para">
                Access to this file has been logged. The duration of your engagement with this 
                document is being recorded. Scroll behavior, idle periods, and return visits are 
                noted automatically and without exception.
            </p>

            {#if isReturning}
                <div class="returning-note">
                    ▸ This file has been accessed before. Previous session on record. Duration of prior access: unknown.
                </div>
            {/if}

            <div class="doc-footer">
                <span>DUC FORM 17-C • PAGE 1 OF 4</span>
                <span>UNAUTHORIZED ACCESS PROHIBITED</span>
            </div>
        </div>

        <div class="page-break">
            <span class="page-number">— 1 —</span>
        </div>

        <div class="doc-page">
            <div class="section-title">SECTION 1 — SUBJECT IDENTIFICATION &amp; INITIAL ASSESSMENT</div>

            <div class="fields">
                <div class="section-row">
                    <span class="section-num">1.1</span>
                    <span>Case Reference: DUC-2024-∞</span>
                </div>
                <div class="section-row">
                    <span class="section-num">1.2</span>
                    <span>Date of Filing: {new Date().toLocaleDateString()}</span>
                </div>
                <div class="section-row">
                    <span class="section-num">1.3</span>
                    <span>Filed By:
                        <span class="redacted" class:revealed={escalation>=4}>[REDACTED]</span>
                    </span>
                </div>
                <div class="section-row">
                    <span class="section-num">1.4</span>
                    <span>Subject Status: {escalation < 2 ? 'UNRESOLVED':'ACTIVE - CURRENTLY READING'}</span>
                </div>
                <div class="section-row">
                    <span class="section-num">1.5</span>
                    <span>Time Since Access: {timeOnPage} seconds</span>
                </div>
            </div>

            <hr class="divider"/>

            <div class="section-title">SECTION 2 - BEHAVIORIAL OBSERVATIONS</div>

            {#each paragraphs.filter(p => p.section === 2 ) as p (p.id)}
                <p class="doc-para" class:wrong={escalation>=3} class:tilt={escalation >= 4}>
                    {p.text}
                </p>
                {#if p.id === 'p2' && escalation>=3}
                    <div class="annotation">— margin note: it hasnt looked away</div>
                {/if}
            {/each}

            <div class="doc-footer">
                <span>DUC FORM 17-C • PAGE 2 OF 4</span>
                <span>CASE  NO: DUC-2024-∞</span>
            </div>
        </div>

        <div class="page-break">
            <span class="page-number">— 2 —</span>
        </div>

        <div class="doc-page">
            <div class="section-title">SECTION 3 - FIELD NOTES &amp; REAL-TIME UPDATES</div>

            {#each paragraphs.filter(p => p.section === 3) as p (p.id)}
                <p class="doc-para" class:wrong={escalation>=3} class:tilt={escalation >= 4}>
                    {p.text}
                </p>
            {/each}

            {#if idleSeconds >= 5 && escalation >= 3}
                <div class="update-stamp">
                    ▸ UPDATE {currentTime}: THE SUBJECT HAS NOT MOVED.
                </div>
            {/if}

            {#if idleSeconds>= 15 && escalation >= 4}
                <div class="update-stamp warning">
                    ▸ UPDATE {currentTime}: THE SUBJECT IS  STILL THERE. DO NOT LET IT KNOW YOU HAVE READ THIS.
                </div>
            {/if}

            <div class="doc-footer">
                <span>DUC FORM 17-C • PAGE 3 OF 4</span>
                <span>CASE NO: DUC-2024-∞</span>
            </div>
        </div>
        
        <div class="page-break">
            <span class="page-number">— 3 —</span>
        </div>

        <div class="doc-page">
            <div class="section-title">SECTION 4 - RECOMMENDATIONS &amp; CLASSIFICATION</div>

            {#each paragraphs.filter(p => p.section === 4) as p (p.id)}
                <p class="doc-para" class:wrong={escalation>=3} class:tilt={escalation>=4}>
                    {p.text}
                </p>
            {/each}

            {#if escalation >=5}
                <div class="final-line">
                    THIS DOCUMENT WILL NOT CLOSE.
                </div>
            {/if}

            <hr class="divider"/>

            <div class="fields">
                <div class="section-row">
                    <span class="section-num">4.1</span>
                    <span>DO NOT FILE</span>
                </div>
                <div class="section-row">
                    <span class="section-num">4.2</span>
                    <span>DO NOT DISTRIBUTE</span>
                </div>
                <div class="section-row">
                    <span class="section-num">4.3</span>
                    <span>DO NOT RETURN</span>
                </div>
            </div>

            <div class="doc-footer">
                <span>DUC FORM 17-C • PAGE 4 OF 4</span>
                <span>QUI LEGIT SCIT</span>
            </div>
        </div>
    </main>
{/if}