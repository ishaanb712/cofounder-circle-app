import SimpleGoogleDriveUpload from '@/components/SimpleGoogleDriveUpload';

export default function TestGoogleDrivePage() {
  const handleFileSelect = (files: any[]) => {
    console.log('Selected Google Drive files:', files);
    alert(`Selected ${files.length} file(s) from Google Drive!`);
  };

  const handleError = (error: string) => {
    console.error('Google Drive error:', error);
    alert(`Error: ${error}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Google Drive Upload Test
          </h1>
          <p className="text-gray-600">
            Test the Google Drive upload functionality
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Upload Files to Google Drive
          </h2>
          
          <SimpleGoogleDriveUpload
            onFileSelect={handleFileSelect}
            onError={handleError}
            placeholder="Upload files to Google Drive"
          />
        </div>

        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            How to Use Google Drive Upload
          </h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p><strong>Option 1 - Upload New Files:</strong></p>
            <ol className="ml-4 space-y-1">
              <li>1. Click "Open Google Drive" to go to your Google Drive</li>
              <li>2. Upload your files to Google Drive</li>
              <li>3. Right-click on the file and select "Share"</li>
              <li>4. Set to "Anyone with the link can view"</li>
              <li>5. Copy the link and use "Add File Link"</li>
            </ol>
            
            <p className="mt-4"><strong>Option 2 - Add Existing Files:</strong></p>
            <ol className="ml-4 space-y-1">
              <li>1. Click "Add File Link"</li>
              <li>2. Enter the file name</li>
              <li>3. Paste the Google Drive share link</li>
              <li>4. The file will be added to your selection</li>
            </ol>
          </div>
        </div>

        <div className="mt-8 bg-green-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-900 mb-3">
            Benefits of Google Drive Upload
          </h3>
          <ul className="space-y-2 text-sm text-green-800">
            <li>✅ <strong>No Authentication Required</strong> - Works immediately</li>
            <li>✅ <strong>No Server Storage</strong> - Files stay in your Google Drive</li>
            <li>✅ <strong>Easy Sharing</strong> - Use Google Drive's sharing features</li>
            <li>✅ <strong>Unlimited Storage</strong> - Use your Google Drive space</li>
            <li>✅ <strong>Familiar Interface</strong> - Users already know Google Drive</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 