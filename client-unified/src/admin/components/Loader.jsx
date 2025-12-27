import React from "react";
import LOGO_URL from "../../cafe/assets/cc.png";

const Loader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-50/70 backdrop-blur-sm">
      <style>
        {`
          /* Bounce animation */
          @keyframes bounce-up-down {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-15px);
            }
          }

          /* Shiny border effect */
          @keyframes shine {
            0% {
              box-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 40px #4a3a2f, 0 0 60px #4a3a2f;
            }
            50% {
              box-shadow: 0 0 20px #fff, 0 0 40px #4a3a2f, 0 0 80px #4a3a2f, 0 0 100px #fff;
            }
            100% {
              box-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 40px #4a3a2f, 0 0 60px #4a3a2f;
            }
          }

          .logo-container {
            animation: bounce-up-down 2s ease-in-out infinite,
                       shine 3s ease-in-out infinite;
          }
        `}
      </style>

      {/* Loader Container */}
      <div className="relative flex items-center justify-center">
        {/* Logo with circular shiny border */}
        <div className="logo-container w-28 h-28 p-2 bg-white rounded-full flex items-center justify-center">
          <img
            src={LOGO_URL}
            alt="App Logo"
            className="w-full h-full object-contain rounded-full"
          />
        </div>
      </div>
    </div>
  );
};

export default Loader;
