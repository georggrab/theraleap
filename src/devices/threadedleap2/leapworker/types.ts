import { Subject, Subscription } from 'rxjs';
import { DeviceConnectionState, GenericHandTrackingData } from '@/devices/generic';

export interface LeapWorkerContext extends Worker {
    connectionState: DeviceConnectionState;
    deviceStreamingIntervalId: number;
    lastFrameTime: number;
    configuration: any;
    pipeline: LeapWorkerReactivePipeline;
}

interface LeapWorkerReactivePipeline {
    deviceFrameSubject: Subject<GenericHandTrackingData>;
    outputSubject: Subject<GenericHandTrackingData>;
    preprocessSubject: Subject<GenericHandTrackingData>;
    preprocessSubscription: Subscription | undefined;
    deviceFrameSubscription: Subscription | undefined;
}