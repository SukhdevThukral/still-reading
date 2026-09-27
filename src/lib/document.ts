export function getParagraphs(escalation: number, currentTime: string, timeOnPage: number) {
    return[
        {
            id: 'p1',
            section: 2,
            text:
                escalation < 2
                    ? 'The subject was last observed at an undisclosed location. Behavioral patterns suggest awareness of surveillance. Field agaents have been instructed to maintain distance and observe only. No direct contact has been authorized at this stage of the investigation.'
                    : 'The subject has not moved. The subject is aware of this document. The subject continues to read. Do not make contact under any circumstances. This has been escalated.'
        },
        {
            id: 'p2',
            section: 2,
            text:
                escalation < 3 
                    ?   'Physical description: unremarkable, Height and weight within normal parameters. No distinguishing features on record. Subject blends easily into civilian population. Hair color and eye color recorded as inconclusive. Photograph on file is considered potenitally outdated.'
                    :   `Physical description updated at ${currentTime}: The subject is seated. The subject is reading. Eyes moving left to right across the page. Breathing rate: elevated. Posture: rigit. The subject has not looked away from this document since access was first logged.`
        },
        {
            id: 'p3',
            section: 2,
            text:
                escalation < 1
                    ? 'Case status: ACTIVE. Filed under routine surveillance protocol 17-C. No immediate action required at this time. File to be reviewed by senior analyst within thirty (30) calendar days. All observations are preliminary and subject to revision upon further review.'
                    : 'Case status: ESCALATED. Subject has reversed direction of scroll. Subject is looking for something that has changed. Subject knows something is wrong with this document. Subject is correct. Do not intervene. Continue to observe.'
        },
        {
            id: 'p3b',
            section: 2,
            text: 
                escalation < 2
                    ? 'Prior case history: No previous filings on record under this subject profile. This appears to be the first instance of surveillance. Standard intake procedure has been followed. Case assigned to field team DUC-7 for ongoing monitoring.'
                    : 'Prior case history: REVISED. One previous session on record. Subject returned. This was not anticipated in the intial filing. Return visits are flagged automaticall. This flag has been raised. Senior review is pending.'
        },
        {
            id: 'p3c',
            section: 2,
            text: 
                escalation < 3
                    ? 'Environmental ovservations: The subject is apparently operating from an anonymous location. Ambient conditions have been noted as stable. No external intereferece detected. The subject\'s environment has been logged for cross referencing again at existing records.'
                    : `Environmental observations updated ${currentTime}: Subject  has not changed location. Subject has been in the same position for the last ${timeOnPage} seconds. The device used to access this document has been logged. This entry is visible to the subject. The subject is reading this entry right now.`
        },
        {
            id: 'p4',
            section: 3,
            text: escalation < 2
                ? 'Field Note 001 — Initial Access: Subject accessed this document at the above recorded time. Initial observation suggests subject believed this to be a standard archived file. Reading speed was consistent with casual review. No unusual behavior detected at point of entry.'
                : `Field Note 001 — UPDATED ${currentTime}: Subject did not leave upon completing the initial read. Subject continued past the first page. Subject continued past the second page. Subject is still here. This was not anticipated. Flag has been raised.`
        },
        {
            id: 'p5',
            section: 3,
            text: 
                escalation < 3 
                    ? 'Field Note 002: Behavioral AssessmentL No anomalous activity to report right now. Subject appears to be processing document contents at an average reading speed. Occasional pauses noted, consistent with standard comprehension behavior. Monitoring continuing passively and without interruption.'
                    : `Field Note 002 - UPDATED ${currentTime}: Subject has been on this document for ${timeOnPage} seconds. Subject has scrolled back. Subject is re-reading sections. Subject is looking for inconsistencies. Subject will find them. Subject is fidning them now.`
        },
        {
            id: 'p6',
            section: 3,
            text: 
                escalation <  4
                    ? 'Field Note 003 - Cross-Reference Check: Subject profile has been cross-referenced against all exisitng case files within the DUC archive.No matches found right now. Surveillance to continue under passive protocol. No escalation recommended at this stage. File to be remain opened.'
                    : 'Field Note 003 - FINAL: Subject is still here. The subject has read this sentence. The subject is reading this one now. The subject should stop. The subject will not stopd. We are aware. This is noted. This is recorded. This will not be forgotten.'
        },
        {
            id: 'p6b',
            section: 3,
            text: 
                escalation < 3 
                    ? 'Field Note 004 - Device Analysis: This device used to access this document has been logged by itself upon entry. Operating system, browser type, and local time have been recorded. This information is retained for the duration of the case and is not subject to deletion requests..'
                    : `Field Note 004 - UPDATED: Device continues to remain active. Local time at last check: ${currentTime}. The subject has not closed this tab. The subject hasn't closed this window. The subject is still reading. We are still watching. Both of these things are true simultaneously.`
        },
        {
            id: 'p7',
            section: 4,
            text: 
                escalation < 3 
                    ? "Recommendation 4.1: No immediate action required. Subject to remain under passive surveillance indefinitely. This file is to be sealed upon subject departure. Standard archival procedure applies. A copy will be retained in the DUC's permanent record."
                    : 'Recommendation 4.1: The subject has not departed. The file cannot be sealed. The subject continues to read the page. This was not anticipated for in the standard procedure. Theres no protocol for a subject who doesnt leave. This is being escalated to senior review for the first time.'
        },
        {
            id: 'p8',
            section: 4,
            text: 
                escalation < 4 
                    ? "Recommendation 4.2 - Classification Notice: This document is not intended for civilian's review, if this document has been accessed in error, cease reading immediately and close this file or one must undergo the consequences. No further actuon will be taken given the subject does not continue past this point"
                    : "Recommendation 4.2 - NOTICE VOID: The subject has already continued past this point. The above notice is now in action. The subject was warned. The subject made the choice to continue. The choice has been logged. The timestamp of this choice has been recorded. It wont be removed."
        },
        {
            id: 'p9',
            section: 4,
            text: 
                escalation < 5 
                    ? 'Final Note: All observations are logged automatically upon access. Duration of acces, scroll behavior, idle periods, and return visits are recorded without exception. This is standard procedure and applies to all subjects regardless of intent or circumstance.'
                    : 'Final Note: The subject is reading the sentence. The subject knows we are watching. The subject cannot leave now. The document has been updated to reflex the subject\'s continyed presence. This note wont change again. There is nothing after this. QUI LEGIT SCIT.'
        },
    ];
}