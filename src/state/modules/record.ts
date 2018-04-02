import { GenericHandTrackingData } from '../../devices/generic';
import { getStoreAccessors } from 'vuex-typescript';
import { DeviceState } from './device';
import { RootState } from '../store';
import Vue from 'vue';

export interface RecordState {
    recordings: { [id: number]: HandTrackRecording };
    totalRecordings: number;
}

export interface HandTrackRecording {
    id: number;
    name: string;
    data: GenericHandTrackingData[];
    created: boolean;
    creationDate?: number;
    duration?: number;
    size?: number;
}

export const record = {
    namespaced: true,
    state: {
        recordings: {},
        totalRecordings: 0
    },
    getters: {
        getRecordings: (state: RecordState) => state.recordings,
        getTotalRecordings: (state: RecordState) => state.totalRecordings
    },
    mutations: {
        clearRecordings: (state: RecordState) => { state.recordings = {}; },
        updateRecording: (state: RecordState, update: {id: number, update: Partial<HandTrackRecording>}) => {
            state.recordings[update.id] = { ...state.recordings[update.id], ...update.update };
        },
        addRecording: (state: RecordState, recording: HandTrackRecording) => { 
            Vue.set(state.recordings as any, recording.id, recording);
            state.totalRecordings++;
        }
    }
}

const { commit, read, dispatch } =
    getStoreAccessors<RecordState, RootState>("record");

export const getRecordings = read(record.getters.getRecordings);
export const getTotalRecordings = read(record.getters.getTotalRecordings);

export const clearRecordings = commit(record.mutations.clearRecordings);
export const addRecording = commit(record.mutations.addRecording);
export const updateRecording = commit(record.mutations.updateRecording);