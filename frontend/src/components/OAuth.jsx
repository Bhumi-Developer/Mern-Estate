import axios from "axios";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase"; // make sure this path matches your setup
import { useDispatch } from "react-redux";
import { signInSuccess, signInFailure, signInStart } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      
      const result = await signInWithPopup(auth, provider);
      dispatch(signInStart());
      const response = await axios.post(
        "/api/auth/google",
        {
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        },
        {
          withCredentials: true, 
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      dispatch(signInSuccess(response.data));
      navigate("/");
  
    } catch (error) {
      console.error("Google sign-in error:", error.response?.data || error.message);
      dispatch(signInFailure(error.response?.data?.message || "Google sign-in failed"));
    }
  };
  return (
    <button
      onClick={handleGoogleClick}
      type='button'
      className='bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95'
    >
      Continue with Google
    </button>
  );
}
