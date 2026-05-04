import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { PanGestureHandlerGestureEvent, PanGestureHandlerStateChangeEvent, State } from 'react-native-gesture-handler';

const SWIPE_DISMISS_DISTANCE = 56;
const SWIPE_DISMISS_VELOCITY = 0.75;

interface UseSwipeDismissOptions {
  visible: boolean;
  onDismiss: () => void;
}

export function useSwipeDismiss({ visible, onDismiss }: UseSwipeDismissOptions) {
  const translateY = useRef(new Animated.Value(0)).current;
  const isDismissingRef = useRef(false);
  const currentValueRef = useRef(0);

  useEffect(() => {
    const listenerId = translateY.addListener(({ value }) => {
      currentValueRef.current = value;
    });
    return () => {
      translateY.removeListener(listenerId);
    };
  }, [translateY]);

  useEffect(() => {
    if (visible) {
      isDismissingRef.current = false;
      translateY.stopAnimation();
      currentValueRef.current = 0;
      translateY.setValue(0);
    }
  }, [translateY, visible]);

  const resetPosition = () => {
    if (isDismissingRef.current) return;
    translateY.stopAnimation();
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
    translateY.stopAnimation(() => {
      translateY.setValue(currentValueRef.current);
      Animated.timing(translateY, {
        toValue: 320,
        duration: 150,
        useNativeDriver: true,
      }).start(({ finished }) => {
        isDismissingRef.current = false;
        if (finished) {
          currentValueRef.current = 0;
          translateY.setValue(0);
          onDismiss();
        }
      });
    });
  };

  const handleGestureEvent = ({ nativeEvent }: PanGestureHandlerGestureEvent) => {
    if (isDismissingRef.current) return;
    const nextValue = Math.max(0, nativeEvent.translationY);
    currentValueRef.current = nextValue;
    translateY.setValue(nextValue);
  };

  const handleGestureStateChange = ({ nativeEvent }: PanGestureHandlerStateChangeEvent) => {
    if (isDismissingRef.current) return;
    if (nativeEvent.oldState !== State.ACTIVE) return;
    const nextValue = Math.max(0, nativeEvent.translationY);
    currentValueRef.current = nextValue;
    translateY.setValue(nextValue);
    if (
      nativeEvent.translationY > SWIPE_DISMISS_DISTANCE ||
      nativeEvent.velocityY > SWIPE_DISMISS_VELOCITY * 1000
    ) {
      dismiss();
      return;
    }
    resetPosition();
  };

  return {
    handleGestureEvent,
    handleGestureStateChange,
    animatedStyle: {
      transform: [{ translateY }],
    },
  };
}
