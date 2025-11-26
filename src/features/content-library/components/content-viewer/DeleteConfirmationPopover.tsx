import React from 'react';
import { Button, Popover } from '../../../../components/ui';

interface DeleteConfirmationPopoverProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  triggerRef: React.RefObject<HTMLElement>;
}

export const DeleteConfirmationPopover: React.FC<DeleteConfirmationPopoverProps> = ({ isOpen, onConfirm, onCancel, triggerRef }) => {
  return (
    <Popover
      isOpen={isOpen}
      onClose={onCancel}
      triggerRef={triggerRef}
      className="w-64"
    >
      <p className="text-sm text-slate-700 mb-4">Are you sure you want to delete this course?</p>
      <div className="flex justify-end gap-2">
        <Button onClick={onCancel} variant="secondary" size="xs" className="!py-1.5">
          Cancel
        </Button>
        <Button onClick={onConfirm} variant="danger" size="xs" className="!py-1.5">
          Delete
        </Button>
      </div>
    </Popover>
  );
};