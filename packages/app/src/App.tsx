// import { GlobalStyle, theme } from '@d3-tests/design-system';
import React, { KeyboardEvent, useState } from 'react';
import * as d3Shape from 'd3-shape';
import * as d3 from 'd3';
import styled, { keyframes } from 'styled-components';
// import { ThemeProvider } from 'styled-components';

interface Point {
  height: number;
  width: number;
  index: number;
}

interface HLine {
  y: number;
}

interface VLine {
  x: number;
}

const MAX_SIZE = 800;
const DETALIZATION = 30;

const random = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min)) + min;

const App = () => {
  const [detalization, setDetalization] = React.useState(DETALIZATION);
  const [heights, setHeights] = React.useState<number[]>([]);
  const [startFrom, setStartFrom] = React.useState(0);
  const [isDragging, setIsDragging] = React.useState(false);

  const points = React.useMemo<Point[]>(
    () =>
      Array.from(
        { length: Math.ceil(detalization + startFrom + 1) },
        (_, i) => ({
          height: heights[startFrom + i],
          width: MAX_SIZE / detalization,
          index: i,
        }),
      ),
    [detalization, heights, startFrom],
  );

  const oddPoints = React.useMemo(() => {
    return points.map((e, i) => ({
      ...e,
      height: ((startFrom + i + 1) % 2) * e.height,
    }));
  }, [startFrom, points]);

  const hLines = React.useMemo(() => {
    const step = MAX_SIZE / detalization;

    return Array.from<undefined, HLine>(
      { length: detalization + 1 },
      (_, i) => ({
        y: step * i,
      }),
    );
  }, [detalization]);

  const vLines = React.useMemo(() => {
    const step = MAX_SIZE / detalization;

    return Array.from<undefined, VLine>(
      { length: detalization + 1 },
      (_, i) => ({
        x: step * i,
      }),
    );
  }, [detalization]);

  const square = d3Shape
    .area<Point>()
    .x((p) => p.index * p.width)
    .y0((p) => 0)
    .y1((p) => p.height)
    .curve(d3Shape.curveStepAfter);

  const recalculateHeights = React.useCallback(() => {
    const heights = Array.from({ length: 5000 }, (_, i) =>
      random(30, MAX_SIZE),
    );
    setHeights(heights);
  }, []);

  React.useEffect(() => {}, []);

  React.useEffect(() => {
    recalculateHeights();
  }, []);

  React.useEffect(() => {
    const maxValue = MAX_SIZE / 2.5;
    const minValue = 3;

    const handler = (e: WheelEvent) => {
      setDetalization((prev) => {
        const coeficient = prev / 20;

        const nextValue = prev + Math.sign(e.deltaY) * coeficient;

        return Math.min(Math.max(minValue, nextValue), maxValue);
      });
    };

    window.addEventListener('wheel', handler);

    return () => {
      window.removeEventListener('wheel', handler);
    };
  }, []);

  React.useEffect(() => {
    const handler = (e: globalThis.KeyboardEvent) => {
      if (e.code !== 'KeyR') return;

      recalculateHeights();
    };

    document.addEventListener('keydown', handler);

    return () => {
      document.removeEventListener('keydown', handler);
    };
  }, []);

  React.useEffect(() => {
    if (!isDragging) return;

    const handler = () => {
      setIsDragging(false);
    };

    document.addEventListener('mouseup', handler);

    return () => document.removeEventListener('mouseup', handler);
  }, [isDragging]);

  React.useEffect(() => {
    if (!isDragging) return;

    const handler = (e: MouseEvent) => {
      setStartFrom((prev) => Math.max(0, prev - Math.sign(e.movementX)));
    };

    document.addEventListener('mousemove', handler);

    return () => document.removeEventListener('mousemove', handler);
  }, [isDragging]);

  return (
    <App.Container>
      <App.Canvas onMouseDown={() => setIsDragging(true)}>
        <clipPath></clipPath>

        {hLines.map((l) => (
          <line
            y1={l.y}
            y2={l.y}
            x1={0}
            x2={MAX_SIZE}
            strokeWidth={1}
            stroke="#000"
            key={l.y}
          />
        ))}

        {vLines.map((l) => (
          <line
            y1={0}
            y2={MAX_SIZE}
            x1={l.x}
            x2={l.x}
            strokeWidth={1}
            stroke="#000"
            key={l.x}
          />
        ))}

        <path d={square(points) ?? undefined} fill="#00aaff"></path>
        <path d={square(oddPoints) ?? undefined} fill="#00ffaa"></path>

        {points.map(
          (p) =>
            p.width > 20 && (
              <App.Text
                key={p.index}
                x={p.index * p.width + 2}
                y={(p.height || 10) - 10}
                fontSize={p.width / 2}
              >
                {p.height}
              </App.Text>
            ),
        )}
      </App.Canvas>
    </App.Container>
  );
};

const createGrowAnimation = (y: number) => keyframes`
  0% { opacity: 0; } 
  100% { opacity: 1; }
`;

App.Container = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
`;

App.Canvas = styled.svg`
  width: ${MAX_SIZE}px;
  height: ${MAX_SIZE}px;

  background: #fff;

  box-shadow: 0 0 15px 12px #fff;
`;

App.Text = styled.text<{ y: number }>`
  animation-name: ${(props) => createGrowAnimation(props.y)};
  animation-duration: 3s;
  animation-iteration-count: 1;
  fill: black;
  user-select: none;
`;

export default App;
