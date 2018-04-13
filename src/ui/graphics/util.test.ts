import { expect } from "chai";
import { project } from "./util";

describe("util", () => {
  describe("project", () => {
    it("should project correctly", () => {
      expect(project(1, 0, 10, 10, 20)).to.equal(11, "constant projection");
      expect(project(10, 0, 200, 0, 400)).to.equal(20, "linear projection");
      expect(project(0, -20, 40, 0, 60)).to.equal(20, "no clipping");
    });
  });
});
