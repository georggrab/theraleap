import { GenericHandTrackingData } from '../../devices/generic';
import { getStoreAccessors } from 'vuex-typescript';
import { DeviceState } from './device';
import { RootState } from '../store';
import Vue from 'vue';

export interface RecordState {
    recordings: { [id: string]: HandTrackRecording };
    totalRecordings: number;
    activatedId: number | undefined;
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
        activatedId: undefined
    },
    getters: {
        getRecordings: (state: RecordState) => state.recordings,
        getRecordingsSortedDescending: (state: RecordState) =>
            Object.keys(state.recordings)
                .map(k => parseInt(k))
                .reverse()
                .map(k => state.recordings[k]),
        getActivatedId: (state: RecordState) => state.activatedId,
        getTotalRecordings: (state: RecordState) => state.totalRecordings,
        hasRecordInCreation: (state: RecordState) => 
            Object.keys(state.recordings)
                .map(k => state.recordings[k])
                .filter(rec => !rec.created).length >= 1
    },
    mutations: {
        clearRecordings: (state: RecordState) => { state.recordings = {}; },
        updateRecording: (state: RecordState, update: {id: number, update: Partial<HandTrackRecording>}) => {
            state.recordings[update.id] = { ...state.recordings[update.id], ...update.update };
        },
        addRecording: (state: RecordState, recording: HandTrackRecording) => { 
            Vue.set(state.recordings as any, recording.id, recording);
            state.totalRecordings++;
        },
        deleteRecording: (state: RecordState, id: number) => {
            Vue.delete(state.recordings as any, id);
            state.totalRecordings--;
        },
        setActivatedId: (state: RecordState, id: number) => {
            state.activatedId = id;
        }

    }
}

const { commit, read, dispatch } =
    getStoreAccessors<RecordState, RootState>("record");

export const getRecordings = read(record.getters.getRecordings);
export const getRecordingsSortedDescending = read(record.getters.getRecordingsSortedDescending);
export const getActivatedId = read(record.getters.getActivatedId);
export const getTotalRecordings = read(record.getters.getTotalRecordings);
export const hasRecordInCreation = read(record.getters.hasRecordInCreation);

export const clearRecordings = commit(record.mutations.clearRecordings);
export const addRecording = commit(record.mutations.addRecording);
export const updateRecording = commit(record.mutations.updateRecording);
export const deleteRecording = commit(record.mutations.deleteRecording);
export const setActivatedId = commit(record.mutations.setActivatedId);