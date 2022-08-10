import { useAtom } from "jotai";

import {posts} from '../dummy-data/posts'

import { 
  soundId,
  soundTitle, 
  soundAuthor, 
  soundDuration,
  soundUrl, 
  soundIsPlaying,
  soundSeek 
} from '@/store/soundplay'; 
import { useState } from "react";
import { PlayIcon } from "./icons/IconSoundPlayer";
import { soundCommentIsPlaying } from "../store/soundplay_comment";
import secondsToMinutes from "../utils/secondsToMinutes";

const Playlist = () => {

  const [id, setId] = useAtom(soundId)
  const [title, setTitle] = useAtom(soundTitle)
  const [author, setAuthor] = useAtom(soundAuthor)
  const [duration, setDuration] = useAtom(soundDuration)
  const [url, setUrl] = useAtom(soundUrl)
  
  const [seek, setSeek] = useAtom(soundSeek)
  const [isPlaying, setIsPlaying] = useAtom(soundIsPlaying)

  const [isSoundSame, setIsSoundSame] = useState(false)
  const [isCommentPlaying, setIsCommentPlaying] = useAtom(soundCommentIsPlaying)

  const playSound = (data) => {
    if(id !== data?.id) {
      setSeek(0)
      setId(data?.id)
      setTitle(data?.title)
      setAuthor(data?.author)
      setDuration(data?.duration)
      setUrl(data?.musicUrl)
    }
    setIsSoundSame(true)
    setIsPlaying(true)
    setIsCommentPlaying(false)
  }

  return (
    <div id="playlist" className="pt-10  max-w-screen-md">
      <h3 className="text-2xl font-medium mb-5">
        Playlist
      </h3>
      <div className="-ml-3 lg:ml-0">
        <header className="grid grid-cols-12 gap-1 bg-dark py-2 pl-2 lg:pl-1 pr-10 text-sm lg:text-base">
          <div className="col-span-1"></div>
          <div className="pl-2 lg:pl-1 col-span-10 lg:col-span-7">Name</div>
          <div className="hidden lg:block col-span-3">Composer</div>
          <div className="col-span-1">Time</div>
        </header>
        <ul className="bg-secondary divide-y divide-dark pb-36 lg:pb-0">
          {
            posts.map((post, i) => (
              <li onClick={() => playSound(post)} className="grid grid-cols-12 items-center gap-1 py-4 pl-2 lg:pl-1 pr-10 cursor-pointer hover:bg-dark/30 transition" key={post.id}>
                <div className="col-span-1 justify-self-center text-sm lg:text-base">
                  {post.id === id ? (
                    <div className="bg-primary rounded-full w-5 lg:w-6 h-5 lg:h-6 p-1.5 flex items-center justify-center">
                      <PlayIcon/>
                    </div>
                  ) : String(++i).padStart(2, '0')}
                </div>
                <div className={`pl-2 lg:pl-1 col-span-10 lg:col-span-7 text-sm lg:text-base ${post.id === id && 'text-primary'}`}>
                  <div className="truncate">{post.title}</div>
                  <div className="lg:hidden text-xs opacity-50 mt-0.5">{post.author}</div>
                </div>
                <div className="hidden lg:block col-span-3">
                  {post.author}
                </div>
                <div className="col-span-1 text-sm lg:text-base">
                  {secondsToMinutes(post.duration)}
                </div>
              </li>
            ))
          }
        
        </ul>
      </div>
    </div>
  )
}

export default Playlist