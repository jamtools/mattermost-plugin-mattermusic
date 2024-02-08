import { useAtom } from "jotai";
import ReactHowler from "react-howler";
import { useEffect, useRef } from "react";

import { IconAttachment, IconEmoticon } from "@/components/icons/IconComments";
import { comments } from "@/dummy-data/comments";

import { PlayIcon, PauseIcon } from "@/components/icons/IconSoundPlayer";
import SoundSeekSlider from "@/components/atom/SoundSeekSlider";

import {
  soundCommentUrl, 
  soundCommentDuration, 
  soundCommentIsPlaying,
  soundCommentSeek,
  soundCommentOnSeeking
} from '@/store/soundplay_comment';


import {
  soundIsPlaying
} from '@/store/soundplay';

import secondsToMinutes from "@/utils/secondsToMinutes";

const ProfileDetailComment = () => {

  const soundCommentRef = useRef()

  const [url, setUrl] = useAtom(soundCommentUrl)
  
  const [isGlobalSoundPlaying, setIsGlobalSoundPlaying] = useAtom(soundIsPlaying)
  const [duration, setDuration] = useAtom(soundCommentDuration)
  const [isPlaying, setIsPlaying] = useAtom(soundCommentIsPlaying)
  const [seek, setSeek] = useAtom(soundCommentSeek)
  const [isSeeking, setIsSeeking] = useAtom(soundCommentOnSeeking)

  useEffect(() => {
    return () => {
      setUrl('')
      setDuration(0)
      setIsPlaying(false)
      setSeek(0)
      setIsSeeking(false)
    }
  }, [])

  useEffect(() => {
    const seekInterval = setInterval(() => {
      setSeek(soundCommentRef.current?.seek())
    }, 1000);

    return () => {
      clearInterval(seekInterval)
    }
  }, [soundCommentRef])

  useEffect(() => {
    if(!isSeeking && isPlaying) soundCommentRef.current.seek(seek)
  }, [isSeeking])

  const playSound = (data) => {
    if(!isPlaying){
      setUrl(data.sound)
      setIsPlaying(false)
    }
    setIsPlaying(val => !val)
    setIsGlobalSoundPlaying(false)
  }

  const handleOnSeek = (value) => {
    setSeek(value)
  } 

  return (
    <section className="relative max-w-xl lg:max-w-none mx-auto mb-28 lg:mb-0 lg:pr-7">
        
      {/* comment list */}
      <div className="relative space-y-7 flex flex-col overflow-auto h-auto lg:h-[calc(100vh-330px)] mt-8 p-5 pb-10 bg-secondary">
        <div className="flex items-center justify-center gap-3 bg-secondary">
          <div className="h-px flex-grow bg-dark"></div>
          <time>July 22</time>
          <div className="h-px flex-grow bg-dark"></div>
        </div>

        {comments.map(comment => {
          return (
            <div className="flex flex-col flex-start gap-3" key={comment.id}>
              <div className="flex gap-3">
                <img className="w-14 h-14 rounded-full object-cover" src={comment.profileImage} alt="profile" />
                <div className="w-full">
                  <div className="flex items-center gap-3 lg:gap-5 mb-1">
                    <h3>{comment.user}</h3>
                    <time className="text-center text-gray text-sm lg:text-base">
                      {comment.date}
                    </time>
                  </div>
                  <div className="text-gray">
                    {comment?.title && (
                      <h1 className="text-4xl font-semibold mb-2 mt-1">{comment.title}</h1>
                    )}
                    <p className="text-sm lg:text-base">
                      {comment.message}
                    </p>
                  </div>
                </div>
              </div>
              {comment.withShare?.type == 'sound' && (
                <div className="pl-[4.25rem]">
                  <div className="border-l-4 border-primary pl-5">
                    <h4 className="text-white text-sm lg:text-lg mb-1">
                      {comment.withShare?.data.title}
                    </h4>
                    <time className="text-sm text-gray">
                      {secondsToMinutes(seek)} / {secondsToMinutes(comment.withShare?.data.duration)}
                    </time>
                    <div className="flex items-center gap-3 mt-3 w-full md:w-2/3">
                      <button onClick={() => playSound(comment.withShare?.data)} className="rounded-full h-6 w-7 flex items-center justify-center hover:opacity-80 transition" aria-label="play_pause">
                        {isPlaying ? <PauseIcon/> : <PlayIcon/>}
                      </button>
                      <div className="flex-grow rounded-full w-full">
                        <SoundSeekSlider
                          size="small"
                          rounded
                          isComment
                          length={duration || 60}
                          disabled={!url} 
                          onSeek={handleOnSeek} 
                          seeking={val => setIsSeeking(val)} 
                          currentTime={seek}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="bg-dark p-5">
        <div className="rounded-lg bg-black px-6 py-4 flex items-center">
          <input type="text" className="bg-transparent w-full focus:outline-none" placeholder="Message...." aria-label="message" />
          <div className="flex items-center gap-4 pl-4">
            <button className="hover:opacity-80 transition" aria-label="attachment">
              <IconAttachment />
            </button>
            <button className="hover:opacity-80 transition" aria-label="emoticon">
              <IconEmoticon />
            </button>
          </div>
        </div>
      </div>

      {url && (
        <ReactHowler
          src={url}
          playing={isPlaying}
          ref={(ref) => soundCommentRef.current = ref}
          onEnd={() => {setIsPlaying(false)}}
          html5={true}
        />
      )}

    </section>
  )
}

export default ProfileDetailComment