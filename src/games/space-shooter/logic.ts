import { Bullet } from "./types";

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
