import { Bullet } from "./types";

export const drawScene = (ctx: p5) => {
  ctx.background(0);
  ctx.fill(255);
};

export const drawSpaceShip = (x: number, y: number, ctx: p5) => {
  ctx.triangle(x, y - 40, x - 15, y, x + 15, y);
};

export const drawBullets = (bullets: Bullet[], ctx: p5) => {
  bullets.forEach(b => {
    ctx.ellipse(b.x, b.y - 15, 5);
  });
};
