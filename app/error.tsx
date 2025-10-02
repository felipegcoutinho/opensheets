'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { RiErrorWarningFill } from '@remixicon/react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="max-w-md w-full space-y-6 text-center">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <RiErrorWarningFill size={48} color="var(--destructive)" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Erro</h1>
          <p className="text-muted-foreground">
            Ocorreu um problema inesperado. Por favor, tente novamente.
          </p>
        </div>
        
        <div className="flex flex-col gap-3 pt-4">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            Voltar para o Dashboard
          </Link>
          
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    </div>
  );
}