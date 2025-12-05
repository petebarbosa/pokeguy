'use client';

import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface SessionEndedModalProps {
  open: boolean;
}

export function SessionEndedModal({ open }: SessionEndedModalProps) {
  const router = useRouter();

  const handleReturn = () => {
    router.push('/');
  };

  return (
    <Dialog open={open}>
      <DialogContent 
        className="sm:max-w-md dark:bg-gray-800 dark:border-gray-700" 
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center dark:text-gray-100">
            Session Ended
          </DialogTitle>
          <DialogDescription className="text-center text-lg dark:text-gray-400">
            The admin has left the session.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 pt-4">
          <p className="text-gray-500 dark:text-gray-400 text-center">
            Thanks for participating! You can create a new session or join another one.
          </p>
          <Button
            onClick={handleReturn}
            className="w-full py-6 text-lg font-semibold"
          >
            Return to Home
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
