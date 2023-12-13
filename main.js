import { Bodies, Body, Engine, Events, Render, Runner, World } from "matter-js";
import { FRUITS_BASE } from "./fruits";

const engine = Engine.create();
const render = Render.create({
  engine,
  element: document.body,
  options: {
    wireframes: false,
    background: "#F7F4C8",
    width: 620,
    height: 850,
  }
});

const world = engine.world;
const leftWall = Bodies.rectangle(15, 395, 30, 790, {
  isStatic: true,
  render: { fillStyle: "#E6B143" }
});

const rightWall = Bodies.rectangle(605, 395, 30, 790, {
  isStatic: true,
  render: { fillStyle: "#E6B143" }
});

const ground = Bodies.rectangle(310, 820, 620, 60, {
  isStatic: true,
  render: { fillStyle: "#E6B143" }
});

const topline = Bodies.rectangle(310, 150, 620, 2, {
  name : 'topLine',
  isStatic: true,
  isSensor: true,
  render: { fillStyle: "#E6B143" }
});

World.add(world, [leftWall, rightWall, ground, topline]);

Render.run(render);
Runner.run(engine);

let currentBody = null;
let currentFruit = null;
let disableAction = false;

function addFruit() {
  const index = Math.floor(Math.random() * 5);
  const fruit = FRUITS_BASE[index];

  const body = Bodies.circle(300, 50, fruit.radius, {
    index: index,
    isSleeping: true,
    restitution: 0.2,
    render: {
      sprite: {
        texture: `${fruit.name}.png`
      }
    }
  });

  currentBody = body;
  currentFruit = fruit;

  World.add(world, body);
}


window.onkeydown = (event) => {
  console.log(event.code);

  if (disableAction) return;
    switch (event.code) {
      case "ArrowLeft":
        if (currentBody.position.x - currentFruit.radius > 30)
          Body.setPosition(currentBody, {x: currentBody.position.x - 10, y: currentBody.position.y,});
        break;
      case "ArrowRight":
        if (currentBody.position.x + currentFruit.radius < 590)
          Body.setPosition(currentBody, {x: currentBody.position.x + 10, y: currentBody.position.y,});
        break;
      case "Enter":
        currentBody.isSleeping = false;
        disableAction = true;
        setTimeout(() => {
          addFruit();
          disableAction = false;
        }, 1000);
        
        break;
    }
}

Events.on(engine, "collisionStart", (event) => {
  event.pairs.forEach((collision) => {
    if (collision.bodyA.index === collision.bodyB.index) {
      const index = collision.bodyA.index;

      if (index === FRUITS_BASE.length - 1) {
        return;
      }

      World.remove(world, [collision.bodyA, collision.bodyB]);
      const newFruit = FRUITS_BASE[index + 1];
      const newBody = Bodies.circle(
        collision.collision.supports[0].x,
        collision.collision.supports[0].y,
        newFruit.radius,
        {
          render: {
            sprite: {texture: `${newFruit.name}.png`}
          },
          index: index + 1,
        }
      );

      console.log(`${newFruit.name}.png`);
      World.add(world, newBody);
    }

    if (!disableAction && collision.bodyA.name === 'topLine' || collision.bodyB.name === 'topLine') {
      alert('Game Over')
    }
  });
});

addFruit();
