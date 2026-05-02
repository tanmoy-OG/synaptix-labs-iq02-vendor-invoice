import { FieldConfigurationView } from '@/components/FieldConfigurationView';
import { FieldsSelectionView } from '@/components/FieldsSelectionView';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useConfiguration } from '@/hooks/useConfiguration';
import { auth } from '@/lib/firebase';
import { ConfigurePdfResponse } from '@/types/api';
import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export function EditConfigurationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { editConfiguration } = useConfiguration();
  const [config, setConfig] = useState<ConfigurePdfResponse | null>(null);
  const [showFieldConfig, setShowFieldConfig] = useState(false);

  const configName = location.state?.name as string;

  useEffect(() => {
    if (!configName) {
      toast.error('No configuration selected');
      navigate('/configurations');
      return;
    }

    if (!auth.currentUser?.uid) {
      toast.error('User not authenticated');
      navigate('/configurations');
      return;
    }

    const loadConfiguration = async () => {
      try {
        const data = await editConfiguration(configName, auth.currentUser.uid);
        setConfig(data);
      } catch (error: any) {
        console.error('Error loading configuration:', error?.message);
        toast.error(error?.message);
        navigate('/configurations');
      }
    };

    loadConfiguration();
  }, [configName, editConfiguration, navigate]);

  const handleFieldSelect = useCallback(
    (section: 'header' | 'item', fieldId: string, selected: boolean) => {
      if (!config) return;

      setConfig(prev => {
        if (!prev) return null;
        return {
          ...prev,
          [section]: {
            ...prev[section],
            [fieldId]: {
              ...prev[section][fieldId],
              selected,
            },
          },
        };
      });
    },
    [config]
  );

  const handleSubmit = () => {
    if (!config) return;

    const hasSelectedFields =
      Object.values(config.header).some(field => field.selected) ||
      Object.values(config.item).some(field => field.selected);

    if (!hasSelectedFields) {
      toast.error('Please select at least one field');
      return;
    }

    setShowFieldConfig(true);
  };

  const handleCancel = useCallback(() => {
    navigate('/configurations');
  }, [navigate]);

  const handleNext = () => {
    navigate('/sort-configuration', { state: { data: config } })
  }

  if (!config) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">Loading configuration...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 md:p-8">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle>Edit Configuration: {config.name}</CardTitle>
        </CardHeader>
        <CardContent>
          {showFieldConfig ? (
            <FieldConfigurationView
              fieldConfig={config}
              onChange={(updated) => setConfig(updated)}
              onCancel={() => setShowFieldConfig(false)}
              onNext={handleNext}
            />
          ) : (
            <FieldsSelectionView
              config={config}
              onFieldSelect={handleFieldSelect}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
