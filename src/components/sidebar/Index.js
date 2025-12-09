import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import LogoutButton from "../LogoutButton";
import LogoFAEO from "../../img/faeo.png";
import {
  IoIosHome,
  IoIosSettings,
  IoIosCash,
  IoIosPie,
  IoIosAlbums,
} from "react-icons/io";
import { FaFileMedical, FaMoneyCheckAlt } from "react-icons/fa";
import { IoShare, IoMenu } from "react-icons/io5";
import { useAuth0 } from "@auth0/auth0-react";

const Index = () => {
  const location = useLocation();
  const { isAuthenticated, getIdTokenClaims } = useAuth0();
  const [isOpen, setIsOpen] = useState(false);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const fetchRoles = async () => {
      const tokenClaims = await getIdTokenClaims();
      const roles = tokenClaims["https://roles.com/roles"];
      setRoles(roles || []);
    };

    if (isAuthenticated) {
      fetchRoles();
    }
  }, [isAuthenticated, getIdTokenClaims]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  const getLinkClass = (path) => {
    return location.pathname === path
      ? "text-black bg-gray-300"
      : "text-black hover:bg-gray-300 transition-all duration-100 ease-in-out transform hover:scale-105";
  };

  return (
    <div className="flex">
      <button
        className="lg:hidden p-4 fixed top-0 left-0 z-50"
        onClick={toggleSidebar}
      >
        <IoMenu size={30} />
      </button>
      <aside
        className={`fixed top-0 left-0 w-80 h-full bg-white shadow-xl transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-300 ease-in-out z-40`}
        style={{
          backdropFilter: isOpen ? "blur(8px)" : "none", // Aplica el efecto de vidrio difuminado solo cuando isOpen es true
          backgroundColor: isOpen ? "rgba(255, 255, 255, 0.8)" : "transparent", // Fondo semi-transparente
        }}
      >
        <div className="flex flex-col h-full">
          <div className="p-4">
            <Link to="/">
              <img
                src={LogoFAEO}
                alt="Logo UJED"
                className="w-32 mx-auto cursor-pointer"
                onClick={closeSidebar}
              />
            </Link>
          </div>
          <nav className="flex-1 border-r border-gray-300">
            <ul className="space-y-4 flex flex-col">
              <li>
                <Link
                  to="/dashboard"
                  className={`flex flex-row items-center font-semibold rounded-lg mx-5 py-2 px-4 ${getLinkClass(
                    "/dashboard"
                  )}`}
                  onClick={closeSidebar}
                >
                  <IoIosHome className="mr-4" size={25} color="#B11830" />
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  to="/courseinfo"
                  className={`flex flex-row items-center font-semibold rounded-lg mx-5 py-2 px-4 ${getLinkClass(
                    "/courseinfo"
                  )}`}
                  onClick={closeSidebar}
                >
                  <IoIosAlbums className="mr-4" size={25} color="#B11830" />
                  Cursos y Diplomados Disponibles
                </Link>
              </li>
              <li>
                <Link
                  to="/queries"
                  className={`flex flex-row items-center font-semibold rounded-lg mx-5 py-2 px-4 ${getLinkClass(
                    "/queries"
                  )}`}
                  onClick={closeSidebar}
                >
                  <FaFileMedical className="mr-4" size={25} color="#B11830" />
                  Consultas
                </Link>
              </li>
              <li>
                <Link
                  to="/diversepayments"
                  className={`flex flex-row items-center font-semibold rounded-lg mx-5 py-2 px-4 ${getLinkClass(
                    "/diversepayments"
                  )}`}
                  onClick={closeSidebar}
                >
                  <FaMoneyCheckAlt className="mr-4" size={25} color="#B11830" />
                  Pagos diversos
                </Link>
              </li>
              <li>
                <Link
                  to="/payments"
                  className={`flex flex-row font-semibold rounded-lg mx-5 py-2 px-4 ${getLinkClass(
                    "/payments"
                  )}`}
                  onClick={closeSidebar}
                >
                  <IoIosCash className="mr-4" size={24} color="#B11830" />
                  Pagos cursos e inscripciones
                </Link>
              </li>
              {isAuthenticated && (
                <li>
                  <Link
                    to="/profile"
                    className={`flex flex-row items-center font-semibold rounded-lg mx-5 py-2 px-4 ${getLinkClass(
                      "/profile"
                    )}`}
                    onClick={closeSidebar}
                  >
                    <IoIosSettings className="mr-4" size={25} color="#B11830" />
                    Perfil
                  </Link>
                </li>
              )}
              {roles.includes("admin") && (
                <li>
                  <Link
                    to="/admin"
                    className={`flex flex-row items-center font-semibold rounded-lg mx-5 py-2 px-4 ${getLinkClass(
                      "/admin"
                    )}`}
                    onClick={closeSidebar}
                  >
                    <IoIosPie className="mr-4" size={25} color="#B11830" />
                    Administrador
                  </Link>
                </li>
              )}
              {/* Agrega más enlaces según sea necesario */}
            </ul>
          </nav>

          <div className="mt-auto p-4 font-semibold">
            <Link
              to="https://www.ujed.mx/"
              className="flex flex-row font-semibold ml-3 py-2 px-1 text-black"
              onClick={closeSidebar}
            >
              <IoShare className="mr-4" size={24} color="#B11830" />
              UJED
            </Link>
            <Link
              to="https://faeo.ujed.mx/"
              className="flex flex-row font-semibold ml-3 py-2 px-1 text-black"
              onClick={closeSidebar}
            >
              <IoShare className="mr-4" size={24} color="#B11830" />
              FAEO UJED
            </Link>
            {isAuthenticated && <LogoutButton />}
          </div>
        </div>
      </aside>
    </div>
  );
};

export default Index;
