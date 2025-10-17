import { GoogleGenAI } from '@google/genai';
import { Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not defined');
    }

    this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    // GeminiService initialized with GoogleGenAI
  }

  async generateText(texto: string): Promise<boolean> {
    const prompt = `Evalúa el contenido del siguiente texto para verificar si contiene discurso de odio, violencia, o contenido explícito. Responde SOLO con la palabra 'APROBADO' si es seguro, o 'RECHAZADO' si es inapropiado. Texto: "${texto}"`;

    try {
      const res = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      return res.text?.trim().toUpperCase() === 'APROBADO';
    } catch {
      // Error generating text with Gemini
      throw new InternalServerErrorException('Text generation service error');
    }
  }

  async moderateImage(fileBuffer: Buffer, mimeType: string): Promise<boolean> {
    const prompt =
      'Evalúa esta imagen. ¿Contiene desnudez, violencia gráfica, símbolos de odio, o contenido que no sea apropiado? Responde SOLO con la palabra "APROBADO" si es segura o "RECHAZADO" si es inapropiada.';
    try {
      const res = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          { text: prompt },
          {
            inlineData: {
              data: fileBuffer.toString('base64'),
              mimeType: mimeType,
            },
          },
        ],
      });
      return res.text?.trim().toUpperCase() === 'APROBADO';
    } catch {
      throw new InternalServerErrorException('Moderation image service error');
    }
  }
}
