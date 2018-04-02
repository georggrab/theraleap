import { GenericHandTrackingData } from '../../devices/generic';
import { getStoreAccessors } from 'vuex-typescript';
import { DeviceState } from './device';
import { RootState } from '../store';

export interface RecordState {
    recordings: HandTrackRecording[];
}

export interface HandTrackRecording {
    name: string;
    data: GenericHandTrackingData[];
    creationDate: number | undefined;
    duration: number | undefined;
    size: number | undefined;
}

export const record = {
    namespaced: true,
    state: {
        recordings: []
    },
    getters: {
        getRecordings: (state: RecordState) => state.recordings
    },
    mutations: {
        clearRecordings: (state: RecordState) => { state.recordings = []; },
        addRecording: (state: RecordState, recording: HandTrackRecording) => { 
            state.recordings.push(recording);
        }
    }
}

const { commit, read, dispatch } =
    getStoreAccessors<RecordState, RootState>("record");

export const getRecordings = read(record.getters.getRecordings);

export const clearRecordings = commit(record.mutations.clearRecordings);
export const addRecording = commit(record.mutations.addRecording);