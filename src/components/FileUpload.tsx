import { Button } from '@/components/ui/button';
import { usePdfUpload } from '@/hooks/usePdfUpload';
import { auth } from '@/lib/firebase';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export function FileUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { configurePdf, isLoading: isUploading } = usePdfUpload();
  const navigate = useNavigate();
  console.log('FileUpload');
  console.log(auth.currentUser);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleConfigure = async () => {
    if (!selectedFile) {
      toast.error('Please select a file first');
      return;
    }

    if (!auth.currentUser?.uid) {
      toast.error('User not authenticated');
      return;
    }

    try {
      const config = await configurePdf(selectedFile, auth.currentUser.uid);
      navigate('/data-configuration', { state: { data: config, file: selectedFile } });
    } catch (error: any) {
      console.error('Failed to configure PDF:', error?.message);
      toast.error(error?.message);
    }
  };

  const handleExtract = () => {
    if (!selectedFile) {
      toast.error('Please select a file first');
      return;
    }
    navigate('/select-configuration', { state: { file: selectedFile } });
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-center">Upload Image or PDF</h2>
          <p className="text-sm text-gray-500 text-center">
            Select an Image or PDF file to configure data extraction
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  className="w-8 h-8 mb-4 text-gray-500"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">Image or PDF files only</p>
              </div>
              <input type="file" className="hidden" accept=".pdf" onChange={handleFileChange} />
            </label>
          </div>

          {selectedFile && (
            <div className="text-sm text-gray-500 text-center">
              Selected file: {selectedFile.name}
            </div>
          )}

          <div className="flex gap-4">
            <Button
              className="flex-1"
              onClick={handleConfigure}
              disabled={!selectedFile || isUploading}
            >
              {isUploading ? 'Processing...' : 'Configure'}
            </Button>
            <Button
              className="flex-1"
              variant="outline"
              onClick={handleExtract}
              disabled={!selectedFile || isUploading}
            >
              Extract PDF
            </Button>
            <Button
              className="flex-1"
              variant="outline"
              onClick={() => navigate('/configurations')}
            >
              Configurations
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
