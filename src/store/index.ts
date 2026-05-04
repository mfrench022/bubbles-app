import { create } from 'zustand';
import { Contact, DEFAULT_CONTACTS } from '../data/contacts';
import { Bubble, DEFAULT_BUBBLES } from '../data/bubbles';
import { DEFAULT_USER_PROFILE, UserProfile } from '../data/user';
import { saveAppData, loadAppData, clearAppData } from '../utils/storage';
import { BubbleColorKey } from '../theme';

let generatedBubbleCount = 1;

function getHighestGeneratedBubbleNumber(bubbles: Bubble[]): number {
  return bubbles.reduce((max, b) => {
    const match = String(b.id || '').match(/(?:bubble|sub)-(\d+)$/);
    return match ? Math.max(max, parseInt(match[1], 10)) : max;
  }, 0);
}

function ensureBubbleArrays(bubble: Bubble): Bubble {
  return {
    ...bubble,
    colorKey: bubble.colorKey || 'violet',
    subBubbleIds: bubble.subBubbleIds || [],
    contactIds: bubble.contactIds || [],
  };
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function getBubbleSize(contactCount: number, isNested: boolean): number {
  if (isNested) {
    return clamp(14 + Math.sqrt(contactCount) * 5.5, 14, 28);
  }
  return clamp(18 + Math.sqrt(contactCount) * 8, 18, 46);
}

function normalizeBubbleSizes(bubbles: Bubble[]): Bubble[] {
  return bubbles.map(bubble => {
    const nextBubble = ensureBubbleArrays(bubble);
    return {
      ...nextBubble,
      size: getBubbleSize(nextBubble.contactIds.length, Boolean(nextBubble.parentId)),
    };
  });
}

export function initials(name: string): string {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

export function getImportedContactColor(index: number): string {
  const colors = [
    '#8B7355', '#5D8A72', '#5E7FA3', '#B07850', '#7B6BB0',
    '#A8607A', '#4E8E72', '#A06B5A', '#4A7EA8', '#9B7040',
    '#6B8E55', '#9060A0',
  ];
  return colors[index % colors.length];
}

export function getTodayNoteDate(): string {
  return new Date().toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

function getNextContactId(contacts: Contact[]): number {
  return contacts.length > 0 ? Math.max(...contacts.map(c => c.id)) + 1 : 1;
}

function cloneDefaultContacts(): Contact[] {
  return JSON.parse(JSON.stringify(DEFAULT_CONTACTS));
}

function cloneDefaultBubbles(): Bubble[] {
  return JSON.parse(JSON.stringify(DEFAULT_BUBBLES));
}

function cloneDefaultUserProfile(): UserProfile {
  return { ...DEFAULT_USER_PROFILE };
}

function mergeUserProfile(storedProfile?: Partial<UserProfile> | null): UserProfile {
  return {
    ...cloneDefaultUserProfile(),
    ...(storedProfile || {}),
  };
}

function mergeMissingDefaultContacts(storedContacts: Contact[]): Contact[] {
  const contactsById = new Map(storedContacts.map(contact => [contact.id, contact]));
  cloneDefaultContacts().forEach(contact => {
    if (!contactsById.has(contact.id)) {
      contactsById.set(contact.id, contact);
    }
  });
  return Array.from(contactsById.values()).sort((a, b) => a.id - b.id);
}

function mergeMissingDefaultBubbles(storedBubbles: Bubble[]): Bubble[] {
  const defaultBubbles = cloneDefaultBubbles();
  const defaultBubbleMap = new Map(defaultBubbles.map(bubble => [bubble.id, ensureBubbleArrays(bubble)]));
  const bubblesById = new Map(
    storedBubbles.map(bubble => {
      const normalized = ensureBubbleArrays(bubble);
      const seededDefault = defaultBubbleMap.get(normalized.id);
      return [
        normalized.id,
        seededDefault
          ? {
              ...normalized,
              // Keep seeded demo bubbles visually current across releases.
              colorKey: seededDefault.colorKey,
            }
          : normalized,
      ];
    })
  );

  defaultBubbles.forEach(bubble => {
    if (!bubblesById.has(bubble.id)) {
      bubblesById.set(bubble.id, ensureBubbleArrays(bubble));
    }
  });
  return Array.from(bubblesById.values());
}

interface AppState {
  contacts: Contact[];
  bubbles: Bubble[];
  userProfile: UserProfile;
  initialized: boolean;

  initialize: () => Promise<void>;
  save: () => void;
  reset: () => void;

  getContact: (id: number) => Contact | undefined;
  getBubble: (id: string) => Bubble | undefined;
  getContactBubbles: (contactId: number) => Bubble[];
  getDescendantContactIds: (bubbleId: string) => Set<number>;
  getVisualContactIds: (bubble: Bubble) => number[];

  addContact: (contact: Omit<Contact, 'id'>) => Contact;
  updateContact: (id: number, updates: Partial<Contact>) => void;
  deleteContact: (id: number) => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;

  addBubble: (bubble: Omit<Bubble, 'id'> & { id?: string }) => Bubble;
  updateBubble: (id: string, updates: Partial<Bubble>) => void;
  deleteBubble: (id: string) => void;
  deleteBubbleCascade: (id: string) => void;

  nestBubbleIntoBubble: (sourceId: string, targetId: string) => boolean;
  moveContactToBubble: (contactId: number, sourceBubbleId: string, targetBubbleId: string) => boolean;
  removeContactFromBubble: (contactId: number, bubbleId: string) => boolean;
  addContactsToBubble: (bubbleId: string, contactIds: number[]) => boolean;
  removeBubbleCategory: (bubbleId: string) => boolean;
  createSubBubbleFromContacts: (parentBubbleId: string, sourceContactId: number, targetContactId: number) => Bubble | null;
  applyBubbleAssignments: (contactId: number, selectedBubbleIds: Set<string>) => void;
  openCreateBubbleSheet: (options: { preselectedContactIds?: number[] }) => void;
}

export const useStore = create<AppState>((set, get) => ({
  contacts: JSON.parse(JSON.stringify(DEFAULT_CONTACTS)),
  bubbles: normalizeBubbleSizes(JSON.parse(JSON.stringify(DEFAULT_BUBBLES))),
  userProfile: cloneDefaultUserProfile(),
  initialized: false,

  initialize: async () => {
    const stored = await loadAppData();
    if (stored) {
      const contacts = mergeMissingDefaultContacts(stored.contacts || []);
      const bubbles = normalizeBubbleSizes(mergeMissingDefaultBubbles(stored.bubbles || []));
      const userProfile = mergeUserProfile(stored.userProfile);
      generatedBubbleCount = Math.max(1, getHighestGeneratedBubbleNumber(bubbles) + 1);
      set({ contacts, bubbles, userProfile, initialized: true });
      saveAppData({ contacts, bubbles, userProfile });
    } else {
      const contacts = cloneDefaultContacts();
      const bubbles = normalizeBubbleSizes(cloneDefaultBubbles());
      const userProfile = cloneDefaultUserProfile();
      generatedBubbleCount = getHighestGeneratedBubbleNumber(bubbles) + 1;
      set({ contacts, bubbles, userProfile, initialized: true });
    }
  },

  save: () => {
    const { contacts, bubbles, userProfile } = get();
    saveAppData({ contacts, bubbles, userProfile });
  },

  reset: () => {
    clearAppData();
    const contacts = cloneDefaultContacts();
    const bubbles = normalizeBubbleSizes(cloneDefaultBubbles());
    const userProfile = cloneDefaultUserProfile();
    generatedBubbleCount = getHighestGeneratedBubbleNumber(bubbles) + 1;
    set({
      contacts,
      bubbles,
      userProfile,
    });
  },

  getContact: (id) => get().contacts.find(c => c.id === id),

  getBubble: (id) => get().bubbles.find(b => b.id === id),

  getContactBubbles: (contactId) =>
    get().bubbles.filter(b => b.contactIds.includes(contactId)),

  getDescendantContactIds: (bubbleId) => {
    const { bubbles } = get();
    const result = new Set<number>();
    const children = bubbles.filter(b => b.parentId === bubbleId);
    children.forEach(child => {
      child.contactIds.forEach(id => result.add(id));
      get().getDescendantContactIds(child.id).forEach(id => result.add(id));
    });
    return result;
  },

  getVisualContactIds: (bubble) => {
    const nested = get().getDescendantContactIds(bubble.id);
    return bubble.contactIds.filter(id => !nested.has(id));
  },

  addContact: (contactData) => {
    const { contacts } = get();
    const contact: Contact = { ...contactData, id: getNextContactId(contacts) };
    set(state => ({ contacts: [...state.contacts, contact] }));
    get().save();
    return contact;
  },

  updateContact: (id, updates) => {
    set(state => ({
      contacts: state.contacts.map(c => c.id === id ? { ...c, ...updates } : c),
    }));
    get().save();
  },

  deleteContact: (id) => {
    set(state => {
      const bubbles = normalizeBubbleSizes(
        state.bubbles.map(b => ({
          ...b,
          contactIds: b.contactIds.filter(cid => cid !== id),
        })).filter(b => !(b.parentId && b.contactIds.length === 0))
      );
      return {
        contacts: state.contacts.filter(c => c.id !== id),
        bubbles,
      };
    });
    get().save();
  },

  addBubble: (bubbleData) => {
    const makeBubbleId = (prefix = 'bubble') => {
      const { bubbles } = get();
      let candidate = `${prefix}-${generatedBubbleCount++}`;
      while (bubbles.some(b => b.id === candidate)) {
        candidate = `${prefix}-${generatedBubbleCount++}`;
      }
      return candidate;
    };

    const bubble: Bubble = ensureBubbleArrays({
      ...bubbleData,
      id: bubbleData.id || makeBubbleId(),
    } as Bubble);

    set(state => ({ bubbles: normalizeBubbleSizes([...state.bubbles, bubble]) }));
    get().save();
    return get().getBubble(bubble.id) || bubble;
  },

  updateBubble: (id, updates) => {
    set(state => ({
      bubbles: normalizeBubbleSizes(
        state.bubbles.map(b => b.id === id ? ensureBubbleArrays({ ...b, ...updates }) : b)
      ),
    }));
    get().save();
  },

  updateUserProfile: (updates) => {
    set(state => ({
      userProfile: { ...state.userProfile, ...updates },
    }));
    get().save();
  },

  deleteBubble: (id) => {
    set(state => ({
      bubbles: normalizeBubbleSizes(
        state.bubbles.filter(b => b.id !== id).map(b => ({
          ...b,
          subBubbleIds: (b.subBubbleIds || []).filter(sid => sid !== id),
        }))
      ),
    }));
    get().save();
  },

  deleteBubbleCascade: (id) => {
    const { bubbles } = get();
    const toDelete = new Set<string>();

    const collect = (bid: string) => {
      toDelete.add(bid);
      bubbles.filter(b => b.parentId === bid).forEach(child => collect(child.id));
    };
    collect(id);

    set(state => ({
      bubbles: normalizeBubbleSizes(
        state.bubbles
          .filter(b => !toDelete.has(b.id))
          .map(b => ({
            ...b,
            subBubbleIds: (b.subBubbleIds || []).filter(sid => !toDelete.has(sid)),
          }))
      ),
    }));
    get().save();
  },

  nestBubbleIntoBubble: (sourceId, targetId) => {
    if (!sourceId || !targetId || sourceId === targetId) return false;
    const { bubbles } = get();
    const source = bubbles.find(b => b.id === sourceId);
    const target = bubbles.find(b => b.id === targetId);
    if (!source || !target) return false;

    const isDescendant = (candidateId: string, ancestorId: string): boolean => {
      let cursor = bubbles.find(b => b.id === candidateId);
      while (cursor?.parentId) {
        if (cursor.parentId === ancestorId) return true;
        cursor = bubbles.find(b => b.id === cursor!.parentId);
      }
      return false;
    };
    if (isDescendant(targetId, sourceId)) return false;

    const nestedContactIds = new Set<number>(source.contactIds);
    get().getDescendantContactIds(sourceId).forEach(id => nestedContactIds.add(id));

    set(state => ({
      bubbles: normalizeBubbleSizes(
        state.bubbles.map(b => {
          if (b.id === sourceId) {
            return { ...b, parentId: targetId };
          }
          if (b.id === targetId) {
            const newSubBubbleIds = b.subBubbleIds.includes(sourceId)
              ? b.subBubbleIds
              : [...b.subBubbleIds, sourceId];
            const newContactIds = [...new Set([...b.contactIds, ...nestedContactIds])];
            return { ...b, subBubbleIds: newSubBubbleIds, contactIds: newContactIds };
          }
          if (b.id === source.parentId) {
            return { ...b, subBubbleIds: b.subBubbleIds.filter(sid => sid !== sourceId) };
          }
          return b;
        })
      ),
    }));
    get().save();
    return true;
  },

  moveContactToBubble: (contactId, sourceBubbleId, targetBubbleId) => {
    if (!contactId || !sourceBubbleId || !targetBubbleId || sourceBubbleId === targetBubbleId) return false;
    const { bubbles } = get();
    const source = bubbles.find(b => b.id === sourceBubbleId);
    const target = bubbles.find(b => b.id === targetBubbleId);
    if (!source || !target) return false;
    if (!source.contactIds.includes(contactId) || target.contactIds.includes(contactId)) return false;

    const isDescendant = (cId: string, aId: string): boolean => {
      let cursor = bubbles.find(b => b.id === cId);
      while (cursor?.parentId) {
        if (cursor.parentId === aId) return true;
        cursor = bubbles.find(b => b.id === cursor!.parentId);
      }
      return false;
    };

    set(state => ({
      bubbles: normalizeBubbleSizes(
        state.bubbles.map(b => {
          if (b.id === sourceBubbleId) {
            if (!isDescendant(targetBubbleId, sourceBubbleId)) {
              return { ...b, contactIds: b.contactIds.filter(id => id !== contactId) };
            }
          }
          if (b.id === targetBubbleId) {
            return { ...b, contactIds: [...b.contactIds, contactId] };
          }
          return b;
        }).filter(b => !(b.parentId && b.contactIds.length === 0))
      ),
    }));
    get().save();
    return true;
  },

  removeContactFromBubble: (contactId, bubbleId) => {
    const { bubbles } = get();
    const bubble = bubbles.find(b => b.id === bubbleId);
    if (!bubble || !bubble.contactIds.includes(contactId)) return false;

    set(state => ({
      bubbles: normalizeBubbleSizes(
        state.bubbles
          .map(b =>
            b.id === bubbleId
              ? { ...b, contactIds: b.contactIds.filter(id => id !== contactId) }
              : b
          )
          .filter(b => !(b.parentId && b.contactIds.length === 0))
      ),
    }));
    get().save();
    return true;
  },

  addContactsToBubble: (bubbleId, contactIds) => {
    const { bubbles } = get();
    const bubble = bubbles.find(candidate => candidate.id === bubbleId);
    if (!bubble) return false;

    const uniqueContactIds = [...new Set(contactIds.filter(Boolean))];
    if (uniqueContactIds.length === 0) return false;

    const bubbleIdsToUpdate = new Set<string>();
    let cursor: Bubble | undefined = bubble;
    while (cursor) {
      bubbleIdsToUpdate.add(cursor.id);
      cursor = cursor.parentId ? bubbles.find(candidate => candidate.id === cursor?.parentId) : undefined;
    }

    set(state => ({
      bubbles: normalizeBubbleSizes(
        state.bubbles.map(candidate => {
          if (!bubbleIdsToUpdate.has(candidate.id)) return candidate;
          return {
            ...candidate,
            contactIds: [...new Set([...candidate.contactIds, ...uniqueContactIds])],
          };
        })
      ),
    }));
    get().save();
    return true;
  },

  removeBubbleCategory: (bubbleId) => {
    const { bubbles } = get();
    const bubble = bubbles.find(b => b.id === bubbleId);
    if (!bubble) return false;

    if (bubble.parentId) {
      const parent = bubbles.find(b => b.id === bubble.parentId);
      if (parent) {
        set(state => ({
          bubbles: normalizeBubbleSizes(
            state.bubbles.map(b => {
              if (b.id === bubble.parentId) {
                const newContactIds = [...new Set([...b.contactIds, ...bubble.contactIds])];
                return { ...b, contactIds: newContactIds };
              }
              return b;
            })
          ),
        }));
      }
    }

    get().deleteBubbleCascade(bubbleId);
    return true;
  },

  createSubBubbleFromContacts: (parentBubbleId, sourceContactId, targetContactId) => {
    if (sourceContactId === targetContactId) return null;
    const { bubbles, contacts } = get();
    const parent = bubbles.find(b => b.id === parentBubbleId);
    if (!parent) return null;
    if (!parent.contactIds.includes(sourceContactId) || !parent.contactIds.includes(targetContactId)) return null;

    const makeBubbleId = (prefix = 'sub') => {
      let candidate = `${prefix}-${generatedBubbleCount++}`;
      while (bubbles.some(b => b.id === candidate)) {
        candidate = `${prefix}-${generatedBubbleCount++}`;
      }
      return candidate;
    };

    const sourceContact = contacts.find(c => c.id === sourceContactId);
    const targetContact = contacts.find(c => c.id === targetContactId);
    const label = `${(sourceContact?.name || 'New').split(' ')[0]}\n${(targetContact?.name || 'Bubble').split(' ')[0]}`;

    const newBubble: Bubble = {
      id: makeBubbleId('sub'),
      label,
      x: parent.x + 5,
      y: parent.y + 5,
      size: 0,
      colorKey: parent.colorKey as BubbleColorKey,
      contactIds: [sourceContactId, targetContactId],
      subBubbleIds: [],
      parentId: parent.id,
    };

    set(state => ({
      bubbles: normalizeBubbleSizes([
        ...state.bubbles.map(b =>
          b.id === parentBubbleId
            ? { ...b, subBubbleIds: [...b.subBubbleIds, newBubble.id] }
            : b
        ),
        newBubble,
      ]),
    }));
    get().save();
    return get().getBubble(newBubble.id) || newBubble;
  },

  applyBubbleAssignments: (contactId, selectedBubbleIds) => {
    set(state => ({
      bubbles: normalizeBubbleSizes(
        state.bubbles.map(b => {
          const shouldInclude = selectedBubbleIds.has(b.id);
          const isIncluded = b.contactIds.includes(contactId);
          if (shouldInclude && !isIncluded) {
            return { ...b, contactIds: [...b.contactIds, contactId] };
          }
          if (!shouldInclude && isIncluded) {
            return { ...b, contactIds: b.contactIds.filter(id => id !== contactId) };
          }
          return b;
        })
      ),
    }));
    get().save();
  },

  openCreateBubbleSheet: (_options) => {
    // Implemented via UI state in the component
  },
}));
