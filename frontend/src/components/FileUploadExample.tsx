'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import FileUpload from './FileUpload';
import PDFViewer, { PDFThumbnail } from './PDFViewer';
import { UploadResult } from '@/lib/storage';

interface UploadedFile {
  url: string;
  fileName: string;
  uploadedAt: Date;
}

export default function FileUploadExample() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [selectedPDF, setSelectedPDF] = useState<string | null>(null);
  const [showViewer, setShowViewer] = useState(false);

  const handleUploadComplete = (result: UploadResult) => {
    if (result.success && result.url) {
      const newFile: UploadedFile = {
        url: result.url,
        fileName: result.path?.split('/').pop() || 'document.pdf',
        uploadedAt: new Date()
      };
      
      setUploadedFiles(prev => [...prev, newFile]);
    }
  };

  const handleUploadError = (error: string) => {
    console.error('Upload error:', error);
    // You can show a toast notification here
    alert(`Upload failed: ${error}`);
  };

  const handleFileDelete = async (fileToDelete: UploadedFile) => {
    // Here you would typically call your delete function
    // await deleteFile(fileToDelete.path);
    setUploadedFiles(prev => prev.filter(file => file !== fileToDelete));
  };

  const handlePDFView = (url: string) => {
    setSelectedPDF(url);
    setShowViewer(true);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          File Upload Example
        </h2>
        <p className="text-gray-600">
          Upload PDF files and other documents to Supabase Storage
        </p>
      </div>

      {/* File Upload Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Upload Documents
        </h3>
        
        <FileUpload
          onUploadComplete={handleUploadComplete}
          onUploadError={handleUploadError}
          options={{
            bucket: 'documents',
            folder: 'founder-documents',
            maxSize: 10 * 1024 * 1024, // 10MB
            allowedTypes: ['application/pdf', 'image/jpeg', 'image/png']
          }}
          placeholder="Drag & drop your documents here or click to browse"
          maxFiles={5}
        />
      </div>

      {/* Uploaded Files Section */}
      {uploadedFiles.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Uploaded Files ({uploadedFiles.length})
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {uploadedFiles.map((file, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <PDFThumbnail
                  url={file.url}
                  fileName={file.fileName}
                  onClick={() => handlePDFView(file.url)}
                />
                
                <button
                  onClick={() => handleFileDelete(file)}
                  className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                  title="Delete file"
                >
                  ×
                </button>
                
                <div className="mt-2 text-xs text-gray-500">
                  Uploaded: {file.uploadedAt.toLocaleDateString()}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* PDF Viewer Modal */}
      {showViewer && selectedPDF && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-auto">
            <PDFViewer
              url={selectedPDF}
              fileName={uploadedFiles.find(f => f.url === selectedPDF)?.fileName}
              onClose={() => {
                setShowViewer(false);
                setSelectedPDF(null);
              }}
            />
          </div>
        </div>
      )}

      {/* Usage Instructions */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">
          How to Use File Upload
        </h3>
        <div className="space-y-2 text-sm text-blue-800">
          <p>• <strong>Drag & Drop:</strong> Simply drag files into the upload area</p>
          <p>• <strong>Click to Browse:</strong> Click the upload area to select files</p>
          <p>• <strong>Multiple Files:</strong> Select multiple files at once</p>
          <p>• <strong>File Types:</strong> PDF, JPG, PNG, GIF (Max 10MB each)</p>
          <p>• <strong>View PDFs:</strong> Click on uploaded PDFs to view them</p>
          <p>• <strong>Delete Files:</strong> Click the × button to remove files</p>
        </div>
      </div>

      {/* Integration Example */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Integration Example
        </h3>
        <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
          <pre>{`// In your form component
import FileUpload from '@/components/FileUpload';
import { UploadResult } from '@/lib/storage';

const [uploadedFiles, setUploadedFiles] = useState<UploadResult[]>([]);

const handleUploadComplete = (result: UploadResult) => {
  if (result.success) {
    setUploadedFiles(prev => [...prev, result]);
  }
};

// In your JSX
<FileUpload
  onUploadComplete={handleUploadComplete}
  options={{
    bucket: 'documents',
    folder: 'user-uploads',
    maxSize: 10 * 1024 * 1024
  }}
/>`}</pre>
        </div>
      </div>
    </div>
  );
} 