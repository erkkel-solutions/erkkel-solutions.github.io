import Graph from 'graphology';
import { bidirectional, type ShortestPath } from 'graphology-shortest-path/unweighted';
import anime from 'animejs/lib/anime.es.js';
import { sampleSize } from 'lodash';

function getElement(graph: Graph, index: string) {
  return graph.getNodeAttribute(index, 'element') as HTMLElement;
}

const ground = document.getElementById('snake-ground');

export default function moveSnake() {
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

  const graph = buildGraph();
  const selected = sampleSize(graph.nodes(), 2);
  const path = bidirectional(graph, selected[0], selected[1]);
  if (!path) {
    return;
  }

  generateLines(graph, path);

  // anime({
  //   targets: element,
  //   keyframes: [{ translateY: -40 }, { translateX: 250 }, { translateY: 40 }, { translateX: 0 }, { translateY: 0 }],
  //   duration: 4000,
  //   loop: true,
  // });
}

function generateLines(graph: Graph, path: ShortestPath) {
  const offset = 7.5;
  let prevIndex = 0;
  for (let i = 1; i <= path.length; i++) {
    const prev = getElement(graph, path[prevIndex]).getBoundingClientRect();
    const current = getElement(graph, path[i]).getBoundingClientRect();

    const top = current.top < prev.top ? `${current.top + offset}px` : `${prev.top + offset}px`;
    const left = current.left < prev.left ? `${current.left + offset}px` : `${prev.left + offset}px`;
    const line = createLine(top, left);

    if (prev.top === current.top) {
      // horizontal
      const width = Math.abs(current.x - prev.x);
      line.style.width = `${width}px`;
    } else {
      // vertical
      const height = Math.abs(current.y - prev.y);
      line.style.height = `${height}px`;
    }

    prevIndex = prevIndex + 1;
  }
}

function createLine(top: string, left: string): HTMLDivElement {
  const line = document.createElement('div');
  line.style.position = 'absolute';
  line.style.zIndex = '90';
  line.style.backgroundColor = 'orange';
  line.style.height = '2px';
  line.style.width = '2px';
  line.style.top = top;
  line.style.left = left;
  ground!.appendChild(line);
  return line;
}
