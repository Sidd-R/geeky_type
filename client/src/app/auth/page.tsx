"use client";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";

const AuthForm = () => {

  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSwitchForm = () => {
    setIsLogin(!isLogin);
  };

  const handleLoginSubmit = async (e:React.FormEvent) => {
    e.preventDefault();
    console.log("Logging in with email:", email, "and password:", password);
  
    // Construct your API endpoint URL
    const apiUrl = process.env.NEXT_PUBLIC_SERVER_URL+"api/user/login"; // Replace this with your actual API endpoint
  
    // Construct the request body (if needed)
    const requestBody = {
      email: email,
      password: password,
    };
  
    try {
      // Make a POST request to the API
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
  
      if (!response.ok) {
        throw new Error("API request failed");
      }
  
      const data = await response.json();
      console.log("API Response:", data);

      const { token, _id } = data;

      toast.success("Login successful!", {
        position: "top-center",
        autoClose: 3000, // Toast will automatically close after 3000ms (3 seconds)
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      const now = new Date();
      const expiryDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

      // Set the cookies with JWT token and _id and expiry of 30 days
      Cookies.set("jwt_token", token, { expires: expiryDate, path: "/" });
      Cookies.set("_id", _id, { expires: expiryDate, path: "/" });
      window.location.href = '/profile';
      // Handle the API response data here
    } catch (error) {
      console.error("Error occurred during API request:", error);
      toast.error("Login failed. Please try again.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };
  
  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(
      "Signing up with name:",
      name,
      "email:",
      email,
      "and password:",
      password
    );
  
    // Construct your API endpoint URL
    const apiUrl = process.env.NEXT_PUBLIC_SERVER_URL+"api/user"; // Replace this with your actual API endpoint
  
    // Construct the request body (if needed)
    const requestBody = {
      name: name,
      email: email,
      password: password,
    };
  
    try {
      // Make a POST request to the API
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
  
      if (!response.ok) {
        throw new Error("API request failed");
      }
  
      const data = await response.json();
      console.log("API Response:", data);

      toast.success("Signup successful!Login to Continue", {
        position: "top-center",
        autoClose: 3000, // Toast will automatically close after 3000ms (3 seconds)
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      // Handle the API response data here
    } catch (error) {
      console.error("Error occurred during API request:", error);
      toast.error("SignUp failed. Please try again.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };
  

  return (
    <div className="center-container">
      <div className="form-container glassmorphism text-gray-800">
        {isLogin ? (
          <>
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Login</h2>
            <form onSubmit={handleLoginSubmit}>
              <div>
                <label>Email:</label>
                <input
                  className="form-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label>Password:</label>
                <input
                  className="form-input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button className="form-submit w-full">
                Login
              </button>
            </form>
            <div className="switch-button">
              <button
                className="form-submit w-full bg-purple-500 hover:bg-purple-700"
                onClick={handleSwitchForm}
              >
                Switch to Signup
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">Signup</h2>
            <form onSubmit={handleSignupSubmit}>
              <div>
                <label>Name:</label>
                <input
                  className="form-input"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label>Email:</label>
                <input
                  className="form-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label>Password:</label>
                <input
                  className="form-input"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div>
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={handleShowPassword}
                />
                <label>Show Password</label>
              </div>
              <button className="form-submit w-full">
                Signup
              </button>
            </form>
            <div className="switch-button">
              <button
                className="form-submit w-full bg-purple-500 hover:bg-purple-700"
                onClick={handleSwitchForm}
              >
                Switch to Login
              </button>
            </div>
          </>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default AuthForm;