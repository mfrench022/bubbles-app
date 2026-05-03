import React from 'react';
import Svg, { Circle, Path, Rect, Line, Polyline } from 'react-native-svg';
import { Colors } from '../theme';

interface IconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

const DEFAULT_ICON_COLOR = Colors.textMuted;

export function SearchIcon({ size = 24, color = DEFAULT_ICON_COLOR }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="10.5" cy="10.5" r="6.5" stroke={color} strokeWidth="2" />
      <Path d="M15.5 15.5L21 21" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

export function ListDashesIcon({ size = 24, color = DEFAULT_ICON_COLOR }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M7 7.5h10M7 12h10M7 16.5h10" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <Circle cx="5" cy="7.5" r="1" fill={color} />
      <Circle cx="5" cy="12" r="1" fill={color} />
      <Circle cx="5" cy="16.5" r="1" fill={color} />
    </Svg>
  );
}

export function BubblesIcon({ size = 28, color = DEFAULT_ICON_COLOR }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <Circle cx="10" cy="10" r="7" stroke={color} strokeWidth="1.8" />
      <Circle cx="19" cy="17" r="5" stroke={color} strokeWidth="1.8" />
      <Circle cx="8" cy="19" r="3.5" stroke={color} strokeWidth="1.8" />
    </Svg>
  );
}

export function AddIcon({ size = 28, color = DEFAULT_ICON_COLOR }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <Circle cx="14" cy="14" r="12" stroke={color} strokeWidth="1.8" />
      <Path d="M14 8V20M8 14H20" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </Svg>
  );
}

export function ProfileIcon({ size = 28, color = DEFAULT_ICON_COLOR }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <Circle cx="14" cy="9.5" r="4.5" stroke={color} strokeWidth="1.8" />
      <Path d="M7 22.5c0-3.866 3.134-7 7-7s7 3.134 7 7" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </Svg>
  );
}

export function BackIcon({ size = 20, color = DEFAULT_ICON_COLOR }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M15 18l-6-6 6-6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function BackChevronIcon({ size = 20, color = DEFAULT_ICON_COLOR }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Path d="M12 4L6 10L12 16" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function ChevronDownIcon({ size = 20, color = DEFAULT_ICON_COLOR, strokeWidth = 2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Path
        d="M5 7.5 10 12.5 15 7.5"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function CloseIcon({ size = 20, color = DEFAULT_ICON_COLOR }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M6 6l12 12M18 6L6 18" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

export function TrashIcon({ size = 28, color = DEFAULT_ICON_COLOR }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M4 7h16" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <Path d="M9 3h6" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <Path d="M8 7v11a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V7" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <Path d="M10 11v5M14 11v5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </Svg>
  );
}

export function PlusIcon({ size = 24, color = DEFAULT_ICON_COLOR }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 5v14M5 12h14" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
    </Svg>
  );
}

export function EmailIcon({ size = 24, color = DEFAULT_ICON_COLOR }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <Rect x="2" y="4" width="20" height="16" rx="2" />
      <Path d="m2 7 10 7 10-7" />
    </Svg>
  );
}

export function PhoneIcon({ size = 24, color = DEFAULT_ICON_COLOR }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <Path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.6 3.4 2 2 0 0 1 3.59 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91A16 16 0 0 0 14.09 16.09l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </Svg>
  );
}

export function BirthdayIcon({ size = 24, color = DEFAULT_ICON_COLOR }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <Path d="M20 12v10H4V12" />
      <Rect x="2" y="7" width="20" height="5" rx="1" />
      <Path d="M12 22V7" />
      <Path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
      <Path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
    </Svg>
  );
}

export function InstagramIcon({ size = 24, color = DEFAULT_ICON_COLOR }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round">
      <Rect x="2" y="2" width="20" height="20" rx="5" />
      <Circle cx="12" cy="12" r="5" />
      <Circle cx="17.5" cy="6.5" r="1" fill={color} stroke="none" />
    </Svg>
  );
}

export function TwitterIcon({ size = 24, color = DEFAULT_ICON_COLOR }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </Svg>
  );
}

export function LinkedInIcon({ size = 24, color = DEFAULT_ICON_COLOR }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <Rect x="2" y="2" width="20" height="20" rx="4" />
      <Line x1="7" y1="10" x2="7" y2="17" />
      <Line x1="7" y1="7" x2="7" y2="7.1" />
      <Path d="M11 17v-4a3 3 0 0 1 6 0v4M11 10v7" />
    </Svg>
  );
}

export function SlackIcon({ size = 24, color = DEFAULT_ICON_COLOR }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zm1.271 0a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zm0 1.271a2.527 2.527 0 0 1 2.521 2.521 2.527 2.527 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.527 2.527 0 0 1 2.522-2.521h6.312zm10.122 2.521a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zm-1.268 0a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zm-2.523 10.122a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zm0-1.268a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" />
    </Svg>
  );
}

export function NoteIcon({ size = 24, color = DEFAULT_ICON_COLOR }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <Path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <Polyline points="14 2 14 8 20 8" />
      <Line x1="8" y1="13" x2="16" y2="13" />
      <Line x1="8" y1="17" x2="13" y2="17" />
    </Svg>
  );
}

export function SocialIcon({ size = 24, color = DEFAULT_ICON_COLOR }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <Circle cx="12" cy="12" r="3" />
      <Path d="M5 12h4M15 12h4M12 5v4M12 15v4" />
      <Circle cx="5" cy="12" r="2" />
      <Circle cx="19" cy="12" r="2" />
      <Circle cx="12" cy="5" r="2" />
      <Circle cx="12" cy="19" r="2" />
    </Svg>
  );
}

export function MinusIcon({ size = 24, color = DEFAULT_ICON_COLOR }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M6 12h12" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

export function PasteTextIcon({ size = 36, color = DEFAULT_ICON_COLOR }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 36 36" fill="none">
      <Path d="M11 8h11l5 5v15H11V8z" stroke={color} strokeWidth="2.4" strokeDasharray="6 5" strokeLinejoin="round" />
      <Path d="M22 8v6h5" stroke={color} strokeWidth="2.4" strokeDasharray="6 5" strokeLinejoin="round" />
    </Svg>
  );
}

export function UploadPhotoIcon({ size = 36, color = DEFAULT_ICON_COLOR }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 36 36" fill="none">
      <Path d="M10 6h13l5 5v19H10V6z" stroke={color} strokeWidth="2.4" strokeLinejoin="round" />
      <Path d="M23 6v6h5" stroke={color} strokeWidth="2.4" strokeLinejoin="round" />
      <Path d="M18 25V15M14 19l4-4 4 4" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function ManualEntryIcon({ size = 36, color = DEFAULT_ICON_COLOR }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 36 36" fill="none">
      <Path d="M7 27.5l4.5-1 16-16a3 3 0 0 0-4.2-4.2l-16 16-1 4.5c-.1.5.3.9.7.7z" stroke={color} strokeWidth="2.4" strokeLinejoin="round" />
      <Path d="M20.5 9.5l6 6M10.5 22.5l3 3" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
    </Svg>
  );
}

export function WifiIcon({ size = 24, color = DEFAULT_ICON_COLOR }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M5 12a7 7 0 0 1 14 0" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <Path d="M8.5 12a3.5 3.5 0 0 1 7 0" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <Path d="M12 14.5v.01" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <Path d="M4 19.5h16" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </Svg>
  );
}
