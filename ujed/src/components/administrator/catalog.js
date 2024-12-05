import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import Sidebar from "../sidebar/Index";
import { Link } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { useAuth0 } from "@auth0/auth0-react";
import { Navigate } from "react-router-dom";

const Catalog = () => {
  const [catalogo, setCatalogo] = useState([]);
  const { isAuthenticated } = useAuth0();
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10; // Número de elementos por página

  useEffect(() => {
    const fetchCatalogo = async () => {
      try {
        const response = await fetch(
          "https://ujed.solmoviles.com.mx/api/catalogo",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setCatalogo(data);
        } else {
          console.error("Error al obtener los catalogo:", response.statusText);
        }
      } catch (error) {
        console.error("Error en la solicitud:", error);
      }
    };

    fetchCatalogo();
  }, []);
  if (!isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  // Obtener los elementos a mostrar en la página actual
  const offset = currentPage * itemsPerPage;
  const currentItems = catalogo.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(catalogo.length / itemsPerPage);

  // Cambiar de página
  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  return (
    <>
      <Sidebar />
      <div className="flex flex-col mt-14 lg:mt-16 h-auto m-8 rounded-xl p-5 text-black lg:mx-20 lg:ml-96">
        <div className="container mx-auto p-4">
          <div className="flex flex-row items-center mb-5 hover:text-slate-700">
            <Link to={"/admin"} className="text-lg">
              <IoIosArrowBack className="inline-block" />
            </Link>
            <h1 className="text-2xl font-bold pl-1">Catálogo de conceptos</h1>
          </div>
          <div className="overflow-x-auto  rounded-2xl">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-200 text-gray-700">
                  <th className="py-2 px-4 border-b">Cuenta</th>
                  <th className="py-2 px-4 border-b">Nombre Cuenta</th>
                  <th className="py-2 px-4 border-b">Subcuenta</th>
                  <th className="py-2 px-4 border-b">Tipo Póliza</th>
                  <th className="py-2 px-4 border-b">Llave Concepto</th>
                  <th className="py-2 px-4 border-b">Concepto</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((c, index) => (
                  <tr
                    key={c.id}
                    className={`border-b hover:bg-gray-100 ${
                      index % 2 === 0 ? "bg-gray-100" : "bg-gray-200"
                    }`}
                  >
                    <td className="py-2 px-4">{c.cuenta}</td>
                    <td className="py-2 px-4">{c.nombre_cuenta}</td>
                    <td className="py-2 px-4">{c.subcuenta}</td>
                    <td className="py-2 px-4">{c.tipo_poliza}</td>
                    <td className="py-2 px-4">{c.llave_concepto}</td>
                    <td className="py-2 px-4">{c.concepto}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Paginación */}
          <div className="flex justify-center mt-4">
            <ReactPaginate
              previousLabel={"Anterior"}
              nextLabel={"Siguiente"}
              breakLabel={"..."}
              pageCount={pageCount}
              marginPagesDisplayed={2}
              pageRangeDisplayed={3}
              onPageChange={handlePageClick}
              containerClassName={"flex justify-center mt-4 space-x-2"}
              pageClassName={"px-3 py-1 border rounded-lg cursor-pointer"}
              activeClassName={"bg-blue-500 text-white"}
              previousClassName={"px-3 py-1 border rounded-lg cursor-pointer"}
              nextClassName={"px-3 py-1 border rounded-lg cursor-pointer"}
              breakClassName={"px-3 py-1 border rounded-lg cursor-pointer"}
              disabledClassName={"opacity-50 cursor-not-allowed"}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Catalog;
