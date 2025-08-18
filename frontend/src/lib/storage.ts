import { supabase } from './supabase';

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
  path?: string;
}

export interface FileUploadOptions {
  bucket?: string;
  folder?: string;
  maxSize?: number; // in bytes
  allowedTypes?: string[];
}

/**
 * Upload a file to Supabase Storage
 */
export async function uploadFile(
  file: File,
  options: FileUploadOptions = {}
): Promise<UploadResult> {
  try {
    const {
      bucket = 'documents',
      folder = 'uploads',
      maxSize = 10 * 1024 * 1024, // 10MB default
      allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/gif']
    } = options;

    // Generate default name if file doesn't have one
    const originalFileName = file.name || `uploaded_file_${Date.now()}`;

    // Validate file size
    if (file.size > maxSize) {
      return {
        success: false,
        error: `File size exceeds ${Math.round(maxSize / 1024 / 1024)}MB limit`
      };
    }

    // Validate file type - check both MIME type and file extension
    const fileExt = originalFileName?.split('.').pop()?.toLowerCase();
    const mimeType = file.type;
    
    // Define allowed extensions for each MIME type
    const allowedExtensions = {
      'application/pdf': ['pdf'],
      'image/jpeg': ['jpg', 'jpeg'],
      'image/png': ['png'],
      'image/gif': ['gif']
    };
    
    // Check if MIME type is allowed
    const isMimeTypeAllowed = mimeType && allowedTypes.includes(mimeType);
    
    // Check if file extension is allowed
    const isExtensionAllowed = fileExt && Object.values(allowedExtensions).flat().includes(fileExt);
    
    // If no extension but MIME type is allowed, accept the file
    const isAcceptable = isMimeTypeAllowed || isExtensionAllowed;
    
    if (!isAcceptable) {
      return {
        success: false,
        error: `File type not allowed. Allowed types: ${allowedTypes.join(', ')} or extensions: ${Object.values(allowedExtensions).flat().join(', ')}`
      };
    }

    // Generate unique filename with appropriate extension
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    
    // Determine file extension
    let fileExtension = fileExt;
    if (!fileExtension && mimeType) {
      // Map MIME types to extensions
      const mimeToExt: { [key: string]: string } = {
        'application/pdf': 'pdf',
        'image/jpeg': 'jpg',
        'image/png': 'png',
        'image/gif': 'gif'
      };
      fileExtension = mimeToExt[mimeType] || 'file';
    } else if (!fileExtension) {
      fileExtension = 'file';
    }
    
    const fileName = `${folder}/${timestamp}_${randomString}.${fileExtension}`;

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Upload error:', error);
      return {
        success: false,
        error: error.message
      };
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    return {
      success: true,
      url: urlData.publicUrl,
      path: fileName
    };

  } catch (error) {
    console.error('Upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * Delete a file from Supabase Storage
 */
export async function deleteFile(
  path: string,
  bucket: string = 'documents'
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) {
      console.error('Delete error:', error);
      return {
        success: false,
        error: error.message
      };
    }

    return { success: true };

  } catch (error) {
    console.error('Delete error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * Get file URL from Supabase Storage
 */
export function getFileUrl(
  path: string,
  bucket: string = 'documents'
): string {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);

  return data.publicUrl;
}

/**
 * List files in a bucket/folder
 */
export async function listFiles(
  folder: string = '',
  bucket: string = 'documents'
): Promise<{ success: boolean; files?: any[]; error?: string }> {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(folder);

    if (error) {
      console.error('List files error:', error);
      return {
        success: false,
        error: error.message
      };
    }

    return {
      success: true,
      files: data
    };

  } catch (error) {
    console.error('List files error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
} 