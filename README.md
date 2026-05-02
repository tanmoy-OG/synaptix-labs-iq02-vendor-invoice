# Synaptix-Labs

Synaptix-Labs is a platform that takes purchase order PDFs and extracts the header and item data using AI in the backend, outputting the data in tabular format as an XLS file.

This repository contains the front-end of the Synaptix-Labs platform, built with React and ShadCN UI components.

## Features

- Clean, modern UI for uploading PDF files
- Drag and drop or file browser support
- Real-time status updates on processing
- Easy download of generated Excel files
- Mobile responsive design

## Technologies Used

- React 19
- TypeScript
- [Vite](https://vitejs.dev/)
- [ShadCN UI](https://ui.shadcn.com/) (Component library)
- [TanStack Query](https://tanstack.com/query/latest) (Data fetching & caching)
- [Axios](https://axios-http.com/) (HTTP requests)
- [Tailwind CSS](https://tailwindcss.com/) (Styling)
- [Sonner](https://sonner.emilkowal.ski/) (Toast notifications)

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/inforium.git
   cd inforium
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Create a `.env` file in the root of the project with backend API URL:
   ```
   VITE_API_BASE_URL=http://your-backend-api-url/api
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open your browser to `http://localhost:5173`

## Project Structure

```
src/
├── components/     # UI components
│   └── ui/         # ShadCN UI components
├── hooks/          # Custom React hooks
├── lib/            # Utility functions
│   └── api/        # API client and endpoints
├── pages/          # Page components
├── types/          # TypeScript type definitions
└── main.tsx        # Application entry point
```

## Backend API Integration

The front-end expects the following API endpoints:

- `POST /api/upload` - Upload PDF file
- `GET /api/status/:id` - Check processing status
- `GET /api/download/:id` - Download generated Excel file

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the project for production
- `npm run preview` - Preview the production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## License

[MIT](LICENSE)

## Acknowledgements

- [ShadCN UI](https://ui.shadcn.com/) for beautiful, accessible UI components
- [Vercel](https://vercel.com/) for hosting and deployment inspiration
