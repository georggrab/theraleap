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
        speed: bullet.speed,
        x: bullet.x,
        y: bullet.y - bullet.speed
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

export const createNewRock = (ctx: p5): SpaceRock => {
  return {
    edges: randomIntInRange(3, 10),
    speedX: randomIntInRange(-2, 2),
    speedY: randomIntInRange(2, 6),
    x: randomIntInRange(0, ctx.width),
    y: -50
  };
};

export const tickSpaceRocks = (s: SpaceRock[], ctx: p5) => {
  const newRocks: SpaceRock[] = [];
  if (Math.random() > 0.985) {
    const rock = createNewRock(ctx);
    newRocks.push(rock);
  }
  s.forEach(rock => {
    if (
      rock.x > -50 &&
      rock.x < ctx.width + 50 &&
      rock.y > -100 &&
      rock.y < ctx.height + 100
    ) {
      newRocks.push({
        edges: rock.edges,
        speedX: rock.speedX,
        speedY: rock.speedY + randomIntInRange(0, 1),
        x: rock.x + rock.speedX,
        y: rock.y + rock.speedY
      });
    }
  });
  return newRocks;
};

export const processBulletCollision = (
  b: Bullet[],
  r: SpaceRock[],
  ctx: p5
) => {
  let hit: number[] = [];
  let collisionOccured = false;
  b.forEach((bullet, bIdx) => {
    r.forEach((rock, rIdx) => {
      if (
        Math.abs(bullet.x - rock.x) < 50 &&
        Math.abs(bullet.y - rock.y) < 30
      ) {
        hit = [bIdx, rIdx];
      }
    });
  });
  if (hit.length !== 0) {
    b.splice(hit[0], 1);
    r.splice(hit[1], 1);
    collisionOccured = true;
  }
  return collisionOccured;
};

export const processSpaceShipCollision = (
  shipX: number,
  shipY: number,
  spaceRocks: SpaceRock[]
) => {
  let collision = false;
  spaceRocks.forEach(rock => {
    if (Math.abs(rock.x - shipX) < 35 && Math.abs(rock.y - shipY) < 35) {
      collision = true;
      return;
    }
  });
  return collision;
};

export const updateScore = (oldScore: number) => {
  return oldScore + 20;
};
