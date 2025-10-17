import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_API_KEY) {
      throw new Error('SUPABASE_URL or SUPABASE_API_KEY is not defined');
    }
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_API_KEY,
    );
    this.supabase = supabase;
  }

  async uploadImage(
    fileBuffer: Buffer,
    mimeType: string,
    bucket: string = 'voz-ciudadana-bucket',
  ): Promise<string> {
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const filePath = `reports/${fileName}`;

    try {
      const { error: uploadedError } = await this.supabase.storage
        .from(bucket)
        .upload(filePath, fileBuffer, {
          contentType: mimeType,
        });

      if (uploadedError) {
        console.error('Error uploading image to Supabase:', uploadedError);
        throw new Error('Error uploading image');
      }

      const {
        data: { publicUrl },
      } = this.supabase.storage.from(bucket).getPublicUrl(filePath);

      if (!publicUrl) {
        throw new Error('Error getting public URL');
      }
      return publicUrl;
    } catch (error) {
      console.error('Unexpected error uploading image to Supabase:', error);
      throw new Error('Unexpected error uploading image');
    }
  }
}
