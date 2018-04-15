import { Classifier, ClassifierMetadata } from "./classifier";
import {
  ThumbSpreadClassifierId,
  ThumbSpreadClassifier
} from "./classifiers/thumbspread";

export const ClassifierRegistry: { [k: string]: { new(...args: any[]): Classifier, metadata: ClassifierMetadata } } = {
  [ThumbSpreadClassifierId]: ThumbSpreadClassifier
}

export const resolveClassifier = (id: string, ...args: any[]): Classifier | undefined => {
  if (ClassifierRegistry.hasOwnProperty(id)) {
    return new (ClassifierRegistry[id])(args);
  }
  return undefined;
};
