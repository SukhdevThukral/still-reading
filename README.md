# <img src="/static/primary.png" alt="logo" width="120" align="center" /> STILL READING

>_another web based horror experience actually disguised as a holy boring "governmental" document._

<br>
<img width="1230" height="901" alt="stillreading_ss" src="https://github.com/user-attachments/assets/056e54aa-529b-43cc-977d-70741aab0fb8" />
<br>


## what ts is

you find a surveillance report from a weird Department of Unresolved Cases, form 17-c, case 2024-∞. It starts as just a paperwork, redacted names dry field notes, "no action required at ts time"

then you scroll

the document starts acting abnormally, random flashes and acts like it can somewhat observe you.

## how ts was built

ive used [SvelteKit](https://svelte.dev/docs/kit) (svelte 5 runes) for the frontend, [Rust](https://www.rust-lang.org/) compiled to WebAssembly wit [wasm-bindgen](https://github.com/wasm-bindgen/wasm-bindgen) for the escalation logic, [Typescript](https://www.typescriptlang.org/) for everythg else, and OBVIOUSLY Vanilla CSS for the texture, glitch effects, screen shakes, and etc. No database or tracking has been involved, the only thing stored is one localStorage flag so tht it can tell if youve been here before.

## how it plays/works

there is nothing to click, just a landing page (continue WITHOUT reduced effects is v cool imo). you just read and scroll, a small Rust state machine (`wasm-core`) observes the way you scroll, how far you scroll and how long youre idle for, then decides how odd the document should feel to the user - including text rewriting itself, redactions revealing, and the timestamps are very personal to you

the escalation only goes up, it cant go back down as of now - you can close the tab tho :b

## assets

most of the visuals made in the experience were designed by me :D ( yes i suck and im a newbie so ).

- **logo** - hand drawn in [Canva](https://www.canva.com)
  <br>
<img width="300" height="300" alt="DOCUMENT OF" src="https://github.com/user-attachments/assets/ef228e2f-2e36-4b72-a87e-ce96cd0000c1" />
<br><br>


- **seals** - the "D.U.C" seal and its corrupted version ( the one tht shows up at level 4) were designed from absolute scratch in [Figma](https://www.figma.com)
  <br><br>
<img width="200" height="200" alt="Group 3 (1)" src="https://github.com/user-attachments/assets/c2bbd83e-6bbd-49b5-abde-292a68afe293" />
<img width="200" height="200" alt="Group 10" src="https://github.com/user-attachments/assets/7b37b053-fe52-4133-a894-4c418885868c" />



## testing locally

youll need [Node.js](https://nodejs.org), [Rust](https://www.rust-lang.org/tools/install) and `wasm-pack`

build the rust escalation logic into wasm
```
cd wasm-core
wasm-pack build build --target web
cd ..
```

install and run the site
```
npm install 
npm run dev
```

then js open the localhost link it prints

**things worth knowing while testing:**
- in dev mode theres a lil green debug box in the top right showing the current escalation level and idle seconds, so you dont have to guess wht the doc is thinking it doesnt show up in production builds
- to see a returning visitor stuff js refresh to go back to first visit you can clear the `still-reading-visited` key in localStorage (devtools -> Application -> Local Storage)
- the jumpscare fires 4-12 seconds after level 5, so scorll to the bottom and stop moving for 10s and wait. use **CONTINUE WITH REDUCED EFFECTS** if you want to skip it
- and obvi if you change any Rust code, re-run `wasm-pack build --target web` or the site will keep using the old wasm

to run the rust tests on their own:

```
cd wasm-core
cargo text
```

:D HAVE FUN!!

## escalation levels (the boring part)

0 - the document is normal

1 - you scrolled past 25% (or youre a returing visitor), only small changes.

2 - you scrolled back up looking for smthg and the subject name revealed

3 - youre 70% deep in the document, text starts conversating about you, title scrambles, location is shown to be THIS DEVICE.

4 - now youre 85% deep, the seal corrupts, ghost cursor appears(ik its ass), pages tilt

5 - FOR THIS YOU NEED TO BE 85% DEEP + YOUVE STOPPED MOVING FOR 10s

( i wouldnt spoil further for you :D )


## accessibility (though id add ts asw)

ive added a content warning (flashing, sudden visual changes, unsetlling text, actually may affect ppl with photosensitivie epilepsy.) BUT YES YOU CAN CONTINUE WITH *REDUCED EFFECTS* which turns of the glitches, shaking and ghost cursor and etc and it also respects `prefers-reduced-motion`
