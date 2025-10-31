import { useSelector } from 'react-redux';
import { useRef, useState, useEffect ,react} from 'react';
import { Link } from 'react-router-dom';
import { updateUserFailure,updateUserStart,updateUserSuccess,deleteUserFailure,deleteUserStart,deleteUserSuccess,signOutUserFailure,signOutUserSuccess,signOutUserStart } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import axios from 'axios'

const Profile = () => {
  // const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  console.log(currentUser)
  // const [file,setFile] = useState(undefined)
  const [formData,setFormData] = useState({})
  const [updateSuccess,setUpdateSuccess] = useState(false)
  const dispatch = useDispatch()
  
  // useEffect(()=>{
  //   if(file){
  //     handleFileUpload(file)
  //   }
  // },[file])

  const handleChange = (e) =>{
    setFormData({
      ...formData,
     
      [e.target.id]: e.target.value
    })
  }

  const handleSubmit = async(e) =>{
    e.preventDefault()
    try {
      dispatch(updateUserStart())
      const response = await axios.post(`/api/user/update/${currentUser.user._id}`,formData,{
        withCredentials:true,
        headers: {
          'Content-Type':"application/json"
        },
      })
      dispatch(updateUserSuccess(response.data.user))
      setUpdateSuccess(true)
    } catch (error) {
      console.log(error)
      dispatch(updateUserFailure(error.response?.data?.message))
    }
  }
  
  const handleDeleteUser = async(e) =>{
    try {
      dispatch(deleteUserStart())
      const response = await axios.delete(`/api/user/delete/${currentUser.user._id}`)
      dispatch(deleteUserSuccess(response.data))
    } catch (error) {
      dispatch(deleteUserFailure(error.response?.data?.message))
    }
  }

  const handleSignOut = async(e) =>{
    try {
      dispatch(signOutUserStart())
      const response = await axios.get('/api/auth/signout')
      dispatch(signOutUserSuccess(response.data))
    } catch (error) {
      dispatch(signOutUserFailure(error.response?.data?.message))
    }
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
    <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
    <form 
    onSubmit={handleSubmit} 
    className='flex flex-col gap-4'>
      <img
        // onClick={() => fileRef.current.click()}
        src={ currentUser?.user?.avatar || currentUser?.avatar
          || "https://i.pinimg.com/736x/f2/00/81/f2008172601ae0e0710a02cf2ed2ea5b.jpg"}
        alt='profile'
        className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'
      />
      {/* <p className='text-sm self-center'>
        {fileUploadError ? (
          <span className='text-red-700'>
            Error Image upload (image must be less than 2 mb)
          </span>
        ) : filePerc > 0 && filePerc < 100 ? (
          <span className='text-slate-700'>{`Uploading ${filePerc}%`}</span>
        ) : filePerc === 100 ? (
          <span className='text-green-700'>Image successfully uploaded!</span>
        ) : (
          ''
        )}
      </p> */}
      <input
        type='text'
        placeholder='username'
        defaultValue={currentUser?.newUser?.username || currentUser?.user?.username}
        id='username'
        className='border p-3 rounded-lg'
        onChange={handleChange}
      />
      <input
        type='email'
        placeholder='email'
        id='email'
        defaultValue={currentUser?.newUser?.email || currentUser?.user?.email}
        className='border p-3 rounded-lg'
        onChange={handleChange}
      />
      <input
        type='password'
        placeholder='password'
        onChange={handleChange}
        id='password'
        className='border p-3 rounded-lg'
      />
      <button
        disabled={loading}
        className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'
      >
        {loading ? 'Loading...' : 'Update'}
      </button>
      <Link
        className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95'
        to={'/create-listing'}
      >
        Create Listing
      </Link>
    </form>
    <div className='flex justify-between mt-5'>
      <span
        onClick={handleDeleteUser}
        className='text-red-700 cursor-pointer'
      >
        Delete account
      </span>
      <span 
      onClick={handleSignOut} 
      className='text-red-700 cursor-pointer'>
        Sign out
      </span>
    </div>

     <p className='text-red-700 mt-5'>{error ? error : ''}</p>
    <p className='text-green-700 mt-5'>
      {updateSuccess ? 'User is updated successfully!' : ''}
    </p>
    {/*<button onClick={handleShowListings} className='text-green-700 w-full'>
      Show Listings
    </button>
    <p className='text-red-700 mt-5'>
      {showListingsError ? 'Error showing listings' : ''}
    </p> */}

    {/* {userListings && userListings.length > 0 && (
      <div className='flex flex-col gap-4'>
        <h1 className='text-center mt-7 text-2xl font-semibold'>
          Your Listings
        </h1>
        {userListings.map((listing) => (
          <div
            key={listing._id}
            className='border rounded-lg p-3 flex justify-between items-center gap-4'
          >
            <Link to={`/listing/${listing._id}`}>
              <img
                src={listing.imageUrls[0]}
                alt='listing cover'
                className='h-16 w-16 object-contain'
              />
            </Link>
            <Link
              className='text-slate-700 font-semibold  hover:underline truncate flex-1'
              to={`/listing/${listing._id}`}
            >
              <p>{listing.name}</p>
            </Link>

            <div className='flex flex-col item-center'>
              <button
                onClick={() => handleListingDelete(listing._id)}
                className='text-red-700 uppercase'
              >
                Delete
              </button>
              <Link to={`/update-listing/${listing._id}`}>
                <button className='text-green-700 uppercase'>Edit</button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    )} */}
  </div>
);
}

export default Profile
