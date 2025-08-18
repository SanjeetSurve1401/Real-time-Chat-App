import { useState } from 'react'
import { LayoutDashboardIcon } from 'lucide-react'
import {Link} from 'react-router'
import useSignUp from '../../hooks/useSignUp.js'

const SignUpPage = () => {

  const [signupData, setSignupData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    gender: "",
    password: "",
  });

  // Created a cutom hook
  const {isPending, error, singupMutation} = useSignUp();

  const handleSignup = (e)=>{
    e.preventDefault();
    singupMutation(signupData)
  }
  return (
    <div className='h-screen flex items-center justify-center p-4 sm:p-6 md:p-8'data-theme="forest">
      <div className='border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden'>

        {/* Signup FORM LEFT SIDE */}
        <div className='w-full lg:w-1/2 p-4 sm:p-8 flex flex-col'>

        {/* Logo */}
        <div className='mb-4 flex items-center justify-start gap-2'>
          <LayoutDashboardIcon className="size-9 text-primary" />
          <span className='text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider'>
              Chatify
          </span>
        </div>

        {/* Error message if any */}
        {error && (
          <div className="alert alert-error mb-4">
            <span>{error.response.data.message}</span>
          </div>
        )}

        {/* SignUp FORM */}
        <div className='w-full'>
          <form onSubmit={handleSignup}>
            <div className='space-y-4'>
              <div>
                <h2 className='text-xl font-semibold'>Create an Account</h2>
                <p className='text-sm opacity-70'>
                  Join us to connect with friends and family!
                </p>
              </div>
              <div className='space-y-3'>

                {/* First Name */}
                <div className='form-control w-full'>
                  <label className='label'>
                    <span className='label-text'>First Name</span>
                  </label>
                  <input type="text" 
                    placeholder='Enter your First Name'
                    className='input input-bordered w-full'
                    value={signupData.firstName}
                    onChange={(e) => setSignupData({...signupData, firstName: e.target.value})}
                    required
                  />
                </div>
                
                {/* Last Name */}
                <div className='form-control w-full'>
                  <label className='label'>
                    <span className='label-text'>Surname</span>
                  </label>
                  <input type="text" 
                    placeholder='Enter your Surname'
                    className='input input-bordered w-full'
                    value={signupData.lastName}
                    onChange={(e) => setSignupData({...signupData, lastName: e.target.value})}
                    required
                  />
                </div>

                {/* Gender */}
                <div className='form-control w-full'>
                  <label className='label'>
                    <span className='label-text'>Gender</span>
                  </label>
                  <div className='flex items-center space-x-6'>
                    
                    <label className='flex items-center space-x-2'>
                      <input 
                        type="radio"
                        name='gender'
                        value='male'
                        className='radio radio-primary'
                        checked={signupData.gender === "male"}
                        onChange={(e) => setSignupData({...signupData, gender: e.target.value})}
                        required
                      />
                      <span>Male</span>
                    </label>

                    <label className='flex items-center space-x-2'>
                      <input 
                        type="radio"
                        name='gender'
                        value='female'
                        className='radio radio-primary'
                        checked={signupData.gender === "female"}
                        onChange={(e) => setSignupData({...signupData, gender: e.target.value})}
                        required
                      />
                      <span>Female</span>
                    </label>
                  </div>
                </div>

                {/* EMAIL */}
                <div className='form-control w-full'>
                  <label className='label'>
                    <span className='label-text'>Email</span>
                  </label>
                  <input type="email" 
                    placeholder='Enter your Email ID'
                    className='input input-bordered w-full'
                    value={signupData.email}
                    onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                    required
                  />
                </div>

                {/* Password */}
                <div className='form-control w-full'>
                  <label className='label'>
                    <span className='label-text'>Password</span>
                  </label>
                  <input type="password" 
                    placeholder='Enter your Password'
                    className='input input-bordered w-full'
                    value={signupData.password}
                    onChange={(e) => setSignupData({...signupData, password: e.target.value})}
                    required
                  />
                  <p className='text-xs opacity-70 mt-1'>
                    Password must be atleast 6 Characters
                  </p>  
                </div>

                {/* Agree statement */}
                <div className='form-control'>
                  <label className='label cursor-pointer justify-start gap-2'>
                    <input type="checkbox" className='checkbox checkbox-sm' required />
                    <span className='text-xs leading-tight'>
                      I agree to the {" "} 
                      <span className='text-primary hover:underline'>terms of services </span> and {" "}
                      <span className='text-primary hover:underline'>privacy policy</span>
                    </span>
                  </label>
                </div>
              </div>
              
              {/* Submit Button */}
              <button className='btn btn-primary w-full' type='submit'>
                {isPending ? (
                  <>                  
                  <span className='Loading loading-spinner loading-xs'></span>
                    Loading...
                  </>
  
                ) : (
                  "Create Account"
                )}
              </button>

              <div className='text-center mt-4'>
                <p className='text-sm'>
                  Already have an account?{" "}
                  <Link to="/login" className='text-primary hover:underline'>
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </form>
          
        </div>
        </div>

        {/* SINGUP FORM - RIGHT SIDE */}
        <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
          <div className="max-w-md p-8">
            {/* Illustration */}
            <div className="relative aspect-square max-w-sm mx-auto">
              <img src="/i.png" alt="Langugae connection illustation" className='w-full h-full' />
            </div>

            <div className="text-center space-y-3 mt-6">
              <h2 className='text-xl font-semibold'>Connect with language partners worldwide</h2>
              <p className='opacity-70'>
                Practice conversations, make friends, and improve your language skills together  
              </p>
            </div>
          </div>
        </div>


      </div>
    </div>
  )
}

export default SignUpPage