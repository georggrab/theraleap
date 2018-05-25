import { inject, injectable } from "inversify";
import Vuex, { Store } from "vuex";

import DIIdent from "@/dependencyinjection/symbols";

import { debug, DebugState } from "@/state/modules/debug";
import { device, DeviceState } from "@/state/modules/device";
import { graphics, GraphicsState } from "@/state/modules/graphics";
import { record, RecordState } from "@/state/modules/record";
import { classifier, ClassifierState } from "./modules/classifiers";
import { persist, PersistorState } from "./modules/persistor";
import { preprocessors, PreProcessorsState } from "./modules/preprocessors";

import { DeviceDriver, DeviceFacade } from "devices";
import { KVPersistenceProvider } from "./persistence";
import {
  deviceConnector,
  deviceFacadeConnector
} from "./plugins/deviceConnector";
import { deviceDataTransferRate } from "./plugins/deviceExtras";
import { initializePersistence } from "./plugins/persistor";

export interface RootState {
  device: DeviceState;
  debug: DebugState;
  record: RecordState;
  graphics: GraphicsState;
  persist: PersistorState;
  classifiers: ClassifierState;
  preprocessors: PreProcessorsState;
}

export interface IStoreFactory {
  get(): Store<RootState>;
}

export interface IStoreHolder {
  store: Store<RootState> | undefined;
}

@injectable()
export class StoreHolder implements IStoreHolder {
  public store: Store<RootState> | undefined;
}

@injectable()
export class StoreFactory implements IStoreFactory {
  constructor(
    @inject(DIIdent.SERVICE_MOTION_TRACKING_DEVICE_FACADE)
    private facade: DeviceFacade,
    @inject(DIIdent.SERVICE_MOTION_TRACKING_DEVICE_DRIVER)
    private driver: DeviceDriver,
    @inject(DIIdent.VUEX_STORE) private storeHolder: IStoreHolder,
    @inject(DIIdent.PERSISTENCE_PROVIDER)
    private persistor: KVPersistenceProvider<string, any>
  ) {}

  public get(): Store<RootState> {
    if (!this.storeHolder.store) {
      this.storeHolder.store = new Vuex.Store<RootState>({
        modules: {
          device,
          debug,
          graphics,
          record,
          persist,
          preprocessors,
          classifier
        },
        plugins: [
          deviceConnector(this.driver),
          deviceFacadeConnector(this.facade),
          deviceDataTransferRate(this.facade),
          initializePersistence(this.persistor)
        ]
      });
    }
    return this.storeHolder.store;
  }
}
