import { SearchIcon } from "@/components/icons/IconSearch"
import { useState } from "react"
import { CloseIcon } from "./icons/CloseIcon"

const SearchInput = () => {

  const [open, setOpen] = useState(false)

  return <>
    <div className={`absolute top-4 left-0 right-0 lg:static flex items-center gap-3 mb-4 bg-secondary pr-12 lg:pr-4 px-4 py-2 rounded-xl mx-5 lg:mx-7 transition-transform duration-200 ${open ? 'translate-y-0' : 'translate-y-[-130%] lg:translate-y-0'}`}>
      <SearchIcon/>
      <input className="bg-transparent py-2 w-full focus:outline-none" placeholder="Search..." type="text" aria-label="search-input" />
    </div>
    <div className="absolute top-5 right-5 z-20 block lg:hidden">
      <button onClick={() => setOpen(val => !val)} className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center" aria-label="search">
        {open ? <CloseIcon /> : <SearchIcon/>}
      </button>
    </div>
  </>
}

export default SearchInput