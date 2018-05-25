import { Bullet, SpaceRock } from "./types";

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

const polygon = (x: number, y: number, radius: number, n: number, ctx: p5) => {
  let angle = Math.PI * 2 / n;
  ctx.beginShape();
  for (let a = 0; a < Math.PI * 2; a += angle) {
    let sx = x + ctx.cos(a) * radius;
    let sy = y + ctx.sin(a) * radius;
    ctx.vertex(sx, sy);
  }
  ctx.endShape(ctx.CLOSE);
};

export const drawSpaceRocks = (rocks: SpaceRock[], ctx: p5) => {
  rocks.forEach(rock => {
    polygon(rock.x, rock.y, 50, rock.edges, ctx);
  });
};

export const drawScore = (score: number, ctx: p5) => {
  ctx.textFont("Courier New", 40);
  ctx.text(score.toString().padStart(5, "0"), 20, 50);
};
