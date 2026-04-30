import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { BubbleChart } from './BubbleChart';

type BubbleChartProps = React.ComponentProps<typeof BubbleChart>;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function ZoomableBubbleChart(props: BubbleChartProps) {
  const zoomScale = useRef(new Animated.Value(1)).current;
  const committedScaleRef = useRef(1);
  const liveScaleRef = useRef(1);
  const minScaleRef = useRef(0.5);

  const [committedScale, setCommittedScale] = useState(1);
  const [pinchActive, setPinchActive] = useState(false);

  const handleZoomLimitChange = useCallback((nextMinScale: number) => {
    const clampedMinScale = clamp(nextMinScale, 0.35, 1);
    minScaleRef.current = clampedMinScale;

    const nextCommittedScale = clamp(committedScaleRef.current, clampedMinScale, 1);
    if (nextCommittedScale !== committedScaleRef.current) {
      committedScaleRef.current = nextCommittedScale;
      liveScaleRef.current = nextCommittedScale;
      zoomScale.setValue(nextCommittedScale);
      setCommittedScale(nextCommittedScale);
    }
  }, [zoomScale]);

  const commitScale = useCallback((nextScale: number) => {
    const clampedScale = clamp(nextScale, minScaleRef.current, 1);
    committedScaleRef.current = clampedScale;
    liveScaleRef.current = clampedScale;
    zoomScale.setValue(clampedScale);
    setCommittedScale(clampedScale);
  }, [zoomScale]);

  const pinchGesture = useMemo(() => Gesture.Pinch()
    .runOnJS(true)
    .onBegin(() => {
      setPinchActive(true);
    })
    .onUpdate(event => {
      const nextScale = clamp(committedScaleRef.current * event.scale, minScaleRef.current, 1);
      liveScaleRef.current = nextScale;
      zoomScale.setValue(nextScale);
    })
    .onFinalize(() => {
      commitScale(liveScaleRef.current);
      setPinchActive(false);
    }), [commitScale, zoomScale]);

  return (
    <GestureDetector gesture={pinchGesture}>
      <View style={styles.container}>
        <BubbleChart
          {...props}
          visualScale={zoomScale}
          interactionScale={committedScale}
          interactionPaused={pinchActive}
          onZoomScaleLimitChange={handleZoomLimitChange}
        />
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
