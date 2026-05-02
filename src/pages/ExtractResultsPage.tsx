import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Papa from 'papaparse';
import { toast } from 'sonner';

interface CSVRow {
  [key: string]: string;
}

export function ExtractResultsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const csvBlob = location.state?.data as Blob;
  const configName = location.state?.name as string;
  const [csvData, setCsvData] = useState<CSVRow[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (csvBlob) {
      parseCSV();
    }
  }, [csvBlob]);

  const parseCSV = async () => {
    setIsLoading(true);

    try {
      const text = await csvBlob.text();

      Papa.parse(text, {
        header: true, // first row as headers
        skipEmptyLines: true,
        complete: function (results: any) {
          setHeaders(results.meta.fields); // array of headers
          setCsvData(results.data);       // array of row objects
        }
      });
    } catch (error: any) {
      console.error("Error parsing CSV:", error?.message);
      toast.error(error?.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!csvBlob) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4 md:p-8">
        <Card className="w-full max-w-4xl">
          <CardHeader>
            <CardTitle>Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-500">No extraction data available</p>
            <Button onClick={() => navigate('/')} className="mt-4">
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleDownload = () => {
    const url = window.URL.createObjectURL(csvBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${configName}_extracted_data.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4 md:p-8">
      <Card className="w-full max-w-6xl">
        <CardHeader>
          <CardTitle>Extraction Complete!</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="text-center">
              <div className="p-6 bg-green-50 rounded-full inline-block">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-20 w-20 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="mt-4 text-xl font-semibold text-gray-900">
                Configuration Selected: {configName}
              </h2>
              <p className="mt-2 text-gray-600">
                Your data has been successfully extracted. Review the results below.
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-white rounded-lg border p-4">
                <h3 className="text-lg font-semibold mb-4">CSV Preview ({csvData.length} rows)</h3>
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading preview...</p>
                  </div>
                ) : csvData.length > 0 ? (
                  <div className="overflow-auto max-h-96 border border-gray-200 rounded-lg">
                    <table className="w-full border-collapse">
                      <thead className="sticky top-0 bg-gray-50">
                        <tr>
                          {headers.map((header, index) => (
                            <th
                              key={index}
                              className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-700 bg-gray-50"
                            >
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {csvData.map((row, rowIndex) => (
                          <tr key={rowIndex} className="hover:bg-gray-50">
                            {headers.map((header, colIndex) => (
                              <td
                                key={colIndex}
                                className="border border-gray-300 px-4 py-2 text-sm"
                              >
                                {row[header] || ''}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No data to preview</p>
                )}
              </div>

              <div className="flex justify-center space-x-4 pt-6">
                <Button
                  onClick={handleDownload}
                  className="px-8 py-3 text-lg bg-green-600 hover:bg-green-700"
                >
                  Download CSV
                </Button>
                <Button
                  onClick={() => navigate('/')}
                  variant="outline"
                  className="px-8 py-3 text-lg"
                >
                  Return to Home
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
