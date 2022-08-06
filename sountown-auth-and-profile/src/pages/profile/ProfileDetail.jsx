import ProfileDetailComment from "@/components/ProfileDetail/ProfileDetailComment"
import ProfileDetailSound from "@/components/ProfileDetail/ProfileDetailSound"

import { soundIsPlaying } from '@/store/soundplay';
import { soundCommentIsPlaying } from '@/store/soundplay_comment';
import { useAtom } from "jotai";
import { useEffect } from "react";

const ProfileDetail = () => {

  const [ isPlaying, setIsPlaying ] = useAtom(soundIsPlaying)
  const [ isCommentPlaying, setIsCommentPlaying ] = useAtom(soundCommentIsPlaying)

  useEffect(() => {
    if(isPlaying) setIsCommentPlaying(false)
    if(isCommentPlaying) setIsPlaying(false)
  }, [isPlaying, isCommentPlaying])

  return (
    <div className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-10 text-white overflow-hidden ">
      <ProfileDetailSound />
      <ProfileDetailComment />
    </div>  
  )
}

export default ProfileDetail