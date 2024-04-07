import _ from 'lodash';
import Graph from 'graphology';
import { bidirectional } from 'graphology-shortest-path/unweighted';

const snake = document.getElementById('snake')!;

function buildGraph(nodes: HTMLElement[]): Graph {
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

function startAnimation() {
  snake.style.animation = 'move 2s linear infinite';
}

function createAnimation(name: string, frames: Frame[]) {
  const style = document.createElement('style');
  let keyFrames = `@keyframes ${name} {`;

  frames.forEach((fr) => {
    keyFrames += `${fr.keyframe}% {transform: translate(${fr.x}px, ${fr.y}px);}`;
  });

  keyFrames += '}';
  style.innerHTML = keyFrames;
  document.getElementsByTagName('head')[0].appendChild(style);
}

export function moveSnake() {
  const crosses = Array.from(document.querySelectorAll<HTMLElement>('.cross'));
  const graph = buildGraph(crosses);
  const selected = _.sampleSize(graph.nodes(), 2);
  const path = bidirectional(graph, selected[0], selected[1]);
  if (!path) {
    return;
  }

  const frames: Frame[] = [];
  const divider = 100 / (path.length - 1);
  path.forEach((p, i) => {
    const node = graph.getNodeAttribute(p, 'element') as HTMLElement;
    const rect = node.getBoundingClientRect();
    const frame: Frame = { keyframe: divider * i, x: rect.x, y: rect.y };
    frames.push(frame);
  });

  createAnimation('move', frames);
  startAnimation();
}

type Frame = {
  keyframe: number;
  x: number;
  y: number;
};
