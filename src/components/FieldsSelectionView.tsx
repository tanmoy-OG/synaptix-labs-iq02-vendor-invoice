import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ConfigurePdfResponse, FieldConfig } from '@/types/api';
import { CheckCircle2 } from 'lucide-react';

interface FieldsSelectionViewProps {
  config: ConfigurePdfResponse;
  onFieldSelect: (section: 'header' | 'item', fieldId: string, selected: boolean) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export function FieldsSelectionView({
  config,
  onFieldSelect,
  onSubmit,
  onCancel,
}: FieldsSelectionViewProps) {
  const selectedHeaderCount = Object.values(config.header).filter(field => field.selected).length;
  const selectedItemCount = Object.values(config.item).filter(field => field.selected).length;

  const renderFieldCard = (section: 'header' | 'item', fieldId: string, field: FieldConfig) => (
    <Card
      key={fieldId}
      className={cn(
        'cursor-pointer transition-all hover:border-primary',
        field.selected ? 'border-2 border-primary bg-primary/5 shadow-md' : ''
      )}
      onClick={() => onFieldSelect(section, fieldId, !field.selected)}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="font-medium text-sm text-gray-500">{field.fieldname}</div>
            <div className="text-lg font-semibold mt-1">{field.first}</div>
          </div>
          {field.selected && <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8 w-full">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Document Header</h2>
          <div className="text-sm text-gray-500">{selectedHeaderCount} item(s) selected</div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(config.header).map(([fieldId, field]) =>
            renderFieldCard('header', fieldId, field)
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Line Items</h2>
          <div className="text-sm text-gray-500">{selectedItemCount} item(s) selected</div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(config.item).map(([fieldId, field]) =>
            renderFieldCard('item', fieldId, field)
          )}
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onSubmit} disabled={selectedHeaderCount === 0 && selectedItemCount === 0}>
          Configure Selected Fields
        </Button>
      </div>
    </div>
  );
}
