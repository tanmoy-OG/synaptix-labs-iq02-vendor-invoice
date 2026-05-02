import { FieldConfigurationView } from '@/components/FieldConfigurationView';
import { FieldsSelectionView } from '@/components/FieldsSelectionView';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useConfiguration } from '@/hooks/useConfiguration';
import { ConfigurePdfResponse } from '@/types/api';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export function DataConfigurationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    configuration,
    updateConfiguration,
  } = useConfiguration();
  const [showFieldConfig, setShowFieldConfig] = useState(false);

  // Get initial configuration and file from location state
  const initialConfig = (location.state?.data || location.state?.config) as ConfigurePdfResponse;
  const pdfFile = location.state?.file as File;

  useEffect(() => {
    // If coming back from sort page, allow missing file and skip redirect
    const fromSort = location.state?.fromSort as boolean | undefined;
    if (!initialConfig || (!pdfFile && !fromSort)) {
      toast.error('No configuration data or file available');
      navigate('/upload');
      return;
    }
    if (initialConfig) {
      updateConfiguration(initialConfig);
      // If coming from sort page, show field configuration view directly
      if (fromSort) {
        setShowFieldConfig(true);
      }
    }
  }, [initialConfig, pdfFile, navigate, updateConfiguration, location.state]);

  const handleFieldSelect = (section: 'header' | 'item', fieldId: string, selected: boolean) => {
    if (!configuration) return;

    const updatedConfig = { ...configuration };
    const field = updatedConfig[section][fieldId];

    if (field) {
      updatedConfig[section][fieldId] = {
        ...field,
        selected,
        logic: selected ? 1 : 0,
      };
    }

    updateConfiguration(updatedConfig);
  };

  const handleSubmit = () => {
    if (!configuration) return;

    const hasSelectedFields =
      Object.values(configuration.header).some(field => field.selected) ||
      Object.values(configuration.item).some(field => field.selected);

    if (!hasSelectedFields) {
      toast.error('Please select at least one field');
      return;
    }

    setShowFieldConfig(true);
  };

  const handleNext = () => {
    navigate('/sort-configuration', { state: { data: configuration, file: pdfFile } })
  }

  const handleCancel = () => {
    toast.error('Configuration cancelled');
    navigate('/');
  };

  if (!configuration) {
    return null;
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>{showFieldConfig ? 'Configure Field Mapping' : 'Select Fields'}</CardTitle>
        </CardHeader>
        <CardContent>
          {showFieldConfig ? (
            <FieldConfigurationView
              fieldConfig={configuration}
              onChange={updateConfiguration}
              onCancel={() => setShowFieldConfig(false)}
              onNext={handleNext}
            />
          ) : (
            <FieldsSelectionView
              config={configuration}
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
