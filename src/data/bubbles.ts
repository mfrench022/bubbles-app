export interface Bubble {
  id: string;
  label: string;
  x: number;
  y: number;
  size: number;
  contactIds: number[];
  subBubbleIds: string[];
  parentId?: string;
  isNewBubbleTrigger?: boolean;
}

export const DEFAULT_BUBBLES: Bubble[] = [
  {
    id: 'work',
    label: 'Work',
    x: 5, y: 36, size: 45,
    contactIds: [1, 2, 3, 4, 5, 8],
    subBubbleIds: ['drinks-crew'],
  },
  {
    id: 'drinks-crew',
    label: 'Drinks\nCrew',
    x: 13, y: 46, size: 21,
    contactIds: [2, 5, 8],
    parentId: 'work',
    subBubbleIds: [],
  },
  {
    id: 'friends',
    label: 'Friends',
    x: 49, y: 44, size: 37,
    contactIds: [1, 6, 7, 9, 11],
    subBubbleIds: [],
  },
  {
    id: 'soccer',
    label: 'Soccer',
    x: 46, y: 29, size: 33,
    contactIds: [3, 4, 7],
    subBubbleIds: [],
  },
  {
    id: 'music',
    label: 'Music',
    x: 29, y: 28, size: 18,
    contactIds: [9, 10],
    subBubbleIds: [],
  },
  {
    id: 'design',
    label: 'Design',
    x: 76, y: 40, size: 16,
    contactIds: [5, 12],
    subBubbleIds: [],
  },
  {
    id: 'wellness',
    label: 'Wellness',
    x: 30, y: 56, size: 22,
    contactIds: [6, 11],
    subBubbleIds: [],
  },
];
