# Ctrl+Alt+Harsh

A 2.5D pixel-art IT help desk game that runs in the browser. You play Harsh, the new IT guy at Cedarline: two floors, twenty coworkers, one ticket queue.

## Play

Open `index.html`, or host the folder on any static host (Vercel, Netlify, GitHub Pages). There is no build step.

- `W A S D` or arrow keys: move
- `E` or `Space`: talk, use devices, grab coffee
- `T`: open DeskFlow, the in-game ticket system
- `H`: help, `M`: mute
- Phones and tablets get an on-screen stick and action button

## What is in it

- 35 troubleshooting tickets across three tiers (help desk, desktop support, systems admin)
- Each ticket: ask the user questions, run diagnostics, pick the fix that matches the evidence
- Physical work: fetch parts from IT storage, clear the printer, swap drives in the server room
- A knowledge base that fills in as you close tickets
- Promotions from Help Desk Tech to IT Manager, a locked server room, energy, coffee, free pizza at noon
- Progress saves in your browser

## Files

- `js/data.js`: employees, tickets, quiz questions. Add or edit tickets here.
- `js/world.js`: the office layout for both floors
- `js/art.js`: every sprite and tile, drawn in code
- `js/game.js`: engine, simulation and UI
