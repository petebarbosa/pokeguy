'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ChangeNameModalProps {
  open: boolean;
  onClose: () => void;
  onChangeName: (newName: string) => void;
  currentName: string;
  error?: string | null;
}

export function ChangeNameModal({
  open,
  onClose,
  onChangeName,
  currentName,
  error,
}: ChangeNameModalProps) {
  const [name, setName] = useState(currentName);

  // Reset name when modal opens with new currentName
  const [prevOpen, setPrevOpen] = useState(open);
  if (open && !prevOpen) {
    setName(currentName);
  }
  if (open !== prevOpen) {
    setPrevOpen(open);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || name.trim() === currentName) {
      onClose();
      return;
    }

    onChangeName(name.trim());
    localStorage.setItem('pokeguy-name', name.trim());
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md dark:bg-gray-800 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="dark:text-gray-100">Change Name</DialogTitle>
          <DialogDescription className="dark:text-gray-400">
            Enter a new display name for this session
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <Input
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
          />
          {error && (
            <p className="text-sm text-red-500 dark:text-red-400 text-center">{error}</p>
          )}
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
