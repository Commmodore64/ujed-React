import { useState, useEffect } from "react";
import Sidebar from "../sidebar/Index";
import { IoIosArrowBack } from "react-icons/io";
import { Link } from "react-router-dom";

const Index = () => {
  const [paymentsData, setPaymentsData] = useState([]);

  // Fetch data from the API
  useEffect(() => {
    const fetchPaymentsData = async () => {
      try {
        const response = await fetch(
          "https://ujed.solmoviles.com.mx/api/pagos"
        ); // Asegúrate de que la URL sea correcta
        if (response.ok) {
          const data = await response.json();
          setPaymentsData(data);
        } else {
          console.error("Error fetching payments data:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching payments data:", error);
      }
    };

    fetchPaymentsData();
  }, []);
  console.log(paymentsData);

  return (
    <>
      <Sidebar />
      <div className="flex flex-col mt-16 lg:mt-20 h-auto m-4 lg:m-8 rounded-xl p-5 text-black lg:mx-20 lg:ml-96">
        <div>
          <div className="flex flex-row items-center mb-5 hover:text-slate-700">
            <Link to={"/history"} className="text-lg">
              <IoIosArrowBack className="inline-block" />
            </Link>
            <h1 className="text-2xl font-bold pl-1">
              Detalles de pagos con tarjeta
            </h1>
          </div>
          <div className="w-full">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4">
              {/* <div className="flex items-center gap-2 w-full md:w-auto mt-4">
                            <input
                                className="flex h-10 w-full sm:w-96 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Buscar..."
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div> */}
            </div>
            <div className="overflow-x-auto">
              <Link to="/history/reports" className="w-full sm:w-auto">
                <button className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-3xl w-full sm:w-auto">
                  Generar reporte de pagos
                </button>
              </Link>
              <div className="relative w-full">
                <table className="caption-bottom text-sm w-full">
                  <thead className="hidden sm:table-header-group">
                    <tr className="border-b transition-colors hover:bg-muted/50">
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                        ID
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                        Nombre del Titular
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                        Monto
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                        Fecha de Pago
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                        Número de Cuenta
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                        Método de Pago
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                        Descripción
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paymentsData.length > 0 ? (
                      paymentsData.map((item, index) => {
                        const [date] = item.Fecha_Pago.split("T");
                        return (
                          <tr
                            key={index}
                            className={`border-b transition-colors hover:bg-blue-50 ${
                              index % 2 === 0 ? "bg-blue-100" : "bg-white"
                            }`}
                          >
                            <td className="px-4 py-2">{item.ID_Pago}</td>
                            <td className="px-4 py-2">{item.Nombre}</td>
                            <td className="px-4 py-2">$ {item.Monto}</td>
                            <td className="px-4 py-2">{date}</td>
                            <td className="px-4 py-2">{item.Numero_Cuenta}</td>
                            <td className="px-4 py-2">{item.Metodo_Pago}</td>
                            <td className="px-4 py-2">{item.Descripcion}</td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center py-4">
                          No se encontraron resultados.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Index;
