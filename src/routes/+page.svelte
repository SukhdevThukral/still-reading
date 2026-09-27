<script lang="ts">
	import { before } from 'node:test';

    import {onMount} from 'svelte';

    let escalation = $state(0);
    let idleSeconds = $state(0);
    let timesScrolledUp = $state(0);
    let lastScrollY = $state(0);
    let isReturning = $state(false);
    let currentTime = $state('');
    let timeOnPage = $state(0);
    let wasmState: any = $state(null);
    let showLanding = $state(true);
    let landingText = $state('');

    const paragraphs = $derived([
        {
            id: 'p1',
            text:
                escalation < 2
                    ? 'The subject was last observed at an undisclosed location. Behavioral patterns suggest awareness of surveillance. Approach with caution.'
                    : 'The subject has not moved. The subject is aware. Do not make contact.'
        },
        {
            id: 'p2',
            text:
                escalation < 3 
                    ?   'Physical description: unremarkable, Height and weight within normal parameters. No distinguishing features on record.'
                    :   `Physical description updated at ${currentTime}: The subject is seated. The subject is reading. Eyes moving left to right.`
        },
        {
            id: 'p3',
            text:
                escalation < 1
                    ? 'Case status: ACTIVE. Filed under routine surveillance. No immediate action required.'
                    : 'Case status: ESCALATED. Subject has scrolled back. Subject is looking for something. Subject knows something is wrong.'
        },
        {
            id: 'p4',
            text: 
                escalation < 4
                    ? `Last known contact: ${currentTime}. No further updates at this time. File to be reviewed quarterly.`
                    : `Last known contact: right now. The subject has been on this page for ${timeOnPage} seconds. The subject has not left.`
        },
        {
            id: 'p5',
            text: 
                escalation < 5 
                    ? 'Notes: Subject believed to be unaware of this filing. Standard protocol applies. Do not make direct contact.'
                    : 'Notes: The subject is reading this sentence. Do not let it know you have read this.'
        }
    ]);

    onMount(() => {
        let idleTick: ReturnType<typeof setInterval>;

        const init = async () => {
            isReturning = !!localStorage.getItem('still-reading-visited');
            localStorage.setItem('still-reading-visited', 'true')

            const wasm = await import('wasm-core');
            wasmState = new wasm.DocumentState(isReturning);
            if (isReturning) escalation = 1;

            const updateTime = () => {
                currentTime = new Date().toLocaleTimeString();
            };
            updateTime();

            setTimeout(() => {
                showLanding = false;
            }, 3000)

            idleTick = setInterval(() => {
                if (wasmState) {
                    wasmState.tick_idle();
                    idleSeconds = wasmState.idle_seconds;
                    escalation = wasmState.get_escalation();

                }
                timeOnPage += 1;
                updateTime();
            }, 1000);            
        };

        const handleScroll = () => {
            if (!wasmState) return;
            const scrolled  = window.scrollY;
            const total = document.body.scrollHeight - window.innerHeight;
            const depth = scrolled / total;
            const scrolledUp = scrolled < lastScrollY;
            if (scrolledUp) timesScrolledUp += 1;
            lastScrollY = scrolled;
            wasmState.update_scroll(depth, scrolledUp);
            wasmState.reset_idle();
            idleSeconds =  0;
            escalation = wasmState.get_escalation();
        };

        const handleMouseMove = () => {
            if (wasmState) {
                wasmState.reset_idle();
                idleSeconds = 0;
            }
        };

        init();

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            clearInterval(idleTick);
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    });
</script>

{#if showLanding}
    <div class="landing">
        <span class="typewriter">{landingText}<span class="cursor">|</span></span>
    </div>
{/if}

{#if !showLanding}
    <main class="page" class:escalated={escalation >= 3} class:corrupted={escalation >= 5}>
        <div class="document">
            <div class="doc-header">
                <div class="seal-slot">
                    <div class="seal-placeholder">D.U.C</div>
                </div>
                <div class="agency-name">DEPARTMENT OF UNRESOLVED CASES</div>
                <div class="form-number">FORM 17-C - ACTIVE SURVEILLANCE REPORT</div>
                <div class="case-meta">
                    <span>CASE NO: DUC-2024-∞ </span>
                    <span>STATUS: {escalation < 3 ? 'ACTIVE' : 'ESCALATED'}</span>
                    <span>FILED: {currentTime}</span>
                </div>
            </div>
            <div class="fields">
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
            </div>
            <hr class="divider"/>

            {#each paragraphs as p (p.id)}
                <p class="doc-para" class:wrong={escalation >= 3}  class:tilt={escalation>=4}>
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

            {#if isReturning}
                <div class="returning-note">
                    ▸ This file has been accessed before. Previous session on record.
                </div>
            {/if}

            {#if escalation >= 5}
                <div class="final-line">
                    This document will not close.
                </div>
            {/if}

            <div class="doc-footer">
                <span>DUC FORM 17-C • UNAUTHORIZED ACCESS PROHIBITED</span>
                <span>QUI LEGIT SCIT</span>
            </div>
        </div>
    </main>
{/if}

<style>
    :global(body) {
        margin: 0;
        background: #111;
        font-family: 'Courier New', Courier, monospace;
    }

    .landing {
        position: fixed;
        inset: 0;
        background: #000;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 100;
    }

    .typewriter{
        color: #aaa;
        font-size: 1rem;
        font-family: 'Courier New', monospace;
        letter-spacing: 0.05em;
    }

    .cursor {
        animation: blink 1s step-end infinite;
        color: #aaa;
    }

    .page {
        min-height: 100vh;
        display: flex;
        justify-content: center;
        padding: 60px 20px;
        transition: background 3s;
    }

    .page.escalted {
        background: #0a0a0a;
    }

    .page.corrupted {
        animation: shake 0.4s infinite;
    }

    .document {
        background: #f5f0e8;
        max-width: 720px;
        width: 100%;
        padding: 60px;
        box-shadow: 0 0 60px rgba(0,0,0,1);
        position: relative;
    }

    .doc-header {
        text-align: center;
        margin-bottom: 28px;
    }

    .seal-slot {
        display: flex;
        justify-content: center;
        margin-bottom: 12px;
    }

    .seal-placeholder {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        border: 2px solid #1a1a2e;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.5rem;
        color: #1a1a2e;
        letter-spacing: 0.1em;
        font-weight: bold;
    }

    .agency-name {
        font-size: 1rem;
        font-weight: bold;
        letter-spacing: 0.25em;
        color: #1a1a2e;
    }

    .form-number {
        font-size: 0.7rem;
        color: #555;
        margin-top: 4px;
        letter-spacing: 0.15em;
    }

    .case-meta{
        display: flex;
        justify-content: space-between;
        font-size: 0.7rem;
        margin-top: 14px;
        color: #333;
        border-top: 2px solid #1a1a2e;
        border-bottom: 1px solid #1a1a2e;
        padding: 5px 0;
    }

    .fields {
        margin: 20px 0;
    }

    .field-row {
        display: flex;
        gap: 12px;
        margin: 10px 0;
        font-size: 0.8rem;
        color: #222;
        align-items: center;
    }

    .field-label {
        font-weight: bold;
        min-width: 210px;
    }

    .redacted {
        background: #111;
        color: #111;
        padding: 1px 10px;
        transition: all 1.8s ease;
        letter-spacing: 0.05em;
        user-select: none;
    }

    .redacted.revealed {
        background: transparent;
        color: #8b0000;
        font-weight: bold;
    }

    .live {
        color: #8b0000;
        font-weight: bold;
    }

    .divider {
        border: none;
        border-top: 1px soild #aaa;
        margin: 24px 0;
    }

    .doc-para {
        font-size: 0.85rem;
        line-height: 2;
        color: #222;
        margin-bottom: 22px;
        transition: all 2.5s ease;
        text-align: justify;
    }

    .doc-para.wrong {
        letter-spacing: 0.025em;
    }

    .doc-para.tilt {
        transform: rotate(0.4deg);
        transform-origin: left center;
    }

    .update-stamp {
        color: #8b0000;
        font-weight: bold;
        font-size: 0.75rem;
        letter-spacing: 0.1em;
        margin: 20px 0;
        border-left: 4px solid #8b0000;
        padding-left: 14px;
        animation: fadeIn 1.5s ease-in;
        line-height: 1.6;
    }

    .update-stamp.warning {
        font-size: 0.85rem;
        border-left-width: 6px;
        border-color: #5c0000;
        color: #5c0000;
    }

    .returning-note{
        background: #fff3cd;
        border: 1px solid #856404;
        color: #856404;
        padding: 10px 14px;
        font-size: 0.75rem;
        margin: 20px 0;
        letter-spacing: 0.05em;
    }

    .final-line {
        text-align: center;
        color: #8b0000;
        font-size: 1rem;
        font-weight: bold;
        letter-spacing: 0.2em;
        margin: 30px 0;
        animation: fadeIn 3s ease-in;
    }

    .doc-footer {
        display: flex;
        justify-content: space-between;
        font-size: 0.6rem;
        color: #777;
        border-top: 1px solid #aaa;
        padding-top: 12px;
        margin-top: 40px;
        letter-spacing: 0.08em;
    }

    @keyframes fadeIn {
        from {opacity: 0;}
        to {opacity: 1;}
    }

    @keyframes shake {
        0%, 100% {transform: translate(0,0) rotate(0deg);}
        20% {transform: translate(-3px, 1px) rotate(-0.3deg);}
        40% {transform: translate(3px, -1px) rotate(0.3deg);}
        60% {transform: translate(-2px, 2px) rotate(-0.2deg);}
        80% {transform: translate(2px, -2px) rotate(0.2deg);}
    }

    @keyframes blink {
        50% {opacity: 0;}
    }
</style>