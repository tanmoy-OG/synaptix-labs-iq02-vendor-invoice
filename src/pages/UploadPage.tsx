import { FileUpload } from '@/components/FileUpload';

export function UploadPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 md:p-8">
      <header className="w-full max-w-4xl mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Synaptix-Labs</h1>
        <p className="mt-2 text-lg text-gray-600">Extract vendor invoice data from PDF files</p>
      </header>

      <main className="w-full max-w-4xl flex flex-col items-center">
        <FileUpload />
      </main>

      <footer className="mt-12 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} Synaptix-Labs. All rights reserved.</p>
      </footer>
    </div>
  );
}
