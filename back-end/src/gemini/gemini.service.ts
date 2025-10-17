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
    console.log('GeminiService initialized with GoogleGenAI');
  }

  async generateText(
    texto: string,
  ): Promise<{ approved: boolean; reason?: string }> {
    const prompt = `Evalúa el contenido del siguiente texto para verificar si contiene discurso de odio, violencia, contenido explícito o inapropiado para un reporte ciudadano. 

    Responde en el siguiente formato JSON:
    {
      "status": "APROBADO" o "RECHAZADO",
      "reason": "breve explicación de por qué fue rechazado (solo si status es RECHAZADO)"
    }

    Texto: "${texto}"`;

    try {
      const res = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const responseText = res.text?.trim();

      try {
        const parsedResponse = JSON.parse(responseText || '{}');
        const approved = parsedResponse.status?.toUpperCase() === 'APROBADO';

        return {
          approved,
          reason: approved
            ? undefined
            : parsedResponse.reason || 'Contenido inapropiado detectado',
        };
      } catch {
        // Fallback al comportamiento anterior si no puede parsear JSON
        const approved = responseText?.toUpperCase() === 'APROBADO';
        return {
          approved,
          reason: approved
            ? undefined
            : 'Contenido no cumple con las políticas de la plataforma',
        };
      }
    } catch (error) {
      console.log('Error generating text with Gemini:', error);
      throw new InternalServerErrorException(
        'Servicio de moderación de texto temporalmente no disponible',
      );
    }
  }

  async moderateImage(
    fileBuffer: Buffer,
    mimeType: string,
  ): Promise<{ approved: boolean; reason?: string }> {
    const prompt = `Evalúa esta imagen para un reporte ciudadano. ¿Contiene desnudez, violencia gráfica, símbolos de odio, o contenido inapropiado?

    Responde en el siguiente formato JSON:
    {
      "status": "APROBADO" o "RECHAZADO",
      "reason": "breve explicación de por qué fue rechazada (solo si status es RECHAZADO)"
    }`;

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

      const responseText = res.text?.trim();

      try {
        const parsedResponse = JSON.parse(responseText || '{}');
        const approved = parsedResponse.status?.toUpperCase() === 'APROBADO';

        return {
          approved,
          reason: approved
            ? undefined
            : parsedResponse.reason || 'Imagen contiene contenido inapropiado',
        };
      } catch {
        // Fallback al comportamiento anterior si no puede parsear JSON
        const approved = responseText?.toUpperCase() === 'APROBADO';
        return {
          approved,
          reason: approved
            ? undefined
            : 'Imagen no cumple con las políticas de la plataforma',
        };
      }
    } catch (error) {
      console.error('Error moderating image with Gemini:', error);
      throw new InternalServerErrorException(
        'Servicio de moderación de imágenes temporalmente no disponible',
      );
    }
  }
}
