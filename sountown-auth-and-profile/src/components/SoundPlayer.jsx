import { useEffect, useRef } from "react";
import ReactHowler from "react-howler";
import { useAtom } from "jotai";

import { 
  soundId,
  soundTitle, 
  soundAuthor, 
  soundUrl, 
  soundDuration, 
  soundIsPlaying, 
  soundMuted, 
  soundSeek,
  soundOnSeeking
} from '@/store/soundplay';

import SoundSeekSlider from "@/components/atom/SoundSeekSlider"
import { 
  PauseIcon, 
  PlayIcon, 
  MutedIcon, 
  UnmutedIcon 
} from "@/components/icons/IconSoundPlayer"

import secondsToMinutes from "@/utils/secondsToMinutes";
import { posts } from "../dummy-data/posts";

const SoundPlayer = () => {

  const [id, setId] = useAtom(soundId)
  const [title, setTitle] = useAtom(soundTitle)
  const [author, setAuthor] = useAtom(soundAuthor)
  const [url, setUrl] = useAtom(soundUrl)
  
  const [seek, setSeek] = useAtom(soundSeek)
  const [isPlaying, setIsPlaying] = useAtom(soundIsPlaying)
  const [duration, setDuration] = useAtom(soundDuration)
  const [muted, setMuted] = useAtom(soundMuted)
  const [isSeeking, setIsSeeking] = useAtom(soundOnSeeking)

  const playerRef = useRef(null)

  useEffect(() => {
    const seekInterval = setInterval(() => {
      setSeek(playerRef.current?.seek())
    }, 1000);

    return () => {
      clearInterval(seekInterval)
    }
  }, [playerRef])

  useEffect(() => {
    if(!isSeeking && isPlaying) playerRef.current.seek(seek)
  }, [isSeeking])
  

  const playSound = () => {
    url && setIsPlaying(val => !val)
  }

  const handleOnSeek = (value) => {
    setSeek(value)
  } 

  const muteSound = () => {
    let isMuted = playerRef.current.howler._muted
    setMuted(!isMuted)
    playerRef.current.mute(!isMuted)
  }

  const handleSoundEnd = () => {
    setIsPlaying(false)
    const next = function(data, id) {
      for (var i = 0; i < data.length; i++) {
        if(i === data.length - 1) {
          return data[0]
        }
        if (data[i].id === id) {
          return data[i + 1]
        }
      }
    };
    
    const nextSound = next(posts, id)
    
    setSeek(0)
    setId(nextSound?.id)
    setTitle(nextSound?.title)
    setAuthor(nextSound?.author)
    setDuration(nextSound?.duration)
    setUrl(nextSound?.musicUrl)
    setIsPlaying(true)
    
  }
  
  return (
    <div className="fixed bottom-0 right-0 z-20 w-full lg:w-[calc(100vw-400px)] h-20 lg:h-24 backdrop-blur-md lg:mr-7">
      <div className="relative z-10">
        <SoundSeekSlider 
          length={duration || 60} 
          disabled={!url} 
          onSeek={handleOnSeek} 
          seeking={val => setIsSeeking(val)} 
          currentTime={seek} 
        />
      </div>
      <div className="relative w-full h-full">
        <div className="absolute inset-0 bg-primary opacity-30 w-full h-full z-[-1]"></div>
        <div className="realtive z-20 h-full flex lg:grid items-center justify-between grid-cols-3 px-5 lg:px-12 -mt-1 gap-3">
          <div className="flex items-center gap-3 lg:gap-8 justify-self-start">
            {url && (
              <>
                <button onClick={playSound} className="w-6 h-6 flex items-center justify-center hover:opacity-80 transition text-primary" aria-label="play_pause">
                  {isPlaying ? <PauseIcon/> : <PlayIcon/>}
                </button>
                <div className="hidden md:block text-sm ">
                  {secondsToMinutes(seek || 0)} / {secondsToMinutes(duration)}
                </div>
              </>
            )}
          </div>
          {
            url ? (
              <div className="justify-self-center">
                <h4 className="">{title}</h4>
                <p className="block lg:hidden text-gray">{author}</p>
              </div>
            ) : <div className="justify-self-center opacity-40 text-sm italic text-center">
                  No sound selected, please select the sound to play
                </div>
          }
          <div className="justify-self-end">
            {url && (
              <button onClick={muteSound} className="hover:opacity-80 transition" aria-label="mute">
                {muted ? <MutedIcon/> : <UnmutedIcon/>}
              </button>
            )}
          </div>
        </div>
      </div>
      {url && (
        <ReactHowler
          src={url}
          playing={isPlaying}
          ref={(ref) => playerRef.current = ref}
          onEnd={handleSoundEnd}
          html5={true}
        />
      )}
    </div>
  )
}

export default SoundPlayer