import { TEXT_LIMITS } from "../config/constants";

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface ReportFormData {
  title: string;
  description: string;
  category: string;
  images?: File[];
}

export interface LoginFormData {
  email: string;
  password: string;
}

export class Validators {
  /**
   * Valida los datos de un formulario de reporte
   */
  static validateReportForm(data: ReportFormData): ValidationResult {
    const errors: string[] = [];

    // Validar título
    if (!data.title || data.title.trim() === "") {
      errors.push("El título es requerido");
    }

    // Validar descripción
    if (!data.description || data.description.trim() === "") {
      errors.push("La descripción es requerida");
    } else if (data.description.length > TEXT_LIMITS.description) {
      errors.push(
        `La descripción no puede exceder ${TEXT_LIMITS.description} caracteres`
      );
    }

    // Validar categoría
    if (!data.category || data.category.trim() === "") {
      errors.push("La categoría es requerida");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Valida los datos de un formulario de login
   */
  static validateLoginForm(data: LoginFormData): ValidationResult {
    const errors: string[] = [];

    // Validar email
    if (!data.email) {
      errors.push("El email es requerido");
    } else if (!this.isValidEmail(data.email)) {
      errors.push("Email inválido");
    }

    // Validar contraseña
    if (!data.password) {
      errors.push("La contraseña es requerida");
    } else if (data.password.length < 6) {
      errors.push("La contraseña debe tener al menos 6 caracteres");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Valida una fecha de nacimiento
   */
  static validateBirthDate(birthDate: string): ValidationResult {
    const errors: string[] = [];

    if (!birthDate) {
      errors.push("Por favor selecciona tu fecha de nacimiento");
      return { isValid: false, errors };
    }

    const age = this.calculateAge(birthDate);

    if (age < TEXT_LIMITS.minAge) {
      errors.push(
        `Debes tener al menos ${TEXT_LIMITS.minAge} años para usar esta aplicación`
      );
    }

    if (age > TEXT_LIMITS.maxAge) {
      errors.push("Por favor verifica que la fecha sea correcta");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Valida formato de email
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /\S+@\S+\.\S+/;
    return emailRegex.test(email);
  }

  /**
   * Calcula la edad a partir de una fecha de nacimiento
   */
  private static calculateAge(birthDate: string): number {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }
    return age;
  }

  /**
   * Valida coordenadas geográficas
   */
  static validateCoordinates(lat: number, lng: number): ValidationResult {
    const errors: string[] = [];

    if (typeof lat !== "number" || isNaN(lat)) {
      errors.push("Latitud inválida");
    } else if (lat < -90 || lat > 90) {
      errors.push("Latitud debe estar entre -90 y 90");
    }

    if (typeof lng !== "number" || isNaN(lng)) {
      errors.push("Longitud inválida");
    } else if (lng < -180 || lng > 180) {
      errors.push("Longitud debe estar entre -180 y 180");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Sanitiza texto para prevenir XSS básico
   */
  static sanitizeText(text: string): string {
    return text
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;")
      .trim();
  }
}
