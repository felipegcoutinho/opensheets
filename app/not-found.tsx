import Link from 'next/link';
import { RiErrorWarningFill } from '@remixicon/react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="max-w-md w-full space-y-6 text-center">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <RiErrorWarningFill size={48} color="var(--destructive)" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-foreground">Página não encontrada</h2>
          <p className="text-muted-foreground">
            A página que você está procurando não existe ou foi movida.
          </p>
        </div>
        
        <div className="pt-4">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            Voltar para o Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}