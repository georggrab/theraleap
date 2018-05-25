import Vue from "vue";
import { getStoreAccessors } from "vuex-typescript";

import { GenericHandTrackingData } from "@/devices/generic";
import { DeviceState } from "@/state/modules/device";
import { KVPersistenceProvider } from "@/state/persistence";
import { RootState } from "@/state/store";

export interface RecordState {
  recordings: { [id: string]: HandTrackRecording };
  totalRecordings: number;
  activatedId: number | undefined;
  persist: boolean;
}

export interface HandTrackRecording {
  id: number;
  name: string;
  recording: Record[];
  created: boolean;
  creationDate?: number;
  duration?: number;
  size?: number;
}

export interface Record {
  time: number;
  data: any;
}

export const record = {
  namespaced: true,
  state: {
    recordings: {},
    totalRecordings: 0,
    activatedId: undefined,
    persist: false
  },
  getters: {
    getRecordings: (state: RecordState) => state.recordings,
    getRecordingsSortedDescending: (state: RecordState) =>
      Object.keys(state.recordings)
        .map(k => parseInt(k))
        .reverse()
        .map(k => state.recordings[k]),
    getActivatedId: (state: RecordState) => state.activatedId,
    getActiveRecording: (state: RecordState): HandTrackRecording | undefined =>
      state.activatedId ? state.recordings[state.activatedId] : undefined,
    getTotalRecordings: (state: RecordState) => state.totalRecordings,
    hasRecordInCreation: (state: RecordState) =>
      Object.keys(state.recordings)
        .map(k => state.recordings[k])
        .filter(rec => !rec.created).length >= 1,
    getPersist: (state: RecordState) => state.persist
  },
  mutations: {
    clearRecordings: (
      state: RecordState,
      payload: { persistor?: KVPersistenceProvider<string, any> }
    ) => {
      state.recordings = {};
      state.totalRecordings = 0;
      if (state.persist && payload.persistor) {
        payload.persistor.clear();
      }
    },
    updateRecording: (
      state: RecordState,
      update: {
        id: number;
        update: Partial<HandTrackRecording>;
        persistor?: KVPersistenceProvider<string, any>;
      }
    ) => {
      const updatedObject = {
        ...state.recordings[update.id],
        ...update.update
      };
      state.recordings[update.id] = updatedObject;
      if (state.persist && update.persistor) {
        update.persistor.update(update.id.toString(), updatedObject);
      }
    },
    addRecording: (
      state: RecordState,
      {
        recording,
        persistor
      }: {
        recording: HandTrackRecording;
        persistor: KVPersistenceProvider<string, any> | undefined;
      }
    ) => {
      Vue.set(state.recordings as any, recording.id, recording);
      state.totalRecordings++;
      if (state.persist && persistor) {
        persistor.put(recording.id.toString(), recording);
      }
    },
    deleteRecording: (
      state: RecordState,
      {
        id,
        persistor
      }: {
        id: number;
        persistor: KVPersistenceProvider<string, any> | undefined;
      }
    ) => {
      Vue.delete(state.recordings as any, id);
      state.totalRecordings--;
      if (state.persist && persistor) {
        persistor.delete(id.toString());
      }
    },
    setActivatedId: (state: RecordState, id: number) => {
      state.activatedId = id;
    },
    setPersist: (state: RecordState, persist: boolean) => {
      state.persist = persist;
    }
  }
};

const { commit, read, dispatch } = getStoreAccessors<RecordState, RootState>(
  "record"
);

export const getRecordings = read(record.getters.getRecordings);
export const getActiveRecording = read(record.getters.getActiveRecording);
export const getRecordingsSortedDescending = read(
  record.getters.getRecordingsSortedDescending
);
export const getActivatedId = read(record.getters.getActivatedId);
export const getTotalRecordings = read(record.getters.getTotalRecordings);
export const getPersist = read(record.getters.getPersist);
export const hasRecordInCreation = read(record.getters.hasRecordInCreation);

export const clearRecordings = commit(record.mutations.clearRecordings);
export const addRecording = commit(record.mutations.addRecording);
export const updateRecording = commit(record.mutations.updateRecording);
export const deleteRecording = commit(record.mutations.deleteRecording);
export const setActivatedId = commit(record.mutations.setActivatedId);
export const setPersist = commit(record.mutations.setPersist);
