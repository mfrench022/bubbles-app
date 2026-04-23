import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Modal, Pressable,
} from 'react-native';
import { Colors, Radius, Spacing } from '../theme';

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
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  panel: {
    width: '100%',
    backgroundColor: 'rgba(13, 17, 39, 0.96)',
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.stroke,
    padding: Spacing.xl,
    gap: 12,
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
    backgroundColor: 'rgba(17, 22, 51, 0.74)',
    borderWidth: 1,
    borderColor: Colors.stroke,
  },
  btnPrimary: {
    backgroundColor: Colors.toggleActive,
    borderColor: 'rgba(115, 132, 198, 0.5)',
  },
  btnDanger: {
    backgroundColor: 'rgba(217, 83, 79, 0.2)',
    borderColor: 'rgba(217, 83, 79, 0.4)',
  },
  btnText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
  },
  btnPrimaryText: {
    color: Colors.text,
  },
});
