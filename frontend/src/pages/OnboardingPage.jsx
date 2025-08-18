import { useState } from "react";
import useAuthUser from "../../hooks/useAuthUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast, { LoaderIcon } from "react-hot-toast";
import { completeOnBoarding } from "../lib/api.js";
import { CameraIcon, ShuffleIcon, MapPinIcon, ShipWheelIcon} from 'lucide-react'
import { LANGUAGES } from "../constants/index.js";

// put this at top of OnboardingPage.jsx
const avatars = import.meta.glob("../assets/*.png", { eager: true, import: "default" });

function resolveAvatar(path) {
  if (!path) return "";
  const filename = path.split("/").pop(); // e.g. M-1.png
  return avatars[`../assets/${filename}`]; // returns actual import URL
}

const OnboardingPage = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();

  const [formState, setFormState] = useState({
    firstName: authUser?.firstName || "",
    lastName: authUser?.lastName || "",
    bio: authUser?.bio || "",
    nativeLanguage: authUser?.nativeLanguage,
    learningLanguage: authUser?.learningLanguage,
    location: authUser?.location,
    profilePicture: authUser?.profilePicture,
  });

  const { mutate: onboardingMutation, isPending } = useMutation({
    mutationFn: completeOnBoarding,
    onSuccess: () => {
      toast.success("Profile onboarded successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },

    onError:(error) =>{
      toast.error(error.response.data.message);
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault();

    onboardingMutation(formState);
  }

  const handleRandomAvatar = () =>{
    const idx = Math.floor(Math.random() * 100) + 1;
    const RandomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;
    setFormState({...formState, profilePicture: RandomAvatar});
    toast.success("Random profile picture generated!")
  }
  
  // UI
  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
      <div className="card bg-base-200 w-full max-w-3xl shadow-xl">
        <div className="card-body p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">Complete Your Profile</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Create a icon for our profile Picture Profile container */}
            <div className="flex flex-col items-center justify-center space-y-4">
             <div className="size-32 rounded-full bg-base-200 overflow-hidden">
               {formState.profilePicture ? (
                <img
                  src={formState.profilePicture}
                  alt="Profile Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <CameraIcon className="size-12 text-base-content opacity-40" />
                </div>
              )}
             </div>

              {/* Generate the Random Avatar */}
             <div className="flex items-center gap-2">
              <button type="button" onClick={handleRandomAvatar} className="btn btn-accent">
                <ShuffleIcon className="size-4 mr-2"/>
                Generate Random Avatar
              </button>
             </div>
            </div>

              {/* First Name and Last Name side by side */}
              <div className="flex gap-4">
                <div className="form-control w-1/2">
                  <label className="label">
                    <span className="label-text"> First Name</span>
                  </label>
                  <input 
                    type="text"
                    name="firstName" 
                    value={formState.firstName}
                    onChange={(e) => setFormState({...formState, firstName:e.target.value})}
                    className="input input-bordered w-full"
                    placeholder="Your First Name"                  
                  />
                </div>

                <div className="form-control w-1/2">
                  <label className="label">
                    <span className="label-text"> Last Name</span>
                  </label>
                  <input 
                    type="text"
                    name="lastName" 
                    value={formState.lastName}
                    onChange={(e) => setFormState({...formState, lastName:e.target.value})}
                    className="input input-bordered w-full"
                    placeholder="Your Last Name"                  
                  />
                </div>
              </div>

              {/* BIO */}
               <div className="form-control">
                <label className="label">
                  <span className="label-text"> Bio</span>
                </label>
                <input 
                  name="bio" 
                  value={formState.bio}
                  onChange={(e) => setFormState({...formState, bio:e.target.value})}
                  className="input textarea-bordered h-24"
                  placeholder="Tell other about yourself and your languages learning goals"                  
                  />
              </div>

              {/* Languages */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Native Language */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Native language</span>
                  </label>
                  <select 
                    name="nativeLanguage" 
                    value={formState.nativeLanguage}
                    onChange={(e) => setFormState ({...formState, nativeLanguage:e.target.value})}
                    className="select select-boardered w-full"
                    >
                    <option value="">Select your native language </option>
                    {LANGUAGES.map((lang) =>(
                      <option key= {`native-${lang}`}value={lang.toLowerCase()}>
                        {lang}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Learning Language */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Learning language</span>
                  </label>
                  <select 
                    name="learningLanguage" 
                    value={formState.learningLanguage}
                    onChange={(e) => setFormState ({...formState, learningLanguage:e.target.value})}
                    className="select select-boardered w-full"
                    >
                    <option value="">Select your learning language </option>
                    {LANGUAGES.map((lang) =>(
                      <option key= {`learning-${lang}`}value={lang.toLowerCase()}>
                        {lang}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Location */}
              <div className="form-control">
                  <label className="label">
                    <span className="label-text">Location</span>
                  </label>
                  <div className="relative">
                    <MapPinIcon className="absolute top-1/2 transform -translate-y-1/2 left-3 size-5 text-base-content opacity-70"/>
                    <input 
                      type="text" 
                      name="location"
                      value={formState.location}
                      onChange={(e) => setFormState ({ ...formState, location:e.target.value})}
                      className="input input-bordered w-full pl-10"
                      placeholder="City, Country"
                    />
                  </div>
              </div>

                {/* Button */}
              <button className="btn btn-primary w-full" disabled={isPending} type="submit">
                  {!isPending ?(
                    <>
                    <ShipWheelIcon className="size-5 mr-2"/>
                    Complete Onboarding
                    </>
                  ) :(
                    <>
                    <LoaderIcon className="size-5 mr-2"/>
                    Onboarding...
                    </>
                  )}
              </button>
              

              
          </form>
        </div>
      </div>
    </div>




  )
}

export default OnboardingPage