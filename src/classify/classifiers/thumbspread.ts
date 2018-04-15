import { Classifier, ClassificationData } from '../classifier';
import { Observable } from '@reactivex/rxjs';
import { GenericHandTrackingData } from '@/devices';


export class ThumbSpreadClassifier implements Classifier {
    public classify(source: Observable<GenericHandTrackingData>): Observable<ClassificationData> {
        return source
            .bufferTime(300)
            .map((bufferedFrames) => {
                return { } as ClassificationData
            })
    }
}

export const ThumbSpreadClassifierId = ThumbSpreadClassifier.name;

