const ProfileBio = ({ bio }) => {
  return (
    <div className="mb-10">
      <h2 className="text-lg font-medium mb-3">
        Bio Profile
      </h2>
      <p className="text-sm text-gray w-[80%]">
        {bio}
      </p>
    </div>
  )
}

export default ProfileBio