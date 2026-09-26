<script lang="ts">
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