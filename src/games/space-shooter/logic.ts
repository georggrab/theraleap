import { Bullet, SpaceRock } from "./types";

export const tickBullets = (b: Bullet[], ctx: p5) => {
  const newBullets: Bullet[] = [];
  b.forEach(bullet => {
    if (
      bullet.x < ctx.width &&
      bullet.x > 0 &&
      bullet.y < ctx.height &&
      bullet.y > 0
    ) {
      const newBullet = {
        x: bullet.x,
        y: bullet.y - bullet.speed,
        speed: bullet.speed
      };
      newBullets.push(newBullet);
    }
  });
  return newBullets;
};

export const shootBullet = (
  bullets: Bullet[],
  x: number,
  y: number,
  speed: number
) => {
  bullets.push({ x, y, speed });
};

export const randomIntInRange = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
};

export const createNewRock = (ctx: p5) => {
  return {
    x: randomIntInRange(0, ctx.width),
    y: -50,
    speedX: randomIntInRange(-2, 2),
    speedY: randomIntInRange(2, 6),
    edges: randomIntInRange(3, 10)
  } as SpaceRock;
};

export const tickSpaceRocks = (s: SpaceRock[], ctx: p5) => {
  const newRocks: SpaceRock[] = [];
  if (Math.random() > 0.985) {
    const rock = createNewRock(ctx);
    newRocks.push(rock);
    console.log("New Rock", rock);
  }
  s.forEach(rock => {
    if (
      rock.x > -50 &&
      rock.x < ctx.width + 50 &&
      rock.y > -100 &&
      rock.y < ctx.height + 100
    ) {
      newRocks.push({
        x: rock.x + rock.speedX,
        y: rock.y + rock.speedY,
        speedX: rock.speedX,
        speedY: rock.speedY + randomIntInRange(0, 1),
        edges: rock.edges
      } as SpaceRock);
    }
  });
  return newRocks;
};
