import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useConfiguration } from '@/hooks/useConfiguration';
import { usePdfUpload } from '@/hooks/usePdfUpload';
import { auth } from '@/lib/firebase';
import { cn } from '@/lib/utils';
import { CheckCircle2 } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export function ConfigurationSelectionPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { configurations, fetchConfigurations, isLoading } = useConfiguration();
  const { extractPdf, isLoading: isExtracting } = usePdfUpload();
  const [selectedConfig, setSelectedConfig] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const hasLoaded = useRef(false);

  // Get the PDF file from location state
  const pdfFile = location.state?.file as File | undefined;

  useEffect(() => {
    if (!pdfFile) {
      toast.error('No PDF file selected');
      navigate('/');
      return;
    }
  }, [pdfFile, navigate]);

  const loadConfigurations = useCallback(async () => {
    if (hasLoaded.current) return;

    if (!auth.currentUser?.uid) {
      setError('User not authenticated');
      return;
    }

    try {
      setError(null);
      await fetchConfigurations(auth.currentUser.uid);
      hasLoaded.current = true;
    } catch (err: any) {
      console.error(err?.status);
      toast.error(err?.message);
    }
  }, [fetchConfigurations]);

  useEffect(() => {
    loadConfigurations();
  }, [loadConfigurations]);

  const handleExtract = useCallback(async () => {
    if (!selectedConfig) {
      toast.error('Please select a configuration');
      return;
    }

    if (!pdfFile) {
      toast.error('No PDF file selected');
      navigate('/');
      return;
    }

    if (!auth.currentUser?.uid) {
      toast.error('User not authenticated');
      return;
    }

    try {
      const csvBlob = await extractPdf(pdfFile, selectedConfig, auth.currentUser.uid);
      navigate('/extract-results', {
        state: {
          data: csvBlob,
          name: selectedConfig,
        },
      });
    } catch (error: any) {
      console.error('Failed to extract PDF:', error?.message);
      toast.error(error?.message);
    }
  }, [selectedConfig, pdfFile, extractPdf, navigate]);

  const handleConfigSelect = useCallback((configName: string) => {
    setSelectedConfig(configName);
  }, []);

  const handleBack = useCallback(() => {
    navigate('/');
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 md:p-8">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Select Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {error ? (
              <div className="text-center py-4 text-red-500">
                {error}
                <div className="mt-4">
                  <Button variant="outline" onClick={handleBack}>
                    Return to Upload
                  </Button>
                </div>
              </div>
            ) : isLoading ? (
              <div className="text-center py-4">Loading configurations...</div>
            ) : !isLoading && !hasLoaded.current && configurations.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                <p>No configurations found. Please create a configuration first.</p>
                <div className="mt-4">
                  <Button variant="outline" onClick={handleBack}>
                    Return to Upload
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {configurations.map(config => (
                  <Card
                    key={config.id}
                    className={cn(
                      'cursor-pointer transition-all hover:border-primary',
                      selectedConfig === config.name
                        ? 'border-2 border-primary bg-primary/5 shadow-md'
                        : ''
                    )}
                    onClick={() => handleConfigSelect(config.name)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium text-sm text-gray-500">Configuration</div>
                          <div className="text-lg font-semibold mt-1">{config.name}</div>
                        </div>
                        {selectedConfig === config.name && (
                          <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {!error && configurations.length > 0 && (
              <div className="flex justify-end space-x-4 pt-4">
                <Button variant="outline" onClick={handleBack}>
                  Back
                </Button>
                <Button
                  onClick={handleExtract}
                  disabled={!selectedConfig || isLoading || isExtracting}
                >
                  {isExtracting ? 'Extracting...' : 'Extract PDF'}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
