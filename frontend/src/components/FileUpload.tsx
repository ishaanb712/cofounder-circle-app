'use client';

import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { uploadFile, UploadResult, FileUploadOptions } from '@/lib/storage';

interface FileUploadProps {
  onUploadComplete: (result: UploadResult) => void;
  onUploadError?: (error: string) => void;
  options?: FileUploadOptions;
  className?: string;
  placeholder?: string;
  maxFiles?: number;
  showPreview?: boolean;
}

interface FileWithPreview extends File {
  preview?: string;
  uploadStatus?: 'pending' | 'uploading' | 'success' | 'error';
  uploadResult?: UploadResult;
}

export default function FileUpload({
  onUploadComplete,
  onUploadError,
  options = {},
  className = '',
  placeholder = 'Drag & drop files here or click to browse',
  maxFiles = 5,
  showPreview = true
}: FileUploadProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    const newFiles: FileWithPreview[] = Array.from(selectedFiles).map(file => ({
      ...file,
      uploadStatus: 'pending' as const
    }));

    // Check max files limit
    if (files.length + newFiles.length > maxFiles) {
      onUploadError?.(`Maximum ${maxFiles} files allowed`);
      return;
    }

    setFiles(prev => [...prev, ...newFiles]);
  }, [files.length, maxFiles, onUploadError]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
    // Reset input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [handleFileSelect]);

  const uploadFiles = useCallback(async () => {
    if (files.length === 0) return;

    setIsUploading(true);
    const uploadPromises = files.map(async (file) => {
      try {
        const result = await uploadFile(file, options);
        
        setFiles(prev => prev.map(f => 
          f === file 
            ? { ...f, uploadStatus: result.success ? 'success' : 'error', uploadResult: result }
            : f
        ));

        if (result.success) {
          onUploadComplete(result);
        } else {
          onUploadError?.(result.error || 'Upload failed');
        }

        return result;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Upload failed';
        setFiles(prev => prev.map(f => 
          f === file 
            ? { ...f, uploadStatus: 'error', uploadResult: { success: false, error: errorMessage } }
            : f
        ));
        onUploadError?.(errorMessage);
        return { success: false, error: errorMessage };
      }
    });

    await Promise.all(uploadPromises);
    setIsUploading(false);
  }, [files, options, onUploadComplete, onUploadError]);

  const removeFile = useCallback((fileToRemove: FileWithPreview) => {
    setFiles(prev => prev.filter(file => file !== fileToRemove));
  }, []);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (file: File) => {
    if (file.type === 'application/pdf') return <FileText className="w-5 h-5" />;
    if (file.type && file.type.startsWith('image/')) return <FileText className="w-5 h-5" />;
    return <FileText className="w-5 h-5" />;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'uploading':
        return <Loader2 className="w-4 h-4 animate-spin" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 cursor-pointer ${
          isDragOver
            ? 'border-blue-500 bg-blue-50/10'
            : 'border-gray-300 hover:border-gray-400'
        } ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png,.gif"
          onChange={handleFileInputChange}
          className="hidden"
        />
        
        <Upload className="w-8 h-8 mx-auto mb-4 text-gray-400" />
        <p className="text-sm text-gray-600 mb-2">{placeholder}</p>
        <p className="text-xs text-gray-500">
          Supported: PDF, JPG, PNG, GIF (Max {Math.round((options.maxSize || 10 * 1024 * 1024) / 1024 / 1024)}MB)
        </p>
      </div>

      {/* File List */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 space-y-2"
          >
            {files.map((file, index) => (
              <motion.div
                key={`${file.name}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  {getFileIcon(file)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {getStatusIcon(file.uploadStatus || 'pending')}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(file);
                    }}
                    className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Button */}
      {files.length > 0 && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={uploadFiles}
          disabled={isUploading}
          className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isUploading ? (
            <div className="flex items-center justify-center space-x-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Uploading...</span>
            </div>
          ) : (
            `Upload ${files.length} file${files.length > 1 ? 's' : ''}`
          )}
        </motion.button>
      )}
    </div>
  );
} 