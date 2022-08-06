import { atom } from "jotai";

export const soundTitle = atom('');
export const soundAuthor = atom('');
export const soundUrl = atom('');

export const soundSeek = atom(0)
export const soundIsPlaying = atom(false)
export const soundDuration = atom(0)
export const soundMuted = atom(false)
export const soundOnSeeking = atom(false)