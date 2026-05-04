import { useEffect, useRef } from 'react';
import { Animated, Dimensions } from 'react-native';
import { PanGestureHandlerGestureEvent, PanGestureHandlerStateChangeEvent, State } from 'react-native-gesture-handler';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SWIPE_DISMISS_DISTANCE = 56;
const SWIPE_DISMISS_VELOCITY = 800;

interface UseSwipeDismissOptions {
  visible: boolean;
  onDismiss: () => void;
}

export function useSwipeDismiss({ visible, onDismiss }: UseSwipeDismissOptions) {
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const isDismissingRef = useRef(false);

  useEffect(() => {
    if (visible) {
      isDismissingRef.current = false;
      translateY.stopAnimation();
      translateY.setValue(SCREEN_HEIGHT);
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
    }
  }, [visible, translateY]);

  const resetPosition = () => {
    if (isDismissingRef.current) return;
    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
      tension: 90,
      friction: 12,
    }).start();
  };

  const dismiss = () => {
    if (isDismissingRef.current) return;
    isDismissingRef.current = true;
    Animated.timing(translateY, {
      toValue: SCREEN_HEIGHT,
      duration: 220,
      useNativeDriver: true,
    }).start(({ finished }) => {
      isDismissingRef.current = false;
      if (finished) onDismiss();
    });
  };

  const handleGestureEvent = ({ nativeEvent }: PanGestureHandlerGestureEvent) => {
    if (isDismissingRef.current) return;
    translateY.setValue(Math.max(0, nativeEvent.translationY));
  };

  const handleGestureStateChange = ({ nativeEvent }: PanGestureHandlerStateChangeEvent) => {
    if (isDismissingRef.current) return;
    if (nativeEvent.oldState !== State.ACTIVE) return;
    if (
      nativeEvent.translationY > SWIPE_DISMISS_DISTANCE ||
      nativeEvent.velocityY > SWIPE_DISMISS_VELOCITY
    ) {
      dismiss();
    } else {
      resetPosition();
    }
  };

  return {
    handleGestureEvent,
    handleGestureStateChange,
    animatedStyle: { transform: [{ translateY }] },
  };
}
