import { Injectable } from '@angular/core';
import { SupabaseService } from '../../../../../../supabase.service';
@Injectable({ providedIn: 'root' })
export class UploadService {

  constructor(private supabase: SupabaseService) {}

  async subirImagenProveedor(file: File): Promise<string | null> {
    try {
      // ruta única dentro del bucket
      const filePath = `${Date.now()}-${file.name}`;

      // Subir archivo
      const { error } = await this.supabase.supabase
        .storage
        .from("proveedor_images")      // <--- TU BUCKET
        .upload(filePath, file);

      if (error) {
        console.error("Error al subir:", error);
        return null;
      }

      // Obtener URL pública
      const { data } = this.supabase.supabase
        .storage
        .from("proveedor_images")
        .getPublicUrl(filePath);

      return data.publicUrl;

    } catch (err) {
      console.error("Error inesperado:", err);
      return null;
    }
  }
}
