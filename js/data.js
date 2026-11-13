/* Ctrl+Alt+Harsh: game content. Employees, tickets, items, quizzes. */
window.DATA = (() => {
  const LEVELS = [
    { t: 'Help Desk Tech', s: 'L1', xp: 0 },
    { t: 'Desktop Support', s: 'L2', xp: 700 },
    { t: 'Systems Admin', s: 'L3', xp: 2200 },
    { t: 'IT Manager', s: 'MGR', xp: 4800 },
  ];

  const ITEMS = {
    cable: { n: 'Cat6 patch cable', i: '🔌' },
    hdmi: { n: 'HDMI cable', i: '📺' },
    aa: { n: 'AA batteries', i: '🔋' },
    kbm: { n: 'Keyboard + mouse set', i: '⌨️' },
    headset: { n: 'USB headset', i: '🎧' },
    toner: { n: 'Toner cartridge', i: '🖨️' },
    ram: { n: '8GB DDR4 RAM', i: '🧩' },
    ssd: { n: '500GB SSD', i: '💾' },
    usb: { n: 'Bootable USB', i: '🔑' },
    upsbat: { n: 'UPS battery pack', i: '🪫' },
    srvdrive: { n: 'Hot-swap server drive', i: '🗄️' },
  };

  const SK = ['#f2d0b4', '#e2b594', '#c99a82', '#a9744f', '#8a5a3c', '#6b4226'];
  const L = (skin, hair, style, shirt, o = {}) => Object.assign({ skin: SK[skin], hair, style, shirt, pants: '#2f3550' }, o);

  const HARSH = L(2, '#231c20', 'big', '#23252f', { glasses: 1, stubble: 1, pack: 1, pants: '#3a4a7a', shoes: '#eceef5' });

  /* kind: n = normal desk (sits south of desk, back to camera), front = sits behind desk facing camera */
  const EMP = [
    { id: 'dana', name: 'Dana Reyes', role: 'IT Manager', dept: 'IT', f: 0, desk: [7, 1], kind: 'n', look: L(3, '#3a2a22', 'bun', '#7a4fa3', { glasses: 1, lan: 1 }),
      lines: ['Diagnose first, fix second. Guessing is how one ticket turns into three.', 'If you get stuck, come ask. That is literally my job.', 'Document your fixes. Future you is a user too.'] },
    { id: 'maya', name: 'Maya Chen', role: 'Sales Lead', dept: 'Sales', f: 0, desk: [13, 1], kind: 'n', look: L(1, '#15131a', 'long', '#d9534f'),
      lines: ['Quarter closes Friday. If my laptop dies before then, so do I.', 'You fixed the printer last week? You are my favourite person in this building.'] },
    { id: 'tom', name: 'Tom Okafor', role: 'Account Executive', dept: 'Sales', f: 0, desk: [18, 1], kind: 'n', look: L(5, '#111014', 'short', '#3f7fd1', { tie: '#f0c040' }),
      lines: ['I have 61 browser tabs open and I need every single one.', 'Is it true you should restart once a week? Asking for me.'] },
    { id: 'priya', name: 'Priya Nair', role: 'Sales Rep', dept: 'Sales', f: 0, desk: [23, 1], kind: 'n', look: L(3, '#1a1216', 'long', '#2aa198', { glasses: 1 }),
      lines: ['Free samosas in the break room on Fridays. Do not tell Finance.', 'My password is not on a sticky note anymore. Promise.'] },
    { id: 'luca', name: 'Luca Rossi', role: 'Sales Rep', dept: 'Sales', f: 0, desk: [28, 1], kind: 'n', look: L(1, '#5a3a22', 'short', '#f39c3d'),
      lines: ['Espresso from that machine is a crime. I drink it anyway.', 'What does the blinking orange light on my monitor mean? It is blinking at me.'] },
    { id: 'aisha', name: 'Aisha Khan', role: 'Sales Operations', dept: 'Sales', f: 0, desk: [13, 6], kind: 'n', look: L(2, '#201820', 'hijab', '#5b6ee1', { wrap: '#e7c6d8' }),
      lines: ['I keep our CRM clean. It is a full contact sport.', 'If the shared drive vanishes again I am mapping it to my soul.'] },
    { id: 'ben', name: 'Ben Carter', role: 'Account Executive', dept: 'Sales', f: 0, desk: [18, 6], kind: 'n', look: L(0, '#c9a14a', 'short', '#6c7a89', { stubble: 1 }),
      lines: ['Is "have you tried turning it off and on" really a thing or a joke?', 'I clicked "remind me later" on that update for six months. Was that bad?'] },
    { id: 'sofia', name: 'Sofia Alvarez', role: 'Inside Sales', dept: 'Sales', f: 0, desk: [23, 6], kind: 'n', look: L(2, '#3b2414', 'pony', '#e56b9f'),
      lines: ['My headset mutes itself whenever a client says yes. Cursed.', 'You should try the trail mix. Somebody refills it every morning.'] },
    { id: 'jin', name: 'Jin Park', role: 'Sales Engineer', dept: 'Sales', f: 0, desk: [28, 6], kind: 'n', look: L(1, '#101014', 'short', '#34495e', { glasses: 1 }),
      lines: ['I already ran ipconfig before calling you. Respect me.', 'DNS. It is always DNS. Except when it is the cable.'] },
    { id: 'gurpreet', name: 'Gurpreet Sidhu', role: 'Support Lead', dept: 'Support', f: 0, desk: [27, 15], kind: 'n', look: L(3, '#17120f', 'turban', '#2e8b57', { wrap: '#2456a6', beard: 1 }),
      lines: ['We answer customer tickets, you answer ours. Circle of life.', 'Kiddan! Coffee later? The new beans are decent.'] },
    { id: 'emma', name: 'Emma Wilson', role: 'Support Agent', dept: 'Support', f: 0, desk: [31, 15], kind: 'n', look: L(0, '#a5522a', 'long', '#8e6bbf'),
      lines: ['Two monitors changed my life. A third would change it again.', 'When my mic dies mid-call I just smile and nod.'] },
    { id: 'noah', name: 'Noah Tremblay', role: 'Support Agent', dept: 'Support', f: 0, desk: [27, 20], kind: 'n', look: L(1, '#2b2018', 'short', '#c0392b', { stubble: 1 }),
      lines: ['I label my cables. You are welcome.', 'Hot take: the printer knows when you are in a hurry.'] },
    { id: 'rosa', name: 'Rosa Martinez', role: 'Receptionist', dept: 'Front Desk', f: 0, desk: [4, 18], kind: 'front', look: L(2, '#2a1a12', 'bun', '#e67e22', { lan: 1 }),
      lines: ['Welcome to Cedarline! Oh, it is you. Welcome anyway.', 'Visitors keep asking for the Wi-Fi password. I point at the sign.'] },
    { id: 'olga', name: 'Olga Petrova', role: 'Senior Accountant', dept: 'Finance', f: 1, desk: [11, 1], kind: 'n', look: L(0, '#d8d2c4', 'bun', '#34495e', { glasses: 1 }),
      lines: ['Month end. Do not speak to me unless something is on fire.', 'My spreadsheets have spreadsheets.'] },
    { id: 'dev', name: 'Dev Sharma', role: 'Payroll Specialist', dept: 'Finance', f: 1, desk: [15, 1], kind: 'n', look: L(3, '#161216', 'short', '#16a085'),
      lines: ['If payroll is late, everyone suddenly knows where I sit.', 'I back up my files. To the same drive. That counts, right?'] },
    { id: 'chloe', name: 'Chloe Dubois', role: 'Brand Designer', dept: 'Marketing', f: 1, desk: [23, 1], kind: 'n', look: L(0, '#e06aa8', 'short', '#1f1f28'),
      lines: ['My files are 4 GB each. The file server fears me.', 'Can we get a bigger monitor budget? For art.'] },
    { id: 'sam', name: 'Sam Whitehorse', role: 'Content Lead', dept: 'Marketing', f: 1, desk: [28, 1], kind: 'n', look: L(4, '#1b1512', 'long', '#d35400'),
      lines: ['I write the newsletter. Yes, people read it. Three people.', 'The plotter jammed again. I did not touch it. Mostly.'] },
    { id: 'fatima', name: 'Fatima Hassan', role: 'HR Manager', dept: 'HR', f: 1, desk: [35, 1], kind: 'n', look: L(4, '#18121a', 'hijab', '#8e44ad', { wrap: '#2c3e50' }),
      lines: ['New hire starts Monday. They will need an account, a laptop and patience.', 'Offboarding matters as much as onboarding. Disable accounts same day.'] },
    { id: 'kenji', name: 'Kenji Sato', role: 'Recruiter', dept: 'HR', f: 1, desk: [40, 1], kind: 'n', look: L(1, '#0f0f14', 'short', '#27ae60'),
      lines: ['I sold a candidate on our free snacks alone.', 'Video interviews all day. My webcam has seen things.'] },
    { id: 'helen', name: 'Helen Zhao', role: 'CEO', dept: 'Executive', f: 1, desk: [5, 18], kind: 'front', look: L(1, '#1c1a22', 'bun', '#f5f5f5', { pants: '#22242e' }),
      lines: ['IT is the reason this company runs. I do notice.', 'Keep doing good work and there is a bigger title in it for you.'] },
    { id: 'marcus', name: 'Marcus Bell', role: 'CFO', dept: 'Executive', f: 1, desk: [15, 15], kind: 'n', look: L(5, '#2a2a2e', 'bald', '#2c3e50', { tie: '#c0392b', glasses: 1 }),
      lines: ['Every outage has a dollar figure. I calculate it for fun.', 'Tell me what the backup costs and what losing the data costs. Easy math.'] },
  ];

  /* Ticket templates.
     clues: [question, answer]
     checks: { l: label, o: output, k: key evidence, t: minutes }
     fixes: { l: label, ok: 1 right | 2 works but poor practice | 0 wrong, o: outcome, need: item id }
     target: desk | printer1 | printer2 | meeting | board | server */
  const T = [];
  const add = (o) => T.push(o);

  /* ---------------- TIER 1 ---------------- */
  add({ id: 'nodisplay', tier: 1, cat: 'Hardware', title: 'Monitor is black', screen: 'off', target: 'desk',
    desc: 'My screen is just black. I pressed every button I could find. The computer sounds like it is on though.',
    clues: [['Did anything change since yesterday?', 'The cleaners were in last night. They always move stuff around under my desk.'],
      ['Is there any light on the monitor?', 'There is a little orange light blinking on the bottom corner.']],
    checks: [{ l: 'Look at the monitor power LED', o: 'LED: blinking AMBER.\nAmber means the monitor has power but is getting no video signal.', k: 1, t: 2 },
      { l: 'Check the PC tower', o: 'Power LED solid white. Fans spinning. The PC is running fine.', t: 2 },
      { l: 'Trace the video cable', o: 'DisplayPort cable is seated in the monitor...\n...and hanging half out of the back of the PC.', k: 1, t: 3 }],
    fixes: [{ l: 'Reseat the DisplayPort cable until it clicks', ok: 1, o: 'Click. The desktop pops up instantly.' },
      { l: 'Swap in a brand new monitor', ok: 0, o: 'You haul a new monitor over. Still black. The old monitor was never the problem: amber LED = it has power, it just has no signal.' },
      { l: 'Reinstall Windows', ok: 0, o: 'You cannot reinstall what you cannot see. Also: never start with the most destructive option.' }],
    learn: ['Check the physical layer first', 'An amber or blinking monitor light means "I have power but no signal". Before you swap hardware, check power, cables at BOTH ends, and the input source. Most "dead" monitors are a loose cable.'] });

  add({ id: 'lockout', tier: 1, cat: 'Accounts', title: 'Account keeps locking', target: 'desk',
    desc: 'It says my account is locked out. I swear I am typing the right password!',
    clues: [['What exactly does the screen say?', '"The referenced account is currently locked out and may not be logged on to."'],
      ['Did you change your password recently?', 'Yesterday, it made me. Oh. My phone still gets work email... with the old one, I guess?']],
    checks: [{ l: 'Look up the account in Active Directory', o: 'Account: LOCKED OUT\nBad password count: 14\nLast bad attempt from: iPhone (ActiveSync)', k: 1, t: 4 },
      { l: 'Check Caps Lock and keyboard layout', o: 'Caps Lock off. Layout EN-US. Not the problem.', t: 2 }],
    fixes: [{ l: 'Verify identity, unlock the account, update the password on their phone', ok: 1, o: 'Unlocked. Phone updated. The bad password counter stays at zero.' },
      { l: 'Just unlock the account', ok: 0, o: 'Works for nine minutes. Then the phone tries the old password again and locks it. You fixed the symptom, not the cause.' },
      { l: 'Turn off the lockout policy for everyone', ok: 0, o: 'Dana: "That policy is what stops password guessing attacks. No."' }],
    learn: ['Lockouts usually mean a stale saved password', 'When an account re-locks, something is still sending the old password: a phone, a mapped drive, a saved Wi-Fi profile. Find the source in the lockout details. And always verify who you are talking to before touching an account.'] });

  add({ id: 'jam', tier: 1, cat: 'Printing', title: 'Printer: paper jam', target: 'printer1',
    desc: 'The big printer on Floor 1 says PAPER JAM and now there is a line of people giving me looks.',
    clues: [['What were you printing?', 'Forty pages of labels. On the thick label paper. From the normal tray.']],
    checks: [{ l: 'Read the printer display', o: 'JAM: REAR DOOR / FUSER AREA\nOpen rear door and remove paper.', k: 1, t: 2 },
      { l: 'Open the rear door', o: 'One crumpled label sheet wedged near the fuser. It is warm.', k: 1, t: 2 },
      { l: 'Check the paper tray', o: 'Tray 2 is overfilled and the label stock is curling.', t: 2 }],
    fixes: [{ l: 'Pull the sheet out slowly with both hands, in the direction of the paper path, then fan and reload the tray', ok: 1, o: 'Sheet comes out in one piece. Printer warms up and the queue starts moving.' },
      { l: 'Yank it out hard from the front', ok: 0, o: 'It tears. Now there are scraps inside the fuser. This just got worse.' },
      { l: 'Power cycle the printer', ok: 0, o: 'It boots up and says: PAPER JAM. The paper is still in there.' }],
    learn: ['Clear jams along the paper path', 'Read the display: it tells you where the jam is. Pull paper gently with both hands in the direction it normally travels, so it does not tear. Thick stock belongs in the bypass tray.'] });

  add({ id: 'toner', tier: 1, cat: 'Printing', title: 'Prints are faded', target: 'printer1',
    desc: 'Everything I print comes out pale and streaky. My proposal looks like a ghost wrote it.',
    clues: [['Is it every page?', 'Every page. And it is worse on the right side.']],
    checks: [{ l: 'Print a configuration page', o: 'Supplies status:\n  Black toner: 2%  (REPLACE)\n  Drum: 71%', k: 1, t: 3 },
      { l: 'Check print quality settings', o: 'Quality: Normal. EconoMode: Off. Settings are fine.', t: 2 }],
    fixes: [{ l: 'Replace the toner cartridge', ok: 1, need: 'toner', o: 'New cartridge in, seal strip pulled. Test page is crisp and black.' },
      { l: 'Shake the old cartridge and put it back', ok: 2, o: 'That buys maybe twenty pages. It works for now, but this ticket is coming back tomorrow.' },
      { l: 'Reinstall the printer driver', ok: 0, o: 'Driver reinstalled. Pages still pale. A driver cannot add toner.' }],
    learn: ['Let the device tell you', 'Printers report their own supply levels on a config page or web panel. Faded or streaky output with low toner is a consumable, not a driver problem. Shaking a cartridge is a stopgap, not a fix.'] });

  add({ id: 'airplane', tier: 1, cat: 'Network', title: 'Laptop has no Wi-Fi', target: 'desk',
    desc: 'My laptop will not connect to the Wi-Fi at all. It does not even show any networks.',
    clues: [['Is Wi-Fi working for people around you?', 'Yeah, everyone else is fine. Just me.'],
      ['When did it last work?', 'Before my flight back from Calgary yesterday.']],
    checks: [{ l: 'Click the network icon', o: 'Airplane mode: ON\nWi-Fi: Off', k: 1, t: 1 },
      { l: 'Check the Wi-Fi adapter in Device Manager', o: 'Intel Wi-Fi 6 AX201: This device is working properly.', t: 3 }],
    fixes: [{ l: 'Turn off airplane mode', ok: 1, o: 'Networks appear. It joins CEDARLINE-CORP on its own.' },
      { l: 'Reboot the office Wi-Fi', ok: 0, o: 'You just kicked forty people off their calls to fix one laptop. Scope the problem first: if only one person is affected, the problem is on their side.' },
      { l: 'Replace the Wi-Fi card', ok: 0, o: 'Device Manager said the card was healthy. That was an hour wasted.' }],
    learn: ['Scope it: one user or everyone?', 'The first question on any network ticket is "who else is affected?". One user means look at their device. Everyone means look at shared gear. Never restart shared infrastructure for a single-user problem.'] });

  add({ id: 'slow', tier: 1, cat: 'Performance', title: 'Computer is really slow', target: 'desk',
    desc: 'My computer takes forever to do anything. Excel takes a full minute to open.',
    clues: [['When did you last restart it?', 'Restart? I just close the lid. So... a month ago? Maybe more?'],
      ['Is it slow at everything?', 'Everything. Typing lags. It is like it is thinking about each letter.']],
    checks: [{ l: 'Open Task Manager', o: 'Up time: 34 days\nMemory: 94%\nChrome: 61 tabs, 9.1 GB\nStartup apps: 14 enabled', k: 1, t: 3 },
      { l: 'Check free disk space', o: 'C: 48 GB free of 256 GB. That is fine.', t: 2 },
      { l: 'Run a quick malware scan', o: 'Scan complete. 0 threats found.', t: 6 }],
    fixes: [{ l: 'Restart the PC and disable the startup apps they do not need', ok: 1, o: 'After the reboot memory sits at 38%. Excel opens in two seconds.' },
      { l: 'Order them a new computer', ok: 0, o: 'Marcus the CFO declines the purchase: "The old one has 16 GB of RAM and a 34 day uptime. Try again."' },
      { l: 'Wipe and reimage it', ok: 0, o: 'Three hours of reinstalling apps to fix what a restart would have. Start small.' }],
    learn: ['Check uptime before anything else', 'Task Manager tells you uptime, memory and what is hogging both. A machine that has not restarted in weeks leaks memory and stacks up pending updates. Restart, then trim startup apps.'] });

  add({ id: 'mouse', tier: 1, cat: 'Hardware', title: 'Wireless mouse is dead', target: 'desk',
    desc: 'My mouse stopped moving. The pointer is just stuck there, judging me.',
    clues: [['Has it been acting up?', 'It was jumpy all week and then gave up this morning.']],
    checks: [{ l: 'Flip the mouse over', o: 'Power switch: ON. Sensor light: OFF. No light at all.', k: 1, t: 1 },
      { l: 'Check the USB receiver', o: 'Receiver plugged in. Windows shows "USB Receiver" connected.', t: 2 }],
    fixes: [{ l: 'Replace the AA batteries', ok: 1, need: 'aa', o: 'Red sensor light comes on. Pointer moves.' },
      { l: 'Give them a whole new mouse', ok: 2, need: 'kbm', o: 'It works. But you just retired a good mouse because of a two dollar battery.' },
      { l: 'Reinstall the mouse driver', ok: 0, o: 'Driver reinstalled. The mouse still has no power.' }],
    learn: ['No light, no power', 'Jumpy then dead is the classic low battery pattern. Check power before drivers. Keep spare AA and AAA batteries in your kit.'] });

  add({ id: 'offline', tier: 1, cat: 'Email', title: 'No new email since morning', target: 'desk',
    desc: 'I have not received a single email since 9. Either everyone forgot me or something is broken.',
    clues: [['Do you see any message in Outlook?', 'At the bottom it says "Working Offline". I did not ask it to do that.']],
    checks: [{ l: 'Read the Outlook status bar', o: 'Status: WORKING OFFLINE', k: 1, t: 1 },
      { l: 'Open a website', o: 'cedarline.example loads fine. Internet is OK.', t: 1 },
      { l: 'Check webmail', o: '23 new messages sitting in the mailbox on the server.', t: 2 }],
    fixes: [{ l: 'Send/Receive tab > turn off Work Offline', ok: 1, o: 'Status flips to "Connected". 23 emails pour in.' },
      { l: 'Delete and rebuild the mail profile', ok: 0, o: 'That would work eventually, but it throws away cached mail and settings for a one-click problem.' },
      { l: 'Reinstall Office', ok: 0, o: 'Forty minutes later Outlook opens... still in Work Offline mode. It is a setting.' }],
    learn: ['Read what the app is telling you', 'Status bars and error text are free diagnostics. Proving the internet works and that mail exists on the server narrows it to the client in under a minute.'] });

  add({ id: 'phish', tier: 1, cat: 'Security', title: 'Weird email asking for password', target: 'desk',
    desc: 'I got an email from "IT Support" saying my mailbox is full and I need to confirm my password. Is that you?',
    clues: [['Did you click the link or type anything in?', 'No! It looked off so I stopped.'],
      ['Who is it from exactly?', 'helpdesk@cedarline-security.co. That is not our address, is it?']],
    checks: [{ l: 'Hover over the link (do not click)', o: 'Displayed: "Verify mailbox"\nActual URL: http://login-micros0ft.xyz/cedarline', k: 1, t: 2 },
      { l: 'Check the message headers', o: 'SPF: FAIL\nDKIM: none\nReturn-Path: bounce@mailer-78.xyz', t: 3 }],
    fixes: [{ l: 'Report it as phishing, block the sender, remove it, and thank them for reporting', ok: 1, o: 'Reported and purged from four other mailboxes too. One other person had clicked it, and you caught it early.' },
      { l: 'Click the link to see what it does', ok: 0, o: 'Dana appears behind you like a ghost. "We do not click the link. We never click the link."' },
      { l: 'Reply and tell them to stop', ok: 0, o: 'Now the attacker knows this mailbox is live and read by a human. Expect more.' }],
    learn: ['Spot the phish', 'Look-alike sender domain, urgency, a link that does not match its text, a request for credentials. IT never asks for your password. Praise people who report: you want them to do it again.'] });

  add({ id: 'tvinput', tier: 1, cat: 'Meeting room', title: 'Meeting room TV shows nothing', target: 'meeting',
    desc: 'I have a client call in the Fraser Room and the TV will not show my laptop. It says "No Signal".',
    clues: [['Which cable did you plug in?', 'The HDMI one on the table. The one with the HDMI 1 label.']],
    checks: [{ l: 'Check the TV input source', o: 'Current input: HDMI 2\nTable cable is plugged into: HDMI 1', k: 1, t: 1 },
      { l: 'Check the HDMI cable', o: 'Seated firmly at both ends. No bent pins.', t: 2 },
      { l: 'Press Win+P on the laptop', o: 'Project mode: Duplicate. Laptop sees a second display.', t: 1 }],
    fixes: [{ l: 'Switch the TV to HDMI 1', ok: 1, o: 'The laptop screen appears on the TV. Client call saved.' },
      { l: 'Replace the HDMI cable', ok: 0, need: 'hdmi', o: 'New cable, same "No Signal". The TV was listening on the wrong input.' },
      { l: 'Restart the laptop', ok: 0, o: 'The laptop was already sending video. Restarting it changed nothing.' }],
    learn: ['Source, cable, input', 'For any display problem walk the chain: is the source sending (Win+P), is the cable good, is the display on the right input. "No Signal" on a TV is very often the wrong input.'] });

  add({ id: 'sdrive', tier: 1, cat: 'Files', title: 'S: drive is missing', target: 'desk',
    desc: 'My S: drive is gone. All the sales decks live there. Please tell me they still exist.',
    clues: [['Where were you working yesterday?', 'From home on the VPN. Today I came in and S: has a red X on it.']],
    checks: [{ l: 'Open File Explorer', o: 'S: (\\\\FS01\\Sales)  [red X]  Disconnected network drive', k: 1, t: 1 },
      { l: 'ping FS01', o: 'Reply from 10.0.1.20: bytes=32 time<1ms TTL=128\nServer is up and reachable.', k: 1, t: 2 },
      { l: 'Check group membership', o: 'Member of: Sales-Share (Modify). Permissions are fine.', t: 3 }],
    fixes: [{ l: 'Remap it: net use S: \\\\FS01\\Sales /persistent:yes', ok: 1, o: 'S: reconnects. Every deck is right where they left it.' },
      { l: 'Make them a local admin so it "just works"', ok: 0, o: 'Admin rights would not remap a drive, and now they can install anything. Least privilege: give only the access a job needs.' },
      { l: 'Copy everything to their desktop instead', ok: 0, o: 'Now there are two copies of every deck and nobody knows which is current.' }],
    learn: ['Server up + permissions fine = client mapping', 'Prove each link: can you reach the server, does the user have rights. If both are yes, the mapping itself is stale. net use with /persistent:yes brings it back at every sign-in.'] });

  add({ id: 'mic', tier: 1, cat: 'Audio', title: 'Nobody can hear me on calls', target: 'desk',
    desc: 'On Teams I can hear everyone but they say I am silent. I have been miming for two meetings.',
    clues: [['Did you plug in anything new?', 'I got that new monitor with the webcam built in on Monday.']],
    checks: [{ l: 'Open Teams device settings', o: 'Speaker: Headset (Jabra)\nMicrophone: Monitor Webcam Mic  <-- the new monitor', k: 1, t: 2 },
      { l: 'Check the headset mute switch', o: 'Inline mute: off. Boom mic is down.', t: 1 },
      { l: 'Windows input test on the headset', o: 'The level bar jumps when they talk into the headset. The mic works.', t: 2 }],
    fixes: [{ l: 'Select the headset as the microphone in Teams and set it as Windows default', ok: 1, o: 'Test call: "Oh! We can hear you!"' },
      { l: 'Replace the headset', ok: 2, need: 'headset', o: 'Windows happens to pick the new headset as default, so it works. The old headset was fine though.' },
      { l: 'Reinstall Teams', ok: 0, o: 'Fresh install, same settings sync back, same wrong microphone.' }],
    learn: ['New device, new default', 'Windows often switches the default audio device when you plug in something new, like a monitor with a webcam. Check which device the app is using before blaming hardware.'] });

  add({ id: 'mfa', tier: 1, cat: 'Accounts', title: 'New phone, cannot sign in', target: 'desk',
    desc: 'I got a new phone on the weekend and now I cannot approve the sign-in thing. I am locked out of everything.',
    clues: [['Do you still have the old phone?', 'I traded it in at the store.']],
    checks: [{ l: 'Check their MFA methods in the admin portal', o: 'Registered methods:\n  Authenticator app: "iPhone 12" (the old phone)\n  No backup method', k: 1, t: 3 },
      { l: 'Verify identity (employee ID + callback to their manager)', o: 'Employee ID matches. Manager confirms it is them and that they got a new phone.', k: 1, t: 5 }],
    fixes: [{ l: 'After verifying identity, reset MFA so they can register the new phone, and add a backup method', ok: 1, o: 'They scan the QR code on the new phone. Signed in. Backup phone number added.' },
      { l: 'Turn MFA off for their account', ok: 0, o: 'MFA blocks the vast majority of account takeovers. Turning it off for convenience is how breaches start.' },
      { l: 'Reset it right away, they seem honest', ok: 0, o: 'It WAS them this time. But "new phone, please reset my MFA" is exactly what an attacker says. Verify first, every time.' }],
    learn: ['Verify identity before resets', 'Password and MFA resets are the top social engineering target at any help desk. Use a second channel: employee ID, a callback to a known number, or their manager. Then set up a backup method so it does not happen again.'] });

  add({ id: 'diskfull', tier: 1, cat: 'Storage', title: 'Cannot save: disk full', target: 'desk',
    desc: 'It will not let me save anything. It says there is not enough space. I only have, like, documents!',
    clues: [['Do you download a lot?', 'Client videos. And installers. And I never empty the recycle bin, is that a thing?']],
    checks: [{ l: 'Check the C: drive', o: 'C: 0.3 GB free of 256 GB  [red bar]', k: 1, t: 1 },
      { l: 'See what is using the space', o: 'Downloads: 71 GB\nTemp files: 38 GB\nRecycle Bin: 22 GB\nWindows update cache: 9 GB', k: 1, t: 4 }],
    fixes: [{ l: 'Run Disk Cleanup, empty the bin, and move their downloads to OneDrive', ok: 1, o: '94 GB free. Saving works. You show them where Storage Sense lives.' },
      { l: 'Delete some big folders from C:\\Windows', ok: 0, o: 'The PC will not boot anymore. Never hand-delete system folders.' },
      { l: 'Swap in a bigger SSD', ok: 2, need: 'ssd', o: 'It works, after an afternoon of cloning. They will fill this one too. The junk was the real problem.' }],
    learn: ['Find what is eating the space', 'Do not guess, measure. Storage settings or a tool like TreeSize shows where the gigabytes went. Temp files, the recycle bin and Downloads are safe wins. System folders are not.'] });

  /* ---------------- TIER 2 ---------------- */
  add({ id: 'apipa', tier: 2, cat: 'Network', title: 'No network at my desk', target: 'desk', screen: 'err',
    desc: 'My desktop has no internet, no email, nothing. The little globe icon has a line through it.',
    clues: [['Did anything change at your desk?', 'Facilities shifted my desk over on Friday to fit the new plant.'],
      ['Can you use Wi-Fi?', 'It is a desktop. Cable only.']],
    checks: [{ l: 'ipconfig', o: 'Ethernet adapter Ethernet:\n   IPv4 Address . . . : 169.254.37.12\n   Subnet Mask  . . . : 255.255.0.0\n   Default Gateway  . :', k: 1, t: 2 },
      { l: 'Look at the network port lights', o: 'No link light on the PC. No link light on the wall jack side either.', k: 1, t: 2 },
      { l: 'ping 10.0.1.1', o: 'PING: transmit failed. General failure.', t: 1 },
      { l: 'Inspect the patch cable', o: 'The cable is pinched hard under the desk leg. The jacket is split.', k: 1, t: 2 }],
    fixes: [{ l: 'Replace the damaged patch cable', ok: 1, need: 'cable', o: 'Link light: green. ipconfig now shows 10.0.1.87. Everything loads.' },
      { l: 'ipconfig /release then /renew', ok: 0, o: '"Unable to contact your DHCP server." There is no link. Software cannot fix a broken wire.' },
      { l: 'Type in a static IP address by hand', ok: 0, o: 'Still no link light, so still nothing. And hand-set addresses cause conflicts later.' }],
    learn: ['169.254.x.x means "I could not find DHCP"', 'That APIPA address is Windows giving up on DHCP. Work bottom-up through the OSI model: link light and cable (Layer 1) before IP settings (Layer 3). No link light means no amount of commands will help.'] });

  add({ id: 'dns', tier: 2, cat: 'Network', title: 'Websites will not load', target: 'desk',
    desc: 'No websites load on my laptop. But Teams still works, which makes no sense to me.',
    clues: [['Has anyone changed settings on it?', 'My nephew "optimized" it on the weekend. He watches a lot of tech videos.']],
    checks: [{ l: 'ping 8.8.8.8', o: 'Reply from 8.8.8.8: bytes=32 time=11ms TTL=117\n(0% loss)  The internet is reachable by IP.', k: 1, t: 1 },
      { l: 'nslookup cedarline.example', o: 'DNS request timed out.\n    timeout was 2 seconds.\nServer:  UnKnown\nAddress:  10.0.1.99', k: 1, t: 2 },
      { l: 'ipconfig /all', o: 'DHCP Enabled. . . . : Yes\nIPv4 Address. . . . : 10.0.1.63\nDNS Servers . . . . : 10.0.1.99   (set manually)', k: 1, t: 2 }],
    fixes: [{ l: 'Set DNS back to automatic and run ipconfig /flushdns', ok: 1, o: 'DNS Servers: 10.0.1.10. nslookup answers instantly. Sites load.' },
      { l: 'Replace the network cable', ok: 0, o: 'Ping to 8.8.8.8 already worked, so the cable and the IP path are fine. This is a name problem.' },
      { l: 'Disable the firewall', ok: 0, o: 'Sites still do not load, and now the laptop is unprotected. Put that back on.' }],
    learn: ['IP works, names do not: it is DNS', 'If you can ping an IP address but not a name, the network is fine and name resolution is broken. nslookup shows which DNS server is being asked. Teams kept working because it had cached addresses.'] });

  add({ id: 'bsod', tier: 2, cat: 'Hardware', title: 'Blue screens every day', target: 'desk', screen: 'bsod',
    desc: 'I get a blue screen with a sad face a few times a day. I have lost the same email draft three times.',
    clues: [['Does it happen during anything specific?', 'No pattern. Excel, browsing, sitting idle. Totally random.']],
    checks: [{ l: 'Read the stop codes in Event Viewer', o: 'BugCheck 0x1A MEMORY_MANAGEMENT\nBugCheck 0x50 PAGE_FAULT_IN_NONPAGED_AREA\nBugCheck 0x3B (different module each time)', k: 1, t: 4 },
      { l: 'Run Windows Memory Diagnostic', o: 'Test complete.\nHardware problems were detected.', k: 1, t: 12 },
      { l: 'Check drive health (SMART)', o: 'Health: Good (99%). No reallocated sectors.', t: 2 },
      { l: 'Check recent driver updates', o: 'No driver changes in the last 60 days.', t: 3 }],
    fixes: [{ l: 'Replace the faulty RAM stick', ok: 1, need: 'ram', o: 'Memory test passes clean. A week later: zero blue screens.' },
      { l: 'Reinstall Windows', ok: 0, o: 'Fresh Windows. Blue screen during setup. Bad hardware survives any reinstall.' },
      { l: 'Update the graphics driver', ok: 0, o: 'The crashes named a different module every time. One driver would crash the same way each time.' }],
    learn: ['Random crashes point at hardware', 'A driver bug crashes in the same place. Faulty RAM crashes everywhere, with different stop codes. Test hardware before reinstalling software: memory diagnostic for RAM, SMART for drives.'] });

  add({ id: 'smart', tier: 2, cat: 'Hardware', title: 'PC clicking, files corrupt', target: 'desk',
    desc: 'My computer makes a clicking noise and two of my files will not open. It takes ten minutes to start.',
    clues: [['Is the important work saved anywhere else?', 'Some of it is on the shared drive. Most is... on this computer.']],
    checks: [{ l: 'Check SMART status', o: 'Health: BAD\nReallocated Sectors Count: 1,892\nCurrent Pending Sectors: 240', k: 1, t: 2 },
      { l: 'Event Viewer > System', o: 'disk: The device \\Device\\Harddisk0 has a bad block. (x 312)', k: 1, t: 3 }],
    fixes: [{ l: 'Copy the data off right now, then replace the drive with an SSD', ok: 1, need: 'ssd', o: 'Data cloned with only two unreadable files. New SSD in. Boots in 9 seconds.' },
      { l: 'Defragment the drive to speed it up', ok: 0, o: 'Defrag hammers every sector on a dying disk. The drive gives its last click. Now it is a data recovery job.' },
      { l: 'Run chkdsk /r until it comes back clean', ok: 0, o: 'Each pass finds more bad sectors. You are stressing a failing drive instead of saving the data.' }],
    learn: ['Failing drive: data first, always', 'Clicking plus reallocated sectors means the drive is dying. Every minute of use risks more data. Stop, copy what matters, then replace. Anything that stresses the disk (defrag, repeated scans) makes it worse.'] });

  add({ id: 'spooler', tier: 2, cat: 'Printing', title: 'Print queue is frozen', target: 'printer2',
    desc: 'Nothing has come out of the upstairs printer in an hour. Everyone keeps hitting print again.',
    clues: [['What was the first job that got stuck?', 'A 300 page PDF from Finance, I think. Then everything piled up behind it.']],
    checks: [{ l: 'Open the print queue', o: 'Q4_ledger_FINAL_v7.pdf   Error - Printing   312 pages\n...and 14 documents waiting behind it', k: 1, t: 2 },
      { l: 'Check the Print Spooler service', o: 'Print Spooler: Running\n(But the stuck job will not cancel.)', k: 1, t: 2 },
      { l: 'ping the printer', o: 'Reply from 10.0.1.50: time=2ms. Printer is online.', t: 1 }],
    fixes: [{ l: 'Stop the spooler, clear the spool\\PRINTERS folder, start the spooler', ok: 1, o: 'Queue is empty. A test page prints. You ask Finance to send the big job in chunks.' },
      { l: 'Ask everyone to print their jobs again', ok: 0, o: 'The queue goes from 15 stuck jobs to 31 stuck jobs.' },
      { l: 'Order a replacement printer', ok: 0, o: 'The printer answered ping and has no errors. The jam is in software.' }],
    learn: ['Clear a stuck spooler', 'One corrupt job blocks every job behind it. If it will not cancel: net stop spooler, delete the files in C:\\Windows\\System32\\spool\\PRINTERS, net start spooler.'] });

  add({ id: 'group', tier: 2, cat: 'Accounts', title: 'New hire: access denied', target: 'desk', who: 'dept:HR',
    desc: 'Our new coordinator started today and gets "Access denied" on the HR system. Their account works for everything else.',
    clues: [['Who approved their access?', 'I did, I am their manager. It is on the onboarding form.']],
    checks: [{ l: 'whoami /groups (on their session)', o: 'CEDARLINE\\Domain Users\nCEDARLINE\\All-Staff\n(no HR groups listed)', k: 1, t: 2 },
      { l: 'Check the account in Active Directory', o: 'Created: yesterday 16:42\nMember of: Domain Users, All-Staff\nOnboarding form asked for: HR-App-Users', k: 1, t: 3 }],
    fixes: [{ l: 'Add them to HR-App-Users (approval is on file), then have them sign out and back in', ok: 1, o: 'After signing back in, the HR system opens. The group shows up in whoami.' },
      { l: 'Add them to Domain Admins so nothing is blocked', ok: 0, o: 'You just gave a day-one employee the keys to the whole company. Dana removes it before the audit log finishes writing.' },
      { l: 'Let them use the manager\'s login for now', ok: 0, o: 'Shared accounts mean nobody knows who did what. Never share logins.' }],
    learn: ['Access comes from groups', 'Grant access by adding users to the right security group, with manager approval, and nothing more (least privilege). Group changes only take effect at the next sign-in, when a new token is issued.'] });

  add({ id: 'ipconflict', tier: 2, cat: 'Network', title: 'Network keeps dropping', target: 'desk',
    desc: 'My connection cuts out every few minutes and a popup says something about an IP address conflict.',
    clues: [['Did someone set this PC up specially?', 'The last IT guy typed some numbers in by hand so I could reach an old system. Years ago.']],
    checks: [{ l: 'ipconfig /all', o: 'DHCP Enabled. . . . : No\nIPv4 Address. . . . : 10.0.1.50  (manual)', k: 1, t: 2 },
      { l: 'Check the DHCP lease table', o: '10.0.1.50   PRINTER-F2   lease active', k: 1, t: 3 },
      { l: 'Event Viewer', o: 'Tcpip 4199: The system detected an address conflict for IP address 10.0.1.50', t: 2 }],
    fixes: [{ l: 'Set the PC back to DHCP and give the printer a proper DHCP reservation', ok: 1, o: 'PC picks up 10.0.1.112. Printer keeps .50 by reservation. No more drops for either.' },
      { l: 'Unplug the printer', ok: 0, o: 'The PC is stable. Floor 2 cannot print. You moved the problem.' },
      { l: 'Type in a different address by hand', ok: 0, o: 'Works until DHCP hands that address to a phone next week. Hand-typed addresses inside a DHCP range always collide eventually.' }],
    learn: ['Two devices, one address', 'An IP conflict means two devices claim the same address and take turns losing. Let DHCP manage addresses. For devices that must keep an address (printers, servers) use a reservation.'] });

  add({ id: 'bitlocker', tier: 2, cat: 'Security', title: 'Laptop wants a recovery key', target: 'desk', screen: 'bsod',
    desc: 'My laptop is asking for a 48 digit BitLocker recovery key. I have never seen one of those in my life.',
    clues: [['What happened before this?', 'It installed a firmware update last night and restarted.']],
    checks: [{ l: 'Read the recovery screen', o: 'BitLocker recovery\nRecovery key ID: 7A3F-91C2', k: 1, t: 1 },
      { l: 'Search the directory for that key ID', o: 'Device: LT-0142\nKey ID 7A3F-91C2: MATCH\nRecovery key: 281094-......-774213', k: 1, t: 4 },
      { l: 'Confirm the laptop is assigned to this user', o: 'Asset LT-0142: assigned to this user. Badge photo matches.', t: 2 }],
    fixes: [{ l: 'Enter the recovery key from the directory, then suspend and resume BitLocker', ok: 1, o: 'Windows boots. Suspending and resuming protection re-seals the key to the new firmware.' },
      { l: 'Wipe the laptop and start over', ok: 0, o: 'The key was sitting in the directory the whole time. That was their only copy of two client folders.' },
      { l: 'Keep guessing keys', ok: 0, o: 'There are 10^48 possibilities. You are not that lucky.' }],
    learn: ['Recovery keys live in the directory', 'Firmware or hardware changes can trip BitLocker into recovery. The key is escrowed in AD or Entra ID: match the key ID on screen. Suspend BitLocker before planned firmware updates.'] });

  add({ id: 'adware', tier: 2, cat: 'Security', title: 'Pop-ups everywhere', target: 'desk', screen: 'err',
    desc: 'There are ads popping up over everything and my homepage is some search site I have never heard of.',
    clues: [['Did you install anything lately?', 'A free PDF converter yesterday. It asked a lot of questions and I clicked Next a lot.']],
    checks: [{ l: 'Check installed programs', o: 'PDFMagicPro        installed yesterday\nSearchHelper Bar   installed yesterday\nWebShield Plus     installed yesterday', k: 1, t: 3 },
      { l: 'Run a full antivirus scan', o: '3 detections: PUP.Optional.Bundle, Adware.SearchHelper (x2)', k: 1, t: 10 },
      { l: 'Look at browser extensions', o: 'Unknown extension "Quick Search" with permission to read all sites.', k: 1, t: 2 }],
    fixes: [{ l: 'Unplug from the network, remove the programs and extension, rescan, reset the browser, change their passwords', ok: 1, o: 'Clean scan. Homepage back. Passwords rotated in case the extension was watching.' },
      { l: 'Close the pop-ups and install an ad blocker', ok: 0, o: 'The ads are hidden. The extension reading every page they visit is still there.' },
      { l: 'It is only ads, leave it', ok: 0, o: 'An extension that reads all sites can read their email and banking. This is a security incident.' }],
    learn: ['Adware is still malware', 'Bundled installers sneak in extras. Disconnect first so nothing phones home, remove, rescan, then rotate passwords because the browser was compromised. This is why users do not get local admin.'] });

  add({ id: 'clock', tier: 2, cat: 'Security', title: 'Every site says "not private"', target: 'desk',
    desc: 'Every website gives me a scary red warning that my connection is not private. Even Google!',
    clues: [['Has the PC been off for a while?', 'It sat in a storage closet for a year until I got it last week.']],
    checks: [{ l: 'Look at the system clock', o: 'Date: January 1, 2019', k: 1, t: 1 },
      { l: 'Open the certificate error details', o: 'NET::ERR_CERT_DATE_INVALID\nThis certificate is not valid yet (according to your clock).', k: 1, t: 2 },
      { l: 'Try a different website', o: 'Same warning on every HTTPS site.', t: 1 }],
    fixes: [{ l: 'Sync the time (w32tm /resync) and replace the dead CMOS battery so it holds', ok: 1, o: 'Clock jumps to today. Warnings gone. New coin cell keeps the time through a power cycle.' },
      { l: 'Tell them to click "Proceed anyway"', ok: 0, o: 'You just trained someone to click through security warnings. That habit will bite on the day the warning is real.' },
      { l: 'Reinstall the browser', ok: 0, o: 'New browser, same clock, same warning.' }],
    learn: ['Certificates depend on the clock', 'A TLS certificate is only valid between two dates. If the PC thinks it is 2019, every modern certificate looks "not valid yet". Domain logins also fail when clocks drift more than five minutes (Kerberos).'] });

  add({ id: 'tempprofile', tier: 2, cat: 'Windows', title: 'Desktop and files vanished', target: 'desk',
    desc: 'I logged in and everything is gone. My desktop is empty and it says something about a temporary profile.',
    clues: [['Did the PC shut down badly?', 'The power flickered yesterday right as I was logging off.']],
    checks: [{ l: 'Read the sign-in notification', o: '"You have been signed in with a temporary profile."', k: 1, t: 1 },
      { l: 'Look in C:\\Users', o: 'C:\\Users\\their.name   (41 GB, all files present)\nC:\\Users\\TEMP', k: 1, t: 2 },
      { l: 'Check the ProfileList registry key', o: 'S-1-5-21-...-1142        (points to TEMP)\nS-1-5-21-...-1142.bak    (points to the real profile)', k: 1, t: 4 }],
    fixes: [{ l: 'Fix the ProfileList entries (swap the .bak key back) and reboot', ok: 1, o: 'They sign in to their real desktop. Every file and shortcut is back.' },
      { l: 'Delete their user folder and let Windows make a fresh one', ok: 0, o: 'The files were all still there. They are not anymore.' },
      { l: 'Create a brand new domain account for them', ok: 0, o: 'New account, no files, no mailbox, no group memberships. And the old profile is still broken.' }],
    learn: ['Temporary profile: the data is still there', 'Windows loads a temp profile when it cannot load the real one, often after a bad shutdown. The files are still in C:\\Users. Confirm that first, then repair the ProfileList registry entry. Never delete before you look.'] });

  /* ---------------- TIER 3 ---------------- */
  add({ id: 'dhcpfull', tier: 3, cat: 'Network', title: 'Nobody new can get online', target: 'server', outage: 1,
    desc: 'Three visitors and two of our own people cannot get on the network this morning. Devices that were already on are fine.',
    clues: [['What do the failing devices show?', 'One of them showed me an address starting with 169.254.']],
    checks: [{ l: 'Open DHCP scope statistics', o: 'Scope 10.0.1.0/24\n  In use: 200 of 200 (100%)\n  Available: 0\n  Lease duration: 30 days', k: 1, t: 3 },
      { l: 'Browse the lease list', o: 'android-7f3a..., iPhone, Galaxy-S23, android-19bc...\n(dozens of phones and guest devices, many not seen in weeks)', k: 1, t: 4 },
      { l: 'Check the DHCP service', o: 'DHCP Server: Running. Authorized. No errors, it is just full.', t: 2 }],
    fixes: [{ l: 'Drop the lease time to 8 hours, clear stale leases, and move guests onto their own VLAN and scope', ok: 1, o: 'Scope drops to 61% in use. New devices get addresses right away. Guests are now walled off from the corporate network too.' },
      { l: 'Restart the DHCP server', ok: 0, o: 'It comes back up with the same 200 leases. Leases survive a restart.' },
      { l: 'Hand out static addresses to the people who are stuck', ok: 0, o: 'You are now the DHCP server. Tomorrow five more people will be stuck.' }],
    learn: ['DHCP scope exhaustion', 'A scope is a pool. With 30-day leases, every phone that visited once holds an address for a month. Short leases suit networks with lots of transient devices, and guests belong on a separate VLAN.'] });

  add({ id: 'loop', tier: 3, cat: 'Network', title: 'Whole network is crawling', target: 'server', outage: 1,
    desc: 'Everything is unusably slow for everyone on both floors. Calls are dropping. It started right after the board meeting setup.',
    clues: [['What changed in the boardroom?', 'Someone "tidied the cables". There was a loose network cable so they plugged both ends into the wall.']],
    checks: [{ l: 'Look at the core switch', o: 'Every port LED is flashing in perfect unison, nonstop.', k: 1, t: 2 },
      { l: 'Check the switch logs', o: 'CPU: 99%\n%SW_MATM-4-MACFLAP: Host 3c:52:... is flapping between Gi0/12 and Gi0/13\n(storm of the same message)', k: 1, t: 3 },
      { l: 'Look up ports Gi0/12 and Gi0/13 on the patch panel', o: 'Gi0/12 -> Boardroom jack A\nGi0/13 -> Boardroom jack B', k: 1, t: 3 }],
    fixes: [{ l: 'Unplug the looped cable, then enable spanning tree PortFast and BPDU Guard on access ports', ok: 1, o: 'The LEDs calm down within seconds. CPU 6%. With BPDU Guard, the next loop shuts one port instead of the whole office.' },
      { l: 'Reboot the core switch', ok: 0, o: 'Quiet for forty seconds. Then the loop floods it again. The cable is still plugged in.' },
      { l: 'Ask the ISP to increase the bandwidth', ok: 0, o: 'The internet link is idle. The LAN is eating itself.' }],
    learn: ['Switching loops and broadcast storms', 'A cable plugged into two ports of the same network makes broadcasts circle forever, multiplying until the switch chokes. MAC flapping in the logs names the ports. Spanning tree with BPDU Guard prevents it.'] });

  add({ id: 'raid', tier: 3, cat: 'Servers', title: 'File server: RAID degraded', target: 'server',
    desc: 'I got an automated email from FS01: "Virtual disk degraded". The shared drives still work. Should I worry?',
    clues: [['Any noise or lights in the server room?', 'There is an orange light on one of the drive trays.']],
    checks: [{ l: 'Open the RAID controller', o: 'Virtual Disk 0: RAID 5   DEGRADED\n  Disk 0: Online\n  Disk 1: Online\n  Disk 2: FAILED\n  Disk 3: Online', k: 1, t: 3 },
      { l: 'Check last night\'s backup', o: 'Job "FS01-Nightly": Success, 01:00, verified.', k: 1, t: 3 },
      { l: 'Look at the drive bays', o: 'Bay 2: solid amber. Bays 0, 1, 3: green.', t: 1 }],
    fixes: [{ l: 'Confirm the backup, hot-swap the failed disk in bay 2, and watch the rebuild', ok: 1, need: 'srvdrive', o: 'New disk in. Rebuild 0%... 100% four hours later. Array: Optimal.' },
      { l: 'Pull disk 1 to see if it is the bad one', ok: 0, o: 'RAID 5 survives exactly one missing disk. You just made it two. The array is offline and it is restore-from-backup day.' },
      { l: 'Shut the server down until a quiet weekend', ok: 0, o: 'A degraded RAID 5 has zero redundancy. Waiting only gives a second disk time to fail.' }],
    learn: ['Degraded means no safety net', 'RAID 5 tolerates one failed disk. Until you replace it and the rebuild finishes, one more failure loses everything. Verify the backup first, identify the right bay twice, then hot-swap. RAID is not a backup.'] });

  add({ id: 'backup', tier: 3, cat: 'Servers', title: 'Backups failing for 3 nights', target: 'server',
    desc: 'The backup report has been red three nights in a row. Nobody noticed until I read the email properly.',
    clues: [['Did anything big get added lately?', 'Marketing dumped all the raw video from the product shoot onto the server last week.']],
    checks: [{ l: 'Read the backup job log', o: 'Error: There is not enough space on the destination.\nDestination BACKUP01: 0 bytes free', k: 1, t: 3 },
      { l: 'Check the retention policy', o: 'Retention: Keep all restore points forever', k: 1, t: 2 },
      { l: 'Compare source size to last month', o: 'FS01 data: 2.9 TB (+40% in 7 days)', t: 2 }],
    fixes: [{ l: 'Set a real retention policy, prune old restore points, run the job, then test a restore', ok: 1, o: 'Job succeeds. You restore one random file to prove it. Retention: 30 daily, 12 monthly.' },
      { l: 'Turn off the failure emails', ok: 0, o: 'The report is no longer red. There are also no backups. That is the worst of both worlds.' },
      { l: 'Delete the newest backups to make room', ok: 0, o: 'You kept the oldest data and threw away the most recent. Backwards.' }],
    learn: ['A backup is only real if it restores', 'Backups fail quietly: full disks, expired credentials, changed paths. Read the reports, set retention so storage does not fill, and test restores on a schedule. Follow 3-2-1: three copies, two kinds of media, one offsite.'] });

  add({ id: 'ups', tier: 3, cat: 'Power', title: 'Beeping from the server room', target: 'server',
    desc: 'Something in the server room has been beeping every thirty seconds since last night. It is driving Finance up the wall.',
    clues: [['Did the lights flicker recently?', 'Yes, twice during the storm on Tuesday.']],
    checks: [{ l: 'Read the UPS display', o: 'Input: Online (utility power OK)\nStatus: REPLACE BATTERY\nEstimated runtime: 2 min', k: 1, t: 2 },
      { l: 'Check the UPS self-test history', o: 'Weekly self-test: FAILED (last 2 runs)', k: 1, t: 2 },
      { l: 'Check the load', o: 'Load: 38%. Well within capacity.', t: 1 }],
    fixes: [{ l: 'Hot-swap the UPS battery pack and run a self-test', ok: 1, need: 'upsbat', o: 'New pack in, no downtime. Self-test: PASS. Runtime: 41 min. Blessed silence.' },
      { l: 'Mute the alarm', ok: 0, o: 'Quiet now. The next two-second power blip takes down every server at once.' },
      { l: 'Plug the servers straight into the wall', ok: 0, o: 'Now there is no protection at all, not even two minutes.' }],
    learn: ['A UPS is only as good as its battery', 'UPS batteries last three to five years. A failed self-test or "replace battery" means the unit will not carry the load when power drops. Most packs are hot-swappable. Always test after replacing.'] });

  add({ id: 'ransom', tier: 3, cat: 'Security', title: 'Files renamed to .locked', target: 'desk', who: 'dept:Finance', screen: 'err',
    desc: 'All my files have a .locked ending and there is a text file telling me to pay Bitcoin. Please tell me this is a prank.',
    clues: [['What did you open before this?', 'An "invoice" attachment from a supplier I did not recognize. It asked me to enable macros.']],
    checks: [{ l: 'Look at the files', o: 'budget.xlsx.locked\npayroll_nov.xlsx.locked\nREAD_ME_RESTORE.txt', k: 1, t: 1 },
      { l: 'Check file server activity from this PC', o: '\\\\FS01\\Finance: 400 files modified in the last 3 minutes by this user. It is spreading over the mapped drive RIGHT NOW.', k: 1, t: 2 },
      { l: 'Check for a clean backup', o: 'FS01 snapshot from 01:00 today: clean, verified.', k: 1, t: 3 }],
    fixes: [{ l: 'Pull the PC off the network now, disable the account, restore the share from the clean snapshot, reimage the PC, report the incident', ok: 1, o: 'Contained at one PC and one share. Restored from 01:00. Four hours of work lost instead of the whole company.' },
      { l: 'Pay the ransom', ok: 0, o: 'Helen, the CEO: "We have backups for exactly this reason." Paying funds the next attack and guarantees nothing.' },
      { l: 'Restart the PC and see if it clears', ok: 0, o: 'It reboots and carries on encrypting. Every second on the network costs more files.' }],
    learn: ['Ransomware: contain first', 'The order is isolate, then investigate. Unplug the network so it cannot spread, disable the account, then restore from a known clean backup and rebuild the machine. Report it: there may be legal duties. This is what backups are for.'] });

  add({ id: 'cert', tier: 3, cat: 'Servers', title: 'Intranet shows security warning', target: 'server',
    desc: 'The intranet has a big red "Not secure" warning for everyone since this morning. People are asking if we got hacked.',
    clues: [['Did we get any warning emails about it?', 'IT renewal notices used to go to Craig. Craig left in March.']],
    checks: [{ l: 'View the site certificate', o: 'intranet.cedarline.example\nValid from: last year\nValid to: YESTERDAY', k: 1, t: 2 },
      { l: 'Check the server clock', o: 'Server time is correct and in sync.', t: 1 },
      { l: 'Find where renewal reminders go', o: 'Contact on the certificate: craig@cedarline.example (mailbox disabled)', k: 1, t: 3 }],
    fixes: [{ l: 'Renew and install the certificate, rebind it on the web server, and add expiry monitoring with a shared mailbox as contact', ok: 1, o: 'Padlock is back. A monitor now alerts the IT shared mailbox 30 days before any certificate expires.' },
      { l: 'Email everyone to click through the warning', ok: 0, o: 'You have now taught sixty people to ignore certificate warnings.' },
      { l: 'Switch the intranet to plain HTTP', ok: 0, o: 'The warning is gone and so is the encryption. Passwords now cross the network in clear text.' }],
    learn: ['Expired certificates are a process failure', 'Certificates expire on a known date. The fix is quick; the lesson is the process. Send renewal notices to a shared mailbox, not a person, and monitor expiry dates automatically.'] });

  add({ id: 'poe', tier: 3, cat: 'Network', title: 'Wi-Fi dead on Floor 2', target: 'server',
    desc: 'The Wi-Fi upstairs vanished this morning. Floor 1 is fine. The access point on the ceiling has no lights at all.',
    clues: [['Was any work done yesterday?', 'The security company put up four new cameras. They plugged them in themselves.']],
    checks: [{ l: 'Check the switch port for the Floor 2 access point', o: 'Gi0/24: PoE FAULT\nPower denied: budget exceeded', k: 1, t: 3 },
      { l: 'Show the PoE budget', o: 'PoE budget: 370 W\nAllocated:   370 W\n4 new devices on Gi0/5-8 drawing 25 W each (IP cameras)', k: 1, t: 3 },
      { l: 'Test the AP cable with a tester', o: 'All 8 wires pass. Cable is fine.', t: 4 }],
    fixes: [{ l: 'Move the cameras to a PoE injector, then re-enable the AP port', ok: 1, o: 'Budget drops to 270 W. Gi0/24 powers up. The AP light goes green and Floor 2 reconnects.' },
      { l: 'Factory reset the access point', ok: 0, o: 'You cannot reset a device that has no power.' },
      { l: 'Replace the access point', ok: 0, o: 'The new one is just as dark. The switch has no power left to give it.' }],
    learn: ['PoE has a budget', 'A PoE switch can only supply so many watts in total. When new devices use it up, the switch denies power to others, often the highest numbered port. Check the budget before adding cameras, phones or access points.'] });

  add({ id: 'perms', tier: 3, cat: 'Security', title: 'Sales can see Payroll folder', target: 'server',
    desc: 'Someone in Sales just told me they can open the Payroll folder. Salaries. Everyone\'s. I feel sick.',
    clues: [['When did it start?', 'They noticed today, but a contractor was "fixing permissions" for us last week.']],
    checks: [{ l: 'View NTFS permissions on \\\\FS01\\Finance\\Payroll', o: 'Finance-Payroll: Modify\nEveryone: Read   <-- added 6 days ago', k: 1, t: 3 },
      { l: 'Check the audit log', o: 'ACL change by CEDARLINE\\temp-contractor, 6 days ago\nRead access since: 3 users outside Finance', k: 1, t: 4 },
      { l: 'Check the share permissions', o: 'Share: Authenticated Users, Full Control (normal: NTFS does the restricting)', t: 2 }],
    fixes: [{ l: 'Remove "Everyone", leave only the Finance-Payroll group, pull the audit log and report it to management', ok: 1, o: 'Access is locked down. The audit list goes to Helen and HR so they can handle it properly.' },
      { l: 'Hide the folder', ok: 0, o: 'Hidden is not secured. Anyone who types the path still gets in.' },
      { l: 'Quietly fix it and tell no one', ok: 0, o: 'Personal data was exposed. Covering that up is far worse than the mistake. Report it.' }],
    learn: ['Permissions and honesty', 'Effective access is the most restrictive mix of share and NTFS permissions, and "Everyone" means everyone. Grant to groups, audit changes, and when private data is exposed, report it. IT earns trust by being straight when things go wrong.'] });

  add({ id: 'isp', tier: 3, cat: 'Network', title: 'Internet down, whole office', target: 'server', outage: 1,
    desc: 'The internet is down for the entire building. Phones, email, the CRM, everything. Sales is pacing.',
    clues: [['Can people still reach the file server?', 'Yes, actually. Shared drives work. It is only outside stuff.']],
    checks: [{ l: 'ping 10.0.1.1 (the firewall)', o: 'Reply from 10.0.1.1: time<1ms. The LAN is healthy.', k: 1, t: 1 },
      { l: 'ping 8.8.8.8', o: 'Request timed out. (100% loss)', k: 1, t: 1 },
      { l: 'Open the firewall WAN status', o: 'WAN1 (fibre): link UP, gateway unreachable. ISP modem "Online" LED is off.\nWAN2 (LTE backup): STANDBY, failover disabled', k: 1, t: 3 }],
    fixes: [{ l: 'Fail over to the LTE backup, open a ticket with the ISP, and post a status update to staff', ok: 1, o: 'Traffic flows over LTE in under a minute. ISP confirms a fibre cut two streets over. Staff know what is going on.' },
      { l: 'Have everyone restart their computers', ok: 0, o: 'Sixty reboots later, still no internet. The LAN was never the problem.' },
      { l: 'Restart the core switch', ok: 0, o: 'Now the file server is unreachable too, for three minutes. The LAN was the one thing that worked.' }],
    learn: ['Find where the path breaks', 'Ping outward one hop at a time: your gateway, then the internet. Inside works and outside does not means the fault is at the edge or the ISP. Use your failover, call the provider, and tell people. Communication is half of incident response.'] });

  const QUIZ = [
    ['Quick one: what does DHCP actually do?', ['Hands out IP addresses automatically', 'Turns names into IP addresses', 'Encrypts the Wi-Fi'], 0, 'DHCP leases each device an IP address, mask, gateway and DNS server.'],
    ['Settle a bet. DNS is basically the internet\'s...?', ['Phone book', 'Firewall', 'Speed limiter'], 0, 'DNS turns names like cedarline.example into IP addresses.'],
    ['Which one is the "this computer" loopback address?', ['192.168.1.1', '127.0.0.1', '8.8.8.8'], 1, '127.0.0.1 always points back at your own machine.'],
    ['What port does HTTPS use?', ['80', '25', '443'], 2, 'HTTPS is 443. Plain HTTP is 80. SMTP mail is 25.'],
    ['One app is frozen. What do I try first?', ['Reinstall Windows', 'Task Manager, End task', 'Pull the power cord'], 1, 'Ctrl+Shift+Esc, find the app, End task. Smallest fix first.'],
    ['What does ping test?', ['If a host answers and how long it takes', 'How strong my password is', 'How much disk space is left'], 0, 'Ping sends an echo request and times the reply.'],
    ['Which password is strongest?', ['P@ssw0rd!', 'correct-horse-battery-staple', 'Cedarline2026'], 1, 'Length beats clever symbols. A long passphrase is hard to guess and easy to remember.'],
    ['My PC shows a 169.254 address. Meaning?', ['It could not reach a DHCP server', 'It is on the guest Wi-Fi', 'It has a virus'], 0, 'That is APIPA: Windows gives itself an address when DHCP does not answer.'],
    ['What is the 3-2-1 backup rule?', ['3 copies, 2 media types, 1 offsite', '3 servers, 2 admins, 1 password', 'Back up 3 times a day'], 0, 'Three copies of the data, on two kinds of storage, with one copy somewhere else.'],
    ['What cable gives a Wi-Fi access point both data and power?', ['HDMI', 'Ethernet with PoE', 'USB-A'], 1, 'Power over Ethernet sends power down the network cable.'],
    ['What does MFA add to a login?', ['A second proof it is really you', 'A longer password', 'Faster sign-in'], 0, 'Something you know plus something you have, like a phone prompt.'],
    ['I found a USB stick in the parking lot. What now?', ['Plug it in to find the owner', 'Hand it to IT, do not plug it in', 'Keep it, free storage'], 1, 'Dropped USB sticks are a classic attack. Never plug in unknown media.'],
    ['Which command shows my IP settings on Windows?', ['ipconfig', 'showip', 'netstat -ip'], 0, 'ipconfig, and ipconfig /all for the details.'],
    ['What does "least privilege" mean?', ['Give people only the access their job needs', 'New hires get no access for a month', 'Only managers get admin'], 0, 'Less access means less damage when an account is misused or stolen.'],
    ['What is the default port for Remote Desktop?', ['22', '3389', '53'], 1, 'RDP is 3389. SSH is 22. DNS is 53.'],
    ['RAM is short-term memory. So an SSD is...?', ['Long-term storage', 'The graphics card', 'The power supply'], 0, 'RAM is wiped at power off. The SSD keeps your files.'],
  ];

  const TIPS = [
    'THE 6 STEPS\n1. Identify the problem\n2. Form a theory\n3. Test the theory\n4. Plan the fix\n5. Verify it works\n6. Document it',
    'Ask: who else is affected? One person or everyone changes where you look.',
    'Work bottom-up: power and cables first, then network settings, then software.',
    'A restart fixes more than anyone likes to admit. Check uptime.',
    'Never ask a user for their password. Never share yours.',
    'Change one thing at a time. If you change five things, you will not know which one worked.',
    'Write down what you did. The ticket notes are for the next person. It might be you.',
  ];

  const GENERIC = [
    'Nice to see IT walking around. Usually we only see you when something is on fire.',
    'Everything is working today. I am suspicious.',
    'Do you ever get tired of people asking "can you take a quick look"?',
    'I restarted this morning. On purpose. Be proud of me.',
    'The break room has those little oat bars again. Just saying.',
    'Is it normal for a laptop fan to sound like a small plane?',
  ];

  return { LEVELS, ITEMS, EMP, HARSH, TICKETS: T, QUIZ, TIPS, GENERIC };
})();
