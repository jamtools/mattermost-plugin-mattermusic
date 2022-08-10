import defaultProfileCover from "@/assets/images/profile-cover.png";
import profileImage from "@/assets/images/profile-image.png";
import team1 from "@/assets/images/team-1.png";
import team2 from "@/assets/images/team-2.png";
import team3 from "@/assets/images/team-3.png";
import team4 from "@/assets/images/team-4.png";
import team5 from "@/assets/images/team-5.png";

import ProfileBio from "@/components/ProfileDescription/ProfileBio";
import SocialLinks from "@/components/ProfileDescription/SocialLinks";
import OurTeams from "@/components/ProfileDescription/OurTeams";

const ProfileDescription = () => {

  return (
    <div className="w-full text-white">
      <div className="w-full">
        <img className="w-full h-48 lg:h-36" src={defaultProfileCover} alt="profile cover" />
        <img src={profileImage} className="-mt-16 ml-5 w-[120px] h-[120px] rounded-full overflow-hidden object-cover" alt="profile" />
      </div>

      <div className="px-3 lg:px-5 pt-7">
        <div>
          <h1 className=" text-lg font-medium">
            Andre Rio
          </h1>
          <h2 className="text-primary">
            @andrerio_user
          </h2>
        </div>

        <div className="py-10 flex items-center gap-5">
          <a href="#playlist" className="w-28 py-3 rounded-md bg-primary text-center" aria-label="play">
            Play
          </a>
          <a href="#" className="w-28 py-3 rounded-md border border-gray text-center">
            Follow Us
          </a>
        </div>

        <ProfileBio bio="Vocals, drums, keys, basson w/ Ableton Live I like jamming" />

        <SocialLinks
          twitter={'https://twitter.com/user'}
          bandcamp={'https://bandcamp.com/user'}
          instagram={'https://instagram.com/user'}
        />

        <OurTeams teams={[team1, team2, team3, team4, team5]} />

      </div>
      
    </div>
  )
}

export default ProfileDescription