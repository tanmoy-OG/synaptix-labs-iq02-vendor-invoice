import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useConfiguration } from '@/hooks/useConfiguration';
import { auth } from '@/lib/firebase';
import { Pencil, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export function ConfigurationsPage() {
  const navigate = useNavigate();
  const { configurations, fetchConfigurations, deleteConfiguration, isLoading } =
    useConfiguration();
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [configToDelete, setConfigToDelete] = useState<string | null>(null);
  const hasLoaded = useRef(false);

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
      toast.error(err?.message);
      console.error('Error loading configurations:', err?.status);
    }
  }, [fetchConfigurations]);

  useEffect(() => {
    loadConfigurations();
  }, [loadConfigurations]);

  const handleEdit = (name: string) => {
    navigate('/edit-configuration', { state: { name } });
  };

  const handleDeleteClick = (name: string) => {
    setConfigToDelete(name);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!configToDelete) return;

    if (!auth.currentUser?.uid) {
      setError('User not authenticated');
      return;
    }

    try {
      await deleteConfiguration(configToDelete, auth.currentUser.uid);
      // Refresh the list after deletion
      hasLoaded.current = false;
      await loadConfigurations();
      setDeleteDialogOpen(false);
      setConfigToDelete(null);
    } catch (error: any) {
      console.error('Error deleting configuration:', error?.message);
      toast.error(error?.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 md:p-8">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle>Configurations</CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="text-center py-4 text-red-500">
              {error}
              <div className="mt-4">
                <Button variant="outline" onClick={() => navigate('/')}>
                  Return to Upload
                </Button>
              </div>
            </div>
          ) : isLoading && !hasLoaded.current ? (
            <div className="text-center py-4">Loading configurations...</div>
          ) : configurations.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              No configurations found. Please create a configuration first.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {configurations.map(config => (
                  <TableRow key={config.id}>
                    <TableCell className="font-medium">{config.name}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(config.name)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(config.name)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          <div className="flex justify-end mt-4">
            <Button variant="outline" onClick={() => navigate('/')}>
              Back to Upload
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Configuration</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete configuration "{configToDelete}"? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setConfigToDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isLoading}
              className="text-white"
            >
              {isLoading ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
