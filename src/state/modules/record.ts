import { GenericHandTrackingData } from '../../devices/generic';
import { getStoreAccessors } from 'vuex-typescript';
import { DeviceState } from './device';
import { RootState } from '../store';
import Vue from 'vue';

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
            state.activatedId? state.recordings[state.activatedId]: undefined,
        getTotalRecordings: (state: RecordState) => state.totalRecordings,
        hasRecordInCreation: (state: RecordState) => 
            Object.keys(state.recordings)
                .map(k => state.recordings[k])
                .filter(rec => !rec.created).length >= 1,
        getPersist: (state: RecordState) => state.persist,
    },
    mutations: {
        clearRecordings: (state: RecordState) => { 
            state.recordings = {}; 
            state.totalRecordings = 0;
        },
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
        },
        setPersist: (state: RecordState, persist: boolean) => {
            state.persist = persist;
        }
    }
}

const { commit, read, dispatch } =
    getStoreAccessors<RecordState, RootState>("record");

export const getRecordings = read(record.getters.getRecordings);
export const getActiveRecording = read(record.getters.getActiveRecording);
export const getRecordingsSortedDescending = read(record.getters.getRecordingsSortedDescending);
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