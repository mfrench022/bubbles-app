import { useEffect, useMemo, useRef } from 'react';
import { Animated, PanResponder } from 'react-native';

const SWIPE_DISMISS_DISTANCE = 90;
const SWIPE_DISMISS_VELOCITY = 1;

interface UseSwipeDismissOptions {
  visible: boolean;
  onDismiss: () => void;
}

export function useSwipeDismiss({ visible, onDismiss }: UseSwipeDismissOptions) {
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      translateY.setValue(0);
    }
  }, [translateY, visible]);

  const resetPosition = () => {
    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
      tension: 90,
      friction: 12,
    }).start();
  };

  const dismiss = () => {
    Animated.timing(translateY, {
      toValue: 420,
      duration: 180,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        translateY.setValue(0);
        onDismiss();
      }
    });
  };

  const panResponder = useMemo(() => PanResponder.create({
    onMoveShouldSetPanResponder: (_event, gestureState) =>
      gestureState.dy > 6 && Math.abs(gestureState.dy) > Math.abs(gestureState.dx),
    onPanResponderMove: (_event, gestureState) => {
      translateY.setValue(Math.max(0, gestureState.dy));
    },
    onPanResponderRelease: (_event, gestureState) => {
      if (gestureState.dy > SWIPE_DISMISS_DISTANCE || gestureState.vy > SWIPE_DISMISS_VELOCITY) {
        dismiss();
        return;
      }
      resetPosition();
    },
    onPanResponderTerminate: resetPosition,
  }), [translateY, onDismiss]);

  return {
    panHandlers: panResponder.panHandlers,
    animatedStyle: {
      transform: [{ translateY }],
    },
  };
}
