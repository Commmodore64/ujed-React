import React from "react";

export default function SwitchButton({ isChecked, onToggle }) {
  return (
    <div className="flex items-center justify-center space-x-4">
      <label
        htmlFor="payment-mode"
        className={`cursor-pointer select-none text-sm ${
          isChecked ? "text-gray-500" : "font-medium text-gray-900"
        }`}
      >
        Efectivo
      </label>
      <button
        id="payment-mode"
        role="switch"
        aria-checked={isChecked}
        aria-label={`Cambiar a ${isChecked ? "Tarjeta" : "Tarjeta"}`}
        onClick={onToggle}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
          isChecked ? "bg-indigo-600" : "bg-gray-200"
        }`}
      >
        <span className="sr-only">
          {isChecked ? "Cambiar a Efectivo" : "Cambiar a Tarjeta"}
        </span>
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            isChecked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
      <label
        htmlFor="payment-mode"
        className={`cursor-pointer select-none text-sm ${
          isChecked ? "font-medium text-gray-900" : "text-gray-500"
        }`}
      >
        Tarjeta
      </label>
    </div>
  );
}
