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
import { useTranslations } from '@/i18n/context';

interface SessionEndedModalProps {
  open: boolean;
}

export function SessionEndedModal({ open }: SessionEndedModalProps) {
  const router = useRouter();
  const { t, locale } = useTranslations();

  const handleReturn = () => {
    router.push(`/${locale}`);
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
            {t('sessionEnded.title')}
          </DialogTitle>
          <DialogDescription className="text-center text-lg dark:text-gray-400">
            {t('sessionEnded.description')}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 pt-4">
          <p className="text-gray-500 dark:text-gray-400 text-center">
            {t('sessionEnded.thanks')}
          </p>
          <Button
            onClick={handleReturn}
            className="w-full py-6 text-lg font-semibold"
          >
            {t('sessionEnded.returnToHome')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
