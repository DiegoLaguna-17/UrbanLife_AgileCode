import { Injectable } from '@angular/core';
import { SupabaseService } from '../../../../../../supabase.service';

@Injectable({ providedIn: 'root' })
export class UploadContratoService {

  private readonly BUCKET = "trabajador_contrato";
  private readonly MAX_MB = 10;

  // Extensiones aceptadas
  private readonly extensionesPermitidas = [
    'pdf'
  ];

  constructor(private supabase: SupabaseService) {}

  async subirContratoTrabajador(file: File): Promise<string | null> {

    // 1️⃣ Validación extensión
    const extension = file.name.split('.').pop()?.toLowerCase() || '';
    if (!this.extensionesPermitidas.includes(extension)) {
      console.error("Formato no permitido:", extension);
      return null;
    }

    // 2️⃣ Validación tamaño
    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > this.MAX_MB) {
      console.error(`El archivo supera los ${this.MAX_MB}MB`);
      return null;
    }

    try {
      // 3️⃣ Ruta única dentro del bucket
      const sanitizedName = this.sanitizeFileName(file.name);
        const filePath = `docs/${Date.now()}-${sanitizedName}`;


      // 4️⃣ Subir archivo a Supabase
      const { error: uploadError } = await this.supabase.supabase
        .storage
        .from(this.BUCKET)
        .upload(filePath, file);

      if (uploadError) {
        console.error("Error al subir archivo:", uploadError);
        return null;
      }

      // 5️⃣ Obtener URL pública
      const { data } = this.supabase.supabase
        .storage
        .from(this.BUCKET)
        .getPublicUrl(filePath);

      console.log("Archivo subido:", data.publicUrl);
      return data.publicUrl;

    } catch (err) {
      console.error("Error inesperado:", err);
      return null;
    }
  }
  private sanitizeFileName(name: string): string {
  return name
    .normalize("NFD")                     // separa letras y acentos
    .replace(/[\u0300-\u036f]/g, "")      // elimina acentos
    .replace(/ñ/g, "n")                   // cambia ñ → n
    .replace(/Ñ/g, "N")                   // cambia Ñ → N
    .replace(/[^a-zA-Z0-9._-]/g, "_");    // reemplaza espacios y símbolos
}

}
