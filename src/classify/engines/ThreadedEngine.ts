import { ClassificationEngine } from "@/classify/engine";
import { ClassificationData } from '@/classify/classifier';

export const WORKER_EVT_CLASSIFICATION = "WorkerClassification"

export class ThreadedEngine extends ClassificationEngine {
    constructor(private workerContext: Worker) { 
        super();
    }

    public handleResult(c: ClassificationData) {
        this.workerContext.postMessage({ type: WORKER_EVT_CLASSIFICATION, payload: c });
    }
}