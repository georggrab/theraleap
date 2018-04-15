import { Classifier, ClassificationData, ClassifierMetadata, ClassifierSetting, SettingType, Slider, String } from '../classifier';
import { Observable } from '@reactivex/rxjs';
import { GenericHandTrackingData } from '@/devices';


export class ThumbSpreadClassifier implements Classifier {
    static metadata: ClassifierMetadata = {
        name: "ThumbSpreadClassifier",
        desc: "Detects extension of Thumb"
    }

    static settings: ClassifierSetting[] = [
        {
            name: "Detection Threshhold",
            desc: "How generously to trigger the detection",
            setting: {
                type: SettingType.Slider,
                min: 0.0,
                max: 1.0,
                value: 0.7,
                step: 0.05,
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
    ]

    constructor(private detectionThreshhold: number) {}

    public classify(source: Observable<GenericHandTrackingData>): Observable<ClassificationData> {
        return source
            .bufferTime(300)
            .map((bufferedFrames) => {
                return { } as ClassificationData
            })
    }
}

export const ThumbSpreadClassifierId = ThumbSpreadClassifier.name;