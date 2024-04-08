import Graph from 'graphology';
import { bidirectional, type ShortestPath } from 'graphology-shortest-path/unweighted';
import anime from 'animejs/lib/anime.es.js';
import { sampleSize } from 'lodash';

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
  const selected = sampleSize(graph.nodes(), 2);
  const path = bidirectional(graph, selected[0], selected[1]);
  if (!path) {
    return;
  }
  const lines = generateLines(graph, path);

  const timeline = anime.timeline({
    duration: 2000,
    easing: 'linear',
  });

  const horizontalKeyFrames = [
    {
      backgroundPositionX: '100%',
      backgroundPositionY: 0,
    },
  ];
  const verticalKeyFrames = [
    {
      backgroundPositionX: 0,
      backgroundPositionY: '100%',
    },
  ];

  lines.forEach((line) => {
    timeline.add({
      targets: line,
      keyframes: isLineHorizontal(line) ? horizontalKeyFrames : verticalKeyFrames,
    });
  });
}

function isLineHorizontal(line: HTMLDivElement) {
  return line.style.height === '2px' || line.style.height === '';
}

function generateLines(graph: Graph, path: ShortestPath): HTMLDivElement[] {
  const offset = 7.5;
  let prevIndex = 0;

  const array: HTMLDivElement[] = [];

  for (let i = 1; i < path.length; i++) {
    const prev = getElement(graph, path[prevIndex]).getBoundingClientRect();
    const current = getElement(graph, path[i]).getBoundingClientRect();

    const top = current.top < prev.top ? `${current.top + offset}px` : `${prev.top + offset}px`;
    const left = current.left < prev.left ? `${current.left + offset}px` : `${prev.left + offset}px`;
    const line = createLine(top, left);

    if (prev.top === current.top) {
      // horizontal
      const width = Math.abs(current.x - prev.x);
      line.style.width = `${width}px`;
      line.classList.add('hline');
    } else {
      // vertical
      const height = Math.abs(current.y - prev.y);
      line.style.height = `${height}px`;
      line.classList.add('vline');
    }

    prevIndex = prevIndex + 1;
    array.push(line);
  }

  return array;
}

function createLine(top: string, left: string): HTMLDivElement {
  const line = document.createElement('div');
  line.className = 'line';
  line.style.top = top;
  line.style.left = left;
  ground!.appendChild(line);
  return line;
}
