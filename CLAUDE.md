# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Bubbles is a vanilla JS progressive web app (PWA) — a personal address book where contacts are organized into nested "bubble" groups. There is no build step, no framework, no bundler, and no package manager. The entire app runs directly in the browser.

## Running the App

Open `index.html` in a browser, or serve it with any static file server:

```bash
npx serve .
# or
python3 -m http.server
```

The PWA service worker (`serviceworker.js`) only activates over HTTP/HTTPS, not via `file://`, so use a local server to test offline behavior and caching.

## File Structure

| File | Purpose |
|---|---|
| `app.js` | All data, state, rendering logic, and event wiring |
| `index.html` | Static HTML shell — all views are pre-declared here |
| `style.css` | All styling, using CSS custom properties for design tokens |
| `serviceworker.js` | Caching strategies for static assets, API responses, and images |
| `manifest.json` | PWA metadata |

## Architecture

### Data (top of `app.js`)
All data lives as plain JS constants at the top of `app.js`:
- `USER_PROFILE` — the logged-in user's info
- `CONTACTS` — array of contact objects; each contact has required fields (`id`, `name`, `email`, `phone`, `color`) and optional fields (`slack`, `teams`, `birthday`, `instagram`, `twitter`, `linkedin`, `notes`)
- `BUBBLES` — array of bubble group objects; positions (`x`, `y`, `size`) are percentages of the chart area; bubbles reference contacts via `contactIds` and can nest via `subBubbleIds`/`parentId`

### Views
Five views are pre-rendered in `index.html` (`.view` divs) and shown/hidden via the `.view--active` class with CSS opacity transitions:
- `view-bubbles` — main bubble chart
- `view-contacts` — flat contact list
- `view-detail` — single bubble drill-down with its contacts
- `view-profile` — current user profile
- `view-contact-detail` — individual contact detail page

Navigation state is tracked in three module-level variables: `currentView`, `activeBubble`, `activeContactId`, and `previousView`.

### Rendering
Dynamic content (bubble charts, contact cards, profile pages) is injected into the pre-existing view containers by render functions in `app.js`. Avatar placement inside bubbles uses a golden-angle spiral algorithm (`layoutAvatars`) that tries progressively smaller avatar sizes until all contacts fit without overlap, with exclusion zones reserved for labels and sub-bubbles.

### Service Worker Caching
Three named caches with distinct strategies:
- Static assets → stale-while-revalidate
- `api.are.na` API calls → network-first with 5 s timeout
- Images (including S3/Arena CDN) → cache-first

## Design Tokens

All visual constants are CSS custom properties in `style.css` under `:root`. Key tokens: `--bg`, `--text`, `--glass`, `--glass-hover`, `--toggle-active`. The app is dark-mode-only with a deep navy background (`#020325`).

## Customizing Data

To add/edit contacts or bubbles, edit the `CONTACTS` and `BUBBLES` arrays near the top of `app.js`. Bubble positions (`x`, `y`, `size`) are 0–100 percent values relative to the chart container.
