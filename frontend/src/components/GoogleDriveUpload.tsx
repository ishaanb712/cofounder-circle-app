'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, Image, File, ExternalLink, CheckCircle, AlertCircle } from 'lucide-react';

interface GoogleDriveUploadProps {
  onFileSelect?: (files: any[]) => void;
  onError?: (error: string) => void;
  className?: string;
  placeholder?: string;
  maxFiles?: number;
  allowedTypes?: string[];
}

interface GoogleDriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  webViewLink: string;
  webContentLink?: string;
}

export default function GoogleDriveUpload({
  onFileSelect,
  onError,
  className = '',
  placeholder = 'Upload files to Google Drive',
  maxFiles = 5,
  allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/gif']
}: GoogleDriveUploadProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<GoogleDriveFile[]>([]);
  const [isGoogleApiLoaded, setIsGoogleApiLoaded] = useState(false);

  useEffect(() => {
    // Load Google API
    const loadGoogleAPI = () => {
      if (window.gapi) {
        setIsGoogleApiLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => {
        window.gapi.load('picker', () => {
          setIsGoogleApiLoaded(true);
        });
      };
      document.head.appendChild(script);
    };

    loadGoogleAPI();
  }, []);

  const openGoogleDrivePicker = async () => {
    if (!isGoogleApiLoaded) {
      onError?.('Google Drive API is still loading. Please try again in a moment.');
      return;
    }

    setIsLoading(true);

    try {
      // Create Google Drive picker
      const picker = new window.google.picker.PickerBuilder()
        .addView(new window.google.picker.DocsUploadView())
        .addView(new window.google.picker.DocsView()
          .setIncludeFolders(true)
          .setSelectFolderEnabled(false)
        )
        .setOAuthToken('') // Will use user's Google account
        .setDeveloperKey('') // Optional: Add your Google API key here
        .setCallback((data: any) => {
          if (data.action === window.google.picker.Action.PICKED) {
            const files = data.docs.map((doc: any) => ({
              id: doc.id,
              name: doc.name,
              mimeType: doc.mimeType,
              size: doc.sizeBytes,
              webViewLink: doc.url,
              webContentLink: doc.downloadUrl
            }));
            
            setSelectedFiles(files);
            onFileSelect?.(files);
          }
        })
        .enableFeature(window.google.picker.Feature.NAV_HIDDEN)
        .enableFeature(window.google.picker.Feature.MULTISELECT_ENABLED)
        .setTitle('Select files to upload')
        .setSelectableMimeTypes(allowedTypes.join(','))
        .build();

      picker.setVisible(true);
    } catch (error) {
      console.error('Google Drive picker error:', error);
      onError?.('Failed to open Google Drive. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType === 'application/pdf') return <FileText className="w-5 h-5 text-red-500" />;
    if (mimeType.startsWith('image/')) return <Image className="w-5 h-5 text-green-500" />;
    return <File className="w-5 h-5 text-blue-500" />;
  };

  const formatFileSize = (bytes: string) => {
    if (!bytes) return '';
    const size = parseInt(bytes);
    if (size === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(size) / Math.log(k));
    return parseFloat((size / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Upload Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={openGoogleDrivePicker}
        disabled={isLoading || !isGoogleApiLoaded}
        className="w-full p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50/10 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <div className="text-center">
          <Upload className="w-8 h-8 mx-auto mb-4 text-gray-400" />
          <p className="text-sm text-gray-600 mb-2">{placeholder}</p>
          <p className="text-xs text-gray-500">
            {isLoading ? 'Loading...' : isGoogleApiLoaded ? 'Click to open Google Drive' : 'Loading Google Drive...'}
          </p>
        </div>
      </motion.button>

      {/* Selected Files */}
      {selectedFiles.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-4 space-y-2"
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
                    {formatFileSize(file.size || '0')} • {file.mimeType}
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
                <div className="w-4 h-4 text-green-500">
                  <CheckCircle className="w-4 h-4" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Instructions */}
      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-sm font-medium text-blue-900 mb-2">How it works:</h3>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• Click the upload area to open Google Drive</li>
          <li>• Select files from your Google Drive</li>
          <li>• Files will be accessible via Google Drive links</li>
          <li>• No files are stored on our servers</li>
        </ul>
      </div>
    </div>
  );
}

// Add Google Picker types to window object
declare global {
  interface Window {
    gapi: any;
    google: {
      picker: {
        PickerBuilder: any;
        DocsUploadView: any;
        DocsView: any;
        Action: any;
        Feature: any;
      };
    };
  }
} 