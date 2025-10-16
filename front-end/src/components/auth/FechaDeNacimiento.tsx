import React, { useState } from "react";

type FechaDeNacimientoProps = {
  onSuccess: () => void;
};

const FechaDeNacimiento: React.FC<FechaDeNacimientoProps> = ({ onSuccess }) => {
  const [birthdate, setBirthdate] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleVerification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!birthdate) return;

    const today = new Date();
    const [year, month, day] = birthdate.split("-").map(Number);
    const userBirthDate = new Date(year, month - 1, day);
    const legalAgeDate = new Date(
      today.getFullYear() - 18,
      today.getMonth(),
      today.getDate()
    );

    if (userBirthDate <= legalAgeDate) {
      setError(null);
      onSuccess();
    } else {
      setError("Debes ser mayor de 18 años para ingresar.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8 text-center animate-fade-in">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Bienvenido</h1>
        <p className="text-gray-500 mb-8">
          Para continuar, por favor verifica tu edad.
        </p>

        <form onSubmit={handleVerification}>
          <div className="mb-4 text-left">
            <label
              htmlFor="birthdate"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Fecha de Nacimiento
            </label>
            <input
              type="date"
              id="birthdate"
              value={birthdate}
              onChange={(e) => {
                setBirthdate(e.target.value);
                if (error) setError(null);
              }}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <button
            type="submit"
            disabled={!birthdate}
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            Verificar
          </button>
        </form>
      </div>
    </div>
  );
};

export default FechaDeNacimiento;
