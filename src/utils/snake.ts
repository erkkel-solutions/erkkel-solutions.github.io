import Graph from 'graphology';
import { bidirectional, type ShortestPath } from 'graphology-shortest-path/unweighted';
import anime from 'animejs/lib/anime.es.js';
import { sampleSize } from 'lodash';
import type { AnimeAnimParams } from 'animejs';

function getElement(graph: Graph, index: string) {
  return graph.getNodeAttribute(index, 'element') as HTMLElement;
}

const ground = document.getElementById('snake-ground');

function buildGraph(): Graph {
  const nodes = Array.from(document.querySelectorAll<HTMLElement>('.cross'));
  const graph = new Graph({ multi: true });
  nodes.forEach((node, index) => {
    graph.addNode(index.toString(), { element: node });
  });

  nodes.forEach((nodeA, indexA) => {
    nodes.forEach((nodeB, indexB) => {
      if (indexA !== indexB) {
        const rectA = nodeA.getBoundingClientRect();
        const rectB = nodeB.getBoundingClientRect();

        if (rectA.left === rectB.left || rectA.top === rectB.top) {
          graph.addUndirectedEdge(indexA.toString(), indexB.toString());
        }
      }
    });
  });

  return graph;
}

export default function moveSnake() {
  if (!ground) {
    return;
  }

  const graph = buildGraph();
  console.log('Graph: ', graph);
  const selected = sampleSize(graph.nodes(), 2);
  const path = bidirectional(graph, selected[0], selected[1]);
  if (!path) {
    return;
  }
  console.log('Path: ', path);
  const lines = generateLines(graph, path);
  console.log('Lines: ', lines);

  const timeline = anime.timeline({
    easing: 'linear',
    loop: true,
  });

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const offset = i === 0 ? '' : `-=${(lines[i - 1].duration / 3) * 2}`;

    timeline.add(
      {
        targets: line.element,
        keyframes: getKeyFrame(line.direction),
        duration: line.duration,
      },
      offset
    );
  }
}

function getKeyFrame(direction: Direction): AnimeAnimParams[] {
  // downward: (0 0) -> (0 100%)
  // upward: (0 100%) -> (0 0)
  // rightward: (100% 0) -> (0 0)
  // leftward: (0 0) -> (100% 0)

  let keyFrame: AnimeAnimParams[];

  switch (direction) {
    case 'downward':
      keyFrame = [
        {
          backgroundPositionX: 0,
          backgroundPositionY: '-150%',
        },
      ];
      break;
    case 'upward':
      keyFrame = [
        {
          backgroundPositionX: 0,
          backgroundPositionY: '100%',
        },
      ];
      break;
    case 'leftward':
      keyFrame = [
        {
          backgroundPositionX: '100%',
          backgroundPositionY: 0,
        },
      ];
      break;
    case 'rightward':
      keyFrame = [
        {
          backgroundPositionX: '-150%',
          backgroundPositionY: 0,
        },
      ];
      break;
    default:
      throw new Error('Unknown direction: ' + direction);
  }

  return keyFrame;
}

function generateLines(graph: Graph, path: ShortestPath): Line[] {
  const array: Line[] = [];

  let prevIndex = 0;
  for (let i = 1; i < path.length; i++) {
    const prev = getElement(graph, path[prevIndex]).getBoundingClientRect();
    const current = getElement(graph, path[i]).getBoundingClientRect();

    const line = createLine(prev, current);
    array.push(line);

    prevIndex = prevIndex + 1;
  }

  return array;
}

function createLine(prev: DOMRect, current: DOMRect): Line {
  const line = document.createElement('div');
  line.classList.add('line');
  ground!.appendChild(line);

  const offset = 7.5;
  const top = current.top < prev.top ? `${current.top + offset}px` : `${prev.top + offset}px`;
  const left = current.left < prev.left ? `${current.left + offset}px` : `${prev.left + offset}px`;
  line.style.setProperty('--top', top);
  line.style.setProperty('--left', left);

  let direction: Direction;
  if (prev.x !== current.x) {
    // horizontal
    line.style.width = `${Math.abs(current.x - prev.x)}px`;
    line.style.setProperty('--deg', '90deg');
    line.style.setProperty('--initialY', '0');
    direction = prev.x < current.x ? 'rightward' : 'leftward';
    line.style.setProperty('--initialX', direction === 'rightward' ? '100%' : '0');
  } else {
    // vertical
    line.style.height = `${Math.abs(current.y - prev.y)}px`;
    line.style.setProperty('--deg', '0deg');
    line.style.setProperty('--initialX', '0');
    direction = prev.y < current.y ? 'downward' : 'upward';
    line.style.setProperty('--initialY', direction === 'upward' ? '100%' : '0');
  }

  return {
    direction: direction,
    element: line,
    duration: 4000,
  };
}

type Direction = 'leftward' | 'rightward' | 'upward' | 'downward';
type Line = {
  direction: Direction;
  element: HTMLElement;
  duration: number;
};
