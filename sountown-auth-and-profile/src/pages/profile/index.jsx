import SoundPlayer from "@/components/SoundPlayer"
import { Outlet, useLocation } from "react-router-dom"
import SearchInput from "@/components/SearchInput"
import ProfileDescription from "@/pages/profile/ProfileDescription"

const Profile = () => {

  const location = useLocation();

  return (
    <div className="relative flex flex-col lg:flex-row">
      <aside className={`w-full lg:w-[350px] lg:sticky top-0 h-full bg-secondary ${location.pathname === '/profile' ? 'block' : 'hidden lg:block'}`}>
        <ProfileDescription />
      </aside>
      <main className="w-full lg:w-[calc(100vw-350px)]">
        
        <div className={`flex flex-col w-full px-0 text-white ${location.pathname === '/profile' ? 'pt-5' : 'lg:pt-5'}`}>
          <SearchInput />
          
          <Outlet />
          
        </div>
      </main>
      <SoundPlayer />
    </div>
  )
}

export default Profile