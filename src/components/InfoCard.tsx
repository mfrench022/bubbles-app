import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Radius, Shadows, Spacing } from '../theme';
import {
  EmailIcon, PhoneIcon, BirthdayIcon, SlackIcon, InstagramIcon,
  TwitterIcon, LinkedInIcon, SocialIcon, NoteIcon,
} from './Icons';

export type InfoIconKey = 'email' | 'phone' | 'birthday' | 'slack' | 'teams' |
  'instagram' | 'twitter' | 'linkedin' | 'social' | 'note';

export interface InfoRow {
  icon: InfoIconKey;
  text: string;
  label?: string;
  value?: string;
  hideIcon?: boolean;
  onPress?: () => void;
}

interface InfoCardProps {
  title: string;
  rows: InfoRow[];
  style?: ViewStyle;
}

function RowIcon({ icon, size = 20 }: { icon: InfoIconKey; size?: number }) {
  const color = Colors.textMuted;
  switch (icon) {
    case 'email': return <EmailIcon size={size} color={color} />;
    case 'phone': return <PhoneIcon size={size} color={color} />;
    case 'birthday': return <BirthdayIcon size={size} color={color} />;
    case 'slack': return <SlackIcon size={size} color={color} />;
    case 'instagram': return <InstagramIcon size={size} color={color} />;
    case 'twitter': return <TwitterIcon size={size} color={color} />;
    case 'linkedin': return <LinkedInIcon size={size} color={color} />;
    case 'social': return <SocialIcon size={size} color={color} />;
    case 'note': return <NoteIcon size={size} color={color} />;
    default: return <SocialIcon size={size} color={color} />;
  }
}

export function InfoCard({ title, rows, style }: InfoCardProps) {
  if (!rows.length) return null;

  return (
    <View style={[styles.card, style]}>
      <Text style={styles.title}>{title}</Text>
      {rows.map((row, idx) => (
        <TouchableOpacity
          key={idx}
          style={[styles.row, idx < rows.length - 1 && styles.rowBorder]}
          onPress={row.onPress}
          activeOpacity={row.onPress ? 0.7 : 1}
          disabled={!row.onPress}
        >
          {!row.hideIcon && (
            <View style={styles.iconWrap}>
              <RowIcon icon={row.icon} />
            </View>
          )}
          {row.label ? (
            <View style={styles.socialRowContent}>
              <Text style={styles.socialLabel} numberOfLines={1}>
                {row.label}
              </Text>
              <Text style={styles.socialValue} numberOfLines={2}>
                {row.value ?? ''}
              </Text>
            </View>
          ) : (
            <Text style={styles.rowText} numberOfLines={2}>
              {row.text}
            </Text>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 17,
    marginBottom: 12,
    backgroundColor: Colors.cardBg,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.stroke,
    overflow: 'hidden',
    ...Shadows.card,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textMuted,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 12,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.stroke,
  },
  iconWrap: {
    width: 28,
    alignItems: 'center',
    flexShrink: 0,
  },
  rowText: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
    lineHeight: 22,
  },
  socialRowContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  socialLabel: {
    width: '28%',
    minWidth: 78,
    paddingRight: Spacing.sm,
    fontSize: 16,
    lineHeight: 22,
    color: Colors.text,
    fontWeight: '700',
  },
  socialValue: {
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
    color: Colors.text,
  },
});
