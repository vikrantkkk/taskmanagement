import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useUpdateUserProfileMutation } from "../redux/api/userApi";
import { updateUserProfile } from "../redux/userSlice";
import { useSnackbar } from "notistack";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

const MyAccountProfile = () => {
  const { user } = useSelector((state) => state.auth);
  const { enqueueSnackbar } = useSnackbar();
  const [profileImage, setProfileImage] = useState(
    user?.profilePic || user?.user?.profilePic || "default-avatar.png"
  );
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [updateUserProfileMutation] = useUpdateUserProfileMutation();
  const dispatch = useDispatch();

  
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
  });


  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

 
  React.useEffect(() => {
    setValue("name", user?.name || user?.user?.name || "");
    setValue("email", user?.email || user?.user?.email || "");
  }, [user, setValue]);

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1 * 1024 * 1024) {
        enqueueSnackbar("File size exceeds 1MB", { variant: "error" });
        return;
      }
      if (!file.type.startsWith("image/")) {
        enqueueSnackbar("Please select an image file", { variant: "error" });
        return;
      }
      setProfileImage(URL.createObjectURL(file));
      setProfilePicFile(file);
    }
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      if (profilePicFile) {
        formData.append("images", profilePicFile);
      }

      const response = await updateUserProfileMutation(formData).unwrap();
      dispatch(updateUserProfile(response));
      enqueueSnackbar(response?.message, { variant: "success" });
    } catch (error) {
      enqueueSnackbar("Error updating profile", { variant: "error" });
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-semibold mb-4">My Account Profile</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
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
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            id="name"
            type="text"
            {...register("name")}
            className={`mt-1 block w-full p-2 border ${
              errors.name ? "border-red-500" : "border-gray-300"
            } rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>

        <div className="mb-6">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register("email")}
            className={`mt-1 block w-full p-2 border ${
              errors.email ? "border-red-500" : "border-gray-300"
            } rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>

        <button type="submit" className="w-full bg-[#673AB7] text-white p-2 rounded-md">
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default MyAccountProfile;
