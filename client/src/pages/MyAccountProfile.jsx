import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useUpdateUserProfileMutation } from "../redux/api/userApi";
import { updateUserProfile } from "../redux/userSlice";

const MyAccountProfile = () => {
  const { user } = useSelector((state) => state.auth);
  const [profileImage, setProfileImage] = useState(
    user?.profilePic || user?.user?.profilePic || "default-avatar.png"
  );
  const [name, setName] = useState(user?.name || user?.user?.name || "");
  const [email, setEmail] = useState(user?.email || user?.user?.email || "");
  const [profilePicFile, setProfilePicFile] = useState(null);

  const [updateUserProfileMutation] = useUpdateUserProfileMutation();
  const dispatch = useDispatch();


  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      if (file.size > 1 * 1024 * 1024) {
        alert("File size exceeds 1MB");
        return;
      }

      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }

    
      setProfileImage(URL.createObjectURL(file));
      setProfilePicFile(file);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      if (profilePicFile) {
        formData.append("images", profilePicFile);
      }

      const response = await updateUserProfileMutation(formData).unwrap();
      dispatch(updateUserProfile(response));
      console.log("Profile updated successfully:", response);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-semibold mb-4">My Account Profile</h1>
      <form onSubmit={handleUpdateProfile}>
        <div className="flex flex-col items-center mb-6">
          <img
            src={profileImage}
            alt="Profile"
            className="w-32 h-32 object-cover rounded-full border border-gray-300"
          />
      
          <input
            type="file"
            accept="image/*"
            className="mt-2"
            id="profilePicInput"
            disabled={false} 
            style={{ display: "none" }} 
            onChange={handleProfilePicChange} 
          />
          <label
            htmlFor="profilePicInput"
            className="mt-2 bg-blue-500 text-white p-2 rounded-md cursor-pointer hover:bg-blue-600"
          >
            Choose a Profile Picture
          </label>
        </div>

        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default MyAccountProfile;