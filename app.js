/* ============================================================
   BUBBLES — app.js
   Data, rendering, and interactions.

   Designed to be readable and editable — every section is
   clearly labelled. Change data below to customise the app.
   ============================================================ */

/* ============================================================
   DATA — Current User's Profile
   This is the logged-in user — shown on the "My Profile" page.
   ============================================================ */
const USER_PROFILE = {
  name:      'Michael French',
  email:     'mfrench@gmail.com',
  phone:     '+1 (317) 123-4567',
  color:     '#4A5FA8',         // avatar background colour
  image:     'photos/MICHAELHEADSHOT25_SQ.jpg',
  slack:     '@Michael',
  teams:     'michael@michaelfrench.co',
  birthday:  'January 14, 1998',
  instagram: '@michaelfrench.co',
  twitter:   '@michaelfrench.co',
  linkedin:  'linkedin.com/MichaelFrench21',
};


/* ============================================================
   DATA — Contacts
   Add or edit contacts here.
   Optional extra fields (slack, birthday, social, notes) are
   shown on the individual contact detail page when present.
   ============================================================ */
const CONTACTS = [
  { id: 1,  name: 'Jack Granger',
    email: 'jack.granger@gmail.com',      phone: '+1 (555) 123-4567', color: '#8B7355',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    birthday: 'April 3, 1995' },

  { id: 2,  name: 'Jane Worthington',
    email: 'jane.worthington@gmail.com',  phone: '+1 (555) 234-5678', color: '#5D8A72',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
    slack: '@JaneW', instagram: '@jane.worthington' },

  { id: 3,  name: 'Andrew Smith',
    email: 'andrew.smith@gmail.com',      phone: '+1 (555) 123-4567', color: '#5E7FA3',
    image: 'https://randomuser.me/api/portraits/men/75.jpg',
    slack: '@Andrew',
    birthday: 'March 12, 1988',
    instagram: '@andrewsmith1',
    twitter:   '@andrewtennisfan',
    linkedin:  'linkedin.com/AndrewSmith4',
    notes: [
      { date: 'Jan. 14, 2025',       text: 'Met Andrew at design conference' },
      { date: 'February 21, 2025',   text: 'Ran into Andrew again at an event, LIKES SOCCER' },
      { date: 'March 4, 2025',       text: 'Got drinks with mutual friend Andrea' },
    ]
  },

  { id: 4,  name: 'Maya Chen',
    email: 'maya.chen@gmail.com',         phone: '+1 (555) 456-7890', color: '#B07850',
    image: 'https://randomuser.me/api/portraits/women/68.jpg',
    instagram: '@maya.chen', birthday: 'July 22, 1993' },

  { id: 5,  name: 'David Park',
    email: 'david.park@gmail.com',        phone: '+1 (555) 567-8901', color: '#7B6BB0',
    image: 'https://randomuser.me/api/portraits/men/14.jpg',
    slack: '@DavidP', linkedin: 'linkedin.com/davidpark' },

  { id: 6,  name: 'Sarah Lee',
    email: 'sarah.lee@gmail.com',         phone: '+1 (555) 678-9012', color: '#A8607A',
    image: 'https://randomuser.me/api/portraits/women/65.jpg',
    slack: '@SarahL', instagram: '@sarah.lee', birthday: 'December 5, 1991' },

  { id: 7,  name: 'Tom Wright',
    email: 'tom.wright@gmail.com',        phone: '+1 (555) 789-0123', color: '#4E8E72',
    image: 'https://randomuser.me/api/portraits/men/46.jpg' },

  { id: 8,  name: 'Emma Davis',
    email: 'emma.davis@gmail.com',        phone: '+1 (555) 890-1234', color: '#A06B5A',
    image: 'https://randomuser.me/api/portraits/women/17.jpg',
    birthday: 'October 18, 1990' },

  { id: 9,  name: 'Ryan Kim',
    email: 'ryan.kim@gmail.com',          phone: '+1 (555) 901-2345', color: '#4A7EA8',
    image: 'https://randomuser.me/api/portraits/men/22.jpg',
    twitter: '@ryankim', linkedin: 'linkedin.com/ryankim' },

  { id: 10, name: 'Lisa Torres',
    email: 'lisa.torres@gmail.com',       phone: '+1 (555) 012-3456', color: '#9B7040',
    image: 'https://randomuser.me/api/portraits/women/12.jpg',
    instagram: '@lisatorres', birthday: 'March 30, 1987' },

  { id: 11, name: 'Chris Nakamura',
    email: 'chris.n@gmail.com',           phone: '+1 (555) 111-2233', color: '#6B8E55',
    image: 'https://randomuser.me/api/portraits/men/57.jpg',
    slack: '@ChrisN' },

  { id: 12, name: 'Priya Patel',
    email: 'priya.patel@gmail.com',       phone: '+1 (555) 222-3344', color: '#9060A0',
    image: 'https://randomuser.me/api/portraits/women/72.jpg',
    linkedin: 'linkedin.com/priyapatel', birthday: 'February 8, 1994' },
];

/* ============================================================
   DATA — Bubbles
   Positions are expressed as percentages of the chart area.
   x/y = top-left corner of the bubble, size = diameter.
   All values are 0–100 (percent).

   contactIds = which contacts appear in this bubble.
   subBubbleIds = bubbles nested visually inside this one.
   parentId = the parent bubble (if this is a sub-bubble).
   ============================================================ */
const BUBBLES = [
  {
    id: 'work',
    label: 'Work',
    // Large bubble, left-center
    x: 5,   y: 36,  size: 45,
    contactIds: [1, 2, 3, 4, 5, 8],
    subBubbleIds: ['drinks-crew'],
  },
  {
    id: 'drinks-crew',
    label: 'Drinks\nCrew',
    // Sub-bubble inside Work
    x: 13,  y: 46,  size: 21,
    contactIds: [2, 5, 8],
    parentId: 'work',
  },
  {
    id: 'friends',
    label: 'Friends',
    // Medium bubble, right-center
    x: 49,  y: 44,  size: 37,
    contactIds: [1, 6, 7, 9, 11],
  },
  {
    id: 'soccer',
    label: 'Soccer',
    // Medium bubble, top-center-right
    x: 46,  y: 29,  size: 33,
    contactIds: [3, 4, 7],
  },
  {
    id: 'music',
    label: 'Music',
    // Small bubble, top-left
    x: 29,  y: 28,  size: 18,
    contactIds: [9, 10],
  },
  {
    id: 'design',
    label: 'Design',
    // Small bubble, far right
    x: 76,  y: 40,  size: 16,
    contactIds: [5, 12],
  },
  {
    id: 'wellness',
    label: 'Wellness',
    // Small bubble, bottom-left
    x: 30,  y: 56,  size: 22,
    contactIds: [6, 11],
  },
];

const DEFAULT_CONTACTS = JSON.parse(JSON.stringify(CONTACTS));
const DEFAULT_BUBBLES = JSON.parse(JSON.stringify(BUBBLES));
const DEMO_PROFILE_IMAGES = [
  'https://randomuser.me/api/portraits/women/44.jpg',
  'https://randomuser.me/api/portraits/men/32.jpg',
  'https://randomuser.me/api/portraits/women/68.jpg',
  'https://randomuser.me/api/portraits/men/75.jpg',
  'photos/MICHAELHEADSHOT25_SQ.jpg',
];


/* ============================================================
   ICONS
   Inline SVG strings for the profile / contact-detail views.
   Using the same stroke style as the rest of the app.
   ============================================================ */
const ICONS = {
  email: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="m2 7 10 7 10-7"/>
  </svg>`,

  phone: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.6 3.4 2 2 0 0 1 3.59 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91A16 16 0 0 0 14.09 16.09l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>`,

  // Slack — four rounded rectangles forming the # grid
  slack: `<svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zm1.271 0a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zm0 1.271a2.527 2.527 0 0 1 2.521 2.521 2.527 2.527 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.527 2.527 0 0 1 2.522-2.521h6.312zm10.122 2.521a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zm-1.268 0a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zm-2.523 10.122a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zm0-1.268a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/>
  </svg>`,

  // Microsoft Teams — T icon
  teams: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
    <circle cx="17.5" cy="5.5" r="2" fill="currentColor" stroke="none"/>
    <path d="M15 8.5h5c.8 0 1.5.7 1.5 1.5v5.5a1 1 0 0 1-1 1H19"/>
    <path d="M19 16.5V21"/>
    <path d="M5 7h7M8.5 7v10"/>
    <rect x="2" y="11" width="11" height="8" rx="2"/>
  </svg>`,

  birthday: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M20 12v10H4V12"/>
    <rect x="2" y="7" width="20" height="5" rx="1"/>
    <path d="M12 22V7"/>
    <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
    <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
  </svg>`,

  work: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <rect x="3" y="7" width="18" height="13" rx="2"/>
    <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/>
    <path d="M3 12h18"/>
  </svg>`,

  instagram: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
    <rect x="2" y="2" width="20" height="20" rx="5"/>
    <circle cx="12" cy="12" r="5"/>
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
  </svg>`,

  twitter: `<svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>`,

  linkedin: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="4"/>
    <line x1="7" y1="10" x2="7" y2="17"/>
    <line x1="7" y1="7" x2="7" y2="7.1"/>
    <path d="M11 17v-4a3 3 0 0 1 6 0v4M11 10v7"/>
  </svg>`,

  social: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M5 12h4M15 12h4M12 5v4M12 15v4"/>
    <circle cx="5" cy="12" r="2"/>
    <circle cx="19" cy="12" r="2"/>
    <circle cx="12" cy="5" r="2"/>
    <circle cx="12" cy="19" r="2"/>
  </svg>`,

  note: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="8" y1="13" x2="16" y2="13"/>
    <line x1="8" y1="17" x2="13" y2="17"/>
  </svg>`,
};


/* ============================================================
   STATE
   ============================================================ */
let currentView      = 'bubbles';  // 'bubbles' | 'contacts' | 'detail' | 'profile' | 'contact-detail' | 'add-contact' | 'upload-photo' | 'manual-entry' | 'paste-text' | 'import-cloud' | 'bubble-tap'
let activeBubble     = null;        // bubble id currently in detail view
let activeContactId  = null;        // contact id in contact-detail view
let previousView     = null;        // where to go back to from profile/contact-detail
let bubbleNavStack   = [];          // stack of bubble ids for drill-down back navigation
let selectedContactBubbleFilters = new Set();
let suppressClicksUntil = 0;
let activeSearchControl = null;

function isStandalonePwa() {
  return window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true;
}

function setAppViewportHeight() {
  const heights = [
    window.innerHeight,
    document.documentElement.clientHeight,
    window.visualViewport ? window.visualViewport.height : 0,
  ].filter(height => Number.isFinite(height) && height > 0);

  if (isStandalonePwa() && screen.height) {
    heights.push(screen.height);
  }

  const appHeight = Math.ceil(Math.max(...heights));
  document.documentElement.style.setProperty('--app-height', `${appHeight}px`);
}

const LONG_PRESS_MS = 220;
const DRAG_MOVE_THRESHOLD = 14;
const TOUCH_DRAG_MOVE_THRESHOLD = 42;
const NAVIGATION_CLICK_GUARD_MS = 500;
const APP_STORAGE_KEY = 'bubbles-app-data-v1';
const OCR_BACKEND_ENDPOINT_KEY = 'bubbles-ocr-backend-endpoint';
const TESSERACT_CDN_URL = 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';
let tesseractLoadPromise = null;

const dragState = {
  pointerId: null,
  pointerType: null,
  phase: 'idle',
  source: null,
  startX: 0,
  startY: 0,
  x: 0,
  y: 0,
  longPressTimer: null,
  sourceEl: null,
};

const selectionState = {
  open: false,
  mode: 'merge',
  parentBubbleId: null,
  newBubbleId: null,
  draftBubble: null,
  selectedIds: new Set(),
  query: '',
};

const importState = {
  source: 'Google Contacts',
  contacts: [],
  selectedIds: new Set(),
  status: 'Choose a platform, then upload a contacts export.',
};

const pasteTextState = {
  text: '',
  parsed: null,
  selectedContactId: null,
  contactQuery: '',
  selectedFieldKeys: new Set(),
  knownFieldKeys: new Set(),
  status: 'Paste a messy note, signature, or social handle to preview updates.',
};

const PASTE_CREATE_CONTACT_ID = '__create-contact__';

const uploadPhotoState = {
  file: null,
  previewUrl: '',
  sourceImageDataUrl: '',
  sourceImageName: '',
  text: '',
  parsed: null,
  selectedContactId: null,
  status: 'Upload a photo or screenshot to extract contact details.',
  isProcessing: false,
};

const manualEntryState = {
  mode: 'create',
  contactId: null,
  returnPreviousView: null,
  photoSrc: '',
  status: '',
};
let confirmDialogAction = null;

let generatedBubbleCount = 1;
const NEW_BUBBLE_TRIGGER_ID = '__new-bubble-trigger';


/* ============================================================
   HELPERS
   ============================================================ */

/** Get contact by id */
function getContact(id) {
  return CONTACTS.find(c => c.id === id);
}

/** Get bubble by id */
function getBubble(id) {
  return BUBBLES.find(b => b.id === id);
}

function saveAppData() {
  try {
    localStorage.setItem(APP_STORAGE_KEY, JSON.stringify({
      contacts: CONTACTS,
      bubbles: BUBBLES,
    }));
  } catch (error) {
    console.warn('Unable to save Bubble data', error);
  }
}

function getHighestGeneratedBubbleNumber() {
  return BUBBLES.reduce((max, bubble) => {
    const match = String(bubble.id || '').match(/(?:bubble|sub)-(\d+)$/);
    return match ? Math.max(max, parseInt(match[1], 10)) : max;
  }, 0);
}

function normalizeStoredContact(contact) {
  const normalized = { ...contact };
  if (typeof normalized.notes === 'string' && normalized.notes.trim()) {
    normalized.notes = [{
      date: getTodayNoteDate(),
      text: normalized.notes.trim(),
    }];
  }
  if (Array.isArray(normalized.socialLinks)) {
    normalized.socialLinks = normalized.socialLinks
      .map(link => ({
        network: String(link?.network || '').trim(),
        handle: String(link?.handle || '').trim(),
      }))
      .filter(link => link.network || link.handle);
  }
  return normalized;
}

function loadAppData() {
  try {
    const stored = JSON.parse(localStorage.getItem(APP_STORAGE_KEY) || 'null');
    if (!stored || typeof stored !== 'object') return;

    if (Array.isArray(stored.contacts)) {
      CONTACTS.splice(0, CONTACTS.length, ...stored.contacts.map(normalizeStoredContact));
    }

    if (Array.isArray(stored.bubbles)) {
      BUBBLES.splice(0, BUBBLES.length, ...stored.bubbles);
      BUBBLES.forEach(ensureBubbleArrays);
    }

    generatedBubbleCount = Math.max(generatedBubbleCount, getHighestGeneratedBubbleNumber() + 1);
  } catch (error) {
    console.warn('Unable to load saved Bubble data', error);
  }
}

function resetSavedAppData() {
  try {
    localStorage.removeItem(APP_STORAGE_KEY);
  } catch (error) {
    console.warn('Unable to clear saved Bubble data', error);
  }

  CONTACTS.splice(0, CONTACTS.length, ...JSON.parse(JSON.stringify(DEFAULT_CONTACTS)));
  BUBBLES.splice(0, BUBBLES.length, ...JSON.parse(JSON.stringify(DEFAULT_BUBBLES)));
  BUBBLES.forEach(ensureBubbleArrays);
  generatedBubbleCount = getHighestGeneratedBubbleNumber() + 1;
  activeBubble = null;
  activeContactId = null;
  previousView = null;
  bubbleNavStack = [];
  selectedContactBubbleFilters = new Set();
  manualEntryState.mode = 'create';
  manualEntryState.contactId = null;
  manualEntryState.returnPreviousView = null;
  manualEntryState.photoSrc = '';
  manualEntryState.status = '';
  goToBubbles();
}

function deleteContact(contactId) {
  const contactIndex = CONTACTS.findIndex(contact => contact.id === contactId);
  if (contactIndex < 0) return false;

  CONTACTS.splice(contactIndex, 1);
  BUBBLES.forEach(bubble => {
    ensureBubbleArrays(bubble);
    bubble.contactIds = bubble.contactIds.filter(id => id !== contactId);
  });
  BUBBLES
    .filter(bubble => bubble.parentId && bubble.contactIds.length === 0)
    .forEach(bubble => deleteBubbleCascade(bubble.id));

  if (activeContactId === contactId) activeContactId = null;
  saveAppData();
  return true;
}

/** Get initials from a name */
function initials(name) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

function getAvatarImageSrc(person) {
  return person?.image || person?.avatar || '';
}

function getAvatarFallbackText(person) {
  return person?.name ? initials(person.name) : '';
}

function escapeAttr(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeHTML(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function buildAvatarContents(person) {
  const imageSrc = getAvatarImageSrc(person);
  const fallback = getAvatarFallbackText(person);
  return imageSrc
    ? `<img src="${escapeAttr(imageSrc)}" alt="" loading="lazy" data-avatar-fallback="${escapeAttr(fallback)}">`
    : escapeHTML(fallback);
}

function appendAvatarContents(el, person) {
  const imageSrc = getAvatarImageSrc(person);
  if (!imageSrc) {
    el.textContent = getAvatarFallbackText(person);
    return;
  }

  const image = document.createElement('img');
  image.src = imageSrc;
  image.alt = '';
  image.loading = 'lazy';
  image.addEventListener('error', () => {
    image.remove();
    el.textContent = getAvatarFallbackText(person);
  }, { once: true });
  el.appendChild(image);
}

document.addEventListener('error', event => {
  const image = event.target;
  if (!(image instanceof HTMLImageElement) || !image.dataset.avatarFallback) return;

  const parent = image.parentElement;
  const fallback = image.dataset.avatarFallback;
  image.remove();
  if (parent) parent.textContent = fallback;
}, true);

function getContactSearchText(contact) {
  const socialText = Array.isArray(contact.socialLinks)
    ? contact.socialLinks.map(link => `${link.network || ''} ${link.handle || ''}`).join(' ')
    : '';
  return [
    contact.name,
    contact.email,
    contact.phone,
    contact.company,
    contact.title,
    contact.slack,
    contact.teams,
    contact.instagram,
    contact.twitter,
    contact.linkedin,
    Array.isArray(contact.notes) ? contact.notes.map(note => note.text).join(' ') : '',
    socialText,
  ].filter(Boolean).join(' ').toLowerCase();
}

function getSearchMatches(query) {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return [];

  return CONTACTS
    .filter(contact => {
      const haystack = getContactSearchText(contact);
      return terms.every(term => haystack.includes(term));
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

function closeSearchControl(control = activeSearchControl) {
  if (!control) return;

  const header = control.closest('.header');
  const input = control.querySelector('.header-search__input');
  const results = control.querySelector('.header-search__results');

  control.setAttribute('aria-expanded', 'false');
  if (input) input.value = '';
  if (results) results.innerHTML = '';
  control.classList.remove('header-search--active', 'header-search--has-results');
  header?.classList.remove('header--search-active');
  input?.blur();
  if (activeSearchControl === control) activeSearchControl = null;
}

function renderSearchResults(control) {
  const input = control.querySelector('.header-search__input');
  const results = control.querySelector('.header-search__results');
  if (!input || !results) return;

  const matches = getSearchMatches(input.value);
  results.innerHTML = '';
  control.classList.toggle('header-search--has-results', Boolean(input.value.trim()));

  if (!input.value.trim()) return;

  if (!matches.length) {
    const empty = document.createElement('div');
    empty.className = 'header-search__empty';
    empty.textContent = 'No matching contacts';
    results.appendChild(empty);
    return;
  }

  matches.forEach(contact => {
    const item = document.createElement('button');
    item.className = 'header-search__result';
    item.type = 'button';
    item.dataset.contactId = contact.id;

    const avatar = document.createElement('span');
    avatar.className = 'header-search__avatar';
    avatar.style.background = contact.color;
    appendAvatarContents(avatar, contact);

    const name = document.createElement('span');
    name.className = 'header-search__name';
    name.textContent = contact.name;

    item.append(avatar, name);
    results.appendChild(item);
  });
}

function openSearchControl(control) {
  if (activeSearchControl && activeSearchControl !== control) {
    closeSearchControl(activeSearchControl);
  }

  const header = control.closest('.header');
  const input = control.querySelector('.header-search__input');
  if (!header || !input) return;

  activeSearchControl = control;
  control.classList.add('header-search--active');
  header.classList.add('header--search-active');
  control.setAttribute('aria-expanded', 'true');
  renderSearchResults(control);

  input.focus({ preventScroll: true });
  requestAnimationFrame(() => {
    input.focus({ preventScroll: true });
    input.setSelectionRange(input.value.length, input.value.length);
  });
}

function setupSearchControls() {
  document.querySelectorAll('.header__icon-btn[aria-label="Search"]').forEach((button, index) => {
    if (button.dataset.searchEnhanced) return;
    button.dataset.searchEnhanced = 'true';

    const iconMarkup = button.innerHTML;
    const control = document.createElement('div');
    control.className = 'header-search';
    control.setAttribute('aria-expanded', 'false');
    control.innerHTML = `
      <button class="header-search__trigger" type="button" aria-label="Search contacts">${iconMarkup}</button>
      <input class="header-search__input" type="search" inputmode="search" enterkeyhint="search" autocomplete="off" autocapitalize="none" placeholder="Search contacts" aria-label="Search contacts" />
      <button class="header-search__clear" type="button" aria-label="Close search">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>
      <div class="header-search__results" id="header-search-results-${index}" role="listbox"></div>
    `;

    button.replaceWith(control);

    const trigger = control.querySelector('.header-search__trigger');
    const input = control.querySelector('.header-search__input');
    const clear = control.querySelector('.header-search__clear');
    const results = control.querySelector('.header-search__results');

    trigger.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      openSearchControl(control);
    });

    input.addEventListener('click', event => event.stopPropagation());
    input.addEventListener('input', () => renderSearchResults(control));
    input.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeSearchControl(control);
      }
    });

    clear.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();

      if (input.value.trim()) {
        input.value = '';
        renderSearchResults(control);
        input.focus();
        return;
      }

      closeSearchControl(control);
    });

    results.addEventListener('click', event => {
      const result = event.target.closest('.header-search__result');
      if (!result) return;
      const contactId = parseInt(result.dataset.contactId, 10);
      if (!contactId) return;

      event.preventDefault();
      event.stopPropagation();
      closeSearchControl(control);
      goToContactDetail(contactId);
    });
  });
}
/**
 * Check whether two circles overlap once padding is included.
 */
function circlesOverlap(a, b, padding = 0) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const minDistance = a.r + b.r + padding;
  return (dx * dx) + (dy * dy) < minDistance * minDistance;
}

function ensureBubbleArrays(bubble) {
  if (!bubble.subBubbleIds) bubble.subBubbleIds = [];
  if (!bubble.contactIds) bubble.contactIds = [];
}

function makeBubbleId(prefix = 'bubble') {
  let candidate = `${prefix}-${generatedBubbleCount++}`;
  while (getBubble(candidate)) {
    candidate = `${prefix}-${generatedBubbleCount++}`;
  }
  return candidate;
}

function makeNewBubbleTrigger() {
  return {
    id: NEW_BUBBLE_TRIGGER_ID,
    label: '',
    x: 66,
    y: 66,
    size: 16,
    contactIds: [],
    subBubbleIds: [],
    isNewBubbleTrigger: true,
  };
}

function createDraftTopLevelBubble() {
  const chart = document.getElementById('bubble-chart');
  const triggerEl = chart?.querySelector(`[data-bubble-id="${NEW_BUBBLE_TRIGGER_ID}"]`);
  const chartRect = chart?.getBoundingClientRect();
  const triggerRect = triggerEl?.getBoundingClientRect();
  const size = 22;
  let x = 62;
  let y = 62;

  if (chartRect && triggerRect && chartRect.width > 0 && chartRect.height > 0) {
    const centerX = triggerRect.left - chartRect.left + (triggerRect.width / 2);
    const centerY = triggerRect.top - chartRect.top + (triggerRect.height / 2);
    x = ((centerX - ((size / 100) * chartRect.width / 2)) / chartRect.width) * 100;
    y = ((centerY - ((size / 100) * chartRect.width / 2)) / chartRect.height) * 100;
  }

  return {
    id: makeBubbleId('bubble'),
    label: 'New Bubble',
    x: Math.max(0, Math.min(100 - size, x)),
    y: Math.max(0, Math.min(100 - size, y)),
    size,
    contactIds: [],
    subBubbleIds: [],
  };
}

function ensureInteractionShell() {
  const app = document.querySelector('.app');
  if (!app) return;

  const selectionSheetMarkup = `
      <div class="selection-sheet__backdrop" id="selection-sheet-backdrop"></div>
      <div class="selection-sheet__panel">
        <div class="selection-sheet__grabber"></div>
        <div class="selection-sheet__header">
          <h2 class="selection-sheet__title" id="selection-sheet-title">Add to New Bubble</h2>
          <p class="selection-sheet__subtitle">Select more contacts to include.</p>
        </div>
        <div class="selection-sheet__fields">
          <label class="selection-sheet__field">
            <span class="selection-sheet__label">Bubble Name</span>
            <input class="selection-sheet__input" id="selection-sheet-name" type="text" placeholder="New Bubble" />
          </label>
          <label class="selection-sheet__field">
            <span class="selection-sheet__label">Search Contacts</span>
            <input class="selection-sheet__input" id="selection-sheet-search" type="search" placeholder="Search all contacts" />
          </label>
        </div>
        <div class="selection-sheet__list" id="selection-sheet-list"></div>
        <div class="selection-sheet__actions">
          <button class="selection-sheet__btn" id="selection-sheet-cancel" type="button">Not Now</button>
          <button class="selection-sheet__btn selection-sheet__btn--primary" id="selection-sheet-confirm" type="button">Done</button>
        </div>
      </div>
    `;

  if (!document.getElementById('drag-layer')) {
    const dragLayer = document.createElement('div');
    dragLayer.className = 'drag-layer';
    dragLayer.id = 'drag-layer';
    dragLayer.setAttribute('aria-hidden', 'true');
    dragLayer.innerHTML = `
      <div class="drag-ghost" id="drag-ghost"></div>
      <button class="trash-drop" id="trash-drop" type="button" aria-label="Remove">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path d="M4 7h16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
          <path d="M9 3h6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
          <path d="M8 7v11a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
          <path d="M10 11v5M14 11v5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
        </svg>
      </button>
    `;
    app.appendChild(dragLayer);
  }

  if (!document.getElementById('selection-sheet')) {
    const selectionSheet = document.createElement('div');
    selectionSheet.className = 'selection-sheet';
    selectionSheet.id = 'selection-sheet';
    selectionSheet.setAttribute('aria-hidden', 'true');
    selectionSheet.innerHTML = selectionSheetMarkup;
    app.appendChild(selectionSheet);
  } else {
    const existingSheet = document.getElementById('selection-sheet');
    const hasExpectedFields =
      document.getElementById('selection-sheet-name') &&
      document.getElementById('selection-sheet-search');

    if (existingSheet && !hasExpectedFields) {
      existingSheet.innerHTML = selectionSheetMarkup;
      existingSheet.setAttribute('aria-hidden', 'true');
    }
  }

  if (!document.getElementById('confirm-dialog')) {
    const confirmDialog = document.createElement('div');
    confirmDialog.className = 'confirm-dialog';
    confirmDialog.id = 'confirm-dialog';
    confirmDialog.setAttribute('aria-hidden', 'true');
    confirmDialog.innerHTML = `
      <div class="confirm-dialog__backdrop" id="confirm-dialog-backdrop"></div>
      <div class="confirm-dialog__panel" role="dialog" aria-modal="true" aria-labelledby="confirm-dialog-title">
        <h2 class="confirm-dialog__title" id="confirm-dialog-title"></h2>
        <p class="confirm-dialog__text" id="confirm-dialog-text"></p>
        <div class="confirm-dialog__actions">
          <button class="confirm-dialog__btn" id="confirm-dialog-cancel" type="button">Cancel</button>
          <button class="confirm-dialog__btn confirm-dialog__btn--danger" id="confirm-dialog-confirm" type="button">Confirm</button>
        </div>
      </div>
    `;
    app.appendChild(confirmDialog);
  }
}

function closeConfirmDialog() {
  const dialog = document.getElementById('confirm-dialog');
  if (!dialog) return;
  dialog.classList.remove('confirm-dialog--open');
  dialog.setAttribute('aria-hidden', 'true');
  confirmDialogAction = null;
}

function openConfirmDialog({ title, text, confirmLabel = 'Confirm', onConfirm }) {
  ensureInteractionShell();
  const dialog = document.getElementById('confirm-dialog');
  const titleEl = document.getElementById('confirm-dialog-title');
  const textEl = document.getElementById('confirm-dialog-text');
  const confirmButton = document.getElementById('confirm-dialog-confirm');
  if (!dialog || !titleEl || !textEl || !confirmButton) return;

  titleEl.textContent = title;
  textEl.textContent = text;
  confirmButton.textContent = confirmLabel;
  confirmDialogAction = onConfirm;
  dialog.classList.add('confirm-dialog--open');
  dialog.setAttribute('aria-hidden', 'false');
  confirmButton.focus({ preventScroll: true });
}

function bindConfirmDialogEvents() {
  const dialog = document.getElementById('confirm-dialog');
  if (!dialog || dialog.dataset.bound) return;
  dialog.dataset.bound = 'true';

  document.getElementById('confirm-dialog-backdrop')?.addEventListener('click', closeConfirmDialog);
  document.getElementById('confirm-dialog-cancel')?.addEventListener('click', closeConfirmDialog);
  document.getElementById('confirm-dialog-confirm')?.addEventListener('click', () => {
    const action = confirmDialogAction;
    closeConfirmDialog();
    action?.();
  });
}

function getBubbleChildren(parentId) {
  return BUBBLES.filter(bubble => bubble.parentId === parentId);
}

function removeBubbleReference(parentId, childId) {
  const parent = getBubble(parentId);
  if (!parent || !parent.subBubbleIds) return;
  parent.subBubbleIds = parent.subBubbleIds.filter(id => id !== childId);
}

function deleteBubbleCascade(bubbleId) {
  const bubble = getBubble(bubbleId);
  if (!bubble) return;

  getBubbleChildren(bubbleId).forEach(child => deleteBubbleCascade(child.id));

  if (bubble.parentId) {
    removeBubbleReference(bubble.parentId, bubbleId);
  }

  const bubbleIndex = BUBBLES.findIndex(entry => entry.id === bubbleId);
  if (bubbleIndex >= 0) {
    BUBBLES.splice(bubbleIndex, 1);
  }
}

function refreshCurrentView() {
  closeSelectionSheet();

  if (currentView === 'bubbles') {
    renderBubbleChart();
  } else if (currentView === 'detail' && activeBubble) {
    if (!getBubble(activeBubble)) {
      bubbleNavStack = [];
      goToBubbles();
      return;
    }
    renderBubbleDetail(activeBubble);
  } else if (currentView === 'contacts') {
    renderContactsList();
  } else if (currentView === 'profile') {
    renderUserProfile();
  } else if (currentView === 'contact-detail' && activeContactId) {
    renderContactDetail(activeContactId);
  } else if (currentView === 'upload-photo') {
    renderUploadPhoto();
  } else if (currentView === 'manual-entry') {
    renderManualEntry();
  } else if (currentView === 'paste-text') {
    renderPasteText();
  } else if (currentView === 'import-cloud') {
    renderImportCloud();
  } else if (currentView === 'bubble-tap') {
    renderBubbleTap();
  }
}

function isBubbleDescendant(candidateId, ancestorId) {
  let cursor = getBubble(candidateId);
  while (cursor?.parentId) {
    if (cursor.parentId === ancestorId) return true;
    cursor = getBubble(cursor.parentId);
  }
  return false;
}

function getDescendantContactIds(bubbleId) {
  const descendantContactIds = new Set();

  getBubbleChildren(bubbleId).forEach(child => {
    ensureBubbleArrays(child);
    child.contactIds.forEach(contactId => descendantContactIds.add(contactId));
    getDescendantContactIds(child.id).forEach(contactId => descendantContactIds.add(contactId));
  });

  return descendantContactIds;
}

function getVisualContactIds(bubble) {
  ensureBubbleArrays(bubble);
  const nestedContactIds = getDescendantContactIds(bubble.id);
  return bubble.contactIds.filter(contactId => !nestedContactIds.has(contactId));
}

function nestBubbleIntoBubble(sourceId, targetId) {
  if (!sourceId || !targetId || sourceId === targetId) return false;

  const source = getBubble(sourceId);
  const target = getBubble(targetId);
  if (!source || !target) return false;
  if (isBubbleDescendant(targetId, sourceId)) return false;

  if (source.parentId) {
    removeBubbleReference(source.parentId, source.id);
  }
  ensureBubbleArrays(target);
  source.parentId = target.id;
  if (!target.subBubbleIds.includes(source.id)) {
    target.subBubbleIds.push(source.id);
  }

  const nestedContactIds = new Set(source.contactIds);
  getDescendantContactIds(source.id).forEach(contactId => nestedContactIds.add(contactId));
  nestedContactIds.forEach(contactId => {
    if (!target.contactIds.includes(contactId)) {
      target.contactIds.push(contactId);
    }
  });

  return true;
}

function createSubBubbleFromContacts(parentBubbleId, sourceContactId, targetContactId) {
  const parent = getBubble(parentBubbleId);
  if (!parent || sourceContactId === targetContactId) return null;
  ensureBubbleArrays(parent);

  if (!parent.contactIds.includes(sourceContactId) || !parent.contactIds.includes(targetContactId)) {
    return null;
  }

  const sourceContact = getContact(sourceContactId);
  const targetContact = getContact(targetContactId);
  const label = `${(sourceContact?.name || 'New').split(' ')[0]}\n${(targetContact?.name || 'Bubble').split(' ')[0]}`;

  const newBubble = {
    id: makeBubbleId('sub'),
    label,
    x: parent.x + 5,
    y: parent.y + 5,
    size: Math.max(18, Math.min(24, parent.size * 0.55)),
    contactIds: [sourceContactId, targetContactId],
    subBubbleIds: [],
    parentId: parent.id,
  };

  BUBBLES.push(newBubble);
  parent.subBubbleIds.push(newBubble.id);
  return newBubble;
}

function moveContactToBubble(contactId, sourceBubbleId, targetBubbleId) {
  if (!contactId || !sourceBubbleId || !targetBubbleId || sourceBubbleId === targetBubbleId) return false;

  const source = getBubble(sourceBubbleId);
  const target = getBubble(targetBubbleId);
  if (!source || !target) return false;
  ensureBubbleArrays(source);
  ensureBubbleArrays(target);

  if (!source.contactIds.includes(contactId) || target.contactIds.includes(contactId)) return false;

  if (!isBubbleDescendant(target.id, source.id)) {
    source.contactIds = source.contactIds.filter(id => id !== contactId);
  }
  target.contactIds.push(contactId);

  if (source.parentId && source.contactIds.length === 0) {
    deleteBubbleCascade(source.id);
  }

  return true;
}

function removeContactFromBubble(contactId, bubbleId) {
  const bubble = getBubble(bubbleId);
  if (!bubble) return false;
  ensureBubbleArrays(bubble);
  if (!bubble.contactIds.includes(contactId)) return false;

  bubble.contactIds = bubble.contactIds.filter(id => id !== contactId);

  if (bubble.parentId && bubble.contactIds.length === 0) {
    deleteBubbleCascade(bubble.id);
  }

  return true;
}

function removeBubbleCategory(bubbleId) {
  const bubble = getBubble(bubbleId);
  if (!bubble) return false;

  if (bubble.parentId) {
    const parent = getBubble(bubble.parentId);
    if (parent) {
      ensureBubbleArrays(parent);
      bubble.contactIds.forEach(contactId => {
        if (!parent.contactIds.includes(contactId)) {
          parent.contactIds.push(contactId);
        }
      });
    }
  }

  deleteBubbleCascade(bubbleId);
  if (activeBubble === bubbleId) {
    activeBubble = null;
  }
  return true;
}

/**
 * Compute positions for N avatars inside a bubble without overlap.
 * Exclusion circles reserve room for labels or nested bubbles.
 */
function layoutAvatars(count, bubbleRadius, initialAvatarSize, options = {}) {
  if (count === 0) return { avatarSize: initialAvatarSize, offsets: [] };

  const {
    exclusionCircles = [],
    minAvatarSize = 18,
    spacing = 8,
    edgePadding = 10,
  } = options;

  const goldenAngle = Math.PI * (3 - Math.sqrt(5));

  for (let avatarSize = Math.round(initialAvatarSize); avatarSize >= minAvatarSize; avatarSize -= 2) {
    const avatarRadius = avatarSize / 2;
    const maxR = bubbleRadius - avatarRadius - edgePadding;
    if (maxR <= 0) continue;

    const positions = [];
    const candidateCount = Math.max(count * 36, 180);

    for (let candidateIndex = 0; candidateIndex < candidateCount && positions.length < count; candidateIndex++) {
      const t = (candidateIndex + 0.5) / candidateCount;
      const r = Math.sqrt(t) * maxR;
      const angle = candidateIndex * goldenAngle;
      const candidate = {
        x: r * Math.cos(angle),
        y: r * Math.sin(angle),
        r: avatarRadius,
      };

      const insideBubble = Math.hypot(candidate.x, candidate.y) + avatarRadius <= bubbleRadius - edgePadding;
      if (!insideBubble) continue;

      const hitsExclusion = exclusionCircles.some(exclusion =>
        circlesOverlap(candidate, exclusion, spacing)
      );
      if (hitsExclusion) continue;

      const hitsAvatar = positions.some(position =>
        circlesOverlap(candidate, { ...position, r: avatarRadius }, spacing)
      );
      if (hitsAvatar) continue;

      positions.push({ x: candidate.x, y: candidate.y });
    }

    if (positions.length === count) {
      return { avatarSize, offsets: positions };
    }
  }

  // Fallback: evenly distribute tiny avatars around a ring.
  const avatarSize = minAvatarSize;
  const avatarRadius = avatarSize / 2;
  const ringRadius = Math.max(0, bubbleRadius - avatarRadius - edgePadding - 2);
  const offsets = Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
    return {
      x: Math.cos(angle) * ringRadius * 0.72,
      y: Math.sin(angle) * ringRadius * 0.72,
    };
  });

  return { avatarSize, offsets };
}

/**
 * Create a DOM element for an avatar circle.
 * avatarSize is in pixels.
 */
function createAvatarEl(contact, avatarSize, options = {}) {
  const { interactive = true } = options;
  const el = document.createElement(interactive ? 'button' : 'div');
  if (interactive) {
    el.type = 'button';
    el.className = 'avatar';
    el.dataset.contactId = contact.id;
    el.setAttribute('aria-label', `Open ${contact.name}`);
    el.title = contact.name;
  } else {
    el.className = 'bubble-preview-avatar';
    el.setAttribute('aria-hidden', 'true');
    el.style.pointerEvents = 'none';
  }
  el.style.width  = avatarSize + 'px';
  el.style.height = avatarSize + 'px';
  el.style.background = contact.color;

  if (getAvatarImageSrc(contact)) {
    appendAvatarContents(el, contact);
  } else if (avatarSize >= 28) {
    el.textContent = getAvatarFallbackText(contact);
  }
  return el;
}

function setAvatarInteractiveState(avatarEl, isInteractive) {
  if (avatarEl.classList.contains('bubble-preview-avatar')) return;
  avatarEl.disabled = !isInteractive;
  avatarEl.classList.toggle('avatar--occluded', !isInteractive);
  avatarEl.style.pointerEvents = isInteractive ? '' : 'none';
  if (isInteractive) {
    avatarEl.removeAttribute('aria-hidden');
    avatarEl.tabIndex = 0;
  } else {
    avatarEl.setAttribute('aria-hidden', 'true');
    avatarEl.tabIndex = -1;
  }
}

function applyDetailAvatarOcclusion(chart) {
  const detailView = document.getElementById('view-detail');
  if (!chart || !detailView || !detailView.classList.contains('view--active')) return;

  const headerGradient = detailView.querySelector('.header__gradient');
  const blockedRect = headerGradient?.getBoundingClientRect();
  const blockedCircles = Array.from(chart.querySelectorAll('.bubble--sub')).map(el => {
    const rect = el.getBoundingClientRect();
    const radius = rect.width / 2;
    return {
      x: rect.left + radius,
      y: rect.top + radius,
      r: radius,
    };
  });

  chart.querySelectorAll('.avatar').forEach(avatarEl => {
    const rect = avatarEl.getBoundingClientRect();
    const centerX = rect.left + (rect.width / 2);
    const centerY = rect.top + (rect.height / 2);

    const occludedByHeader = blockedRect &&
      centerX >= blockedRect.left &&
      centerX <= blockedRect.right &&
      centerY >= blockedRect.top &&
      centerY <= blockedRect.bottom;

    const occludedBySubBubble = blockedCircles.some(circle =>
      Math.hypot(centerX - circle.x, centerY - circle.y) <= circle.r
    );

    setAvatarInteractiveState(avatarEl, !(occludedByHeader || occludedBySubBubble));
  });
}

function pointIsInsideElementCircle(element, clientX, clientY) {
  if (!element) return false;
  const rect = element.getBoundingClientRect();
  const radius = rect.width / 2;
  if (radius <= 0) return false;

  const centerX = rect.left + radius;
  const centerY = rect.top + radius;
  return Math.hypot(clientX - centerX, clientY - centerY) <= radius;
}

function getNestedBubbleExclusions(parentBubble, chartW, chartH, positionedSubBubbles = null) {
  const parentPxX = (parentBubble.x / 100) * chartW;
  const parentPxY = (parentBubble.y / 100) * chartH;
  const parentRadius = ((parentBubble.size / 100) * chartW) / 2;
  const parentCx = parentPxX + parentRadius;
  const parentCy = parentPxY + parentRadius;

  if (positionedSubBubbles) {
    return positionedSubBubbles.map(subBubble => {
      const subPxX = (subBubble.x / 100) * chartW;
      const subPxY = (subBubble.y / 100) * chartH;
      const subRadius = ((subBubble.size / 100) * chartW) / 2;

      return {
        x: subPxX + subRadius - parentCx,
        y: subPxY + subRadius - parentCy,
        r: subRadius,
      };
    });
  }

  return (parentBubble.subBubbleIds || [])
    .map(getBubble)
    .filter(Boolean)
    .map(subBubble => {
      const subPxX = (subBubble.x / 100) * chartW;
      const subPxY = (subBubble.y / 100) * chartH;
      const subRadius = ((subBubble.size / 100) * chartW) / 2;
      return {
        x: subPxX + subRadius - parentCx,
        y: subPxY + subRadius - parentCy,
        r: subRadius,
      };
    });
}

function bubbleToPxCircle(bubble, chartW, chartH) {
  const size = (bubble.size / 100) * chartW;
  const radius = size / 2;
  const x = (bubble.x / 100) * chartW;
  const y = (bubble.y / 100) * chartH;
  return {
    ...bubble,
    pxSize: size,
    r: radius,
    cx: x + radius,
    cy: y + radius,
  };
}

function pxCircleToBubble(circle, chartW, chartH) {
  return {
    ...circle,
    x: ((circle.cx - circle.r) / chartW) * 100,
    y: ((circle.cy - circle.r) / chartH) * 100,
    size: (circle.pxSize / chartW) * 100,
  };
}

function clampCircleToChart(circle, chartW, chartH, padding) {
  circle.cx = Math.min(chartW - padding - circle.r, Math.max(padding + circle.r, circle.cx));
  circle.cy = Math.min(chartH - padding - circle.r, Math.max(padding + circle.r, circle.cy));
}

function clampCircleToParent(circle, parentCircle, padding) {
  const maxDistance = Math.max(0, parentCircle.r - circle.r - padding);
  const dx = circle.cx - parentCircle.cx;
  const dy = circle.cy - parentCircle.cy;
  const distance = Math.hypot(dx, dy);

  if (distance > maxDistance && distance > 0) {
    const ratio = maxDistance / distance;
    circle.cx = parentCircle.cx + dx * ratio;
    circle.cy = parentCircle.cy + dy * ratio;
  } else if (distance === 0 && maxDistance > 0) {
    circle.cy = parentCircle.cy + maxDistance;
  }
}

function resolveBubbleCollisions(circles, gap, clampFn) {
  if (circles.length < 2) return circles;

  for (let iteration = 0; iteration < 160; iteration++) {
    let moved = false;

    for (let i = 0; i < circles.length; i++) {
      for (let j = i + 1; j < circles.length; j++) {
        const a = circles[i];
        const b = circles[j];
        const dx = b.cx - a.cx;
        const dy = b.cy - a.cy;
        const distance = Math.hypot(dx, dy) || 0.0001;
        const minDistance = a.r + b.r + gap;

        if (distance >= minDistance) continue;

        const overlap = (minDistance - distance) / 2;
        const ux = dx / distance;
        const uy = dy / distance;

        a.cx -= ux * overlap;
        a.cy -= uy * overlap;
        b.cx += ux * overlap;
        b.cy += uy * overlap;
        clampFn(a);
        clampFn(b);
        moved = true;
      }
    }

    if (!moved) break;
  }

  return circles;
}

function getCenteredLayoutShift(min, max, size, padding) {
  const desiredShift = (size / 2) - ((min + max) / 2);
  const minShift = padding - min;
  const maxShift = size - padding - max;

  if (minShift > maxShift) return 0;
  return Math.min(maxShift, Math.max(minShift, desiredShift));
}

function centerBubbleLayout(circles, chartW, chartH, padding, options = {}) {
  const { horizontal = true, vertical = true } = options;

  if (!circles.length) return;

  const bounds = circles.reduce((acc, circle) => ({
    minX: Math.min(acc.minX, circle.cx - circle.r),
    maxX: Math.max(acc.maxX, circle.cx + circle.r),
    minY: Math.min(acc.minY, circle.cy - circle.r),
    maxY: Math.max(acc.maxY, circle.cy + circle.r),
  }), {
    minX: Infinity,
    maxX: -Infinity,
    minY: Infinity,
    maxY: -Infinity,
  });

  const dx = horizontal
    ? getCenteredLayoutShift(bounds.minX, bounds.maxX, chartW, padding)
    : 0;
  const dy = vertical
    ? getCenteredLayoutShift(bounds.minY, bounds.maxY, chartH, padding)
    : 0;

  circles.forEach(circle => {
    circle.cx += dx;
    circle.cy += dy;
  });
}

function layoutTopLevelBubbles(chartW, chartH, gap = 22, padding = 12, extraBubbles = []) {
  const circles = BUBBLES
    .filter(bubble => !bubble.parentId)
    .concat(extraBubbles)
    .map(bubble => bubbleToPxCircle(bubble, chartW, chartH));

  circles.forEach(circle => clampCircleToChart(circle, chartW, chartH, padding));
  resolveBubbleCollisions(circles, gap, circle => clampCircleToChart(circle, chartW, chartH, padding));
  centerBubbleLayout(circles, chartW, chartH, padding);

  return new Map(circles.map(circle => [circle.id, pxCircleToBubble(circle, chartW, chartH)]));
}

function layoutNestedBubbles(parentBubble, nestedBubbles, chartW, chartH, gap = 4, padding = 4) {
  if (!nestedBubbles.length) return [];

  const parentCircle = bubbleToPxCircle(parentBubble, chartW, chartH);
  const circles = nestedBubbles.map(bubble => bubbleToPxCircle(bubble, chartW, chartH));

  circles.forEach(circle => clampCircleToParent(circle, parentCircle, padding));
  resolveBubbleCollisions(circles, gap, circle => clampCircleToParent(circle, parentCircle, padding));

  return circles.map(circle => pxCircleToBubble(circle, chartW, chartH));
}

/**
 * Render a single bubble + its avatars into containerEl.
 *
 * containerEl  — the chart div to append into
 * bubble       — BUBBLES entry
 * chartW/H     — pixel dimensions of the chart area
 * avatarScale  — optional multiplier for avatar size
 * options      — rendering controls
 */
function renderBubble(containerEl, bubble, chartW, chartH, avatarScale = 1, options = {}) {
  const {
    showLabel = true,
    showAvatars = true,
    avatarsInteractive = true,
    exclusionCircles = [],
    reserveLabelSpace = showLabel,
    avatarBubbleId = bubble.id,
    bubbleRole = bubble.parentId ? 'sub-bubble' : 'bubble',
  } = options;

  const pxX    = (bubble.x    / 100) * chartW;
  const pxY    = (bubble.y    / 100) * chartH;
  const pxSize = (bubble.size / 100) * chartW;
  const radius = pxSize / 2;
  const cx     = pxX + radius;
  const cy     = pxY + radius;

  // --- Bubble circle div ---
  const bubbleEl = document.createElement('div');
  bubbleEl.className = 'bubble';
  if (bubble.size <= 22) bubbleEl.classList.add('bubble--small');
  if (bubble.parentId)   bubbleEl.classList.add('bubble--sub');

  bubbleEl.style.left   = pxX    + 'px';
  bubbleEl.style.top    = pxY    + 'px';
  bubbleEl.style.width  = pxSize + 'px';
  bubbleEl.style.height = pxSize + 'px';
  bubbleEl.dataset.id   = bubble.id;
  bubbleEl.dataset.bubbleId = bubble.id;
  bubbleEl.dataset.role = bubbleRole;

  if (!showLabel) {
    bubbleEl.classList.add('bubble--label-hidden');
  }

  if (showLabel) {
    const labelEl = document.createElement('span');
    labelEl.className = 'bubble__label';
    // Support line breaks in label (e.g. "Drinks\nCrew")
    labelEl.innerHTML = bubble.label.replace(/\n/g, '<br>');
    bubbleEl.appendChild(labelEl);
  }

  containerEl.appendChild(bubbleEl);

  if (!showAvatars) {
    return bubbleEl;
  }

  // --- Avatars ---
  const rawAvatarSize = Math.max(18, radius * 0.38) * avatarScale;
  const contacts      = getVisualContactIds(bubble).map(getContact).filter(Boolean);
  const labelReserveRadius = reserveLabelSpace
    ? Math.min(radius * 0.34, Math.max(26, bubble.label.replace(/\n/g, '').length * 4.2))
    : 0;
  const layoutExclusions = exclusionCircles.slice();

  if (labelReserveRadius > 0) {
    layoutExclusions.push({ x: 0, y: 0, r: labelReserveRadius });
  }

  const { avatarSize, offsets } = layoutAvatars(contacts.length, radius, rawAvatarSize, {
    exclusionCircles: layoutExclusions,
    minAvatarSize: bubble.parentId ? 16 : 18,
    spacing: bubble.parentId ? 6 : 8,
    edgePadding: bubble.parentId ? 8 : 10,
  });

  contacts.forEach((contact, i) => {
    const avatarEl = createAvatarEl(contact, avatarSize, {
      interactive: avatarsInteractive,
    });
    // Position relative to chart container
    avatarEl.style.left = (cx + offsets[i].x - avatarSize / 2) + 'px';
    avatarEl.style.top  = (cy + offsets[i].y - avatarSize / 2) + 'px';
    avatarEl.dataset.bubbleId = avatarBubbleId;
    if (!avatarsInteractive) {
      setAvatarInteractiveState(avatarEl, false);
    } else {
      setAvatarInteractiveState(avatarEl, true);
    }
    containerEl.appendChild(avatarEl);
  });

  return bubbleEl;
}


/* ============================================================
   HELPERS — Profile / Contact Detail
   ============================================================ */

/**
 * Build an info card HTML string.
 * title  — section heading
 * rows   — array of { icon: 'iconKey', text: 'display string' }
 */
function buildInfoCard(title, rows) {
  if (!rows.length) return '';

  const rowsHTML = rows.map(row => `
    <div class="info-row">
      <div class="info-row__icon">${ICONS[row.icon] || ''}</div>
      <span class="info-row__text">${escapeHTML(row.text)}</span>
    </div>
  `).join('');

  return `
    <div class="info-card">
      <div class="info-card__title">${escapeHTML(title)}</div>
      ${rowsHTML}
    </div>
  `;
}

function getSocialLinkRows(person) {
  const rows = [
    person.slack && { icon: 'slack', text: `Slack ${person.slack}` },
    person.teams && { icon: 'teams', text: `Teams ${person.teams}` },
    person.instagram && { icon: 'instagram', text: `Instagram ${person.instagram}` },
    person.twitter && { icon: 'twitter', text: `Twitter ${person.twitter}` },
    person.linkedin && { icon: 'linkedin', text: `LinkedIn ${person.linkedin}` },
  ].filter(Boolean);

  if (Array.isArray(person.socialLinks)) {
    person.socialLinks.forEach(link => {
      const network = String(link.network || '').trim();
      const handle = String(link.handle || '').trim();
      if (!network && !handle) return;
      rows.push({
        icon: 'social',
        text: network && handle ? `${network} ${handle}` : network || handle,
      });
    });
  }

  return rows;
}

/**
 * Build bubble-tag chips HTML for a given list of bubble labels.
 */
function buildBubbleTags(labels, options = {}) {
  const { includeAdd = true, extraClass = '', tagName = 'button' } = options;
  const chips = labels.map(label =>
    `<${tagName} class="bubble-tag">${escapeHTML(label)}</${tagName}>`
  ).join('');
  const addChip = includeAdd ? `
    <button class="bubble-tag bubble-tag--add" type="button" aria-label="Create new bubble">
      <svg class="bubble-tag__plus-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
      </svg>
    </button>
  ` : '';
  return `<div class="profile-bubbles ${extraClass}">${chips}${addChip}</div>`;
}

function bindCreateBubblePill(container, preselectedContactId = null) {
  const addButton = container?.querySelector('.bubble-tag--add');
  if (!addButton) return;

  addButton.addEventListener('click', event => {
    event.preventDefault();
    event.stopPropagation();
    openCreateBubbleSheet({
      preselectedContactIds: preselectedContactId ? [preselectedContactId] : [],
    });
  });
}

function getContactBubbleLabels(contactId) {
  return getContactBubbles(contactId)
    .map(b => b.label.replace(/\n/g, ' '));
}

function getContactBubbles(contactId) {
  return BUBBLES
    .filter(b => b.contactIds.includes(contactId));
}

function contactMatchesBubbleFilters(contactId) {
  if (!selectedContactBubbleFilters.size) return 0;

  return getContactBubbles(contactId)
    .filter(b => selectedContactBubbleFilters.has(b.id))
    .length;
}

function buildContactBubbleTags(contactId) {
  const bubbles = getContactBubbles(contactId).sort((a, b) => {
    const aSelected = selectedContactBubbleFilters.has(a.id);
    const bSelected = selectedContactBubbleFilters.has(b.id);
    if (aSelected === bSelected) return 0;
    return aSelected ? -1 : 1;
  });

  const chips = bubbles.map(bubble => {
    const label = bubble.label.replace(/\n/g, ' ');
    const isSelected = selectedContactBubbleFilters.has(bubble.id);

    return `
      <button class="bubble-tag contact-card__bubble-tag${isSelected ? ' bubble-tag--selected' : ''}" data-bubble-id="${bubble.id}">
        ${escapeHTML(label)}
      </button>
    `;
  }).join('');

  return `<div class="profile-bubbles contact-card__bubbles">${chips}</div>`;
}


/* ============================================================
   RENDER — User Profile page
   ============================================================ */
function renderUserProfile() {
  document.getElementById('profile-title').textContent = "Michael's Profile";
  const content = document.getElementById('profile-content');

  // All top-level bubbles appear on the user's profile
  const bubbleLabels = BUBBLES
    .filter(b => !b.parentId)
    .map(b => b.label.replace(/\n/g, ' '));

  // Contact information rows — only include fields that have a value
  const contactRows = [
    USER_PROFILE.email    && { icon: 'email',    text: USER_PROFILE.email },
    USER_PROFILE.phone    && { icon: 'phone',    text: USER_PROFILE.phone },
    USER_PROFILE.birthday && { icon: 'birthday', text: USER_PROFILE.birthday },
  ].filter(Boolean);

  const socialRows = getSocialLinkRows(USER_PROFILE);

  content.innerHTML = `
    <!-- Profile photo (avatar with initials as fallback) -->
    <div class="profile-avatar" style="background: ${USER_PROFILE.color}">
      ${buildAvatarContents(USER_PROFILE)}
    </div>

    <!-- Bubbles this user belongs to -->
    ${buildBubbleTags(bubbleLabels)}

    <!-- Contact information card -->
    ${buildInfoCard('Contact Information', contactRows)}

    <!-- Social links card -->
    ${buildInfoCard('Social Links', socialRows)}

    <!-- Action buttons -->
    <div class="profile-actions">
      <button class="profile-action-btn profile-action-btn--primary">Edit Profile</button>
      <button class="profile-action-btn">Share Contact</button>
    </div>
    <button class="profile-action-btn profile-action-btn--danger profile-action-btn--full" type="button" data-action="reset-saved-data">Reset Data</button>
  `;
  bindCreateBubblePill(content);
}

function getBubbleProfileShareUrl() {
  const url = new URL(window.location.href);
  url.hash = `profile=${encodeURIComponent(USER_PROFILE.name.toLowerCase().replace(/\s+/g, '-'))}`;
  return url.href;
}

function getBubbleSharePayload() {
  return {
    title: `${USER_PROFILE.name}'s Bubble Tap profile`,
    text: `Connect with ${USER_PROFILE.name} using Bubble Tap.`,
    url: getBubbleProfileShareUrl(),
  };
}

function setBubbleTapStatus(message) {
  const status = document.getElementById('bubble-tap-status');
  if (status) status.textContent = message;
}

async function copyBubbleProfileLink() {
  const { url } = getBubbleSharePayload();

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(url);
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = url;
      textArea.setAttribute('readonly', '');
      textArea.className = 'visually-hidden';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      textArea.remove();
    }
    setBubbleTapStatus('Bubble Tap link copied.');
  } catch (_error) {
    setBubbleTapStatus('Unable to copy automatically. Use your browser share controls instead.');
  }
}

async function openBubbleTapShare() {
  const payload = getBubbleSharePayload();

  if (!navigator.share) {
    await copyBubbleProfileLink();
    return;
  }

  try {
    await navigator.share(payload);
    setBubbleTapStatus('Share sheet opened.');
  } catch (error) {
    if (error?.name !== 'AbortError') {
      setBubbleTapStatus('Unable to open the share sheet. Link copied instead.');
      await copyBubbleProfileLink();
    }
  }
}

function renderBubbleTap() {
  const content = document.getElementById('bubble-tap-content');
  if (!content) return;

  const topLevelBubbleLabels = BUBBLES
    .filter(bubble => !bubble.parentId)
    .map(bubble => bubble.label.replace(/\n/g, ' '));
  const bubbleTags = topLevelBubbleLabels
    .map(label => `<span class="bubble-tap-chip">${escapeHTML(label)}</span>`)
    .join('');
  const canUseNativeShare = Boolean(navigator.share);

  content.innerHTML = `
    <div class="bubble-tap__halo" aria-hidden="true">
      <div class="bubble-tap__pulse bubble-tap__pulse--one"></div>
      <div class="bubble-tap__pulse bubble-tap__pulse--two"></div>
      <div class="bubble-tap__profile" style="background:${escapeAttr(USER_PROFILE.color)}">
        ${buildAvatarContents(USER_PROFILE)}
      </div>
    </div>

    <section class="bubble-tap-panel" aria-labelledby="bubble-tap-name">
      <div class="bubble-tap-panel__eyebrow">Bubble Tap profile</div>
      <h2 class="bubble-tap-panel__name" id="bubble-tap-name">${escapeHTML(USER_PROFILE.name)}</h2>
      <p class="bubble-tap-panel__detail">${escapeHTML(USER_PROFILE.email)}</p>
      <div class="bubble-tap-chip-row">${bubbleTags}</div>
    </section>

    <section class="bubble-tap-note" aria-label="NameDrop availability">
      <div class="bubble-tap-note__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M5 12a7 7 0 0 1 14 0" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
          <path d="M8.5 12a3.5 3.5 0 0 1 7 0" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
          <path d="M12 14.5v.01" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
          <path d="M4 19.5h16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
        </svg>
      </div>
      <div>
        <h3 class="bubble-tap-note__title">NameDrop is not available in this web build.</h3>
        <p class="bubble-tap-note__text">Apple does not expose NameDrop to browser or PWA JavaScript. A native iOS app could integrate nearby sharing separately; here we can use the system share sheet or copy a Bubble Tap profile link.</p>
      </div>
    </section>

    <div class="bubble-tap-actions">
      <button class="bubble-tap-action bubble-tap-action--primary" id="bubble-tap-native-btn" type="button">
        ${canUseNativeShare ? 'Open Share Sheet' : 'Copy Profile Link'}
      </button>
      <button class="bubble-tap-action" id="bubble-tap-copy-btn" type="button">Copy Link</button>
    </div>

    <p class="bubble-tap-status" id="bubble-tap-status" role="status" aria-live="polite">
      ${canUseNativeShare ? 'Ready to share your Bubble Tap profile.' : 'Share sheet unavailable in this browser.'}
    </p>
  `;

  document.getElementById('bubble-tap-native-btn')?.addEventListener('click', openBubbleTapShare);
  document.getElementById('bubble-tap-copy-btn')?.addEventListener('click', copyBubbleProfileLink);
}

/* ============================================================
   MANUAL ENTRY
   ============================================================ */
function buildManualEntryField({ id, label, type = 'text', autocomplete = '', placeholder = '', value = '' }) {
  return `
    <label class="manual-entry-field" for="${id}">
      <span class="manual-entry-field__label">${escapeHTML(label)}</span>
      <input
        class="manual-entry-field__input"
        id="${id}"
        name="${id}"
        type="${escapeAttr(type)}"
        ${autocomplete ? `autocomplete="${autocomplete}"` : ''}
        placeholder="${escapeAttr(placeholder)}"
        value="${escapeAttr(value)}"
      />
    </label>
  `;
}

function getDateInputValue(value) {
  if (!value) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return '';
  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, '0');
  const day = String(parsed.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatBirthdayForDisplay(value) {
  if (!value) return '';
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) return value;
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatPhoneNumber(value) {
  const digits = String(value || '').replace(/\D/g, '').slice(0, 11);
  const hasCountryCode = digits.length > 10 && digits.startsWith('1');
  const national = hasCountryCode ? digits.slice(1) : digits.slice(0, 10);
  const parts = [];

  if (national.length > 0) parts.push(national.slice(0, 3));
  if (national.length > 3) parts.push(national.slice(3, 6));
  if (national.length > 6) parts.push(national.slice(6, 10));

  const formatted = parts.join('-');
  return hasCountryCode ? `+1 ${formatted}` : formatted;
}

function getManualEntryContact() {
  return manualEntryState.mode === 'edit'
    ? getContact(manualEntryState.contactId)
    : null;
}

function getManualEntrySocialLinks(contact) {
  if (!contact) return [{ network: '', handle: '' }];
  const links = [];
  const legacyLinks = [
    ['slack', 'Slack'],
    ['teams', 'Teams'],
    ['instagram', 'Instagram'],
    ['twitter', 'Twitter'],
    ['linkedin', 'LinkedIn'],
  ];

  legacyLinks.forEach(([key, network]) => {
    if (contact[key]) links.push({ network, handle: contact[key] });
  });

  if (Array.isArray(contact.socialLinks)) {
    contact.socialLinks.forEach(link => {
      const network = String(link.network || '').trim();
      const handle = String(link.handle || '').trim();
      if (network || handle) links.push({ network, handle });
    });
  }

  return links.length ? links : [{ network: '', handle: '' }];
}

function socialLinkHasContent(link = {}) {
  return Boolean(String(link.network || '').trim() || String(link.handle || '').trim());
}

function buildManualEntrySocialRow(link = {}, index = 0) {
  const hideRemove = index === 0 && !socialLinkHasContent(link);
  return `
    <div class="manual-entry-social-row${hideRemove ? ' manual-entry-social-row--hide-remove' : ''}">
      <label class="manual-entry-social-field">
        <span class="manual-entry-field__label">Network</span>
        <input class="manual-entry-field__input manual-social-network" name="manual-social-network" type="text" placeholder="X, Instagram..." value="${escapeAttr(link.network || '')}" />
      </label>
      <label class="manual-entry-social-field">
        <span class="manual-entry-field__label">Handle</span>
        <input class="manual-entry-field__input manual-social-handle" name="manual-social-handle" type="text" placeholder="@username" value="${escapeAttr(link.handle || '')}" />
      </label>
      <button class="manual-entry-icon-btn manual-entry-social-remove" type="button" aria-label="Remove social link">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M6 12h12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>
    </div>
  `;
}

function buildManualEntrySocialFields(contact) {
  const rows = getManualEntrySocialLinks(contact)
    .map((link, index) => buildManualEntrySocialRow(link, index))
    .join('');
  return `
    <div class="manual-entry-social-list" id="manual-entry-social-list">
      ${rows}
    </div>
    <button class="manual-entry-add-row" id="manual-entry-add-social-btn" type="button">
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
      <span>Add Social Link</span>
    </button>
  `;
}

function getContactBubbleIds(contactId) {
  return new Set(BUBBLES
    .filter(bubble => {
      ensureBubbleArrays(bubble);
      return bubble.contactIds.includes(contactId);
    })
    .map(bubble => bubble.id));
}

function buildManualEntryBubblePicker(contact) {
  const selectedIds = contact ? getContactBubbleIds(contact.id) : new Set();
  const chips = BUBBLES.map(bubble => {
    const label = bubble.label.replace(/\n/g, ' ');
    const isSelected = selectedIds.has(bubble.id);
    return `
      <button class="bubble-tag manual-entry-bubble-chip${isSelected ? ' manual-entry-bubble-chip--selected' : ''}" type="button" data-bubble-id="${escapeAttr(bubble.id)}" aria-pressed="${isSelected ? 'true' : 'false'}">
        ${escapeHTML(label)}
      </button>
    `;
  }).join('');

  return `
    <div class="info-card manual-entry-card">
      <div class="info-card__title">Bubbles</div>
      <div class="manual-entry-bubble-picker" aria-label="Assigned bubbles">
        ${chips || '<div class="manual-entry-empty">No bubbles yet</div>'}
      </div>
    </div>
  `;
}

function getBlankManualEntryAvatarIcon() {
  return `
    <svg viewBox="0 0 80 80" fill="none" aria-hidden="true">
      <circle cx="40" cy="29" r="13" stroke="currentColor" stroke-width="5"/>
      <path d="M18 64c0-12.2 9.8-22 22-22s22 9.8 22 22" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>
    </svg>
  `;
}

function buildManualEntryAvatarContents(contact) {
  if (manualEntryState.photoSrc) {
    return `<img src="${escapeAttr(manualEntryState.photoSrc)}" alt="" loading="lazy">`;
  }
  return contact?.name ? escapeHTML(initials(contact.name)) : getBlankManualEntryAvatarIcon();
}

function buildManualEntryDemoPhotos() {
  return DEMO_PROFILE_IMAGES.map((src, index) => `
    <button class="manual-entry-demo-photo${manualEntryState.photoSrc === src ? ' manual-entry-demo-photo--selected' : ''}" type="button" data-demo-photo="${escapeAttr(src)}" aria-label="Use demo photo ${index + 1}">
      <img src="${escapeAttr(src)}" alt="" loading="lazy">
    </button>
  `).join('');
}

function renderManualEntry() {
  const content = document.getElementById('manual-entry-content');
  if (!content) return;

  const contact = getManualEntryContact();
  const isEdit = Boolean(contact);
  const title = document.getElementById('manual-entry-title');
  if (title) title.textContent = isEdit ? 'Edit Contact' : 'New Contact';
  manualEntryState.status = '';

  const notesText = contact?.notes?.[0]?.text || '';
  const avatarColor = contact?.color || getImportedContactColor(CONTACTS.length);
  content.innerHTML = `
    <button class="profile-avatar manual-entry-avatar" id="manual-entry-avatar" type="button" aria-label="Upload profile photo" style="background: ${escapeAttr(avatarColor)}">
      ${buildManualEntryAvatarContents(contact)}
      <span class="manual-entry-avatar__hint">Tap to upload</span>
    </button>
    <input class="manual-entry-photo-input" id="manual-entry-photo-input" type="file" accept="image/*">
    <div class="manual-entry-photo-library" aria-label="Demo profile photos">
      ${buildManualEntryDemoPhotos()}
    </div>

    <form class="manual-entry-form" id="manual-entry-form">
      <div class="info-card manual-entry-card">
        <div class="info-card__title">Contact Information</div>
        ${buildManualEntryField({ id: 'manual-name', label: 'Name', autocomplete: 'name', placeholder: 'Full name', value: contact?.name || '' })}
        ${buildManualEntryField({ id: 'manual-email', label: 'Email', type: 'email', autocomplete: 'email', placeholder: 'name@example.com', value: contact?.email || '' })}
        ${buildManualEntryField({ id: 'manual-phone', label: 'Phone', type: 'tel', autocomplete: 'tel', placeholder: '555-123-4567', value: formatPhoneNumber(contact?.phone || '') })}
        ${buildManualEntryField({ id: 'manual-birthday', label: 'Birthday', type: 'date', autocomplete: 'bday', value: getDateInputValue(contact?.birthday || '') })}
      </div>

      <div class="info-card manual-entry-card">
        <div class="info-card__title">Social Links</div>
        ${buildManualEntrySocialFields(contact)}
      </div>

      ${buildManualEntryBubblePicker(contact)}

      <div class="info-card manual-entry-card">
        <div class="info-card__title">Notes</div>
        <label class="manual-entry-field manual-entry-field--stacked" for="manual-notes">
          <span class="manual-entry-field__label">First note</span>
          <textarea class="manual-entry-field__input manual-entry-field__input--textarea" id="manual-notes" name="manual-notes" rows="4" placeholder="Where you met, what to remember, follow-up ideas">${escapeHTML(notesText)}</textarea>
        </label>
      </div>

      <div class="profile-actions manual-entry-actions">
        <button class="profile-action-btn" type="button" id="manual-entry-secondary-btn">${isEdit ? 'Cancel' : 'Clear'}</button>
        <button class="profile-action-btn profile-action-btn--primary" type="submit">${isEdit ? 'Save Contact' : 'Create Contact'}</button>
      </div>
      ${isEdit ? '<button class="profile-action-btn profile-action-btn--danger manual-entry-delete" type="button" id="manual-entry-delete-btn">Delete Contact</button>' : ''}
      <p class="manual-entry-status" id="manual-entry-status" role="status" aria-live="polite"></p>
    </form>
  `;

  bindManualEntryForm(content);
}

function getManualEntryValue(form, fieldId) {
  return form.elements[fieldId]?.value.trim() || '';
}

function updateManualEntryAvatar(content) {
  const avatar = content.querySelector('#manual-entry-avatar');
  const nameInput = content.querySelector('#manual-name');
  if (!avatar || !nameInput) return;

  const name = nameInput.value.trim();
  const contents = manualEntryState.photoSrc
    ? `<img src="${escapeAttr(manualEntryState.photoSrc)}" alt="" loading="lazy">`
    : name ? escapeHTML(initials(name)) : getBlankManualEntryAvatarIcon();
  avatar.innerHTML = `${contents}<span class="manual-entry-avatar__hint">Tap to upload</span>`;
}

function setManualEntryPhoto(content, src) {
  manualEntryState.photoSrc = src || '';
  updateManualEntryAvatar(content);
  content.querySelectorAll('.manual-entry-demo-photo').forEach(button => {
    button.classList.toggle('manual-entry-demo-photo--selected', button.dataset.demoPhoto === manualEntryState.photoSrc);
  });
  renderManualEntryStatus('');
}

function readManualEntryPhotoFile(content, file) {
  if (!file || !file.type.startsWith('image/')) {
    renderManualEntryStatus('Choose an image file for this contact.');
    return;
  }

  const reader = new FileReader();
  reader.addEventListener('load', () => {
    setManualEntryPhoto(content, String(reader.result || ''));
  }, { once: true });
  reader.addEventListener('error', () => {
    renderManualEntryStatus('Could not read that image.');
  }, { once: true });
  reader.readAsDataURL(file);
}

function renderManualEntryStatus(message) {
  manualEntryState.status = message;
  const status = document.getElementById('manual-entry-status');
  if (status) status.textContent = message;
}

function getSelectedManualEntryBubbleIds(content) {
  return new Set([...content.querySelectorAll('.manual-entry-bubble-chip--selected')]
    .map(chip => chip.dataset.bubbleId)
    .filter(Boolean));
}

function getManualEntrySocialLinksFromForm(content) {
  return [...content.querySelectorAll('.manual-entry-social-row')]
    .map(row => ({
      network: row.querySelector('.manual-social-network')?.value.trim() || '',
      handle: row.querySelector('.manual-social-handle')?.value.trim() || '',
    }))
    .filter(link => link.network || link.handle);
}

function resetLegacySocialFields(contact) {
  ['slack', 'teams', 'instagram', 'twitter', 'linkedin'].forEach(key => {
    delete contact[key];
  });
}

function updateManualEntrySocialRemoveButtons(content) {
  const rows = [...content.querySelectorAll('.manual-entry-social-row')];
  rows.forEach((row, index) => {
    const hasContent = Boolean(
      row.querySelector('.manual-social-network')?.value.trim() ||
      row.querySelector('.manual-social-handle')?.value.trim()
    );
    row.classList.toggle('manual-entry-social-row--hide-remove', index === 0 && !hasContent);
  });
}

function applyManualEntryBubbleAssignments(contactId, selectedBubbleIds) {
  BUBBLES.forEach(bubble => {
    ensureBubbleArrays(bubble);
    const shouldInclude = selectedBubbleIds.has(bubble.id);
    const isIncluded = bubble.contactIds.includes(contactId);

    if (shouldInclude && !isIncluded) {
      bubble.contactIds.push(contactId);
    } else if (!shouldInclude && isIncluded) {
      bubble.contactIds = bubble.contactIds.filter(id => id !== contactId);
    }
  });
}

function bindManualEntryForm(content) {
  const form = content.querySelector('#manual-entry-form');
  const secondaryButton = content.querySelector('#manual-entry-secondary-btn');
  const addSocialButton = content.querySelector('#manual-entry-add-social-btn');
  const socialList = content.querySelector('#manual-entry-social-list');
  const deleteButton = content.querySelector('#manual-entry-delete-btn');
  const phoneInput = content.querySelector('#manual-phone');
  const avatarButton = content.querySelector('#manual-entry-avatar');
  const photoInput = content.querySelector('#manual-entry-photo-input');
  if (!form || !secondaryButton) return;

  form.addEventListener('input', () => {
    updateManualEntryAvatar(content);
    updateManualEntrySocialRemoveButtons(content);
    renderManualEntryStatus('');
  });

  phoneInput?.addEventListener('input', () => {
    phoneInput.value = formatPhoneNumber(phoneInput.value);
  });

  avatarButton?.addEventListener('click', () => {
    photoInput?.click();
  });

  photoInput?.addEventListener('change', event => {
    readManualEntryPhotoFile(content, event.target.files?.[0]);
    event.target.value = '';
  });

  content.querySelectorAll('.manual-entry-demo-photo').forEach(button => {
    button.addEventListener('click', () => {
      setManualEntryPhoto(content, button.dataset.demoPhoto || '');
    });
  });

  content.querySelectorAll('.manual-entry-bubble-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const isSelected = !chip.classList.contains('manual-entry-bubble-chip--selected');
      chip.classList.toggle('manual-entry-bubble-chip--selected', isSelected);
      chip.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
      renderManualEntryStatus('');
    });
  });

  addSocialButton?.addEventListener('click', () => {
    const rowCount = socialList?.querySelectorAll('.manual-entry-social-row').length || 0;
    socialList?.insertAdjacentHTML('beforeend', buildManualEntrySocialRow({}, rowCount));
    socialList?.querySelector('.manual-entry-social-row:last-child .manual-social-network')?.focus();
    updateManualEntrySocialRemoveButtons(content);
    renderManualEntryStatus('');
  });

  socialList?.addEventListener('click', event => {
    const removeButton = event.target.closest('.manual-entry-social-remove');
    if (!removeButton) return;
    const row = removeButton.closest('.manual-entry-social-row');
    if (!row) return;

    if (socialList.querySelectorAll('.manual-entry-social-row').length === 1) {
      row.querySelectorAll('input').forEach(input => {
        input.value = '';
      });
    } else {
      row.remove();
    }
    updateManualEntrySocialRemoveButtons(content);
    renderManualEntryStatus('');
  });

  deleteButton?.addEventListener('click', () => {
    const contact = getContact(manualEntryState.contactId);
    if (!contact) return;
    openConfirmDialog({
      title: `Delete ${contact.name}?`,
      text: 'This removes the contact from every bubble.',
      confirmLabel: 'Delete Contact',
      onConfirm: () => {
        deleteContact(contact.id);
        goToContacts();
      },
    });
  });

  secondaryButton.addEventListener('click', () => {
    if (manualEntryState.mode === 'edit' && manualEntryState.contactId) {
      goToManualEntryContactDetail(manualEntryState.contactId);
      return;
    }
    form.reset();
    manualEntryState.photoSrc = '';
    if (socialList) socialList.innerHTML = buildManualEntrySocialRow();
    updateManualEntryAvatar(content);
    content.querySelectorAll('.manual-entry-demo-photo').forEach(button => {
      button.classList.remove('manual-entry-demo-photo--selected');
    });
    content.querySelectorAll('.manual-entry-bubble-chip').forEach(chip => {
      chip.classList.remove('manual-entry-bubble-chip--selected');
      chip.setAttribute('aria-pressed', 'false');
    });
    renderManualEntryStatus('');
    form.elements['manual-name']?.focus();
  });

  form.addEventListener('submit', event => {
    event.preventDefault();

    const name = getManualEntryValue(form, 'manual-name');
    const email = getManualEntryValue(form, 'manual-email');
    const phone = getManualEntryValue(form, 'manual-phone');
    if (!name) {
      renderManualEntryStatus('Add a name before creating this contact.');
      form.elements['manual-name']?.focus();
      return;
    }

    const isEdit = manualEntryState.mode === 'edit';
    const existingContact = isEdit ? getContact(manualEntryState.contactId) : null;
    const contact = existingContact || {
      id: getNextContactId(),
      color: getImportedContactColor(CONTACTS.length),
    };

    contact.name = name;
    contact.email = email;
    contact.phone = phone;
    if (manualEntryState.photoSrc) contact.image = manualEntryState.photoSrc;
    else delete contact.image;
    const birthday = formatBirthdayForDisplay(getManualEntryValue(form, 'manual-birthday'));
    if (birthday) contact.birthday = birthday;
    else delete contact.birthday;

    resetLegacySocialFields(contact);
    contact.socialLinks = getManualEntrySocialLinksFromForm(content);
    if (!contact.socialLinks.length) delete contact.socialLinks;

    const noteText = getManualEntryValue(form, 'manual-notes');
    if (noteText) {
      contact.notes = [{
        date: contact.notes?.[0]?.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        text: noteText,
      }];
    } else {
      delete contact.notes;
    }

    if (!existingContact) CONTACTS.push(contact);
    applyManualEntryBubbleAssignments(contact.id, getSelectedManualEntryBubbleIds(content));
    saveAppData();
    renderManualEntryStatus(`${isEdit ? 'Saved' : 'Created'} ${contact.name}.`);
    goToManualEntryContactDetail(contact.id);
  });
}

function normalizeLooseToken(value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

function titleCaseWords(value) {
  return String(value || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

function splitHandleIntoName(handle) {
  const cleaned = String(handle || '')
    .replace(/^@/, '')
    .replace(/[_\.]+/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .trim();

  if (!cleaned) return '';

  const spaced = cleaned.includes(' ')
    ? cleaned
    : cleaned.replace(/^([a-z]+?)(smith|johnson|williams|brown|jones|garcia|miller|davis|wilson|anderson|taylor|lee|kim|chen|park|patel|torres|wright|granger|worthington|nakamura)$/i, '$1 $2');

  return titleCaseWords(spaced);
}

function addParsedField(fields, key, value) {
  const normalized = String(value || '').trim();
  if (!normalized || fields[key]) return;
  fields[key] = normalized;
}

function extractSocialHandle(text, fields, fieldName, labels, urlPattern) {
  const urlMatch = text.match(urlPattern);
  if (urlMatch?.[1]) {
    addParsedField(fields, fieldName, fieldName === 'linkedin' ? urlMatch[0].replace(/^https?:\/\//i, '') : `@${urlMatch[1]}`);
  }

  const labelPattern = new RegExp(`(?:^|\\b)(${labels.join('|')})\\s*(?:handle|profile|account)?\\s*[:\\-]?\\s*@?([a-z0-9._-]{2,50})`, 'i');
  const labelMatch = text.match(labelPattern);
  if (!labelMatch?.[2]) return;

  const value = fieldName === 'linkedin' && labelMatch[2].includes('linkedin.com')
    ? labelMatch[2].replace(/^https?:\/\//i, '')
    : `@${labelMatch[2].replace(/^@/, '')}`;
  addParsedField(fields, fieldName, value);
}

function extractLabeledName(text) {
  const match = text.match(/\b(?:name|contact|person)\s*[:\-]\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,3})/);
  if (match?.[1]) return titleCaseWords(match[1]);

  const leadingName = text.match(/^\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})\b(?=.*\b(?:email|phone|mobile|instagram|insta|ig|twitter|linkedin|slack|teams|birthday|birthdate|dob|company|organization|org|title|role|job|note|notes)\b)/s);
  if (leadingName?.[1]) return titleCaseWords(leadingName[1]);

  const lines = text.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
  const plainNameLine = lines.find(line =>
    /^[A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3}$/.test(line) &&
    !/\b(instagram|linkedin|twitter|phone|email|birthday|slack|teams)\b/i.test(line)
  );

  return plainNameLine ? titleCaseWords(plainNameLine) : '';
}

function extractLabeledValue(text, labels, options = {}) {
  const { requireCapital = false } = options;
  const labelPattern = labels.join('|');
  const match = text.match(new RegExp(`(?:^|\\n|\\b)(?:${labelPattern})\\s*[:\\-]?\\s*([^\\n;]+)`, 'i'));
  const value = match?.[1]
    ?.replace(/\s+\b(?:email|phone|mobile|instagram|insta|ig|twitter|linkedin|slack|teams|birthday|birthdate|dob|company|organization|org|title|role|job|note|notes)\b.*$/i, '')
    .trim()
    .replace(/\s+/g, ' ');
  if (!value) return '';
  if (requireCapital && !/[A-Z0-9]/.test(value.charAt(0))) return '';
  return value.replace(/[.,]\s*$/, '');
}

function extractCompany(text) {
  const labeled = extractLabeledValue(text, ['company', 'organization', 'org', 'workplace']);
  if (labeled) return labeled;

  const worksAt = text.match(/\bworks?\s+at\s+([A-Z0-9][^\n,;]+)/i);
  return worksAt?.[1]?.trim().replace(/[.,]\s*$/, '') || '';
}

function extractNoteText(text) {
  const labeled = extractLabeledValue(text, ['notes', 'note', 'remember']);
  if (labeled) return labeled;

  const metLine = text.split(/\r?\n/)
    .map(line => line.trim())
    .find(line => /^met\s+/i.test(line) || /^follow\s*up\s*:/i.test(line));
  return metLine || '';
}

function parseChaoticContactText(text) {
  const fields = {};
  const rawText = String(text || '').trim();
  if (!rawText) return { fields, nameClues: [], matchedContacts: [] };

  const emailMatch = rawText.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  addParsedField(fields, 'email', emailMatch?.[0]);

  const phoneMatch = rawText.match(/(?:\+?1[\s.-]?)?(?:\(?\d{3}\)?[\s.-]?)\d{3}[\s.-]?\d{4}/);
  addParsedField(fields, 'phone', phoneMatch?.[0]);

  extractSocialHandle(rawText, fields, 'instagram', ['instagram', 'insta', 'ig'], /(?:https?:\/\/)?(?:www\.)?instagram\.com\/([a-z0-9._]+)/i);
  extractSocialHandle(rawText, fields, 'twitter', ['twitter', 'x'], /(?:https?:\/\/)?(?:www\.)?(?:twitter|x)\.com\/([a-z0-9._]+)/i);
  extractSocialHandle(rawText, fields, 'linkedin', ['linkedin', 'linked in'], /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/(?:in\/)?([a-z0-9._-]+)/i);
  extractSocialHandle(rawText, fields, 'slack', ['slack'], /(?:^$)/);
  extractSocialHandle(rawText, fields, 'teams', ['teams', 'microsoft teams'], /(?:^$)/);

  const birthdayMatch = rawText.match(/\b(?:birthday|birthdate|born|dob)\s*[:\-]?\s*([A-Z][a-z]+\.?\s+\d{1,2}(?:,\s*\d{4})?|\d{1,2}[\/.-]\d{1,2}(?:[\/.-]\d{2,4})?)/i);
  addParsedField(fields, 'birthday', birthdayMatch?.[1]);
  addParsedField(fields, 'company', extractCompany(rawText));
  addParsedField(fields, 'title', extractLabeledValue(rawText, ['title', 'role', 'job title', 'job'], { requireCapital: true }));
  addParsedField(fields, 'notes', extractNoteText(rawText));

  const nameClues = [];
  const explicitName = extractLabeledName(rawText);
  if (explicitName) nameClues.push(explicitName);

  ['instagram', 'twitter', 'slack'].forEach(key => {
    if (!fields[key]) return;
    const inferredName = splitHandleIntoName(fields[key]);
    if (inferredName) nameClues.push(inferredName);
  });

  if (fields.email) {
    const localPart = fields.email.split('@')[0].replace(/[._-]+/g, ' ');
    if (localPart) nameClues.push(titleCaseWords(localPart));
  }

  return {
    fields,
    nameClues: [...new Set(nameClues)].filter(Boolean),
    matchedContacts: findContactsForParsedText(fields, nameClues),
  };
}

function scoreContactForParsedText(contact, fields, nameClues) {
  let score = 0;
  const contactNameToken = normalizeLooseToken(contact.name);

  if (fields.email && normalizeContactToken(contact.email) === normalizeContactToken(fields.email)) score += 120;
  if (fields.phone && normalizePhoneToken(contact.phone) === normalizePhoneToken(fields.phone)) score += 120;

  ['instagram', 'twitter', 'slack', 'linkedin'].forEach(key => {
    if (!fields[key] || !contact[key]) return;
    if (normalizeLooseToken(contact[key]) === normalizeLooseToken(fields[key])) score += 90;
  });

  nameClues.forEach(clue => {
    const clueToken = normalizeLooseToken(clue);
    if (!clueToken) return;
    if (contactNameToken === clueToken) score += 100;
    else if (contactNameToken.includes(clueToken) || clueToken.includes(contactNameToken)) score += 45;

    const clueTerms = clue.toLowerCase().split(/\s+/).filter(term => term.length > 1);
    if (clueTerms.length && clueTerms.every(term => contact.name.toLowerCase().includes(term))) score += 35;
  });

  return score;
}

function findContactsForParsedText(fields, nameClues) {
  return CONTACTS
    .map(contact => ({ contact, score: scoreContactForParsedText(contact, fields, nameClues) }))
    .filter(match => match.score >= 45)
    .sort((a, b) => b.score - a.score || a.contact.name.localeCompare(b.contact.name))
    .slice(0, 4);
}

function getParsedFieldRows(fields) {
  return [
    ['email', 'Email'],
    ['phone', 'Phone'],
    ['company', 'Company'],
    ['title', 'Title'],
    ['instagram', 'Instagram'],
    ['twitter', 'Twitter'],
    ['linkedin', 'LinkedIn'],
    ['slack', 'Slack'],
    ['teams', 'Teams'],
    ['birthday', 'Birthday'],
    ['notes', 'Note'],
  ]
    .filter(([key]) => fields[key])
    .map(([key, label]) => ({ key, label, value: fields[key] }));
}

function getContactUpdateRows(contact, fields) {
  if (!contact) return [];

  return getParsedFieldRows(fields)
    .filter(row => {
      if (row.key === 'notes') {
        const existingNotes = Array.isArray(contact.notes) ? contact.notes : [];
        return !existingNotes.some(note => normalizeContactToken(note.text) === normalizeContactToken(row.value));
      }
      return normalizeContactToken(contact[row.key]) !== normalizeContactToken(row.value);
    })
    .map(row => ({
      ...row,
      previous: row.key === 'notes'
        ? ''
        : contact[row.key] || '',
    }));
}

function getParsedContactName(parsed) {
  const nameClue = parsed?.nameClues?.[0];
  if (nameClue) return nameClue;

  const email = parsed?.fields?.email || '';
  if (email) return titleCaseWords(email.split('@')[0].replace(/[._-]+/g, ' '));

  return '';
}

function canCreateContactFromParsed(parsed) {
  const fields = parsed?.fields || {};
  return Boolean(getParsedContactName(parsed) || fields.email || fields.phone || fields.instagram || fields.linkedin);
}

function getTodayNoteDate() {
  return new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function applyParsedRowsToContact(contact, rows) {
  rows.forEach(row => {
    if (row.key === 'notes') {
      contact.notes = Array.isArray(contact.notes) ? contact.notes : [];
      contact.notes.push({
        date: getTodayNoteDate(),
        text: row.value,
      });
      return;
    }
    contact[row.key] = row.value;
  });
}

function syncSelectedPasteFields(parsed, preserveSelection = true) {
  const fieldKeys = getParsedFieldRows(parsed?.fields || {}).map(row => row.key);
  const availableKeys = new Set(fieldKeys);

  pasteTextState.selectedFieldKeys.forEach(key => {
    if (!availableKeys.has(key)) pasteTextState.selectedFieldKeys.delete(key);
  });

  fieldKeys.forEach(key => {
    if (!preserveSelection || !pasteTextState.knownFieldKeys.has(key)) {
      pasteTextState.selectedFieldKeys.add(key);
    }
  });

  if (!preserveSelection) {
    pasteTextState.selectedFieldKeys = new Set(fieldKeys);
  }
  pasteTextState.knownFieldKeys = availableKeys;
}

function getSelectedParsedRows(fields) {
  return getParsedFieldRows(fields)
    .filter(row => pasteTextState.selectedFieldKeys.has(row.key));
}

function getSelectedFieldsObject(fields) {
  return getSelectedParsedRows(fields).reduce((selected, row) => {
    selected[row.key] = row.value;
    return selected;
  }, {});
}

function createContactFromParsedText(parsed, selectedRows = getSelectedParsedRows(parsed.fields)) {
  const contact = {
    id: getNextContactId(),
    name: getParsedContactName(parsed) || parsed.fields.email || parsed.fields.phone || 'New Contact',
    email: selectedRows.find(row => row.key === 'email')?.value || '',
    phone: selectedRows.find(row => row.key === 'phone')?.value || '',
    color: getImportedContactColor(CONTACTS.length),
  };

  selectedRows.forEach(row => {
    if (row.key === 'email' || row.key === 'phone') return;
    if (row.key === 'notes') {
      contact.notes = [{
        date: getTodayNoteDate(),
        text: row.value,
      }];
      return;
    }
    contact[row.key] = row.value;
  });

  CONTACTS.push(contact);
  return contact;
}

function getPasteFieldAction(row, contact, isCreateMode) {
  if (isCreateMode) return row.key === 'notes' ? 'Add note' : 'Add';
  if (!contact) return 'Pending';
  if (row.key === 'notes') return 'Add note';
  return row.previous ? 'Replace' : 'Add';
}

function getPasteContactPickerMatches(query, parsed) {
  const normalizedQuery = query.trim().toLowerCase();
  const parsedMatchIds = new Set((parsed?.matchedContacts || []).map(match => match.contact.id));

  return CONTACTS
    .filter(contact => !parsedMatchIds.has(contact.id))
    .filter(contact => {
      if (!normalizedQuery) return true;
      return getContactSearchText(contact).includes(normalizedQuery);
    })
    .sort((a, b) => a.name.localeCompare(b.name))
    .slice(0, 6);
}

function renderPasteTextStatus(message) {
  pasteTextState.status = message;
  const status = document.getElementById('paste-text-status');
  if (status) status.textContent = message;
}

function syncPasteTextPreview({ preserveSelection = false } = {}) {
  const input = document.getElementById('paste-text-input');
  const clearButton = document.getElementById('paste-text-clear-btn');
  if (input) pasteTextState.text = input.value;
  if (clearButton) clearButton.disabled = !pasteTextState.text;
  pasteTextState.parsed = parseChaoticContactText(pasteTextState.text);
  syncSelectedPasteFields(pasteTextState.parsed, preserveSelection);

  const matches = pasteTextState.parsed.matchedContacts;
  const canCreate = canCreateContactFromParsed(pasteTextState.parsed);
  const selectionStillValid = matches.some(match => match.contact.id === pasteTextState.selectedContactId) ||
    pasteTextState.selectedContactId === PASTE_CREATE_CONTACT_ID ||
    Boolean(getContact(pasteTextState.selectedContactId));

  if (!preserveSelection || !selectionStillValid) {
    pasteTextState.selectedContactId = matches[0]?.contact.id || (canCreate ? PASTE_CREATE_CONTACT_ID : null);
  }

  renderPasteTextPreview();
}

function renderPasteTextPreview() {
  const parsed = pasteTextState.parsed || parseChaoticContactText(pasteTextState.text);
  const fields = parsed.fields;
  const isCreateMode = pasteTextState.selectedContactId === PASTE_CREATE_CONTACT_ID;
  const selectedContact = isCreateMode ? null : getContact(pasteTextState.selectedContactId);
  const parsedRows = getParsedFieldRows(fields);
  const selectedRows = getSelectedParsedRows(fields);
  const selectedFields = getSelectedFieldsObject(fields);
  const updateRows = getContactUpdateRows(selectedContact, selectedFields);
  const preview = document.getElementById('paste-text-preview');
  const applyButton = document.getElementById('paste-text-apply-btn');
  const canCreate = canCreateContactFromParsed(parsed);
  const createName = getParsedContactName(parsed) || fields.email || fields.phone || 'New Contact';

  if (!preview) return;

  if (!pasteTextState.text.trim()) {
    preview.innerHTML = `
      <div class="paste-text-empty">
        <div class="paste-text-empty__title">Nothing to sort yet</div>
        <div class="paste-text-empty__text">Try something like "instagram @joshsmith" or paste a whole email signature.</div>
      </div>
    `;
    if (applyButton) applyButton.disabled = true;
    renderPasteTextStatus('Paste a messy note, signature, or social handle to preview updates.');
    return;
  }

  if (!parsedRows.length) {
    preview.innerHTML = `
      <div class="paste-text-empty">
        <div class="paste-text-empty__title">No profile details found</div>
        <div class="paste-text-empty__text">Look for an email, phone, company, title, birthday, social handle, LinkedIn URL, Slack, Teams handle, or note.</div>
      </div>
    `;
    if (applyButton) applyButton.disabled = true;
    renderPasteTextStatus('No recognizable profile fields found yet.');
    return;
  }

  const parserMatches = parsed.matchedContacts.map(({ contact, score }) => `
      <button class="paste-text-match${contact.id === pasteTextState.selectedContactId ? ' paste-text-match--selected' : ''}" type="button" data-contact-id="${contact.id}">
        <span class="paste-text-match__avatar" style="background:${escapeAttr(contact.color)}">${buildAvatarContents(contact)}</span>
        <span class="paste-text-match__meta">
          <span class="paste-text-match__name">${escapeHTML(contact.name)}</span>
          <span class="paste-text-match__detail">${score >= 100 ? 'Strong match' : 'Possible match'}</span>
        </span>
        <span class="paste-text-match__check">${contact.id === pasteTextState.selectedContactId ? '✓' : ''}</span>
      </button>
    `).join('');

  const createOption = canCreate
    ? `
      <button class="paste-text-match${isCreateMode ? ' paste-text-match--selected' : ''}" type="button" data-contact-id="${PASTE_CREATE_CONTACT_ID}">
        <span class="paste-text-match__avatar paste-text-match__avatar--new">+</span>
        <span class="paste-text-match__meta">
          <span class="paste-text-match__name">Create ${escapeHTML(createName)}</span>
          <span class="paste-text-match__detail">Add a new contact from these details</span>
        </span>
        <span class="paste-text-match__check">${isCreateMode ? '✓' : ''}</span>
      </button>
    `
    : '';

  const manualContacts = getPasteContactPickerMatches(pasteTextState.contactQuery, parsed);
  const manualOptions = manualContacts.map(contact => `
    <button class="paste-text-match${contact.id === pasteTextState.selectedContactId ? ' paste-text-match--selected' : ''}" type="button" data-contact-id="${contact.id}">
      <span class="paste-text-match__avatar" style="background:${escapeAttr(contact.color)}">${buildAvatarContents(contact)}</span>
      <span class="paste-text-match__meta">
        <span class="paste-text-match__name">${escapeHTML(contact.name)}</span>
        <span class="paste-text-match__detail">${escapeHTML(contact.email || contact.phone || 'Existing contact')}</span>
      </span>
      <span class="paste-text-match__check">${contact.id === pasteTextState.selectedContactId ? '✓' : ''}</span>
    </button>
  `).join('');

  const matchOptions = parserMatches || createOption
    ? `${parserMatches}${createOption}`
    : `
      <div class="paste-text-empty">
        <div class="paste-text-empty__title">No matching contact found</div>
        <div class="paste-text-empty__text">Search below to choose an existing contact, or include a name, email, phone number, or handle to create one.</div>
      </div>
    `;

  const parsedList = parsedRows.map(row => `
    <label class="paste-text-field paste-text-field--selectable">
      <input class="paste-text-field__checkbox" type="checkbox" data-field-key="${escapeAttr(row.key)}" ${pasteTextState.selectedFieldKeys.has(row.key) ? 'checked' : ''} />
      <span class="paste-text-field__label">${escapeHTML(row.label)}</span>
      <span class="paste-text-field__value">${escapeHTML(row.value)}</span>
    </label>
  `).join('');

  const updateList = updateRows.length
    ? updateRows.map(row => `
      <div class="paste-text-field">
        <span class="paste-text-field__badge">${escapeHTML(getPasteFieldAction(row, selectedContact, isCreateMode))}</span>
        <span class="paste-text-field__label">${escapeHTML(row.label)}</span>
        <span class="paste-text-field__value">${escapeHTML(row.previous ? `${row.previous} -> ${row.value}` : row.value)}</span>
      </div>
    `).join('')
    : isCreateMode
      ? selectedRows.map(row => `
        <div class="paste-text-field">
          <span class="paste-text-field__badge">${escapeHTML(getPasteFieldAction(row, null, true))}</span>
          <span class="paste-text-field__label">${escapeHTML(row.label)}</span>
          <span class="paste-text-field__value">${escapeHTML(row.value)}</span>
        </div>
      `).join('') || '<div class="paste-text-empty__text">Choose at least one extracted detail to create this contact.</div>'
      : '<div class="paste-text-empty__text">Select a contact with new or different details to update.</div>';

  preview.innerHTML = `
    <section class="paste-text-card">
      <h2 class="paste-text-card__title">Matched Contact</h2>
      <div class="paste-text-matches">${matchOptions}</div>
    </section>

    <section class="paste-text-card">
      <label class="paste-text-label" for="paste-text-contact-search">Choose Existing Contact</label>
      <input class="paste-text-search" id="paste-text-contact-search" type="search" placeholder="Search contacts" value="${escapeAttr(pasteTextState.contactQuery)}" />
      <div class="paste-text-matches paste-text-matches--manual">
        ${manualOptions || '<div class="paste-text-empty__text">No contacts match that search.</div>'}
      </div>
    </section>

    <section class="paste-text-card">
      <h2 class="paste-text-card__title">Details Found</h2>
      <div class="paste-text-fields">${parsedList}</div>
    </section>

    <section class="paste-text-card">
      <h2 class="paste-text-card__title">Updates Preview</h2>
      <div class="paste-text-fields">${updateList}</div>
    </section>
  `;

  if (applyButton) {
    applyButton.disabled = isCreateMode ? !canCreate || !selectedRows.length : !selectedContact || !updateRows.length;
    applyButton.textContent = isCreateMode ? 'Create Contact' : 'Apply Updates';
  }

  const searchInput = document.getElementById('paste-text-contact-search');
  searchInput?.addEventListener('input', event => {
    pasteTextState.contactQuery = event.target.value;
    renderPasteTextPreview();
    document.getElementById('paste-text-contact-search')?.focus();
  });

  renderPasteTextStatus(isCreateMode
    ? `${selectedRows.length} detail${selectedRows.length === 1 ? '' : 's'} selected for ${createName}.`
    : selectedContact
    ? `${updateRows.length} update${updateRows.length === 1 ? '' : 's'} ready for ${selectedContact.name}.`
    : 'Choose a matching contact before applying updates.');
}

function applyPasteTextUpdates() {
  const parsed = pasteTextState.parsed || parseChaoticContactText(pasteTextState.text);
  if (pasteTextState.selectedContactId === PASTE_CREATE_CONTACT_ID) {
    if (!canCreateContactFromParsed(parsed)) return;
    const selectedRows = getSelectedParsedRows(parsed.fields);
    if (!selectedRows.length) return;
    const newContact = createContactFromParsedText(parsed, selectedRows);
    saveAppData();
    pasteTextState.selectedContactId = newContact.id;
    pasteTextState.status = `Created ${newContact.name}.`;
    goToContactDetail(newContact.id);
    return;
  }

  const contact = getContact(pasteTextState.selectedContactId);
  const updateRows = getContactUpdateRows(contact, getSelectedFieldsObject(parsed.fields));
  if (!contact || !updateRows.length) return;

  applyParsedRowsToContact(contact, updateRows);
  saveAppData();
  pasteTextState.status = `Updated ${contact.name}.`;
  renderPasteText();
  renderPasteTextStatus(`Updated ${contact.name}.`);
}

function confirmPasteTextUpdates() {
  const parsed = pasteTextState.parsed || parseChaoticContactText(pasteTextState.text);
  if (pasteTextState.selectedContactId === PASTE_CREATE_CONTACT_ID) {
    if (!canCreateContactFromParsed(parsed)) return;
    const createName = getParsedContactName(parsed) || parsed.fields.email || parsed.fields.phone || 'New Contact';
    const selectedRows = getSelectedParsedRows(parsed.fields);
    if (!selectedRows.length) return;
    openConfirmDialog({
      title: `Create ${createName}?`,
      text: `Add a new contact with ${selectedRows.length} selected detail${selectedRows.length === 1 ? '' : 's'}.`,
      confirmLabel: 'Create Contact',
      onConfirm: applyPasteTextUpdates,
    });
    return;
  }

  const contact = getContact(pasteTextState.selectedContactId);
  const updateRows = getContactUpdateRows(contact, getSelectedFieldsObject(parsed.fields));
  if (!contact || !updateRows.length) return;

  openConfirmDialog({
    title: `Update ${contact.name}?`,
    text: `Apply ${updateRows.length} extracted profile update${updateRows.length === 1 ? '' : 's'} to this contact.`,
    confirmLabel: 'Apply Updates',
    onConfirm: applyPasteTextUpdates,
  });
}

function renderPasteText() {
  const content = document.getElementById('paste-text-content');
  if (!content) return;

  content.innerHTML = `
    <section class="paste-text-card">
      <label class="paste-text-label" for="paste-text-input">Text to sort</label>
      <textarea class="paste-text-input" id="paste-text-input" rows="8" placeholder="Paste a note, signature, DM, or social handle...">${escapeHTML(pasteTextState.text)}</textarea>
    </section>

    <div class="paste-text-actions">
      <button class="paste-text-action" id="paste-text-clear-btn" type="button" ${pasteTextState.text ? '' : 'disabled'}>Clear</button>
      <button class="paste-text-action paste-text-action--primary" id="paste-text-apply-btn" type="button" disabled>Apply Updates</button>
    </div>

    <p class="paste-text-status" id="paste-text-status" role="status" aria-live="polite">${escapeHTML(pasteTextState.status)}</p>
    <div class="paste-text-preview" id="paste-text-preview"></div>
  `;

  const input = document.getElementById('paste-text-input');
  const clearButton = document.getElementById('paste-text-clear-btn');
  const applyButton = document.getElementById('paste-text-apply-btn');
  const preview = document.getElementById('paste-text-preview');

  input?.addEventListener('input', () => syncPasteTextPreview());
  clearButton?.addEventListener('click', () => {
    pasteTextState.text = '';
    pasteTextState.parsed = null;
    pasteTextState.selectedContactId = null;
    pasteTextState.contactQuery = '';
    pasteTextState.selectedFieldKeys = new Set();
    pasteTextState.knownFieldKeys = new Set();
    pasteTextState.status = 'Paste a messy note, signature, or social handle to preview updates.';
    renderPasteText();
  });
  applyButton?.addEventListener('click', confirmPasteTextUpdates);
  preview?.addEventListener('change', event => {
    const checkbox = event.target.closest('.paste-text-field__checkbox');
    if (!checkbox) return;

    const fieldKey = checkbox.dataset.fieldKey;
    if (!fieldKey) return;
    if (checkbox.checked) {
      pasteTextState.selectedFieldKeys.add(fieldKey);
    } else {
      pasteTextState.selectedFieldKeys.delete(fieldKey);
    }
    renderPasteTextPreview();
  });
  preview?.addEventListener('click', event => {
    const matchButton = event.target.closest('.paste-text-match');
    if (!matchButton) return;
    const contactId = matchButton.dataset.contactId;
    pasteTextState.selectedContactId = contactId === PASTE_CREATE_CONTACT_ID
      ? PASTE_CREATE_CONTACT_ID
      : parseInt(contactId, 10);
    renderPasteTextPreview();
  });

  syncPasteTextPreview({ preserveSelection: true });
}

function renderUploadPhotoStatus(message) {
  uploadPhotoState.status = message;
  const status = document.getElementById('upload-photo-status');
  if (status) status.textContent = message;
}

function clearUploadPhotoPreviewUrl() {
  if (uploadPhotoState.previewUrl) {
    URL.revokeObjectURL(uploadPhotoState.previewUrl);
  }
  uploadPhotoState.previewUrl = '';
}

function resetUploadPhotoState() {
  clearUploadPhotoPreviewUrl();
  uploadPhotoState.file = null;
  uploadPhotoState.sourceImageDataUrl = '';
  uploadPhotoState.sourceImageName = '';
  uploadPhotoState.text = '';
  uploadPhotoState.parsed = null;
  uploadPhotoState.selectedContactId = null;
  uploadPhotoState.status = 'Upload a photo or screenshot to extract contact details.';
  uploadPhotoState.isProcessing = false;
}

function getPhotoTextDetector() {
  try {
    return typeof TextDetector === 'function' ? new TextDetector() : null;
  } catch (_error) {
    return null;
  }
}

function loadImageForOcr(file) {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Unable to load that image.'));
    };
    image.src = objectUrl;
  });
}

function canvasToBlob(canvas, type = 'image/png', quality = 0.95) {
  return new Promise(resolve => {
    canvas.toBlob(blob => resolve(blob), type, quality);
  });
}

async function preprocessImageForOcr(file) {
  const image = await loadImageForOcr(file);
  const maxSide = 1800;
  const scale = Math.min(1, maxSide / Math.max(image.naturalWidth || image.width, image.naturalHeight || image.height));
  const width = Math.max(1, Math.round((image.naturalWidth || image.width) * scale));
  const height = Math.max(1, Math.round((image.naturalHeight || image.height) * scale));
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d', { willReadFrequently: true });
  if (!context) return file;

  canvas.width = width;
  canvas.height = height;
  context.drawImage(image, 0, 0, width, height);

  const imageData = context.getImageData(0, 0, width, height);
  const data = imageData.data;
  const contrast = 1.35;
  const midpoint = 128;

  for (let i = 0; i < data.length; i += 4) {
    const grayscale = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    const adjusted = Math.max(0, Math.min(255, (grayscale - midpoint) * contrast + midpoint));
    data[i] = adjusted;
    data[i + 1] = adjusted;
    data[i + 2] = adjusted;
  }

  context.putImageData(imageData, 0, 0);
  return await canvasToBlob(canvas) || file;
}

async function createUploadPhotoAttachment(file) {
  const image = await loadImageForOcr(file);
  const maxSide = 900;
  const scale = Math.min(1, maxSide / Math.max(image.naturalWidth || image.width, image.naturalHeight || image.height));
  const width = Math.max(1, Math.round((image.naturalWidth || image.width) * scale));
  const height = Math.max(1, Math.round((image.naturalHeight || image.height) * scale));
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) return '';

  canvas.width = width;
  canvas.height = height;
  context.drawImage(image, 0, 0, width, height);
  return canvas.toDataURL('image/jpeg', 0.76);
}

function loadExternalScript(src) {
  const existingScript = document.querySelector(`script[src="${src}"]`);
  if (existingScript) {
    return new Promise((resolve, reject) => {
      if (existingScript.dataset.loaded === 'true') {
        resolve();
        return;
      }
      existingScript.addEventListener('load', resolve, { once: true });
      existingScript.addEventListener('error', () => reject(new Error('Could not load image text reader.')), { once: true });
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => {
      script.dataset.loaded = 'true';
      resolve();
    };
    script.onerror = () => reject(new Error('Could not load image text reader.'));
    document.head.appendChild(script);
  });
}

async function ensureTesseractLoaded() {
  if (window.Tesseract) return;
  if (!tesseractLoadPromise) {
    tesseractLoadPromise = loadExternalScript(TESSERACT_CDN_URL).catch(error => {
      tesseractLoadPromise = null;
      throw error;
    });
  }
  await tesseractLoadPromise;
  if (!window.Tesseract) {
    throw new Error('Image text reader is unavailable.');
  }
}

async function extractTextWithNativeDetector(file, detector) {
  let imageSource = null;
  let cleanup = () => {};

  if (typeof createImageBitmap === 'function') {
    imageSource = await createImageBitmap(file);
    cleanup = () => imageSource.close?.();
  } else {
    const objectUrl = URL.createObjectURL(file);
    imageSource = await new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error('Unable to load that image.'));
      image.src = objectUrl;
    });
    cleanup = () => URL.revokeObjectURL(objectUrl);
  }

  try {
    const detections = await detector.detect(imageSource);
    return detections
      .map(detection => detection.rawValue || detection.text || '')
      .filter(Boolean)
      .join('\n');
  } finally {
    cleanup();
  }
}

async function extractTextWithTesseract(file) {
  await ensureTesseractLoaded();
  const result = await window.Tesseract.recognize(file, 'eng', {
    logger(message) {
      if (message.status !== 'recognizing text' || !Number.isFinite(message.progress)) return;
      renderUploadPhotoStatus(`Reading contact details from image... ${Math.round(message.progress * 100)}%`);
    },
  });
  return result?.data?.text || '';
}

function getOcrBackendEndpoint() {
  return window.BUBBLES_OCR_ENDPOINT ||
    localStorage.getItem(OCR_BACKEND_ENDPOINT_KEY) ||
    '';
}

async function extractTextWithBackend(file, endpoint) {
  const body = new FormData();
  body.append('image', file, file.name || 'contact-photo.jpg');
  const response = await fetch(endpoint, {
    method: 'POST',
    body,
  });

  if (!response.ok) {
    throw new Error('Backend text extraction failed.');
  }

  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    const payload = await response.json();
    return payload.text || payload.extractedText || '';
  }

  return response.text();
}

async function extractTextFromUploadPhoto(file) {
  const backendEndpoint = getOcrBackendEndpoint();
  if (backendEndpoint) {
    try {
      renderUploadPhotoStatus('Reading contact details with secure extraction...');
      return await extractTextWithBackend(file, backendEndpoint);
    } catch (error) {
      console.warn('Backend OCR unavailable, falling back to browser extraction', error);
    }
  }

  renderUploadPhotoStatus('Preparing image for text extraction...');
  const ocrFile = await preprocessImageForOcr(file).catch(() => file);
  const detector = getPhotoTextDetector();
  if (detector) {
    renderUploadPhotoStatus('Reading contact details from image...');
    return extractTextWithNativeDetector(ocrFile, detector);
  }

  return extractTextWithTesseract(ocrFile);
}

function syncUploadPhotoPreview({ preserveSelection = false } = {}) {
  const input = document.getElementById('upload-photo-text');
  if (input) uploadPhotoState.text = input.value;
  uploadPhotoState.parsed = parseChaoticContactText(uploadPhotoState.text);

  const matches = uploadPhotoState.parsed.matchedContacts;
  if (!preserveSelection || !matches.some(match => match.contact.id === uploadPhotoState.selectedContactId)) {
    uploadPhotoState.selectedContactId = matches[0]?.contact.id || null;
  }

  renderUploadPhotoPreview();
}

function renderUploadPhotoPreview() {
  const parsed = uploadPhotoState.parsed || parseChaoticContactText(uploadPhotoState.text);
  const fields = parsed.fields;
  const selectedContact = getContact(uploadPhotoState.selectedContactId);
  const parsedRows = getParsedFieldRows(fields);
  const updateRows = getContactUpdateRows(selectedContact, fields);
  const preview = document.getElementById('upload-photo-preview');
  const applyButton = document.getElementById('upload-photo-apply-btn');

  if (!preview) return;

  if (!uploadPhotoState.file) {
    preview.innerHTML = `
      <div class="paste-text-empty">
        <div class="paste-text-empty__title">No image selected</div>
        <div class="paste-text-empty__text">Choose a business card, profile screenshot, or saved contact image.</div>
      </div>
    `;
    if (applyButton) applyButton.disabled = true;
    return;
  }

  if (!uploadPhotoState.text.trim()) {
    preview.innerHTML = `
      <div class="paste-text-empty">
        <div class="paste-text-empty__title">No text extracted yet</div>
        <div class="paste-text-empty__text">Use an image with clear contact details, or type the visible text above.</div>
      </div>
    `;
    if (applyButton) applyButton.disabled = true;
    return;
  }

  if (!parsedRows.length) {
    preview.innerHTML = `
      <div class="paste-text-empty">
        <div class="paste-text-empty__title">No profile details found</div>
        <div class="paste-text-empty__text">Look for an email, phone, birthday, social handle, LinkedIn URL, Slack, or Teams handle.</div>
      </div>
    `;
    if (applyButton) applyButton.disabled = true;
    renderUploadPhotoStatus('No recognizable profile fields found yet.');
    return;
  }

  const matchOptions = parsed.matchedContacts.length
    ? parsed.matchedContacts.map(({ contact, score }) => `
      <button class="paste-text-match${contact.id === uploadPhotoState.selectedContactId ? ' paste-text-match--selected' : ''}" type="button" data-contact-id="${contact.id}">
        <span class="paste-text-match__avatar" style="background:${escapeAttr(contact.color)}">${buildAvatarContents(contact)}</span>
        <span class="paste-text-match__meta">
          <span class="paste-text-match__name">${escapeHTML(contact.name)}</span>
          <span class="paste-text-match__detail">${score >= 100 ? 'Strong match' : 'Possible match'}</span>
        </span>
        <span class="paste-text-match__check">${contact.id === uploadPhotoState.selectedContactId ? '✓' : ''}</span>
      </button>
    `).join('')
    : `
      <div class="paste-text-empty">
        <div class="paste-text-empty__title">No matching contact found</div>
        <div class="paste-text-empty__text">The image needs a name, email, phone number, or a handle that resembles an existing contact.</div>
      </div>
    `;

  const parsedList = parsedRows.map(row => `
    <div class="paste-text-field">
      <span class="paste-text-field__label">${escapeHTML(row.label)}</span>
      <span class="paste-text-field__value">${escapeHTML(row.value)}</span>
    </div>
  `).join('');

  const updateList = updateRows.length
    ? updateRows.map(row => `
      <div class="paste-text-field">
        <span class="paste-text-field__label">${escapeHTML(row.label)}</span>
        <span class="paste-text-field__value">${escapeHTML(row.previous ? `${row.previous} -> ${row.value}` : row.value)}</span>
      </div>
    `).join('')
    : '<div class="paste-text-empty__text">Select a contact with new or different details to update.</div>';

  preview.innerHTML = `
    <section class="paste-text-card">
      <h2 class="paste-text-card__title">Matched Contact</h2>
      <div class="paste-text-matches">${matchOptions}</div>
    </section>

    <section class="paste-text-card">
      <h2 class="paste-text-card__title">Details Found</h2>
      <div class="paste-text-fields">${parsedList}</div>
    </section>

    <section class="paste-text-card">
      <h2 class="paste-text-card__title">Updates Preview</h2>
      <div class="paste-text-fields">${updateList}</div>
    </section>
  `;

  if (applyButton) applyButton.disabled = !selectedContact || !updateRows.length;
  renderUploadPhotoStatus(selectedContact
    ? `${updateRows.length} update${updateRows.length === 1 ? '' : 's'} ready for ${selectedContact.name}.`
    : 'Choose a matching contact before applying updates.');
}

function applyUploadPhotoUpdates() {
  const parsed = uploadPhotoState.parsed || parseChaoticContactText(uploadPhotoState.text);
  const contact = getContact(uploadPhotoState.selectedContactId);
  const updateRows = getContactUpdateRows(contact, parsed.fields);
  if (!contact || !updateRows.length) return false;

  applyParsedRowsToContact(contact, updateRows);
  addUploadPhotoAuditNote(contact, updateRows);
  saveAppData();
  uploadPhotoState.status = `Updated ${contact.name}.`;
  renderUploadPhoto();
  renderUploadPhotoStatus(`Updated ${contact.name}.`);
  return true;
}

function addUploadPhotoAuditNote(contact, updateRows) {
  contact.notes = Array.isArray(contact.notes) ? contact.notes : [];
  const updatedLabels = updateRows.map(row => row.label.toLowerCase()).join(', ');
  const note = {
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    text: `Updated from uploaded photo${updatedLabels ? `: ${updatedLabels}` : ''}.`,
    source: 'upload-photo',
  };

  if (uploadPhotoState.sourceImageDataUrl) {
    note.image = uploadPhotoState.sourceImageDataUrl;
    note.imageName = uploadPhotoState.sourceImageName || 'Uploaded contact photo';
  }

  contact.notes.push(note);
}

function confirmUploadPhotoUpdates() {
  const parsed = uploadPhotoState.parsed || parseChaoticContactText(uploadPhotoState.text);
  const contact = getContact(uploadPhotoState.selectedContactId);
  const updateRows = getContactUpdateRows(contact, parsed.fields);
  if (!contact || !updateRows.length) return;

  openConfirmDialog({
    title: `Update ${contact.name}?`,
    text: `Apply ${updateRows.length} extracted profile update${updateRows.length === 1 ? '' : 's'} from this image.`,
    confirmLabel: 'Apply Updates',
    onConfirm: applyUploadPhotoUpdates,
  });
}

function getStrongUploadPhotoMatch() {
  const parsed = uploadPhotoState.parsed || parseChaoticContactText(uploadPhotoState.text);
  const bestMatch = parsed.matchedContacts[0];
  return bestMatch?.score >= 100 ? bestMatch : null;
}

async function processUploadPhotoFile(file) {
  if (!file || !file.type.startsWith('image/')) {
    renderUploadPhotoStatus('Choose an image file to extract contact details.');
    return;
  }

  clearUploadPhotoPreviewUrl();
  uploadPhotoState.file = file;
  uploadPhotoState.previewUrl = URL.createObjectURL(file);
  uploadPhotoState.sourceImageDataUrl = '';
  uploadPhotoState.sourceImageName = file.name || 'Uploaded contact photo';
  uploadPhotoState.text = '';
  uploadPhotoState.parsed = null;
  uploadPhotoState.selectedContactId = null;
  uploadPhotoState.isProcessing = true;
  uploadPhotoState.status = 'Reading contact details from image...';
  renderUploadPhoto();

  try {
    uploadPhotoState.sourceImageDataUrl = await createUploadPhotoAttachment(file).catch(() => '');
    const text = await extractTextFromUploadPhoto(file);
    uploadPhotoState.text = text.trim();
    uploadPhotoState.isProcessing = false;
    uploadPhotoState.parsed = parseChaoticContactText(uploadPhotoState.text);
    uploadPhotoState.selectedContactId = uploadPhotoState.parsed.matchedContacts[0]?.contact.id || null;

    if (!uploadPhotoState.text) {
      uploadPhotoState.status = 'No text was found in this image.';
      renderUploadPhoto();
      return;
    }

    renderUploadPhoto();
    const strongMatch = getStrongUploadPhotoMatch();
    renderUploadPhotoStatus(strongMatch
      ? `Strong match found for ${strongMatch.contact.name}. Review the updates, then apply them.`
      : 'Contact details extracted. Review the matched profile before applying updates.');
  } catch (error) {
    uploadPhotoState.isProcessing = false;
    uploadPhotoState.status = error.message || 'Could not read text from this image.';
    renderUploadPhoto();
  }
}

function renderUploadPhoto() {
  const content = document.getElementById('upload-photo-content');
  if (!content) return;

  const previewMarkup = uploadPhotoState.previewUrl
    ? `<img class="upload-photo-drop__image" src="${escapeAttr(uploadPhotoState.previewUrl)}" alt="">`
    : `
      <span class="upload-photo-drop__icon" aria-hidden="true">
        <svg viewBox="0 0 36 36" fill="none">
          <path d="M10 6h13l5 5v19H10V6z" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"/>
          <path d="M23 6v6h5" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"/>
          <path d="M18 25V15M14 19l4-4 4 4" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </span>
      <span class="upload-photo-drop__title">Choose Image</span>
    `;

  content.innerHTML = `
    <section class="upload-photo-card">
      <label class="upload-photo-drop" for="upload-photo-input">
        ${previewMarkup}
        <input class="upload-photo-input" id="upload-photo-input" type="file" accept="image/*" capture="environment">
      </label>
    </section>

    <section class="paste-text-card">
      <label class="paste-text-label" for="upload-photo-text">Extracted Text</label>
      <textarea class="paste-text-input upload-photo-text" id="upload-photo-text" rows="6" placeholder="Contact details from the image appear here...">${escapeHTML(uploadPhotoState.text)}</textarea>
    </section>

    <div class="paste-text-actions">
      <button class="paste-text-action" id="upload-photo-clear-btn" type="button" ${uploadPhotoState.file || uploadPhotoState.text ? '' : 'disabled'}>Clear</button>
      <button class="paste-text-action" id="upload-photo-extract-btn" type="button" ${uploadPhotoState.file && !uploadPhotoState.isProcessing ? '' : 'disabled'}>${uploadPhotoState.isProcessing ? 'Reading...' : 'Extract Details'}</button>
      <button class="paste-text-action paste-text-action--primary" id="upload-photo-apply-btn" type="button" disabled>Apply Updates</button>
    </div>

    <p class="paste-text-status" id="upload-photo-status" role="status" aria-live="polite">${escapeHTML(uploadPhotoState.status)}</p>
    <div class="paste-text-preview" id="upload-photo-preview"></div>
  `;

  const fileInput = document.getElementById('upload-photo-input');
  const textInput = document.getElementById('upload-photo-text');
  const clearButton = document.getElementById('upload-photo-clear-btn');
  const extractButton = document.getElementById('upload-photo-extract-btn');
  const applyButton = document.getElementById('upload-photo-apply-btn');
  const preview = document.getElementById('upload-photo-preview');

  fileInput?.addEventListener('change', event => {
    processUploadPhotoFile(event.target.files?.[0]);
  });
  textInput?.addEventListener('input', () => syncUploadPhotoPreview());
  clearButton?.addEventListener('click', () => {
    resetUploadPhotoState();
    renderUploadPhoto();
  });
  extractButton?.addEventListener('click', () => {
    if (uploadPhotoState.file) processUploadPhotoFile(uploadPhotoState.file);
  });
  applyButton?.addEventListener('click', confirmUploadPhotoUpdates);
  preview?.addEventListener('click', event => {
    const matchButton = event.target.closest('.paste-text-match');
    if (!matchButton) return;
    uploadPhotoState.selectedContactId = parseInt(matchButton.dataset.contactId, 10);
    renderUploadPhotoPreview();
  });

  syncUploadPhotoPreview({ preserveSelection: true });
}

function normalizeContactToken(value) {
  return String(value || '').trim().toLowerCase();
}

function normalizePhoneToken(value) {
  return String(value || '').replace(/\D/g, '');
}

function getNextContactId() {
  return CONTACTS.reduce((maxId, contact) => Math.max(maxId, contact.id || 0), 0) + 1;
}

function getImportedContactColor(index) {
  const colors = ['#5E7FA3', '#5D8A72', '#A8607A', '#7B6BB0', '#B07850', '#4E8E72'];
  return colors[index % colors.length];
}

function parseCsvRows(text) {
  const rows = [];
  let row = [];
  let value = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"' && inQuotes && next === '"') {
      value += '"';
      i++;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === ',' && !inQuotes) {
      row.push(value.trim());
      value = '';
      continue;
    }

    if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && next === '\n') i++;
      row.push(value.trim());
      if (row.some(cell => cell.length)) rows.push(row);
      row = [];
      value = '';
      continue;
    }

    value += char;
  }

  row.push(value.trim());
  if (row.some(cell => cell.length)) rows.push(row);
  return rows;
}

function findCsvValue(row, headers, candidates) {
  const normalizedHeaders = headers.map(header => header.toLowerCase());
  const index = normalizedHeaders.findIndex(header =>
    candidates.some(candidate => header.includes(candidate))
  );
  return index >= 0 ? row[index] : '';
}

function parseCsvContacts(text) {
  const rows = parseCsvRows(text);
  if (rows.length < 2) return [];

  const headers = rows[0];
  return rows.slice(1).map((row, index) => {
    const firstName = findCsvValue(row, headers, ['first name', 'given name']);
    const lastName = findCsvValue(row, headers, ['last name', 'family name', 'surname']);
    const displayName = findCsvValue(row, headers, ['display name', 'full name', 'name']);
    const email = findCsvValue(row, headers, ['e-mail', 'email']);
    const phone = findCsvValue(row, headers, ['phone', 'mobile', 'telephone']);
    const name = displayName || [firstName, lastName].filter(Boolean).join(' ');

    if (!name && !email && !phone) return null;

    return {
      id: `import-${Date.now()}-${index}`,
      name: name || email || phone || 'Unnamed Contact',
      email,
      phone,
      color: getImportedContactColor(index),
      source: importState.source,
    };
  }).filter(Boolean);
}

function unfoldVcardLines(text) {
  return text.replace(/\r\n[ \t]/g, '').replace(/\n[ \t]/g, '').split(/\r?\n/);
}

function decodeVcardValue(value) {
  return String(value || '')
    .replace(/\\n/gi, ' ')
    .replace(/\\,/g, ',')
    .replace(/\\;/g, ';')
    .trim();
}

function parseVcardContacts(text) {
  const cards = text.split(/BEGIN:VCARD/i).slice(1);

  return cards.map((card, index) => {
    const lines = unfoldVcardLines(card);
    const fields = {};

    lines.forEach(line => {
      const separatorIndex = line.indexOf(':');
      if (separatorIndex < 0) return;
      const rawKey = line.slice(0, separatorIndex).split(';')[0].toUpperCase();
      const rawValue = decodeVcardValue(line.slice(separatorIndex + 1));
      if (!rawValue || fields[rawKey]) return;
      fields[rawKey] = rawValue;
    });

    const nameParts = fields.N
      ? fields.N.split(';').filter(Boolean).join(' ')
      : '';
    const name = fields.FN || nameParts || fields.EMAIL || fields.TEL || 'Unnamed Contact';

    return {
      id: `import-${Date.now()}-${index}`,
      name,
      email: fields.EMAIL || '',
      phone: fields.TEL || '',
      color: getImportedContactColor(index),
      source: importState.source,
    };
  }).filter(contact => contact.name || contact.email || contact.phone);
}

function parseImportedContacts(text, fileName) {
  const lowerFileName = fileName.toLowerCase();
  if (lowerFileName.endsWith('.vcf') || text.includes('BEGIN:VCARD')) {
    return parseVcardContacts(text);
  }
  return parseCsvContacts(text);
}

function canUseContactsPicker() {
  return Boolean(navigator.contacts?.select);
}

async function importFromDeviceContacts() {
  if (!canUseContactsPicker()) {
    renderCloudImportStatus('Device contact picking is not available in this browser.');
    return;
  }

  try {
    const pickedContacts = await navigator.contacts.select(['name', 'email', 'tel'], { multiple: true });
    const contacts = pickedContacts.map((contact, index) => {
      const name = Array.isArray(contact.name) ? contact.name[0] : contact.name;
      const email = Array.isArray(contact.email) ? contact.email[0] : contact.email;
      const phone = Array.isArray(contact.tel) ? contact.tel[0] : contact.tel;

      return {
        id: `device-${Date.now()}-${index}`,
        name: name || email || phone || 'Unnamed Contact',
        email: email || '',
        phone: phone || '',
        color: getImportedContactColor(index),
        source: 'Device Contacts',
      };
    }).filter(contact => contact.name || contact.email || contact.phone);

    importState.source = 'Device Contacts';
    importState.contacts = contacts;
    importState.selectedIds = new Set(contacts.map(contact => contact.id));
    importState.status = contacts.length
      ? `Found ${contacts.length} device contact${contacts.length === 1 ? '' : 's'}.`
      : 'No contacts were selected.';
    renderImportCloud();
  } catch (error) {
    if (error?.name !== 'AbortError') {
      renderCloudImportStatus('Unable to open device contacts from this browser.');
    }
  }
}

function renderCloudImportStatus(message) {
  importState.status = message;
  const status = document.getElementById('cloud-import-status');
  if (status) status.textContent = message;
}

function contactExists(importedContact) {
  const email = normalizeContactToken(importedContact.email);
  const phone = normalizePhoneToken(importedContact.phone);

  return CONTACTS.some(contact => {
    const contactEmail = normalizeContactToken(contact.email);
    const contactPhone = normalizePhoneToken(contact.phone);
    return (email && email === contactEmail) || (phone && phone === contactPhone);
  });
}

function importSelectedCloudContacts() {
  const selectedContacts = importState.contacts.filter(contact => importState.selectedIds.has(contact.id));
  let addedCount = 0;
  let skippedCount = 0;
  let nextId = getNextContactId();

  selectedContacts.forEach((contact, index) => {
    if (contactExists(contact)) {
      skippedCount++;
      return;
    }

    CONTACTS.push({
      id: nextId++,
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      color: contact.color || getImportedContactColor(index),
    });
    addedCount++;
  });

  if (addedCount) saveAppData();
  importState.contacts = [];
  importState.selectedIds = new Set();
  renderImportCloud();
  renderCloudImportStatus(`Imported ${addedCount} contact${addedCount === 1 ? '' : 's'}${skippedCount ? `, skipped ${skippedCount} duplicate${skippedCount === 1 ? '' : 's'}` : ''}.`);
}

function renderImportPreview() {
  if (!importState.contacts.length) {
    return `
      <div class="cloud-import-empty">
        <div class="cloud-import-empty__title">No contacts selected yet</div>
        <div class="cloud-import-empty__text">Upload an exported .vcf or .csv file from iCloud, Google Contacts, or Outlook to preview contacts here.</div>
      </div>
    `;
  }

  const allSelected = importState.contacts.length > 0 &&
    importState.selectedIds.size === importState.contacts.length;
  const previewItems = importState.contacts.map(contact => `
    <button class="cloud-import-preview__item${importState.selectedIds.has(contact.id) ? ' cloud-import-preview__item--selected' : ''}" type="button" data-import-id="${escapeAttr(contact.id)}">
      <span class="cloud-import-preview__avatar" style="background:${escapeAttr(contact.color)}">${escapeHTML(getAvatarFallbackText(contact))}</span>
      <span class="cloud-import-preview__meta">
        <span class="cloud-import-preview__name">${escapeHTML(contact.name)}</span>
        <span class="cloud-import-preview__detail">${escapeHTML(contact.email || contact.phone || contact.source)}</span>
      </span>
      <span class="cloud-import-preview__check">${importState.selectedIds.has(contact.id) ? '✓' : ''}</span>
    </button>
  `).join('');

  return `
    <div class="cloud-import-preview">
      <div class="cloud-import-preview__header">
        <h2 class="cloud-import-section__title">Preview</h2>
        <button class="cloud-import-link-btn" id="cloud-import-toggle-all" type="button">${allSelected ? 'Deselect all' : 'Select all'}</button>
      </div>
      <div class="cloud-import-preview__list">${previewItems}</div>
    </div>
  `;
}

function renderImportCloud() {
  const content = document.getElementById('cloud-import-content');
  if (!content) return;
  const contactsPickerAvailable = canUseContactsPicker();

  const platformCards = [
    {
      id: 'icloud',
      name: 'iCloud',
      detail: 'Upload a vCard export from iCloud Contacts.',
      badge: 'VCF',
    },
    {
      id: 'google',
      name: 'Google Contacts',
      detail: 'Upload a Google Contacts CSV or vCard export.',
      badge: 'CSV',
    },
    {
      id: 'outlook',
      name: 'Outlook',
      detail: 'Upload an Outlook contacts CSV export.',
      badge: 'CSV',
    },
  ];

  content.innerHTML = `
    <input class="visually-hidden" id="cloud-import-file" type="file" accept=".vcf,.csv,text/vcard,text/csv" />

    <section class="cloud-import-card cloud-import-card--intro">
      <h2 class="cloud-import-title">Bring in contacts from your cloud address books.</h2>
      <p class="cloud-import-copy">This web build can import exported files now. Direct account sync with iCloud, Google, or Outlook needs OAuth app credentials and a backend token exchange before we can safely connect accounts.</p>
    </section>

    <button class="cloud-import-device${contactsPickerAvailable ? '' : ' cloud-import-device--disabled'}" id="cloud-import-device-btn" type="button" ${contactsPickerAvailable ? '' : 'disabled'}>
      <span class="cloud-import-device__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="8" r="3.5" stroke="currentColor" stroke-width="1.8"/>
          <path d="M5.5 19c.8-3.2 3.2-5 6.5-5s5.7 1.8 6.5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
        </svg>
      </span>
      <span class="cloud-import-device__copy">
        <span class="cloud-import-device__title">Import from this device</span>
        <span class="cloud-import-device__detail">${contactsPickerAvailable ? 'Pick contacts from the browser contact picker.' : 'Device contact picker is not supported in this browser.'}</span>
      </span>
    </button>

    <section class="cloud-import-platforms" aria-label="Cloud contact platforms">
      ${platformCards.map(platform => `
        <button class="cloud-import-platform${importState.source === platform.name ? ' cloud-import-platform--active' : ''}" type="button" data-platform="${escapeAttr(platform.name)}">
          <span class="cloud-import-platform__badge">${platform.badge}</span>
          <span class="cloud-import-platform__copy">
            <span class="cloud-import-platform__name">${platform.name}</span>
            <span class="cloud-import-platform__detail">${platform.detail}</span>
          </span>
        </button>
      `).join('')}
    </section>

    <button class="cloud-import-upload" id="cloud-import-upload-btn" type="button">
      <span class="cloud-import-upload__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M12 16V5M7.5 9.5 12 5l4.5 4.5" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M5 17.5v1.2A2.3 2.3 0 0 0 7.3 21h9.4a2.3 2.3 0 0 0 2.3-2.3v-1.2" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/>
        </svg>
      </span>
      Upload ${escapeHTML(importState.source)} export
    </button>

    ${renderImportPreview()}

    <div class="cloud-import-actions">
      <button class="cloud-import-action" id="cloud-import-clear-btn" type="button" ${importState.contacts.length ? '' : 'disabled'}>Clear</button>
      <button class="cloud-import-action cloud-import-action--primary" id="cloud-import-confirm-btn" type="button" ${importState.selectedIds.size ? '' : 'disabled'}>Import Selected</button>
    </div>

    <p class="cloud-import-status" id="cloud-import-status" role="status" aria-live="polite">${escapeHTML(importState.status)}</p>
  `;

  bindImportCloudEvents();
}

function bindImportCloudEvents() {
  const fileInput = document.getElementById('cloud-import-file');
  const uploadButton = document.getElementById('cloud-import-upload-btn');
  const clearButton = document.getElementById('cloud-import-clear-btn');
  const confirmButton = document.getElementById('cloud-import-confirm-btn');
  const toggleAllButton = document.getElementById('cloud-import-toggle-all');
  const deviceButton = document.getElementById('cloud-import-device-btn');
  const previewList = document.querySelector('.cloud-import-preview__list');

  document.querySelectorAll('.cloud-import-platform').forEach(button => {
    button.addEventListener('click', () => {
      importState.source = button.dataset.platform || importState.source;
      renderImportCloud();
    });
  });

  uploadButton?.addEventListener('click', () => fileInput?.click());
  deviceButton?.addEventListener('click', importFromDeviceContacts);

  fileInput?.addEventListener('change', async event => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const contacts = parseImportedContacts(text, file.name);
      importState.contacts = contacts;
      importState.selectedIds = new Set(contacts.map(contact => contact.id));
      importState.status = contacts.length
        ? `Found ${contacts.length} contact${contacts.length === 1 ? '' : 's'} in ${file.name}.`
        : `No contacts found in ${file.name}.`;
      renderImportCloud();
    } catch (_error) {
      renderCloudImportStatus('Unable to read that file. Try a CSV or vCard export.');
    }
  });

  previewList?.addEventListener('click', event => {
    const item = event.target.closest('.cloud-import-preview__item');
    if (!item) return;
    const importId = item.dataset.importId;
    if (importState.selectedIds.has(importId)) {
      importState.selectedIds.delete(importId);
    } else {
      importState.selectedIds.add(importId);
    }
    renderImportCloud();
  });

  toggleAllButton?.addEventListener('click', () => {
    const allSelected = importState.selectedIds.size === importState.contacts.length;
    importState.selectedIds = allSelected
      ? new Set()
      : new Set(importState.contacts.map(contact => contact.id));
    renderImportCloud();
  });

  clearButton?.addEventListener('click', () => {
    importState.contacts = [];
    importState.selectedIds = new Set();
    importState.status = 'Import cleared. Choose a platform to upload another export.';
    renderImportCloud();
  });

  confirmButton?.addEventListener('click', importSelectedCloudContacts);
}


/* ============================================================
   RENDER — Individual Contact Detail page
   ============================================================ */
function renderContactDetail(contactId) {
  const contact = getContact(contactId);
  if (!contact) return;

  document.getElementById('contact-detail-title').textContent = contact.name;
  const content = document.getElementById('contact-detail-content');

  // Which bubbles is this contact in?
  const contactBubbles = getContactBubbleLabels(contact.id);

  // Contact information rows
  const contactRows = [
    contact.email    && { icon: 'email',    text: contact.email },
    contact.phone    && { icon: 'phone',    text: contact.phone },
    contact.company  && { icon: 'work',     text: contact.company },
    contact.title    && { icon: 'work',     text: contact.title },
    contact.birthday && { icon: 'birthday', text: contact.birthday },
  ].filter(Boolean);

  const socialRows = getSocialLinkRows(contact);

  // Notes section — only rendered when the contact has notes
  let notesHTML = '';
  if (contact.notes && contact.notes.length > 0) {
    const noteEntries = contact.notes.map(note => `
      <div class="note-entry">
        <div class="note-entry__icon">${ICONS.note}</div>
        <div class="note-entry__body">
          <div class="note-entry__date">${escapeHTML(note.date)}</div>
          <div class="note-entry__text">${escapeHTML(note.text)}</div>
          ${note.image ? `<img class="note-entry__image" src="${escapeAttr(note.image)}" alt="${escapeAttr(note.imageName || 'Uploaded contact photo')}">` : ''}
        </div>
      </div>
    `).join('');

    notesHTML = `
      <div class="info-card">
        <div class="info-card__title">Notes</div>
        ${noteEntries}
        <button class="note-add-btn">+ New Note</button>
      </div>
    `;
  }

  content.innerHTML = `
    <!-- Profile photo (avatar with initials) -->
    <div class="profile-avatar" style="background: ${contact.color}">
      ${buildAvatarContents(contact)}
    </div>

    <!-- Bubbles this contact shares with the user -->
    ${buildBubbleTags(contactBubbles)}

    <!-- Contact information card -->
    ${buildInfoCard('Contact Information', contactRows)}

    <!-- Social links card (hidden if none) -->
    ${socialRows.length ? buildInfoCard('Social Links', socialRows) : ''}

    <!-- Notes card (hidden if none) -->
    ${notesHTML}

    <!-- Action buttons -->
    <div class="profile-actions">
      <button class="profile-action-btn profile-action-btn--primary" type="button" data-action="edit-contact" data-contact-id="${contact.id}">Edit Contact</button>
      <button class="profile-action-btn" type="button">Share Contact</button>
      <button class="profile-action-btn profile-action-btn--danger" type="button" data-action="delete-contact" data-contact-id="${contact.id}">Delete Contact</button>
    </div>
  `;
  bindCreateBubblePill(content, contact.id);
}


/* ============================================================
   RENDER — Bubble Chart (home view)
   ============================================================ */
function renderBubbleChart() {
  const chart = document.getElementById('bubble-chart');
  // Keep the bg-glow, clear everything else
  const glow = chart.querySelector('.bg-glow');
  chart.innerHTML = '';
  chart.appendChild(glow);

  const chartW = chart.clientWidth;
  const chartH = chart.clientHeight;
  const newBubbleTrigger = makeNewBubbleTrigger();
  const topLevelLayout = layoutTopLevelBubbles(chartW, chartH, 22, 12, [newBubbleTrigger]);
  const renderPlan = [];

  BUBBLES.forEach(bubble => {
    if (bubble.parentId) return;

    const laidOutBubble = topLevelLayout.get(bubble.id) || bubble;
    const nestedBubbles = (bubble.subBubbleIds || [])
      .map(getBubble)
      .filter(Boolean);
    const laidOutNested = layoutNestedBubbles(laidOutBubble, nestedBubbles, chartW, chartH);
    renderPlan.push({ bubble: laidOutBubble, nested: laidOutNested });
  });

  renderPlan.forEach(({ nested }) => {
    nested.forEach(bubble => {
      renderBubble(chart, bubble, chartW, chartH, 1, {
        showAvatars: true,
        avatarsInteractive: false,
        exclusionCircles: getNestedBubbleExclusions(bubble, chartW, chartH),
        bubbleRole: 'sub-bubble',
      });
    });
  });

  renderPlan.forEach(({ bubble, nested }) => {
    renderBubble(chart, bubble, chartW, chartH, 1, {
      showAvatars: true,
      avatarsInteractive: false,
      exclusionCircles: getNestedBubbleExclusions(bubble, chartW, chartH, nested),
      bubbleRole: 'home-bubble',
    });
  });

  const laidOutTrigger = topLevelLayout.get(NEW_BUBBLE_TRIGGER_ID) || newBubbleTrigger;
  const triggerEl = renderBubble(chart, laidOutTrigger, chartW, chartH, 1, {
    showLabel: false,
    showAvatars: false,
    bubbleRole: 'new-bubble-trigger',
  });
  triggerEl.classList.add('bubble--new-trigger');
  triggerEl.setAttribute('role', 'button');
  triggerEl.setAttribute('aria-label', 'Create new bubble');
  triggerEl.tabIndex = 0;
  triggerEl.innerHTML = `
    <svg class="bubble__plus-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
    </svg>
  `;
  triggerEl.addEventListener('click', event => {
    if (currentView !== 'bubbles' || Date.now() < suppressClicksUntil) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    openCreateBubbleSheet();
  });
  triggerEl.addEventListener('keydown', event => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    openCreateBubbleSheet();
  });

  chart.querySelectorAll('.bubble:not(.bubble--sub):not(.bubble--new-trigger)').forEach(el => {
    el.addEventListener('click', event => {
      if (currentView !== 'bubbles' || Date.now() < suppressClicksUntil) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      onBubbleClick(el.dataset.id);
    });
  });
  bindHomeBubbleDraggables(chart);
}


/* ============================================================
   RENDER — Bubble Detail (drill-down view)
   ============================================================ */
function renderBubbleDetail(bubbleId) {
  const bubble = getBubble(bubbleId);
  if (!bubble) return;

  document.getElementById('detail-title').textContent = bubble.label.replace(/\n/g, ' ') + ' Bubble';

  const chart = document.getElementById('bubble-detail-chart');
  const glow  = chart.querySelector('.bg-glow');
  chart.innerHTML = '';
  chart.appendChild(glow);

  const chartW = chart.clientWidth;
  const chartH = chart.clientHeight;

  // Scale the selected bubble to fill most of the chart
  const mainSize = Math.min(chartW, chartH) * 0.88;
  const mainX    = (chartW - mainSize) / 2;
  const mainY    = (chartH - mainSize) / 2;

  const scaledBubble = {
    ...bubble,
    x: (mainX / chartW) * 100,
    y: (mainY / chartH) * 100,
    size: (mainSize / chartW) * 100,
    // A drilled-into sub-bubble becomes the root preview bubble in detail view.
    // Clearing parentId prevents it from inheriting sub-bubble stacking styles.
    parentId: null,
    // In the detail view don't recurse into sub-bubbles' contacts —
    // render all contacts directly in the main bubble
  };
  const positionedSubBubbles = [];

  // Render sub-bubbles if any
  if (bubble.subBubbleIds) {
    const rawSubBubbles = bubble.subBubbleIds
      .map(subId => getBubble(subId))
      .filter(Boolean)
      .map((sub, index) => {
        const subSize = mainSize * 0.42;
        const ringRadius = mainSize * 0.2;
        const angle = (Math.PI * 0.78) + index * 0.8;
        const subCx = mainX + (mainSize / 2) + Math.cos(angle) * ringRadius;
        const subCy = mainY + (mainSize / 2) + Math.sin(angle) * ringRadius;

        return {
          ...sub,
          x: ((subCx - subSize / 2) / chartW) * 100,
          y: ((subCy - subSize / 2) / chartH) * 100,
          size: (subSize / chartW) * 100,
        };
      });

    positionedSubBubbles.push(...layoutNestedBubbles(scaledBubble, rawSubBubbles, chartW, chartH));
  }

  // Render the outer bubble first so it sits at the back of the stacking context
  renderBubble(chart, scaledBubble, chartW, chartH, 1.4, {
    showLabel: false,
    reserveLabelSpace: false,
    exclusionCircles: getNestedBubbleExclusions(scaledBubble, chartW, chartH, positionedSubBubbles),
    avatarBubbleId: bubble.id,
    bubbleRole: 'detail-root',
  });

  // Render sub-bubbles on top — avatars are non-interactive so the whole
  // bubble circle is the tap target for drilling into the sub-bubble
  positionedSubBubbles.forEach(scaledSub => {
    renderBubble(chart, scaledSub, chartW, chartH, 1.1, {
      avatarsInteractive: false,
      avatarBubbleId: scaledSub.id,
      bubbleRole: 'detail-sub',
    });
  });

  chart.querySelectorAll('.bubble--sub').forEach(el => {
    el.addEventListener('click', event => {
      if (currentView !== 'detail' || Date.now() < suppressClicksUntil) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      onBubbleClick(el.dataset.id);
    });
  });

  chart.querySelectorAll('.avatar').forEach(el => {
    el.addEventListener('click', event => {
      if (currentView !== 'detail' || Date.now() < suppressClicksUntil || el.disabled) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      if (!pointIsInsideElementCircle(el, event.clientX, event.clientY)) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      goToContactDetail(parseInt(el.dataset.contactId, 10));
    });
  });

  applyDetailAvatarOcclusion(chart);
  bindDetailDraggables(chart);
}


/* ============================================================
   RENDER — Contacts List
   ============================================================ */
function renderContactsList() {
  const list = document.getElementById('contacts-list');
  list.innerHTML = '';

  const contacts = CONTACTS
    .map((contact, index) => ({
      contact,
      index,
      filterMatches: contactMatchesBubbleFilters(contact.id)
    }))
    .sort((a, b) => {
      if (b.filterMatches !== a.filterMatches) {
        return b.filterMatches - a.filterMatches;
      }
      return a.index - b.index;
    });

  contacts.forEach(({ contact, filterMatches }) => {
    const card = document.createElement('div');
    card.className = 'contact-card';
    if (filterMatches > 0) card.classList.add('contact-card--bubble-match');
    card.dataset.contactId = contact.id;  // used by the click handler below
    card.innerHTML = `
      <div class="contact-card__avatar" style="background:${contact.color}">
        ${buildAvatarContents(contact)}
      </div>
      <div class="contact-card__info">
        <div class="contact-card__name">${escapeHTML(contact.name)}</div>
        <div class="contact-card__row">
          <svg class="contact-card__row-icon" viewBox="0 0 24 24" fill="none">
            <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" stroke-width="1.8"/>
            <path d="M2 8l10 6 10-6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
          </svg>
          <span class="contact-card__row-text">${escapeHTML(contact.email || '')}</span>
        </div>
        <div class="contact-card__row">
          <svg class="contact-card__row-icon" viewBox="0 0 24 24" fill="none">
            <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C9.6 21 3 14.4 3 6c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="contact-card__row-text">${escapeHTML(contact.phone || '')}</span>
        </div>
        ${buildContactBubbleTags(contact.id)}
      </div>
    `;
    list.appendChild(card);
  });
}


/* ============================================================
   VIEW SWITCHING
   ============================================================ */
function showView(viewId) {
  closeSearchControl();
  document.querySelectorAll('.view').forEach(v => {
    v.classList.remove('view--active');
  });
  const target = document.getElementById(viewId);
  if (target) target.classList.add('view--active');
  currentView = viewId.replace('view-', '');
  updateBottomNavState();
}

function setModeToggle(mode) {
  document.querySelectorAll('.mode-toggle__btn').forEach(btn => {
    btn.classList.toggle('mode-toggle__btn--active', btn.dataset.mode === mode);
  });
}

function updateBottomNavState() {
  const activeNav = currentView === 'profile'
    ? 'profile'
    : currentView === 'add-contact' || currentView === 'upload-photo' || currentView === 'manual-entry' || currentView === 'paste-text' || currentView === 'import-cloud' || currentView === 'bubble-tap'
      ? 'add-contact'
      : 'bubbles';

  document.querySelectorAll('.bottom-nav__btn[data-nav]').forEach(btn => {
    const isActive = btn.dataset.nav === activeNav;
    btn.classList.toggle('bottom-nav__btn--active', isActive);
    btn.style.opacity = isActive ? '1' : '0.68';
    btn.style.color = isActive ? 'var(--text)' : 'var(--text-muted)';
    btn.style.transform = isActive ? 'translateY(-1px)' : 'none';
  });
}

function getActiveViewElement() {
  return document.querySelector('.view.view--active');
}

function goToBubbles() {
  bubbleNavStack = [];
  setModeToggle('bubble');
  showView('view-bubbles');
  document.getElementById('bubbles-title').textContent = 'Your Bubbles';
  renderBubbleChart();
}

function goToContacts() {
  setModeToggle('contact');
  showView('view-contacts');
  renderContactsList();
}

function goToAddContact() {
  showView('view-add-contact');
}

function goToUploadPhoto() {
  previousView = currentView;
  showView('view-upload-photo');
  renderUploadPhoto();
}

function goToManualEntry(options = {}) {
  const { mode = 'create', contactId = null } = options;
  const contact = contactId ? getContact(contactId) : null;
  manualEntryState.mode = mode;
  manualEntryState.contactId = contactId;
  manualEntryState.returnPreviousView = mode === 'edit' ? previousView : 'add-contact';
  manualEntryState.photoSrc = mode === 'edit' ? (contact?.image || '') : '';
  manualEntryState.status = '';
  previousView = currentView;
  showView('view-manual-entry');
  renderManualEntry();
}

function goToManualEntryContactDetail(contactId) {
  activeContactId = contactId;
  previousView = manualEntryState.mode === 'edit'
    ? manualEntryState.returnPreviousView
    : 'add-contact';
  showView('view-contact-detail');
  renderContactDetail(contactId);
}

function goToPasteText() {
  previousView = currentView;
  showView('view-paste-text');
  renderPasteText();
}

function goToImportCloud() {
  previousView = currentView;
  showView('view-import-cloud');
  renderImportCloud();
}

function goToBubbleTap() {
  previousView = currentView;
  showView('view-bubble-tap');
  renderBubbleTap();
}

function goToDetail(bubbleId) {
  if (currentView === 'detail') {
    // Drilling into a sub-bubble — remember where we came from
    bubbleNavStack.push(activeBubble);
  } else {
    // Arriving from bubbles/contacts — start a fresh stack
    bubbleNavStack = [];
  }
  activeBubble = bubbleId;
  showView('view-detail');
  renderBubbleDetail(bubbleId);
}

function goToProfile() {
  previousView = currentView;   // remember where we came from
  showView('view-profile');
  renderUserProfile();
}

function goToContactDetail(contactId) {
  previousView    = currentView; // remember where we came from
  activeContactId = contactId;
  showView('view-contact-detail');
  renderContactDetail(contactId);
}

/** Go back to whatever view was active before opening a profile/contact page */
function goBack() {
  if (previousView === 'contacts')       goToContacts();
  else if (previousView === 'detail')    goToDetail(activeBubble);
  else if (previousView === 'upload-photo') goToUploadPhoto();
  else if (previousView === 'manual-entry') goToManualEntry({
    mode: manualEntryState.mode,
    contactId: manualEntryState.contactId,
  });
  else if (previousView === 'paste-text') goToPasteText();
  else if (previousView === 'import-cloud') goToImportCloud();
  else if (previousView === 'bubble-tap') goToBubbleTap();
  else if (previousView === 'add-contact') goToAddContact();
  else                                   goToBubbles();
}

function renderSelectionSheet() {
  ensureInteractionShell();
  bindSelectionSheetEvents();
  const sheet = document.getElementById('selection-sheet');
  const list = document.getElementById('selection-sheet-list');
  const title = document.getElementById('selection-sheet-title');
  const nameInput = document.getElementById('selection-sheet-name');
  const searchInput = document.getElementById('selection-sheet-search');
  if (!sheet || !list || !title || !nameInput || !searchInput) return;

  const parent = getBubble(selectionState.parentBubbleId);
  const newBubble = selectionState.mode === 'create'
    ? selectionState.draftBubble
    : getBubble(selectionState.newBubbleId);
  if (!selectionState.open || !newBubble || (selectionState.mode !== 'create' && !parent)) {
    sheet.classList.remove('selection-sheet--open');
    sheet.setAttribute('aria-hidden', 'true');
    list.innerHTML = '';
    nameInput.value = '';
    searchInput.value = '';
    return;
  }

  const displayLabel = newBubble.label.replace(/\n/g, ' ');
  title.textContent = selectionState.mode === 'create'
    ? 'Create New Bubble'
    : `Edit ${displayLabel}`;
  if (nameInput.value !== displayLabel) {
    nameInput.value = displayLabel;
  }
  if (searchInput.value !== selectionState.query) {
    searchInput.value = selectionState.query;
  }

  const parentContactIds = new Set(parent?.contactIds || []);
  const bubbleContactIds = new Set(newBubble.contactIds);
  const normalizedQuery = selectionState.query.trim().toLowerCase();
  const options = CONTACTS
    .filter(contact => !bubbleContactIds.has(contact.id))
    .filter(contact => !normalizedQuery || contact.name.toLowerCase().includes(normalizedQuery) || contact.email.toLowerCase().includes(normalizedQuery))
    .map(contact => `
      <button class="selection-sheet__option${selectionState.selectedIds.has(contact.id) ? ' selection-sheet__option--selected' : ''}" type="button" data-contact-id="${contact.id}">
        <span class="selection-sheet__avatar" style="background:${contact.color}">${buildAvatarContents(contact)}</span>
        <span class="selection-sheet__meta">
          <span class="selection-sheet__name">${contact.name}</span>
          <span class="selection-sheet__source">${selectionState.mode === 'create' || !parentContactIds.has(contact.id) ? 'From all contacts' : 'From this bubble'}</span>
        </span>
        <span class="selection-sheet__check">${selectionState.selectedIds.has(contact.id) ? '✓' : ''}</span>
      </button>
    `)
    .join('');

  list.innerHTML = options || '<div class="add-users-empty-state">No matching contacts found.</div>';
  sheet.classList.add('selection-sheet--open');
  sheet.setAttribute('aria-hidden', 'false');
}

function openSelectionSheet(parentBubbleId, newBubbleId) {
  selectionState.open = true;
  selectionState.mode = 'merge';
  selectionState.parentBubbleId = parentBubbleId;
  selectionState.newBubbleId = newBubbleId;
  selectionState.draftBubble = null;
  selectionState.selectedIds = new Set();
  selectionState.query = '';
  renderSelectionSheet();
}

function openCreateBubbleSheet(options = {}) {
  const { preselectedContactIds = [] } = options;
  selectionState.open = true;
  selectionState.mode = 'create';
  selectionState.parentBubbleId = null;
  selectionState.newBubbleId = null;
  selectionState.draftBubble = createDraftTopLevelBubble();
  selectionState.selectedIds = new Set(preselectedContactIds);
  selectionState.query = '';
  renderSelectionSheet();
}

function closeSelectionSheet() {
  selectionState.open = false;
  selectionState.mode = 'merge';
  selectionState.parentBubbleId = null;
  selectionState.newBubbleId = null;
  selectionState.draftBubble = null;
  selectionState.selectedIds = new Set();
  selectionState.query = '';
  renderSelectionSheet();
}

function commitSelectionSheet() {
  if (selectionState.mode === 'create' && selectionState.draftBubble) {
    const newBubble = selectionState.draftBubble;
    selectionState.selectedIds.forEach(contactId => {
      if (!newBubble.contactIds.includes(contactId)) {
        newBubble.contactIds.push(contactId);
      }
    });
    BUBBLES.push(newBubble);
  } else {
    const parent = getBubble(selectionState.parentBubbleId);
    const newBubble = getBubble(selectionState.newBubbleId);
    if (parent && newBubble) {
      selectionState.selectedIds.forEach(contactId => {
        if (parent.contactIds.includes(contactId)) {
          moveContactToBubble(contactId, parent.id, newBubble.id);
        } else if (!newBubble.contactIds.includes(contactId)) {
          newBubble.contactIds.push(contactId);
        }
      });
    }
  }
  saveAppData();
  closeSelectionSheet();
  refreshCurrentView();
}

function bindSelectionSheetEvents() {
  const selectionSheetList = document.getElementById('selection-sheet-list');
  const selectionSheetBackdrop = document.getElementById('selection-sheet-backdrop');
  const selectionSheetCancel = document.getElementById('selection-sheet-cancel');
  const selectionSheetConfirm = document.getElementById('selection-sheet-confirm');
  const selectionSheetName = document.getElementById('selection-sheet-name');
  const selectionSheetSearch = document.getElementById('selection-sheet-search');

  if (selectionSheetList && !selectionSheetList.dataset.bound) {
    selectionSheetList.dataset.bound = 'true';
    selectionSheetList.addEventListener('click', event => {
      const option = event.target.closest('.selection-sheet__option');
      if (!option) return;
      const contactId = parseInt(option.dataset.contactId, 10);
      if (!contactId) return;

      if (selectionState.selectedIds.has(contactId)) {
        selectionState.selectedIds.delete(contactId);
      } else {
        selectionState.selectedIds.add(contactId);
      }
      renderSelectionSheet();
    });
  }

  if (selectionSheetBackdrop && !selectionSheetBackdrop.dataset.bound) {
    selectionSheetBackdrop.dataset.bound = 'true';
    selectionSheetBackdrop.addEventListener('click', closeSelectionSheet);
  }

  if (selectionSheetCancel && !selectionSheetCancel.dataset.bound) {
    selectionSheetCancel.dataset.bound = 'true';
    selectionSheetCancel.addEventListener('click', closeSelectionSheet);
  }

  if (selectionSheetConfirm && !selectionSheetConfirm.dataset.bound) {
    selectionSheetConfirm.dataset.bound = 'true';
    selectionSheetConfirm.addEventListener('click', commitSelectionSheet);
  }

  if (selectionSheetName && !selectionSheetName.dataset.bound) {
    selectionSheetName.dataset.bound = 'true';
    selectionSheetName.addEventListener('input', event => {
      const bubble = selectionState.mode === 'create'
        ? selectionState.draftBubble
        : getBubble(selectionState.newBubbleId);
      if (!bubble) return;

      const rawValue = event.target.value.replace(/\s+/g, ' ').trim();
      bubble.label = rawValue || 'New Bubble';
      const title = document.getElementById('selection-sheet-title');
      if (title && selectionState.mode !== 'create') {
        title.textContent = `Edit ${bubble.label.replace(/\n/g, ' ')}`;
      }
    });
  }

  if (selectionSheetSearch && !selectionSheetSearch.dataset.bound) {
    selectionSheetSearch.dataset.bound = 'true';
    selectionSheetSearch.addEventListener('input', event => {
      selectionState.query = event.target.value;
      renderSelectionSheet();
    });
  }
}

function getDragLayerRefs() {
  ensureInteractionShell();
  return {
    layer: document.getElementById('drag-layer'),
    ghost: document.getElementById('drag-ghost'),
    trash: document.getElementById('trash-drop'),
  };
}

function getAppFrameRect() {
  const app = document.querySelector('.app');
  return app ? app.getBoundingClientRect() : { left: 0, top: 0 };
}

function getBubbleVisualElements(bubbleId) {
  const activeView = document.querySelector('.view--active') || document;
  return Array.from(activeView.querySelectorAll(`[data-bubble-id="${bubbleId}"]`));
}

function buildBubbleGhostMarkup(bubbleId) {
  const ghostElements = getBubbleVisualElements(bubbleId);
  if (!ghostElements.length) return null;

  const rects = ghostElements.map(el => ({ el, rect: el.getBoundingClientRect() }));
  const bounds = rects.reduce((acc, { rect }) => ({
    left: Math.min(acc.left, rect.left),
    top: Math.min(acc.top, rect.top),
    right: Math.max(acc.right, rect.right),
    bottom: Math.max(acc.bottom, rect.bottom),
  }), { left: Infinity, top: Infinity, right: -Infinity, bottom: -Infinity });

  const width = Math.max(1, bounds.right - bounds.left);
  const height = Math.max(1, bounds.bottom - bounds.top);

  const html = rects.map(({ el, rect }) => {
    const clone = el.cloneNode(true);
    clone.removeAttribute('id');
    clone.style.position = 'absolute';
    clone.style.left = `${rect.left - bounds.left}px`;
    clone.style.top = `${rect.top - bounds.top}px`;
    clone.style.margin = '0';
    clone.style.pointerEvents = 'none';
    clone.style.transform = 'none';
    return clone.outerHTML;
  }).join('');

  return {
    width,
    height,
    left: bounds.left,
    top: bounds.top,
    html,
  };
}

function setDragGhost(source) {
  const { ghost } = getDragLayerRefs();
  if (!ghost) return;

  ghost.className = 'drag-ghost';
  ghost.innerHTML = '';
  if (source.type === 'contact') {
    const contact = getContact(source.contactId);
    const sourceRect = dragState.sourceEl?.getBoundingClientRect();
    ghost.classList.add('drag-ghost--avatar');
    ghost.style.setProperty('--ghost-color', contact?.color || '#6883f9');
    ghost.style.width = `${source.size}px`;
    ghost.style.height = `${source.size}px`;
    ghost.dataset.offsetX = sourceRect ? Math.max(0, dragState.x - sourceRect.left) : source.size / 2;
    ghost.dataset.offsetY = sourceRect ? Math.max(0, dragState.y - sourceRect.top) : source.size / 2;
    if (contact) appendAvatarContents(ghost, contact);
  } else {
    const composite = buildBubbleGhostMarkup(source.bubbleId);
    if (composite) {
      ghost.classList.add('drag-ghost--bubble-group');
      ghost.style.width = `${composite.width}px`;
      ghost.style.height = `${composite.height}px`;
      ghost.dataset.offsetX = Math.max(0, dragState.x - composite.left);
      ghost.dataset.offsetY = Math.max(0, dragState.y - composite.top);
      ghost.innerHTML = composite.html;
    } else {
      const sourceRect = dragState.sourceEl?.getBoundingClientRect();
      ghost.classList.add('drag-ghost--bubble');
      ghost.style.width = `${source.size}px`;
      ghost.style.height = `${source.size}px`;
      ghost.dataset.offsetX = sourceRect ? Math.max(0, dragState.x - sourceRect.left) : source.size / 2;
      ghost.dataset.offsetY = sourceRect ? Math.max(0, dragState.y - sourceRect.top) : source.size / 2;
      ghost.textContent = '';
    }
  }
}

function positionDragGhost(x, y) {
  const { ghost } = getDragLayerRefs();
  if (!ghost) return;
  const appRect = getAppFrameRect();
  const offsetX = parseFloat(ghost.dataset.offsetX || '0');
  const offsetY = parseFloat(ghost.dataset.offsetY || '0');
  ghost.style.left = `${x - appRect.left - offsetX}px`;
  ghost.style.top = `${y - appRect.top - offsetY}px`;
}

function clearDropHighlights() {
  document.querySelectorAll('.bubble--drop-target, .avatar--drop-target, .trash-drop--active, .avatar--drag-source, .bubble--drag-source')
    .forEach(el => el.classList.remove('bubble--drop-target', 'avatar--drop-target', 'trash-drop--active', 'avatar--drag-source', 'bubble--drag-source'));
}

function resetDragState() {
  window.clearTimeout(dragState.longPressTimer);
  dragState.longPressTimer = null;
  if (dragState.sourceEl && dragState.pointerId != null) {
    try {
      if (dragState.sourceEl.hasPointerCapture?.(dragState.pointerId)) {
        dragState.sourceEl.releasePointerCapture(dragState.pointerId);
      }
    } catch (_error) {
      // Ignore capture cleanup failures.
    }
  }
  dragState.pointerId = null;
  dragState.pointerType = null;
  dragState.phase = 'idle';
  dragState.source = null;
  dragState.sourceEl = null;

  const { layer, ghost } = getDragLayerRefs();
  if (layer) layer.classList.remove('drag-layer--active');
  if (ghost) {
    ghost.className = 'drag-ghost';
    ghost.textContent = '';
    ghost.style.removeProperty('--ghost-color');
  }
  clearDropHighlights();
}

function startDrag(source, sourceEl) {
  dragState.phase = 'dragging';
  dragState.source = source;
  dragState.sourceEl = sourceEl;
  if (source.type === 'contact') {
    sourceEl.classList.add('avatar--drag-source');
  } else {
    getBubbleVisualElements(source.bubbleId).forEach(el => {
      el.classList.add(el.classList.contains('avatar') ? 'avatar--drag-source' : 'bubble--drag-source');
    });
  }

  const { layer } = getDragLayerRefs();
  if (layer) layer.classList.add('drag-layer--active');
  setDragGhost(source);
  positionDragGhost(dragState.x, dragState.y);
  suppressClicksUntil = Date.now() + 500;
}

function resolveContactDropTarget(x, y, source) {
  const elements = document.elementsFromPoint(x, y);
  const trash = elements.find(el => el.id === 'trash-drop');
  if (trash) {
    trash.classList.add('trash-drop--active');
    return { type: 'trash' };
  }

  const targetSubBubble = elements.find(el => el.classList?.contains('bubble--sub') && el.dataset.bubbleId);
  if (targetSubBubble && targetSubBubble.dataset.bubbleId !== source.bubbleId) {
    targetSubBubble.classList.add('bubble--drop-target');
    return { type: 'sub-bubble', bubbleId: targetSubBubble.dataset.bubbleId };
  }

  const targetAvatar = elements.find(el =>
    el.classList?.contains('avatar') &&
    el.dataset.contactId &&
    el.dataset.bubbleId === activeBubble &&
    el.dataset.contactId !== String(source.contactId)
  );

  if (targetAvatar) {
    targetAvatar.classList.add('avatar--drop-target');
    return {
      type: 'avatar',
      bubbleId: targetAvatar.dataset.bubbleId,
      contactId: parseInt(targetAvatar.dataset.contactId, 10),
    };
  }

  return null;
}

function resolveBubbleDropTarget(x, y, source) {
  const elements = document.elementsFromPoint(x, y);
  const trash = elements.find(el => el.id === 'trash-drop');
  if (trash) {
    trash.classList.add('trash-drop--active');
    return { type: 'trash' };
  }

  const targetBubble = elements.find(el =>
    el.classList?.contains('bubble') &&
    el.dataset.bubbleId &&
    el.dataset.bubbleId !== source.bubbleId
  );

  if (targetBubble) {
    targetBubble.classList.add('bubble--drop-target');
    return { type: 'bubble', bubbleId: targetBubble.dataset.bubbleId };
  }

  return null;
}

function updateDragFeedback() {
  if (dragState.phase !== 'dragging' || !dragState.source) return;
  clearDropHighlights();
  if (dragState.sourceEl) {
    dragState.sourceEl.classList.add(dragState.source.type === 'contact' ? 'avatar--drag-source' : 'bubble--drag-source');
  }

  positionDragGhost(dragState.x, dragState.y);

  if (dragState.source.type === 'contact') {
    resolveContactDropTarget(dragState.x, dragState.y, dragState.source);
  } else {
    resolveBubbleDropTarget(dragState.x, dragState.y, dragState.source);
  }
}

function finalizeDrag() {
  if (dragState.phase !== 'dragging' || !dragState.source) {
    resetDragState();
    return;
  }

  let changed = false;
  let selectionToOpen = null;
  const source = dragState.source;
  const target = source.type === 'contact'
    ? resolveContactDropTarget(dragState.x, dragState.y, source)
    : resolveBubbleDropTarget(dragState.x, dragState.y, source);

  if (source.type === 'contact') {
    if (target?.type === 'trash') {
      changed = removeContactFromBubble(source.contactId, source.bubbleId);
    } else if (target?.type === 'sub-bubble') {
      changed = moveContactToBubble(source.contactId, source.bubbleId, target.bubbleId);
    } else if (target?.type === 'avatar' && source.bubbleId === activeBubble) {
      const newBubble = createSubBubbleFromContacts(activeBubble, source.contactId, target.contactId);
      if (newBubble) {
        changed = true;
        selectionToOpen = { parentBubbleId: activeBubble, newBubbleId: newBubble.id };
      }
    }
  } else if (source.type === 'bubble') {
    if (target?.type === 'trash') {
      changed = removeBubbleCategory(source.bubbleId);
    } else if (target?.type === 'bubble') {
      changed = nestBubbleIntoBubble(source.bubbleId, target.bubbleId);
    }
  }

  resetDragState();

  if (changed) {
    saveAppData();
    refreshCurrentView();
    if (selectionToOpen) {
      openSelectionSheet(selectionToOpen.parentBubbleId, selectionToOpen.newBubbleId);
    }
  }
}

function onGlobalPointerMove(event) {
  if (dragState.pointerId !== event.pointerId) return;

  dragState.x = event.clientX;
  dragState.y = event.clientY;

  if (dragState.phase === 'pressing') {
    const moved = Math.hypot(event.clientX - dragState.startX, event.clientY - dragState.startY);
    const threshold = dragState.pointerType === 'touch' || dragState.pointerType === 'pen'
      ? TOUCH_DRAG_MOVE_THRESHOLD
      : DRAG_MOVE_THRESHOLD;

    if (moved > threshold) {
      window.clearTimeout(dragState.longPressTimer);
      dragState.longPressTimer = null;
      resetDragState();
    }
    return;
  }

  if (dragState.phase === 'dragging') {
    event.preventDefault();
    updateDragFeedback();
  }
}

function onGlobalPointerUp(event) {
  if (dragState.pointerId !== event.pointerId) return;
  finalizeDrag();
}

function onGlobalPointerCancel(event) {
  if (dragState.pointerId !== event.pointerId) return;
  resetDragState();
}

function scheduleLongPress(event, source, sourceEl) {
  if (selectionState.open) return;

  if (event.pointerType === 'touch' || event.pointerType === 'pen') {
    event.preventDefault();
  }

  resetDragState();
  try {
    sourceEl.setPointerCapture?.(event.pointerId);
  } catch (_error) {
    // Some elements/browsers may reject pointer capture here.
  }
  dragState.pointerId = event.pointerId;
  dragState.pointerType = event.pointerType;
  dragState.phase = 'pressing';
  dragState.startX = event.clientX;
  dragState.startY = event.clientY;
  dragState.x = event.clientX;
  dragState.y = event.clientY;
  dragState.longPressTimer = window.setTimeout(() => {
    startDrag(source, sourceEl);
  }, LONG_PRESS_MS);
}

function bindHomeBubbleDraggables(chart) {
  chart.querySelectorAll('.bubble:not(.bubble--sub):not(.bubble--new-trigger)').forEach(el => {
    if (el.dataset.dragBound) return;
    el.dataset.dragBound = 'true';
    el.addEventListener('contextmenu', event => event.preventDefault());
    el.addEventListener('pointerdown', event => {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      scheduleLongPress(event, {
        type: 'bubble',
        bubbleId: el.dataset.bubbleId,
        size: el.offsetWidth,
      }, el);
    });
    el.addEventListener('click', event => {
      if (Date.now() < suppressClicksUntil) {
        event.preventDefault();
        event.stopPropagation();
      }
    }, true);
  });
}

function bindDetailDraggables(chart) {
  chart.querySelectorAll('.avatar').forEach(el => {
    if (el.dataset.dragBound) return;
    el.dataset.dragBound = 'true';
    el.addEventListener('contextmenu', event => event.preventDefault());
    el.addEventListener('pointerdown', event => {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      scheduleLongPress(event, {
        type: 'contact',
        contactId: parseInt(el.dataset.contactId, 10),
        bubbleId: el.dataset.bubbleId,
        size: el.offsetWidth,
      }, el);
    });
    el.addEventListener('click', event => {
      if (Date.now() < suppressClicksUntil) {
        event.preventDefault();
        event.stopPropagation();
      }
    }, true);
  });

  chart.querySelectorAll('.bubble--sub').forEach(el => {
    if (el.dataset.dragBound) return;
    el.dataset.dragBound = 'true';
    el.addEventListener('contextmenu', event => event.preventDefault());
    el.addEventListener('pointerdown', event => {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      scheduleLongPress(event, {
        type: 'bubble',
        bubbleId: el.dataset.bubbleId,
        size: el.offsetWidth,
      }, el);
    });
    el.addEventListener('click', event => {
      if (Date.now() < suppressClicksUntil) {
        event.preventDefault();
        event.stopPropagation();
      }
    }, true);
  });
}


/* ============================================================
   EVENT HANDLERS
   ============================================================ */

function suppressFollowupClicks(duration = NAVIGATION_CLICK_GUARD_MS) {
  suppressClicksUntil = Math.max(suppressClicksUntil, Date.now() + duration);
}

/** Clicking a bubble on the home chart */
function onBubbleClick(bubbleId) {
  suppressFollowupClicks();
  goToDetail(bubbleId);
}

/** Mode toggle buttons (both views share this logic) */
function bindToggle(toggleEl) {
  toggleEl.querySelectorAll('.mode-toggle__btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = btn.dataset.mode;
      setModeToggle(mode);

      if (mode === 'bubble')  goToBubbles();
      if (mode === 'contact') goToContacts();
    });
  });
}

/** Back button in bubble-detail view */
document.getElementById('back-btn').addEventListener('click', () => {
  if (bubbleNavStack.length > 0) {
    const parentId = bubbleNavStack.pop();
    activeBubble = parentId;
    showView('view-detail');
    renderBubbleDetail(parentId);
  } else {
    goToBubbles();
  }
});

/** Back button on User Profile view */
document.getElementById('profile-back-btn').addEventListener('click', () => {
  goBack();
});

/** Back button on Contact Detail view */
document.getElementById('contact-detail-back-btn').addEventListener('click', () => {
  goBack();
});

/** Back button on Import from Cloud view */
document.getElementById('import-cloud-back-btn').addEventListener('click', () => {
  goToAddContact();
});

/** Back button on Manual Entry view */
document.getElementById('manual-entry-back-btn').addEventListener('click', () => {
  if (manualEntryState.mode === 'edit' && manualEntryState.contactId) {
    goToManualEntryContactDetail(manualEntryState.contactId);
    return;
  }
  goToAddContact();
});

/** Back button on Upload Photo view */
document.getElementById('upload-photo-back-btn').addEventListener('click', () => {
  goToAddContact();
});

/** Back button on Paste Text view */
document.getElementById('paste-text-back-btn').addEventListener('click', () => {
  goToAddContact();
});

/** Back button on Bubble Tap view */
document.getElementById('bubble-tap-back-btn').addEventListener('click', () => {
  goToAddContact();
});

bindSelectionSheetEvents();

document.addEventListener('click', event => {
  if (Date.now() >= suppressClicksUntil) return;
  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();
}, true);

document.addEventListener('click', event => {
  const importCloudButton = event.target.closest('[data-action="import-cloud"]');
  if (!importCloudButton) return;

  const activeView = getActiveViewElement();
  if (!activeView || !activeView.contains(importCloudButton)) return;

  event.preventDefault();
  event.stopPropagation();
  goToImportCloud();
});

document.addEventListener('click', event => {
  const uploadPhotoButton = event.target.closest('[data-action="upload-photo"]');
  if (!uploadPhotoButton) return;

  const activeView = getActiveViewElement();
  if (!activeView || !activeView.contains(uploadPhotoButton)) return;

  event.preventDefault();
  event.stopPropagation();
  goToUploadPhoto();
});

document.addEventListener('click', event => {
  const pasteTextButton = event.target.closest('[data-action="paste-text"]');
  if (!pasteTextButton) return;

  const activeView = getActiveViewElement();
  if (!activeView || !activeView.contains(pasteTextButton)) return;

  event.preventDefault();
  event.stopPropagation();
  goToPasteText();
});

document.addEventListener('click', event => {
  const manualEntryButton = event.target.closest('[data-action="manual-entry"]');
  if (!manualEntryButton) return;

  const activeView = getActiveViewElement();
  if (!activeView || !activeView.contains(manualEntryButton)) return;

  event.preventDefault();
  event.stopPropagation();
  goToManualEntry();
});

document.addEventListener('click', event => {
  const editContactButton = event.target.closest('[data-action="edit-contact"]');
  if (!editContactButton) return;

  const contactId = parseInt(editContactButton.dataset.contactId, 10);
  if (!contactId) return;

  event.preventDefault();
  event.stopPropagation();
  goToManualEntry({ mode: 'edit', contactId });
});

document.addEventListener('click', event => {
  const deleteContactButton = event.target.closest('[data-action="delete-contact"]');
  if (!deleteContactButton) return;

  const contactId = parseInt(deleteContactButton.dataset.contactId, 10);
  const contact = getContact(contactId);
  if (!contact) return;

  event.preventDefault();
  event.stopPropagation();

  openConfirmDialog({
    title: `Delete ${contact.name}?`,
    text: 'This removes the contact from every bubble.',
    confirmLabel: 'Delete Contact',
    onConfirm: () => {
      deleteContact(contactId);
      goToContacts();
    },
  });
});

document.addEventListener('click', event => {
  const resetButton = event.target.closest('[data-action="reset-saved-data"]');
  if (!resetButton) return;

  event.preventDefault();
  event.stopPropagation();

  openConfirmDialog({
    title: 'Reset saved data?',
    text: 'This restores the default contacts and bubbles on this device.',
    confirmLabel: 'Reset Data',
    onConfirm: resetSavedAppData,
  });
});

document.addEventListener('click', event => {
  const bubbleTapButton = event.target.closest('[data-action="bubble-tap"]');
  if (!bubbleTapButton) return;

  const activeView = getActiveViewElement();
  if (!activeView || !activeView.contains(bubbleTapButton)) return;

  event.preventDefault();
  event.stopPropagation();
  goToBubbleTap();
});

document.addEventListener('click', event => {
  if (!activeSearchControl) return;
  if (activeSearchControl.contains(event.target)) return;
  closeSearchControl();
});

// Bind toggles on all views
bindToggle(document.getElementById('toggle-bubbles'));
bindToggle(document.getElementById('toggle-contacts'));
bindToggle(document.getElementById('toggle-detail'));

/**
 * Profile icon in EVERY bottom nav opens the user's profile.
 * We wire up all profile buttons at once using the aria-label selector.
 */
document.addEventListener('click', event => {
  const navBtn = event.target.closest('.bottom-nav__btn[data-nav]');
  if (!navBtn) return;

  const activeView = getActiveViewElement();
  if (!activeView || !activeView.contains(navBtn)) return;

  event.preventDefault();
  event.stopPropagation();

  if (navBtn.dataset.nav === 'profile') {
    if (currentView === 'profile') {
      renderUserProfile();
      return;
    }
    goToProfile();
    return;
  }

  if (navBtn.dataset.nav === 'add-contact') {
    goToAddContact();
    return;
  }

  if (navBtn.dataset.nav === 'bubbles') {
    goToBubbles();
  }
}, true);

/**
 * Contact cards in the contacts list open the contact detail page.
 * We use event delegation on the list container so it works even
 * after the list is re-rendered by renderContactsList().
 */
document.getElementById('contacts-list').addEventListener('click', e => {
  const bubbleTag = e.target.closest('.contact-card__bubble-tag');
  if (bubbleTag) {
    const bubbleId = bubbleTag.dataset.bubbleId;
    if (selectedContactBubbleFilters.has(bubbleId)) {
      selectedContactBubbleFilters.delete(bubbleId);
    } else {
      selectedContactBubbleFilters.add(bubbleId);
    }
    renderContactsList();
    return;
  }

  const card = e.target.closest('.contact-card');
  if (!card) return;
  const contactId = parseInt(card.dataset.contactId, 10);
  if (contactId) goToContactDetail(contactId);
});

window.addEventListener('pointermove', onGlobalPointerMove, { passive: false });
window.addEventListener('pointerup', onGlobalPointerUp);
window.addEventListener('pointercancel', onGlobalPointerCancel);
document.addEventListener('selectstart', event => {
  const interactiveTextField = event.target.closest('input, textarea, [contenteditable="true"]');
  if (!interactiveTextField) {
    event.preventDefault();
  }
});
document.addEventListener('dragstart', event => {
  event.preventDefault();
});


/* ============================================================
   INITIAL RENDER
   Re-render bubble chart if window resizes (e.g. orientation change)
   ============================================================ */
window.addEventListener('resize', () => {
  setAppViewportHeight();
  if (currentView === 'bubbles') renderBubbleChart();
  if (currentView === 'detail' && activeBubble) renderBubbleDetail(activeBubble);
});

window.visualViewport?.addEventListener('resize', () => {
  setAppViewportHeight();
  if (currentView === 'bubbles') renderBubbleChart();
  if (currentView === 'detail' && activeBubble) renderBubbleDetail(activeBubble);
});

// Boot
loadAppData();
setAppViewportHeight();
ensureInteractionShell();
bindConfirmDialogEvents();
setupSearchControls();
goToBubbles();

// Service worker for Progressive Web App (register URL relative to this page so it works under a subpath, e.g. GitHub Pages /repo-name/)
function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;

  const isLocalDevHost = ["localhost", "127.0.0.1"].includes(window.location.hostname);

  if (isLocalDevHost) {
    navigator.serviceWorker.getRegistrations()
      .then(registrations => Promise.all(registrations.map(registration => registration.unregister())))
      .then(() => console.log("SW unregistered for local development"))
      .catch(error => console.error("SW unregister failed:", error));
    return;
  }

  function directoryBaseHref() {
    const u = new URL(window.location.href);
    const last = u.pathname.split("/").pop() ?? "";
    if (last.includes(".")) {
      u.pathname = u.pathname.slice(0, u.pathname.lastIndexOf("/") + 1);
    } else if (!u.pathname.endsWith("/")) {
      u.pathname += "/";
    }
    return u.href;
  }

  globalThis.addEventListener("load", () => {
    const swUrl = new URL("serviceworker.js", directoryBaseHref());
    navigator.serviceWorker
      .register(swUrl)
      .then((registration) => {
        console.log("SW registered:", registration.scope);
      })
      .catch((error) => {
        console.error("SW registration failed:", error);
      });
  });
}

registerServiceWorker();
