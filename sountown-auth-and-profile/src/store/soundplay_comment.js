import { atom } from "jotai";

export const soundCommentUrl = atom('');

export const soundCommentSeek = atom(0)
export const soundCommentIsPlaying = atom(false)
export const soundCommentDuration = atom(0)
export const soundCommentOnSeeking = atom(false)