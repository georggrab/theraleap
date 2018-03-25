"use strict";
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
function project(value, min, max, targetMin, targetMax) {
    return targetMin + (targetMax - targetMin) * ((value - min) / (max - min));
}
//# sourceMappingURL=util.js.map