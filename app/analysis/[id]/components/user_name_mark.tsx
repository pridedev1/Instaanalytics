const UserNameMark = ({ profileData }: { profileData: any }) => {
  return (
    <div className="absolute top-4 left-4 text-sm font-medium text-gray-600">
      {profileData.full_name !== undefined
        ? profileData.full_name
        : profileData.username}
    </div>
  );
};
export default UserNameMark;
