import { Subject, Subscription } from "rxjs";
import {
  DeviceConnectionState,
  GenericHandTrackingData
} from "@/devices/generic";
import { ClassificationData, ClassifierConfig } from "@/classify";

export interface LeapWorkerContext extends Worker {
  connectionState: DeviceConnectionState;
  deviceStreamingIntervalId: number;
  lastFrameTime: number;
  configuration: any;
  pipeline: LeapWorkerReactivePipeline;
  currentClassifierConfig: ClassifierConfig | undefined;
}

/**
 * The Reactive Data Processing pipeline of the Leapworker can be illustrated as
 * follows:
 *
 * (dFS) --> (ppS) --> (cS)  -> message to main window context
 *                 \
 *                  (oS)     -> message to main window context
 *   with
 *      dFS: deviceFrameSubject
 *      ppS: preprocessSubject
 *       oS: outputSubject
 *       cs: classifySubject
 *
 * First, raw data is entering from the Websocket connection into the deviceFrameSubject.
 * Then, the data is preprocessed according to various configurable preprocessing recipes.
 * The preprocessed data is then sent to the outputSubject, which in turn messages the main window context
 * with the data for various debugging information
 * (like, drawing the hand, logging the raw data...).
 * The preprocessed data is also sent to the classifySubject, which applies the configured classification
 * routine, and then sends the classification result to the main window context for further evaluation.
 */
interface LeapWorkerReactivePipeline {
  deviceFrameSubject: Subject<GenericHandTrackingData>;
  outputSubject: Subject<GenericHandTrackingData>;
  preprocessSubject: Subject<GenericHandTrackingData>;
  classifySubject: Subject<GenericHandTrackingData>;
  preprocessSubscription: Subscription | undefined;
  deviceFrameSubscription: Subscription | undefined;
  classifySubscription: Subscription | undefined;
  classifyOutputSubscription: Subscription | undefined;
}
