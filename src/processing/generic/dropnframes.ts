import { Observable, Operator, Subscriber } from 'rxjs';
import { filter } from "rxjs/operators";

import { PreProcessor } from "@/processing/types";
import { GenericHandTrackingData } from '@/devices';

export const DropNFramesPreProcessorId = "DropNFrames-Preprocessor-v0.01";

export class DropNFramesOperator implements Operator<GenericHandTrackingData, GenericHandTrackingData> {
    constructor(private dropEvery: number) { }

    public call(subscriber: Subscriber<GenericHandTrackingData>, source: Observable<GenericHandTrackingData>) {
        return source.pipe(filter((value, index) => index % this.dropEvery === 0))
            .subscribe(subscriber);
    }
}