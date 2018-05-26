import { LeapHandTrackingData, LeapPointable } from "@/devices/leapmotion";

const norm = (vec: number[]) => {
  return Math.sqrt(vec.map(x => Math.pow(x, 2)).reduce((p, c) => p + c, 0));
};

export const calculatePointableAngle = (
  first: LeapPointable,
  second: LeapPointable
): number => {
  const ab = first.direction
    .map((el, idx) => el * second.direction[idx])
    .reduce((p, c) => p + c, 0);
  const normFirst = norm(first.direction);
  const normSecond = norm(second.direction);
  const theta = Math.acos(ab / (normFirst * normSecond));
  return theta * 180 / Math.PI;
};

export const sortPointables = (
  frame: LeapHandTrackingData
): LeapPointable[] | undefined => {
  const copy = frame.data.pointables.slice(0);
  if (copy.length !== 5) {
    // We only work with frames tracking all fingers
    return undefined;
  }
  copy.sort((a: LeapPointable, b: LeapPointable) => {
    if (a.type < b.type) {
      return -1;
    } else {
      return 1;
    }
  });
  return copy;
};
