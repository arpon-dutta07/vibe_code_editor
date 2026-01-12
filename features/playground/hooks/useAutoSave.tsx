import { useCallback, useRef, useEffect, useState } from 'react';
import { toast } from 'sonner';

export type SaveStatus = 'saved' | 'saving' | 'unsaved' | 'error';

interface UseAutoSaveOptions {
  onSave: () => Promise<void>;
  debounceMs?: number;
  enabled?: boolean;
}

interface UseAutoSaveReturn {
  saveStatus: SaveStatus;
  triggerSave: () => Promise<void>;
  resetStatus: () => void;
}

export const useAutoSave = ({
  onSave,
  debounceMs = 2000, // 2 seconds default
  enabled = true,
}: UseAutoSaveOptions): UseAutoSaveReturn => {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isSavingRef = useRef(false);
  const lastSaveTimeRef = useRef<number>(0);

  const triggerSave = useCallback(async () => {
    if (!enabled || isSavingRef.current) return;

    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    // Set status to unsaved immediately
    setSaveStatus('unsaved');

    // Debounce the actual save
    debounceTimerRef.current = setTimeout(async () => {
      if (isSavingRef.current) return;

      try {
        isSavingRef.current = true;
        setSaveStatus('saving');
        
        await onSave();
        
        setSaveStatus('saved');
        lastSaveTimeRef.current = Date.now();
        
        // Reset to saved after a short delay to show feedback
        setTimeout(() => {
          if (saveStatus === 'saved') {
            // Keep saved status, but could reset if needed
          }
        }, 1000);
      } catch (error) {
        console.error('Auto-save error:', error);
        setSaveStatus('error');
        toast.error('Failed to auto-save changes');
        
        // Reset error status after a delay
        setTimeout(() => {
          setSaveStatus('unsaved');
        }, 3000);
      } finally {
        isSavingRef.current = false;
      }
    }, debounceMs);
  }, [onSave, debounceMs, enabled, saveStatus]);

  const resetStatus = useCallback(() => {
    setSaveStatus('saved');
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return {
    saveStatus,
    triggerSave,
    resetStatus,
  };
};
