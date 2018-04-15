import { Observable, Subscription } from "rxjs";

import { Classifier, ClassificationData } from "./classifier";
import { GenericHandTrackingData } from "@/devices/generic";

export abstract class ClassificationEngine {
  public abstract handleResult(c: ClassificationData): void;

  private classifiers: Classifier[] = [];
  private classifierSubscriptions: Subscription[] = [];

  public addClassifier(c: Classifier) {
    this.classifiers.push(c);
  }

  public process(source: Observable<GenericHandTrackingData>) {
    this.classifiers.forEach(classifier => {
      const subscription = classifier
        .classify(source)
        .subscribe(this.handleResult.bind(this));
      this.classifierSubscriptions.push(subscription);
    });
  }

  public terminate() {
    this.classifierSubscriptions.forEach(sub => {
      sub.unsubscribe();
    });
    this.classifierSubscriptions = [];
  }
}
