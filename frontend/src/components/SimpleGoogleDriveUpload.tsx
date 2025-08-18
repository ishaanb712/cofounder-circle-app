'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, Image, File, ExternalLink, CheckCircle, Plus } from 'lucide-react';

interface GoogleDriveUploadProps {
  onFileSelect?: (files: any[]) => void;
  onError?: (error: string) => void;
  className?: string;
  placeholder?: string;
}

interface GoogleDriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  webViewLink: string;
}

export default function SimpleGoogleDriveUpload({
  onFileSelect,
  onError,
  className = '',
  placeholder = 'Upload files to Google Drive'
}: GoogleDriveUploadProps) {
  const [selectedFiles, setSelectedFiles] = useState<GoogleDriveFile[]>([]);

  const openGoogleDrive = () => {
    // Open Google Drive in a new tab
    window.open('https://drive.google.com', '_blank');
  };

  const openGoogleDriveUpload = () => {
    // Open Google Drive upload page directly
    window.open('https://drive.google.com/drive/my-drive', '_blank');
  };

  const addFileManually = () => {
    const fileName = prompt('Enter the name of your file:');
    const fileUrl = prompt('Enter the Google Drive share link:');
    
    if (fileName && fileUrl) {
      const newFile: GoogleDriveFile = {
        id: Date.now().toString(),
        name: fileName,
        mimeType: 'application/octet-stream',
        webViewLink: fileUrl
      };
      
      const updatedFiles = [...selectedFiles, newFile];
      setSelectedFiles(updatedFiles);
      onFileSelect?.(updatedFiles);
    }
  };

  const removeFile = (fileId: string) => {
    const updatedFiles = selectedFiles.filter(file => file.id !== fileId);
    setSelectedFiles(updatedFiles);
    onFileSelect?.(updatedFiles);
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType === 'application/pdf') return <FileText className="w-5 h-5 text-red-500" />;
    if (mimeType.startsWith('image/')) return <Image className="w-5 h-5 text-green-500" />;
    return <File className="w-5 h-5 text-blue-500" />;
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Upload Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Open Google Drive */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={openGoogleDrive}
          className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50/10 transition-all duration-200"
        >
          <div className="text-center">
            <Upload className="w-6 h-6 mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-gray-600">Open Google Drive</p>
            <p className="text-xs text-gray-500">Browse and upload files</p>
          </div>
        </motion.button>

        {/* Add File Manually */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={addFileManually}
          className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50/10 transition-all duration-200"
        >
          <div className="text-center">
            <Plus className="w-6 h-6 mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-gray-600">Add File Link</p>
            <p className="text-xs text-gray-500">Paste Google Drive link</p>
          </div>
        </motion.button>
      </div>

      {/* Instructions */}
      <div className="mb-4 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-sm font-medium text-blue-900 mb-2">How to upload files:</h3>
        <ol className="text-xs text-blue-800 space-y-1">
          <li>1. Click "Open Google Drive" to upload files to your Google Drive</li>
          <li>2. Or click "Add File Link" to add existing Google Drive files</li>
          <li>3. Make sure your files are set to "Anyone with the link can view"</li>
          <li>4. Copy the share link and paste it when prompted</li>
        </ol>
      </div>

      {/* Selected Files */}
      {selectedFiles.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="space-y-2"
        >
          <h3 className="text-sm font-medium text-gray-900">Selected Files ({selectedFiles.length})</h3>
          {selectedFiles.map((file, index) => (
            <motion.div
              key={file.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                {getFileIcon(file.mimeType)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    Google Drive file
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <a
                  href={file.webViewLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-full transition-colors"
                  title="Open in Google Drive"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  onClick={() => removeFile(file.id)}
                  className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-full transition-colors"
                  title="Remove file"
                >
                  ×
                </button>
                <div className="w-4 h-4 text-green-500">
                  <CheckCircle className="w-4 h-4" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Quick Actions */}
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-medium text-gray-900 mb-2">Quick Actions:</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={openGoogleDriveUpload}
            className="px-3 py-1 text-xs bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
          >
            Upload New File
          </button>
          <button
            onClick={addFileManually}
            className="px-3 py-1 text-xs bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
          >
            Add Existing File
          </button>
        </div>
      </div>
    </div>
  );
} 