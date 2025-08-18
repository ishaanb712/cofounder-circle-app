'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, ExternalLink, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface PDFViewerProps {
  url: string;
  fileName?: string;
  onClose?: () => void;
  className?: string;
}

export default function PDFViewer({ url, fileName, onClose, className = '' }: PDFViewerProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName || 'document.pdf';
    link.click();
  };

  const handleOpenInNewTab = () => {
    window.open(url, '_blank');
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`bg-white rounded-lg shadow-xl overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
            <span className="text-red-600 font-bold text-sm">PDF</span>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 truncate max-w-xs">
              {fileName || 'Document'}
            </h3>
            <p className="text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Navigation */}
          <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={prevPage}
              disabled={currentPage <= 1}
              className="p-1 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 text-sm text-gray-600">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={nextPage}
              disabled={currentPage >= totalPages}
              className="p-1 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          {/* Actions */}
          <button
            onClick={handleDownload}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            title="Download PDF"
          >
            <Download className="w-4 h-4" />
          </button>
          
          <button
            onClick={handleOpenInNewTab}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            title="Open in new tab"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
          
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* PDF Content */}
      <div className="relative bg-gray-100 min-h-[500px]">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}
        
        <iframe
          src={`${url}#page=${currentPage}`}
          className="w-full h-[500px] border-0"
          onLoad={() => setIsLoading(false)}
          title={fileName || 'PDF Document'}
        />
      </div>
    </motion.div>
  );
}

// Simple PDF thumbnail component
export function PDFThumbnail({ url, fileName, onClick }: { 
  url: string; 
  fileName?: string; 
  onClick?: () => void;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="cursor-pointer bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
    >
      <div className="aspect-[3/4] bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-2">
            <span className="text-red-600 font-bold text-lg">PDF</span>
          </div>
          <p className="text-xs text-gray-500">PDF Document</p>
        </div>
      </div>
      <div className="p-3">
        <p className="text-sm font-medium text-gray-900 truncate">
          {fileName || 'Document'}
        </p>
        <p className="text-xs text-gray-500 mt-1">Click to view</p>
      </div>
    </motion.div>
  );
} 