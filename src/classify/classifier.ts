import { GenericHandTrackingData } from '@/devices';
import { Observable } from '@reactivex/rxjs';

export interface ClassificationData {
    actionName: string;
    metrics: ClassificationMetrics;
}

export interface ClassificationMetrics {
    quality: number;
}

export interface Classifier {
    classify(source: Observable<GenericHandTrackingData>): Observable<ClassificationData>
}