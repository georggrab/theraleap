import { Container, injectable, interfaces } from "inversify";
import "reflect-metadata";
import { Store } from "vuex";

import DIIdent from "@/dependencyinjection/symbols";
import {
  DeviceDriver,
  DeviceFacade,
  HardwareDriverConnectionSettings
} from "@/devices";
import {
  IStoreFactory,
  IStoreHolder,
  RootState,
  StoreFactory,
  StoreHolder
} from "@/state/store";

import { AllPurposeRecordingFacade } from "@/devices/allpurposefacade";
import { ThreadedLeap2Driver } from "@/devices/threadedleap2/threadedleap2driver";
import {
  IndexedDBPersistenceProvider,
  KVPersistenceProvider
} from "@/state/persistence";

const AppContainer = new Container();
AppContainer.bind<DeviceDriver>(DIIdent.SERVICE_MOTION_TRACKING_DEVICE_DRIVER)
  .to(ThreadedLeap2Driver)
  .inSingletonScope();
AppContainer.bind<HardwareDriverConnectionSettings>(
  DIIdent.SETTINGS_HARDWARE_DRIVER_CONNECTION
).toConstantValue({
  frameEventName: "animationFrame",
  host: "127.0.0.1",
  port: 6437,

  enableGestures: false
});
AppContainer.bind<DeviceFacade>(DIIdent.SERVICE_MOTION_TRACKING_DEVICE_FACADE)
  .to(AllPurposeRecordingFacade)
  .inSingletonScope();
AppContainer.bind<IStoreFactory>(DIIdent.VUEX_STORE_FACTORY)
  .to(StoreFactory)
  .inSingletonScope();
AppContainer.bind<IStoreHolder>(DIIdent.VUEX_STORE)
  .to(StoreHolder)
  .inSingletonScope();
AppContainer.bind<KVPersistenceProvider<string, any>>(
  DIIdent.PERSISTENCE_PROVIDER
)
  .to(IndexedDBPersistenceProvider)
  .inSingletonScope();
export { AppContainer };
