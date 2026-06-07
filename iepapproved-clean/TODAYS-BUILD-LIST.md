# Today's Complete Build List
## Organized by Page/Section
*Captured from Kimberly's full walkthrough — June 2026*

---

## HOMEPAGE — index.js

### NAV (top menu)
- [ ] Add "Storefront" link → /storefront page
- [ ] Add "Community" link → /community placeholder
- [ ] Add EN | ES language toggle (top right of nav)
- [ ] Fix broken logo image
- [ ] Remove "Contact" from legal footer section (duplicative)

### HOW IT WORKS — 3 Cards
- [ ] Cards clickable → flip animation → "Click to Try" → opens Ada chat
- [ ] Card 1: "Ask Ada Anything" — click to try → /ada
- [ ] Card 2: "Get the Law, Not Just an Opinion" — not an opinion language
- [ ] Card 3: "Advocate with Confidence" — prepare letters, the difference between yes and no

### MEET ADA SECTION
- [ ] Change "IEP Law Guide" subtitle under Ada → "Your IEP Approved AI Guide"
- [ ] Add to feature tiles: "Ada is not an attorney. We do not provide legal services. Ada is intuitive and will tell you when you need one."
- [ ] Capitalize Español in this section
- [ ] Spanish tile already exists — no need to add since toggle is coming

### PRICING SECTION
- [ ] Rename section: "Find Your Level of Support"
- [ ] Free tier copy: "Always free to start. Ask Ada 5 questions today, no signup needed. Join our community and ask up to 10 questions per month — free forever."
- [ ] Ada Unlimited: center tile, gold, "Most Popular" badge
  - Copy: "Unlimited access to Ada for less than a cup of coffee. $4.99/month was designed intentionally — because every family deserves access to the law, not just those who can afford an attorney."
  - Make this the centerpiece — bold, gold, prominent
- [ ] IEP Pro: "Coming Soon" — remove clickable start button
- [ ] Advocate+: "Coming Soon" — remove clickable start button

### OUR STORY SECTION
- [ ] Add photo gallery (6 Robbie photos)
- [ ] Tighten copy — stop after "you're winning, and he was right"
- [ ] Keep: "That moment taught me everything I need to know about the power of words — and the right ones at the right time."
- [ ] Keep: "That is the energy IEP Approved was built on."
- [ ] REMOVE: "Just because an outcome isn't what you expect..."
- [ ] REMOVE: "My first IEP meeting was no different..."
- [ ] REMOVE: the IEP meeting story paragraphs
- [ ] NEW closing paragraph: "IEP Approved was developed with the mindset that communication and collaboration are at the core of everything we do when advocating for our children. Knowledge is power — and knowing the law gives you the confidence to walk into any room and advocate for your child's future. That is why IEP Approved exists. Not to teach parents to fight. But to give every family the knowledge to partner, advocate, and win."
- [ ] *(Kimberly to approve this copy before publishing)*

### STAY INFORMED SECTION (email signup)
- [ ] Keep section as-is
- [ ] When someone submits email → send welcome email with logo
- [ ] Welcome email: branded, warm, confirms they joined mailing list
- [ ] After email signup → prompt to create a login (sets up future upgrade path)
- [ ] Fine print (no spam etc.) — keep as is, that's fine

### FOOTER
- [ ] Remove "Contact" from Legal column (already in Company column)
- [ ] Add AI disclosure: "Ada is an AI assistant, not a human attorney. IEP Approved provides legal information for educational purposes only and does not constitute an attorney-client relationship. Ada is powered by artificial intelligence."

---

## ADA PAGE — ada.js

### HEADER/NAV
- [ ] Add full nav header matching homepage (How It Works, Storefront, Community, Contact, EN|ES toggle)
- [ ] Keep the ← IEP Approved back link but make nav full width

### ADA PANEL (left side)
- [ ] Change "IEP Law Guide" → "Your IEP Approved AI Guide"
- [ ] Make "▶ Repeat" button much more prominent (larger, more visible)
- [ ] Resume position when unpausing audio (don't restart from beginning)

### MIC INPUT
- [ ] Two mic buttons at bottom:
  - 🎤 "Speak to Ask Ada" (English — lang: en-US)
  - 🎤 "Habla con Ada" (Spanish — lang: es-ES)
- [ ] Higher quality audio capture — more dynamic, sensitive microphone settings
- [ ] When listening: more responsive, doesn't require shouting

### VOICE OUTPUT (ElevenLabs)
- [ ] Fix Spanish speed/cadence inconsistency (speeds up then slows down)
- [ ] Fix punctuation being read aloud in Spanish (-- / § should not be narrated)
- [ ] Fix numbers being read in English during Spanish responses (504 → "quinientos cuatro" or "la Sección 504")
- [ ] Better text cleaning before sending to ElevenLabs
- [ ] Studio quality output target

### QUESTION LIMIT WALL
- [ ] Pop-out box (more prominent, centered modal)
- [ ] Primary CTA: "Join Ada Unlimited — $4.99/month" (recommended, gold, prominent)
- [ ] Secondary CTA: "Sign up free for 10 questions/month" (smaller, below)
- [ ] Free signup → auto welcome email sent
- [ ] Free signup → prompt to create login

### CHAT FEATURES
- [ ] Save chat history (requires Supabase login — Phase 2)
- [ ] When Spanish toggle is on → Ada's greeting shows in Spanish
- [ ] Resume audio from pause point (not restart)

---

## NEW PAGES TO BUILD

### /storefront
- [ ] Branded IEP Approved storefront page
- [ ] Lists all physical + digital products
- [ ] Links out to Amazon KDP
- [ ] Links out to Gumroad for digital downloads
- [ ] Open to ALL visitors — no login required
- [ ] Sections: Coloring Books, Story Books, Guides & Resources, Adaptive Tech (affiliate)

### /community
- [ ] Placeholder page for now
- [ ] "Coming Soon" with email signup to be notified
- [ ] Login required to access (captures data)
- [ ] Description of what community will include

---

## SPANISH TOGGLE — site-wide

### What changes when toggled to ES:
- [ ] All homepage text → Spanish
- [ ] Nav links → Spanish
- [ ] Ada's greeting → Spanish
- [ ] Mic language → es-ES automatically
- [ ] Storefront page → Spanish
- [ ] Pricing section → Spanish
- [ ] Footer → Spanish
- [ ] Legal pages → add Spanish versions (Phase 2)

---

## EMAIL AUTOMATIONS NEEDED

### Welcome email — mailing list signup
- [ ] Triggered when: someone submits email in "Stay Informed" section
- [ ] Contains: logo, warm welcome, what to expect, link to ask Ada
- [ ] Sent via: Resend

### Welcome email — Ada question limit (free signup)
- [ ] Triggered when: someone hits 5 question limit and signs up with email
- [ ] Contains: logo, "You now have 10 questions/month", link back to Ada
- [ ] Sent via: Resend

---

## PRIORITY ORDER FOR TODAY

**Tier 1 — Do first (blocks everything):**
1. Fix logo
2. Stripe live (waiting on unlock)
3. Spanish toggle
4. Two mic buttons on Ada (EN + ES)
5. Fix Spanish voice issues (punctuation, numbers, speed)

**Tier 2 — High impact:**
6. Nav updates (Storefront + Community links)
7. Clickable 1/2/3 cards → Ada
8. Pricing section copy overhaul
9. Story section tightened
10. Ada page full nav header

**Tier 3 — Build this week:**
11. /storefront page
12. /community placeholder
13. Welcome emails (Resend)
14. Question limit pop-out modal
15. Ada subtitle fix
16. Repeat button more prominent
17. Footer AI disclosure

