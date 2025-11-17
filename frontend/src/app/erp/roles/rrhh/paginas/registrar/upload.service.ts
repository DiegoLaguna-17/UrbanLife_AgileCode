import { Injectable } from '@angular/core';
import { SupabaseService } from '../../../../../../supabase.service';
@Injectable({ providedIn: 'root' })
export class UploadService {

  constructor(private supabase: SupabaseService) {}

  async subirContratoPDF(file: File): Promise<string | null> {
    try {
      const filePath = `${Date.now()}-${file.name}`;

      const { error } = await this.supabase.supabase.storage
        .from("empleado_contratos")      // tu bucket
        .upload(filePath, file);

      if (error) {
        console.error("Error al subir contrato PDF:", error);
        return null;
      }

      const { data } = this.supabase.supabase.storage
        .from("empleado_contratos")
        .getPublicUrl(filePath);

      return data.publicUrl;

    } catch (err) {
      console.error("Error inesperado:", err);
      return null;
    }
  }
}