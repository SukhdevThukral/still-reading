export function getParagraphs(escalation: number, currentTime: string, timeOnPage: number) {
    return[
        {
            id: 'p1',
            section: 2,
            text:
                escalation < 2
                    ? 'The subject was last observed at an undisclosed location. Behavioral patterns suggest awareness of surveillance. Field agaents have been instructed to maintain distance and observe only.'
                    : 'The subject has not moved. The subject is aware of this document. Do not make contact under any circumstances.'
        },
        {
            id: 'p2',
            section: 2,
            text:
                escalation < 3 
                    ?   'Physical description: unremarkable, Height and weight within normal parameters. No distinguishing features on record. Subject blends easily into civilian population.'
                    :   `Physical description updated at ${currentTime}: The subject is seated. The subject is reading. Eyes moving left to right across the page. Breathing rate: elevated.`
        },
        {
            id: 'p3',
            section: 2,
            text:
                escalation < 1
                    ? 'Case status: ACTIVE. Filed under routine surveillance protocol 17-C. No immediate action required at this time. File to be reviewed by senior analyst.'
                    : 'Case status: ESCALATED. Subject has reversed direction of scroll. Subject is looking for something. Subject knows something is wrong. Do not intervene.'
        },
        {
            id: 'p4',
            section: 3,
            text: 
                escalation < 2
                    ? 'Field Note 001: Subject accessed this document at the above recorded time. Initial observation suggests subject believed this to be a standard archived file. No unsual behavior detected at point of entry.'
                    : `Field Note 001 [UPDATED ${currentTime}]: Subject did not leave. Subject did not leave. Subject continued reading past the initial assessment. This is not standard behavior. Flag for review.`
        },
        {
            id: 'p5',
            section: 3,
            text: 
                escalation < 3 
                    ? 'Field Note 002: No anomalous activity to report. Subject appears to be processing document contents at normal reading speed. Monitoring continues passively.'
                    : `Field Note 002 [UPDATED ${currentTime}]: Subject has been on this page for ${timeOnPage} seconds. Subject has scrolled back. Subject is re-reading. Something has been noticed.`
        },
        {
            id: 'p6',
            section: 3,
            text: 
                escalation <  4
                    ? 'Field Note 003: Standard protocol applies. Document access logged. Subject profile cross-referenced against existing case files. No matches found. Surveillance to continue.'
                    : 'Field Note 003: Subject is still here. The subject has read this sentence. The subject is reading this one now. We are aware. The subject should stop.'
        },
        {
            id: 'p7',
            section: 4,
            text: 
                escalation < 3 
                    ? 'Recommendation: No immediate action required. Subject to remain under passive surveillance. This file is to be sealed upon subject departure. Standard archival procedure applies.'
                    : 'Recommendation: The subject has not departed. The file cannot be sealed. This was not anticipated. Escalate to senior review.'
        },
        {
            id: 'p8',
            section: 4,
            text: 
                escalation < 4 
                    ? 'Classification: RESTRICTED. This document is not intended for civilian review. If this document has been accessed in error, cease reading immediately and close this file.'
                    : 'Classification: The subject has not ceased reading. The subject has not closed this file. The subject is still here. This is noted. This is recorded. This will not be forgotten.'
        },
        {
            id: 'p9',
            section: 4,
            text: 
                escalation < 5 
                    ? 'Final Note: All observations are logged automatically upon access. Duration of acces, scroll behavior, idle periods, and return visits are recorded without exception. This is standard procedure.'
                    : 'Final Note: The subject is reading the sentence. The subject knows we are watching. The subject cannot leave now. Neither can we. QUI LEGIT SCIT.'
        },
    ];
}