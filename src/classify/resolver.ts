import { Operator } from "rxjs";
import { Classifier, ClassificationData, ClassifierConfig } from "./classifier";
import { GenericHandTrackingData } from "@/devices";

import {
  ThumbSpreadClassifierId,
  ThumbSpreadClassifier
} from "@/classify/classifiers/thumbspread";

export const ClassifierRegistry: {
  [_: string]: { new (...args: any[]): Operator<any, any> };
} = {
  [ThumbSpreadClassifierId]: ThumbSpreadClassifier
};

export const ClassifyResolver = (
  config: ClassifierConfig
): Operator<any, any> => {
  return new ClassifierRegistry[config.identifier](...config.args);
};
