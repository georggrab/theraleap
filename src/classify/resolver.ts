import { Operator } from "rxjs";
import { Classifier, ClassificationData } from "./classifier";
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

export const ClassifyResolver = (config: {
  identifier: string;
  args: any[];
}): Operator<any, any> => {
  return new ClassifierRegistry[config.identifier](...config.args);
};
