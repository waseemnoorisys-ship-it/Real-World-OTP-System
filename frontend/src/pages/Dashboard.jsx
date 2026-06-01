// // import { useEffect, useState } from "react";
// import React, { useEffect, useState } from "react"
// import axios from "axios";
// import api from "../services/api";
// import { useNavigate } from "react-router-dom";
// import socket from "../socket";
// const [popup, setPopup] = useState("");

// useEffect(() => {
//   socket.on("welcome-popup", (data) => {
//     setPopup(data.message);

//     setTimeout(() => {
//       setPopup("");
//     }, 5000);
//   });

//   return () => {
//     socket.off("welcome-popup");
//   };
// }, []);
// function Dashboard() {
//   const [data, setData] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     getProfile();
//   }, []);

//   const getProfile = async () => {
//     try {
//       const token = localStorage.getItem("token");

//       const res = await api.get("/user/me", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       setData(res.data);
//     } catch (error) {
//       window.location.href = "/";
//     }
//   };

//   if (!data) {
//     return <h1>Loading...</h1>;
//   }

//   //logout function to clear tokens and redirect to login page
//   const logout = async () => {
//     try {
//       await axios.post(
//         "http://localhost:5000/api/auth/logout",
//         {},
//         {
//           withCredentials: true,
//         },
//       );

//       // Remove access token from localStorage
//       localStorage.removeItem("accessToken");

//       // Redirect user
//       navigate("/");

//       //send alert on successful logout
//       alert("Logged out successfully");
//     } catch (error) {
//       console.log(error);
//       alert(error?.response?.data?.message || error.message);
//     }
//   };

//   return (
//     <div>
//       <h1>{data.message}</h1>

//       <p>{data.user.email}</p>
//       <br />
//       <br></br>
//       <button onClick={logout}>Log Out</button>

//       {popup && (
//         <div
//           style={{
//             position: "fixed",
//             top: "20px",
//             right: "20px",
//             background: "black",
//             color: "white",
//             padding: "15px",
//             borderRadius: "10px",
//           }}
//         >
//           {popup}
//         </div>
//       )}
//     </div>
//   );
// }

// export default Dashboard;

import React, { useEffect, useState } from "react";
import axios from "axios";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import socket from "../socket";

function Dashboard() {
  const [popup, setPopup] = useState("");

  const [data, setData] = useState(null);

  const navigate = useNavigate();

  // =========================
  // GET PROFILE
  // =========================
  useEffect(() => {
    getProfile();
  }, []);

  // =========================
  // SOCKET LISTENER
  // =========================
  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      console.log("Socket Connected:", socket.id);
    });

    socket.on("welcome-popup", (popupData) => {
      console.log("POPUP RECEIVED:", popupData);

      setPopup(popupData.message);

      // CLEAR AFTER 5 SEC
      const timer = setTimeout(() => {
        setPopup("");
      }, 5000);

      return () => clearTimeout(timer);
    });

    return () => {
      socket.off("welcome-popup");
    };
  }, []);

  // =========================
  // GET PROFILE FUNCTION
  // =========================
  const getProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get("/user/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setData(res.data);
    } catch (error) {
      console.log(error);

      window.location.href = "/";
    }
  };

  // =========================
  // LOADING
  // =========================
  if (!data) {
    return <h1>Loading...</h1>;
  }

  // =========================
  // LOGOUT
  // =========================
  const logout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/auth/logout",
        {},
        {
          withCredentials: true,
        },
      );

      localStorage.removeItem("token");

      navigate("/");

      alert("Logged out successfully");
    } catch (error) {
      console.log(error);

      alert(error?.response?.data?.message || error.message);
    }
  };

  return (
    <div>
      <h1>{data.message}</h1>

      <h2>{popup}</h2>

      <p>{data.user.email}</p>

      <br />
      {/* <button
        onClick={() => {
          setPopup("MANUAL POPUP 🚀");
        }}
      >
        Test Popup
      </button> */}

      <button onClick={logout}>Log Out</button>

      {/* POPUP UI */}

      {popup && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            backgroundColor: "red",
            color: "white",
            padding: "20px",
            zIndex: 999999,
            fontSize: "22px",
            borderRadius: "10px",
            boxShadow: "0 0 20px black",
          }}
        >
          {popup}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
