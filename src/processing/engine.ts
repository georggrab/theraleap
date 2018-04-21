import { Observable } from 'rxjs';

import { GenericHandTrackingData } from '@/devices/generic';
import { PreProcessor, PreProcessingEngine } from '@/processing/types';

export class GenericPreProcessingEngine implements PreProcessingEngine {
    private preprocessors: PreProcessor[] = [];

    public getPreProcessors(): PreProcessor[] {
        return this.preprocessors
    }

    public setPreProcessors(inp: PreProcessor[]): void {
        this.preprocessors = inp;
    }

    public applyPreProcessors(inp: Observable<GenericHandTrackingData>): Observable<GenericHandTrackingData> {
        return inp.pipe(...this.preprocessors.map((p) => p.process));
    }
}
