# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Project Overview

Bubbles is a React Native app (built with Expo) — a personal address book where contacts are organized into nested "bubble" groups. The original PWA files (`index.html`, `app.js`, `style.css`, `serviceworker.js`) are preserved in the repo root but the active codebase is the React Native app.

## Running the App

```bash
npm install
npx expo start          # starts the dev server (iOS/Android/Web)
npx expo start --ios    # open in iOS Simulator
npx expo start --web    # open in browser
```

## File Structure

```
app/                    # Expo Router screens
  _layout.tsx           # Root stack navigator
  (main)/
    _layout.tsx         # Main stack layout
    index.tsx           # Bubbles + Contacts main screen (mode toggle)
  bubble/[id].tsx       # Bubble detail screen
  contact/[id].tsx      # Contact detail screen
  profile.tsx           # User profile screen
  add-contact/
    index.tsx           # Add contact method picker
    manual.tsx          # Manual entry form
    paste.tsx           # Paste text parser
    photo.tsx           # Upload photo + OCR
    cloud.tsx           # Import from cloud (native placeholder)
    bubble-tap.tsx      # Share profile / Bubble Tap

src/
  components/           # Shared UI components
    Avatar.tsx          # Contact avatar (photo or initials)
    BubbleChart.tsx     # Main bubble chart with layout algorithms
    BottomNav.tsx       # Bottom tab navigation bar
    BubbleTags.tsx      # Bubble chip pills
    ConfirmDialog.tsx   # Confirmation modal
    ContactCard.tsx     # Contact list row
    Header.tsx          # App header with optional search
    Icons.tsx           # SVG icon components
    InfoCard.tsx        # Contact detail info rows
    ModeToggle.tsx      # Contact/Bubble mode segmented control
    SelectionSheet.tsx  # Bottom sheet for creating bubbles

  data/
    bubbles.ts          # Default BUBBLES data + Bubble type
    contacts.ts         # Default CONTACTS data + Contact type
    user.ts             # USER_PROFILE + DEMO_PROFILE_IMAGES

  store/
    index.ts            # Zustand store — all app state and mutations

  theme/
    index.ts            # Design tokens (Colors, Typography, Spacing, Radius)

  utils/
    layout.ts           # Avatar golden-angle spiral + bubble layout algorithms
    storage.ts          # AsyncStorage helpers
```

## Architecture

### State Management
The app uses **Zustand** (`src/store/index.ts`) for all global state:
- `contacts` — array of Contact objects
- `bubbles` — array of Bubble objects
- All mutations (addContact, updateContact, deleteContact, addBubble, nestBubble, etc.)
- `initialize()` — loads persisted data from AsyncStorage on app start
- `save()` — persists current state to AsyncStorage
- `reset()` — restores default demo data

### Navigation
Uses **Expo Router** (file-based routing) with a root stack navigator:
- `/(main)/index` — main screen (bubbles + contacts with mode toggle)
- `/bubble/[id]` — pushed when tapping a bubble
- `/contact/[id]` — pushed when tapping a contact or avatar
- `/profile` — pushed from bottom nav profile tab
- `/add-contact/*` — pushed from bottom nav add tab

### Bubble Chart
`BubbleChart.tsx` renders bubbles and avatars using absolute positioning. Layout is computed via `src/utils/layout.ts`:
- `layoutAvatars()` — golden-angle spiral algorithm for placing avatars inside bubbles
- `layoutTopLevelBubbles()` — resolves collisions between top-level bubbles
- `layoutNestedBubbles()` — positions sub-bubbles within their parent

### Design Tokens
All colors, typography, spacing, and shadows are in `src/theme/index.ts`. The app is dark-mode-only with a deep navy background (`#050714`).

### Data
To add/edit contacts or bubbles, edit the arrays in `src/data/contacts.ts` and `src/data/bubbles.ts`. Bubble positions (`x`, `y`, `size`) are 0–100 percent values relative to the chart container width.
