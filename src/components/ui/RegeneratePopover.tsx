


import React from 'react';
import { Popover, Button, Textarea } from '../ui';
import { Sparkles } from '../icons';

interface RegeneratePopoverProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLElement>;
  onRegenerate: (instructions: string) => void;
  isLoading: boolean;
}

export const RegeneratePopover: React.FC<RegeneratePopoverProps> = ({
  isOpen,
  onClose,
  triggerRef,
  onRegenerate,
  isLoading,
}) => {
  const [instructions, setInstructions] = React.useState('');

  const handleRegenerate = () => {
    onRegenerate(instructions);
  };

  React.useEffect(() => {
    if (!isOpen) {
        setInstructions('');
    }
  }, [isOpen]);

  return (
    <Popover
      isOpen={isOpen}
      onClose={onClose}
      triggerRef={triggerRef}
      title="Generate Content"
      className="w-80"
      align="end"
    >
      <div>
        <label htmlFor="regen-instructions" className="block text-sm font-medium text-slate-600 mb-1">
            Instructions
        </label>
        <Textarea
          id="regen-instructions"
          rows={3}
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          placeholder="(optional) e.g., Make this simpler for beginners"
        />
      </div>
      <div className="flex justify-end mt-4">
        <Button onClick={handleRegenerate} disabled={isLoading} className="w-full !py-2">
          {isLoading ? (
            <span className="flex items-center">
              <Sparkles className="w-5 h-5 mr-2 animate-pulse" />
              Generating...
            </span>
          ) : (
            'Generate'
          )}
        </Button>
      </div>
    </Popover>
  );
};