import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SortConfiguration } from '../components/SortConfiguration';
import { ConfigurePdfResponse } from '@/types/api';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { auth } from '@/lib/firebase';
import { useConfiguration } from '@/hooks/useConfiguration';
import { usePdfUpload } from '@/hooks/usePdfUpload';

export function SortConfigurationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    saveConfiguration,
    isLoading: isSaving,
  } = useConfiguration();
  const { extractPdf, isLoading: isExtracting } = usePdfUpload();
  const config = (location.state?.data || location.state?.config) as ConfigurePdfResponse;
  const pdfFile = location.state?.file as File || null;

  useEffect(() => {
    if (!config) {
      toast.error('No configuration available for sorting');
      navigate('/');
    }
  }, [config, navigate]);

  if (!config) return null;

  const handleSave = async (newConfig: ConfigurePdfResponse) => {
    if (!auth.currentUser?.uid) {
      toast.error('User not authenticated');
      return;
    }

    try {
      // First save the configuration
      await saveConfiguration(newConfig, auth.currentUser.uid);

      if (pdfFile) {
        // Then extract the PDF with the saved configuration
        const extractionResult = await extractPdf(pdfFile, newConfig.name, auth.currentUser.uid);

        // Navigate to results page with the extraction data
        navigate('/extract-results', {
          state: {
            data: extractionResult,
            name: newConfig.name,
          },
        });
      }
      else navigate('/configurations')
    } catch (error: any) {
      console.error('Failed to process configuration:', error?.message);
      toast.error(error?.message);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Arrange CSV Headers</CardTitle>
        </CardHeader>
        <CardContent>
          <SortConfiguration config={config} onSave={handleSave} isSaving={isSaving} isExtracting={isExtracting} />
        </CardContent>
      </Card>
    </div>
  );
}


