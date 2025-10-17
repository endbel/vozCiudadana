import React, { useState } from "react";
import { calculateAge } from "../../lib/calculateAge";

type FechaDeNacimientoProps = {
  onDateSelect: (date: string) => void;
};

const FechaDeNacimiento: React.FC<FechaDeNacimientoProps> = ({
  onDateSelect,
}) => {
  const [birthDate, setBirthDate] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleVerification = (e: React.FormEvent) => {
    e.preventDefault();

    if (!birthDate) {
      setError("Por favor selecciona tu fecha de nacimiento");
      return;
    }

    const age = calculateAge(birthDate);

    if (age < 13) {
      setError("Debes tener al menos 13 años para usar esta aplicación");
      return;
    }

    if (age > 120) {
      setError("Por favor verifica que la fecha sea correcta");
      return;
    }

    // Si todo está bien, llamar al callback
    onDateSelect(birthDate);
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
              value={birthDate}
              onChange={(e) => {
                setBirthDate(e.target.value);
                if (error) setError(null);
              }}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <button
            type="submit"
            disabled={!birthDate}
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
