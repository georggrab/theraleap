import { Store } from "vuex";
import { RootState } from '@/state/store';
import * as record from '@/state/modules/record';
import * as device from './modules/device';

/**
 * Determines whether a salvagable Tracking Data Stream
 * exists, no matter where it is actually coming from.
 * Similar to device.getConnectionHealthy(), but takes into
 * account other Device Tracking Data Stream sources, such as
 * recordings
 * @param store The VueX Root Store
 */
export const hasSalvagableStream = (store: Store<RootState>): boolean => {
    if (record.getActiveRecording(store) !== undefined) {
      return true;
    }
    const deviceConnectionHealthy = device.getConnectionHealthy(store);
    if (deviceConnectionHealthy === undefined || deviceConnectionHealthy === false) {
        return false;
    }
    return true;
}