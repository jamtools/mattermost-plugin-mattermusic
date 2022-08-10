import { ArrowDown } from "@/components/icons/IconArrows";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

const OurTeams = ({ teams }) => {

  const [expand, setExpand] = useState(true)
  const [bodyHeight, setBodyHeight] = useState() 

  const body = useRef(null)

  useEffect(() => {
    setBodyHeight(body.current.clientHeight)
  }, [])

  useLayoutEffect(() => {
    function updateSize() {
      if(body.current.clientHeight !== 0) {
        setBodyHeight(body.current.clientHeight);
      }
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  
  return (
    <div className="pb-5">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-medium  ">
          Our Teams
        </h2>
        <button onClick={() => setExpand(val => !val)} className={`p-2 rounded-md hover:bg-white/5 transition duration-300 ${!expand ? 'rotate-180' : ''}`} aria-label="expand">
          <ArrowDown />
        </button>
      </div>
      <div ref={body} className="transition-all duration-300 overflow-hidden" style={{ maxHeight: expand ? (bodyHeight+50)+'px' : '0px' }}>
        <div className="grid grid-cols-5 gap-5 mr-3">
          {teams.map((team, i) => (
            <img src={team} className="w-10 h-10 rounded-full overflow-hidden" alt="team" key={i} />
          ))}
        </div>
        <p className="mt-5 text-gray text-sm mb-5">
          When you join a team, st should ask you if  you want to publish your membership here
        </p>
        <button className="w-full py-3 rounded-md bg-primary text-lg font-medium" aria-label="join">
          Join Membership
        </button>
      </div>
    </div>
  )
}

export default OurTeams