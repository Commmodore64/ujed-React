import React from "react";
import Sidebar from "../sidebar/Index";
import { Link } from "react-router-dom";
import Details from "./Details";

const Index = () => {
  function pay() {
    localStorage.clear();
  }

  return (
    <>
      <Sidebar />
      <div className="flex flex-col lg:flex-row mt-16 lg:mt-28 h-auto m-8 bg-[#D9D9D9] rounded-xl p-5 text-black lg:mx-20 lg:ml-96">
        <style jsx="true">{`
          input[type="number"]::-webkit-inner-spin-button,
          input[type="number"]::-webkit-outer-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }
          input[type="number"] {
            -moz-appearance: textfield;
          }
        `}</style>
        <Details />
      </div>
    </>
  );
};

export default Index;
