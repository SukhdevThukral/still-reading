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

    const paragraphs = $derived([
        {
            id: 'p1',
            text:
                escalation < 2
                    ? 'The subject was last observed at an undisclosed location. Behavioral patterns suggest awareness of surveillance. Approach with caution.'
                    : 'The subject has not moved. The subject is aware. Do not make contact.'
        }
    ]);
</script>