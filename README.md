<div align="center">

<img src="docs/icon.png" alt="Fêrbûn" width="88">

# Fêrbûn

**Learn Kurdish, step by step.** Free, offline, no account.

<a href="https://omerizm47.github.io/ferbun/get.html"><img alt="Get the app" src="https://img.shields.io/badge/Get_the_app-E85D00?style=for-the-badge"></a>
<img alt="iOS and Android" src="https://img.shields.io/badge/iOS_and_Android-1C1C1E?style=for-the-badge">

![Expo](https://img.shields.io/badge/Expo_SDK_54-000020?style=flat-square&logo=expo&logoColor=white)
![React Native](https://img.shields.io/badge/React_Native_0.81-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)

<img src="docs/shot-1.jpg" width="22%"> <img src="docs/shot-2.jpg" width="22%"> <img src="docs/shot-3.jpg" width="22%"> <img src="docs/shot-4.jpg" width="22%">

</div>

## Why it exists

Kurdish has tens of millions of speakers and almost no decent learning software. The apps that do exist want an account, a subscription, and a signal. Fêrbûn wants none of those. Every lesson, story and word ships inside the binary, so it works on a village bus with no coverage and on a phone that has never been signed in to anything.

## What is in it

The interface speaks **English or Turkish**, and that choice is separate from the variety you are learning.

| Track | Status | Content |
|---|---|---|
| **Kurmancî** (Latin script) | Complete | 3 courses, 10 units, 40 lessons, 292 words across 17 themes, 14 interactive stories |
| **Sorani** (Latin script) | In progress | Vocabulary and the first courses authored, remaining lessons registered as real empty lessons rather than crashes |

Lessons come in four shapes: `vocab`, `grammar`, `culture`, `reading`. Stories carry a gloss for every single word plus comprehension questions, so tapping an unknown word never breaks the reading.

## How the learning works

**Spaced repetition.** Each word carries a mastery level from 0 to 5. Getting it right pushes the next review out along a fixed ladder of 0, 1, 3, 7, 14 and 30 days. Getting it wrong drops it one rung, never all the way back to zero. The home screen derives a live "due now" count straight from that state, so there is no queue to rebuild and nothing to sync.

```mermaid
graph LR
  L0["level 0<br/>today"] -->|correct| L1["level 1<br/>1 day"]
  L1 -->|correct| L2["level 2<br/>3 days"]
  L2 -->|correct| L3["level 3<br/>7 days"]
  L3 -->|correct| L4["level 4<br/>14 days"]
  L4 -->|correct| L5["level 5<br/>30 days"]
  L1 -.->|wrong| L0
  L2 -.->|wrong| L1
  L3 -.->|wrong| L2
  L4 -.->|wrong| L3
  L5 -.->|wrong| L4
```

**Weak words.** Anything stuck at mastery 0 or 1 is available as its own flashcard deck, so you can drill what is actually failing without waiting for a timer to fire.

**Rapid fire.** A timed round for when you want pressure instead of patience.

**Streaks that mean something.** Consecutive days move you through Candle, Spark, Campfire, Bonfire and Newroz Fire at 3, 7, 14 and 30 days. 100 XP is a level. There is a daily XP goal that resets at midnight without a background timer, and 12 badges to find.

## Offline and private

There is no backend. There is no account. There is no analytics call.

Progress lives on the device in `AsyncStorage` under a versioned schema, with a migration path and a backup key, so an app update cannot quietly eat a 40 day streak. Turning the phone off aeroplane mode changes nothing about how the app behaves.

## Content provenance

Language content is not vibes. Taught Sorani entries cite a source declared in [`src/data/sources.ts`](src/data/sources.ts), currently Thackston's *Sorani Kurdish: A Reference Grammar with Selected Readings* (Harvard). Two checks run over the corpus:

```bash
npm run selfcheck          # structural integrity of the content tree
npm run verify-citations   # every citation locator resolves to a region the volume actually has
```

The citation check is deliberately honest about its own limits. It proves a locator is well formed and points inside a part of the book that exists. It does not prove the cited page says what the author claims, and it cannot tell you whether a form is idiomatic or current. That still needs a speaker.

## Running it locally

Requires Node.js 18+ and npm.

```bash
npm install
npm start           # Expo dev server
npm run android     # or: npm run ios
npm run typecheck
npm run lint
```

Builds are produced with EAS, configured in [`eas.json`](eas.json).

## Project layout

```
App.tsx                 Root: fonts, theme, navigation, providers
src/
  screens/              Home, Lesson, Unit, Flashcard, RapidFire,
                        StoriesList, Story, Vocab, Profile, Onboarding
  data/
    tracks.ts           Track registry: one entry per taught variety
    courses.ts          Kurmancî course tree
    vocabulary.ts       292 words, 17 themes
    stories.ts          14 stories with per-word glosses
    exercises.ts        Teach cards and exercises per lesson
    sources.ts          Provenance registry for cited content
    ckb/                The Sorani corpus, same shape
  stores/               zustand stores + AsyncStorage migration
  i18n/                 English and Turkish interface strings
  components/ hooks/ theme/ utils/
tools/                  Content self-check and citation verification
docs/                   GitHub Pages: download page, privacy policy
```

Adding a variety means adding an entry to the track registry, not teaching a screen a new id. Script is a stored field and is never inferred from the track id, so an Arabic-script Sorani is a second script on the same track rather than a fork of every screen.

## Links

[Download](https://omerizm47.github.io/ferbun/get.html) &nbsp;·&nbsp; [Privacy policy](https://omerizm47.github.io/ferbun/privacy-policy.html)
