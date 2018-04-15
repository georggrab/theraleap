import { Classifier } from "./classifier";
import {
  ThumbSpreadClassifierId,
  ThumbSpreadClassifier
} from "./classifiers/thumbspread";

export const resolveClassifier = (id: string): Classifier | undefined => {
  switch (id) {
    case ThumbSpreadClassifierId:
      return new ThumbSpreadClassifier();
    default:
      return undefined;
  }
};
