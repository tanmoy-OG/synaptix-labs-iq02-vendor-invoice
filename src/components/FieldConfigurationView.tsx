import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ConfigurePdfResponse, FieldConfig } from '@/types/api';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

// Dialog components
const Dialog = ({
  open,
  onOpenChange,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}) => {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4"
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

const DialogContent = ({ children }: { children: React.ReactNode }) => (
  <div className="p-6">{children}</div>
);

const DialogHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-4">{children}</div>
);

const DialogTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-lg font-semibold">{children}</h2>
);

const DialogDescription = ({ children }: { children: React.ReactNode }) => (
  <p className="text-sm text-gray-500 mt-1">{children}</p>
);

const DialogFooter = ({ children }: { children: React.ReactNode }) => (
  <div className="flex justify-end space-x-2 mt-6">{children}</div>
);

interface FieldConfigurationViewProps {
  fieldConfig: ConfigurePdfResponse;
  onCancel: () => void;
  onNext: () => void;
  onChange?: (updated: ConfigurePdfResponse) => void;
}

export function FieldConfigurationView({
  fieldConfig,
  onCancel,
  onNext,
  onChange,
}: FieldConfigurationViewProps) {
  const [config, setConfig] = useState<ConfigurePdfResponse>(fieldConfig);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newField, setNewField] = useState<{
    fieldname: string;
    type: 'header' | 'item';
    label: string;
    prompt: string;
  }>({
    fieldname: '',
    type: 'header',
    label: '',
    prompt: '',
  });

  // Update local state when prop changes
  useEffect(() => {
    setConfig(fieldConfig);
  }, [fieldConfig]);

  const handleFieldChange = (
    section: 'header' | 'item',
    fieldId: string,
    key: keyof FieldConfig,
    value: string | number | boolean
  ) => {
    setConfig(prev => {
      const updated: ConfigurePdfResponse = {
        ...prev,
        [section]: {
          ...prev[section],
          [fieldId]: {
            ...prev[section][fieldId],
            [key]: value,
          },
        },
      };
      onChange?.(updated);
      return updated;
    });
  };

  const handleAddField = () => {
    if (!newField.label.trim()) {
      toast.error('Please enter a field label');
      return;
    }

    if (!newField.prompt.trim()) {
      toast.error('Please enter a field label');
      return;
    }

    const fieldId = (Object.keys(config[newField.type]).length + 1).toString();
    const newFieldConfig: FieldConfig = {
      fieldname: newField.fieldname,
      label: newField.label,
      logic: 2, // Default to AI Prompt
      prompt: newField.prompt,
      pos: 0,
      selected: true,
      first: newField.fieldname, // Using fieldname as first value
    };

    setConfig(prev => {
      const updated: ConfigurePdfResponse = {
        ...prev,
        [newField.type]: {
          ...prev[newField.type],
          [fieldId]: newFieldConfig,
        },
      };
      onChange?.(updated);
      return updated;
    });

    // Reset form and close dialog
    setNewField({
      fieldname: '',
      type: 'header',
      label: '',
      prompt: '',
    });
    setShowAddDialog(false);
    toast.success('Field added successfully');
  };

  const renderFieldConfig = (section: 'header' | 'item', fieldId: string, field: FieldConfig) => {
    if (!field.selected) return null;

    return (
      <Card key={fieldId} className="mb-4">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Field Name</Label>
              <Input value={field.fieldname} disabled className="bg-gray-50" />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Input
                value={section === 'header' ? 'Header Data' : 'Item Data'}
                disabled
                className="bg-gray-50"
              />
            </div>
            <div className="space-y-2">
              <Label>Label</Label>
              <Input
                value={field.label}
                onChange={e => handleFieldChange(section, fieldId, 'label', e.target.value)}
                placeholder="Enter field label"
              />
            </div>
            <div className="space-y-2">
              <Label>Logic</Label>
              <Select
                value={field.logic.toString()}
                onValueChange={value =>
                  handleFieldChange(section, fieldId, 'logic', parseInt(value))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Direct Mapping</SelectItem>
                  <SelectItem value="2">AI Prompt</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {field.logic == 2 && (
              <div className="space-y-2 md:col-span-2">
                <Label>Prompt</Label>
                <Textarea
                  value={field.prompt}
                  onChange={e => handleFieldChange(section, fieldId, 'prompt', e.target.value)}
                  placeholder="Enter transformation prompt"
                  className="h-10"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const selectedHeaderFields = Object.entries(config.header).filter(([, field]) => field.selected);
  const selectedItemFields = Object.entries(config.item).filter(([, field]) => field.selected);

  return (
    <div className="space-y-6 relative">
      {/* Floating Add Button */}
      <Button
        onClick={() => setShowAddDialog(true)}
        className="fixed bottom-20 right-8 rounded-full w-14 h-14 z-20 shadow-lg"
        size="icon"
      >
        <Plus className="h-6 w-6" />
      </Button>

      {/* Existing content */}
      {selectedHeaderFields.length > 0 && (
        <div className="space-y-4">
          <CardHeader>
            <CardTitle>Header Fields</CardTitle>
          </CardHeader>
          {selectedHeaderFields.map(([fieldId, field]) =>
            renderFieldConfig('header', fieldId, field)
          )}
        </div>
      )}

      {selectedItemFields.length > 0 && (
        <div className="space-y-4">
          <CardHeader>
            <CardTitle>Item Fields</CardTitle>
          </CardHeader>
          {selectedItemFields.map(([fieldId, field]) => renderFieldConfig('item', fieldId, field))}
        </div>
      )}

      <div className="flex justify-end space-x-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onNext}>Next</Button>
      </div>

      {/* Add Field Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Field</DialogTitle>
            <DialogDescription>
              Configure a new field to be extracted from the document.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select
                value={newField.type}
                onValueChange={(value: 'header' | 'item') =>
                  setNewField(prev => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="header">Header Data</SelectItem>
                  <SelectItem value="item">Item Data</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Label</Label>
              <Input
                value={newField.label}
                onChange={e =>
                  setNewField(prev => ({
                    ...prev,
                    label: e.target.value,
                    fieldname: e.target.value,
                  }))
                }
                placeholder="Enter field label"
              />
            </div>
            <div className="space-y-2">
              <Label>Prompt</Label>
              <Textarea
                value={newField.prompt}
                onChange={e => setNewField(prev => ({ ...prev, prompt: e.target.value }))}
                placeholder="Enter transformation prompt"
                className="h-20"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddField}>Add Field</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
