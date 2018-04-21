import { Observable } from 'rxjs';
import { GenericHandTrackingData } from '@/devices';

export interface PreProcessor {
    process(inp: Observable<GenericHandTrackingData>): Observable<GenericHandTrackingData>;
}

export interface PreProcessingEngine {
    getPreProcessors(): PreProcessor[];
    setPreProcessors(lp: PreProcessor[]): void;
    applyPreProcessors(inp: Observable<GenericHandTrackingData>): Observable<GenericHandTrackingData>;
}