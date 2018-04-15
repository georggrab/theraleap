import {
  Classifier,
  ClassificationData,
  ClassifierMetadata,
  ClassifierSetting,
  SettingType,
  Slider,
  String
} from "../classifier";
import { Observable } from "rxjs";
import { bufferTime, map } from "rxjs/operators";
import { GenericHandTrackingData } from "@/devices";

export class ThumbSpreadClassifier implements Classifier {
  static metadata: ClassifierMetadata = {
    name: "ThumbSpreadClassifier",
    shortDesc: "Detects extension of the Thumb",
    longDesc: `This classifier is used in order to aid recovery from x/y syndrome. I have no actual idea what I am talking about, just implementing this stuff and writing some blindtext. In the future, here could be a well-written description of this classifier, including pointers on which types of patients it should be used. Even <strong>HTML</strong> is possible here! (Don't <code>&lt;script&gt;</code> in here please lol)`,
    examplePath: "json/thera-rec-slow-thumb-spread.json"
  };

  static settings: ClassifierSetting[] = [
    {
      name: "Detection Threshhold",
      desc: "How generously to trigger the detection",
      setting: {
        type: SettingType.Slider,
        min: 0.0,
        max: 1.0,
        value: 0.7,
        step: 0.05
      } as Slider
    },
    {
      name: "Text test",
      desc: "Desc",
      setting: {
        type: SettingType.String,
        value: "test"
      } as String
    }
  ];

  constructor(private detectionThreshhold: number) {}

  public classify(
    source: Observable<GenericHandTrackingData>
  ): Observable<ClassificationData> {
    return source.pipe(
      bufferTime(300),
      map(bufferedFrames => {
        return {} as ClassificationData;
      })
    );
  }
}

export const ThumbSpreadClassifierId = ThumbSpreadClassifier.name;
