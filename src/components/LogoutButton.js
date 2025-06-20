import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const LogoutButton = ({className}) => {
  const { logout } = useAuth0();
  return (
    <button
      className={`m-5 bg-gray-900 hover:bg-[#B11830] transition duration-300 ease-in-out text-white py-2 px-4 rounded-md ${className}`}
      onClick={() => logout({ returnTo: window.location.origin })}
    >
      Cerrar Sesión
    </button>
  );
};

export default LogoutButton;
