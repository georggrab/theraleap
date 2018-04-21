import { PreProcessor } from "@/processing/types";
import { Observable } from 'rxjs';
import { GenericHandTrackingData } from '@/devices/generic';
import { filter } from "rxjs/operators";

export class DropNFramesPreProcessor implements PreProcessor {
    constructor(private dropEvery: number) { }

    public process(inp: Observable<GenericHandTrackingData>): Observable<GenericHandTrackingData> {
        return inp.pipe(filter((value, index) => index % this.dropEvery === 0));
    }
}