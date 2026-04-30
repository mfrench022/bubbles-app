import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Modal, Pressable,
} from 'react-native';
import { Colors, Radius, Shadows, Spacing } from '../theme';

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  danger?: boolean;
}

export function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel = 'Confirm',
  onConfirm,
  onCancel,
  danger = false,
}: ConfirmDialogProps) {
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onCancel}>
      <Pressable style={styles.backdrop} onPress={onCancel}>
        <View style={styles.panel} onStartShouldSetResponder={() => true}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.actions}>
            <TouchableOpacity style={styles.btn} onPress={onCancel} activeOpacity={0.7}>
              <Text style={styles.btnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btn, styles.btnPrimary, danger && styles.btnDanger]}
              onPress={onConfirm}
              activeOpacity={0.7}
            >
              <Text style={[styles.btnText, styles.btnPrimaryText]}>{confirmLabel}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(31, 36, 48, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  panel: {
    width: '100%',
    backgroundColor: Colors.sheetBg,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.stroke,
    padding: Spacing.xl,
    gap: 12,
    ...Shadows.card,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  message: {
    fontSize: 15,
    color: Colors.textMuted,
    lineHeight: 22,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  btn: {
    flex: 1,
    height: 48,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
  },
  btnPrimary: {
    backgroundColor: Colors.primarySolid,
    borderColor: Colors.primarySolid,
  },
  btnDanger: {
    backgroundColor: '#F4D8D4',
    borderColor: '#E8AAA0',
  },
  btnText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
  },
  btnPrimaryText: {
    color: Colors.inverseText,
  },
});
