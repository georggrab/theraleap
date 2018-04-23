import { Projection3 } from "./types";

/**
 * Project a value from one number range onto another one.
 * Establishes a proportion between the two number ranges and returns the proportion
 * applied to the new range.
 * @param value value to be projected
 * @param min minimum value of the input value
 * @param max maximum value of the input value
 * @param targetMin minimum value of the projected plane
 * @param targetMax maximum value of the projected plane
 */
export function project(
  value: number,
  min: number,
  max: number,
  targetMin: number,
  targetMax: number
): number {
  return targetMin + (targetMax - targetMin) * ((value - min) / (max - min));
}

/**
 * Project a 3 Dimensional Vector from one plane into another one, as described
 * by the from / to projection matrices.
 * @param vector3 The Vector to be projected into a new plane
 * @param projection  The Projection Matrix
 */
export function project3(
  vector3: number[],
  projection: { projectionFrom: Projection3; projectionTo: Projection3 }
): number[] {
  const projected = [];
  for (let i in [0, 1, 2]) {
    projected.push(
      project(
        vector3[i],
        projection.projectionFrom.min[i],
        projection.projectionFrom.max[i],
        projection.projectionTo.min[i],
        projection.projectionTo.max[i]
      )
    );
  }
  return projected;
}
