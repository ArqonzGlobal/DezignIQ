import { useState, useEffect } from 'react';

export interface HistoryItem {
  id: string;
  imageUrl: string;
  toolName: string;
  timestamp: number;
  prompt?: string;
}

const HISTORY_KEY = 'arqonz-image-history';
const MAX_HISTORY_ITEMS = 50;

export const useImageHistory = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const loadHistory = () => {
      try {
        const stored = localStorage.getItem(HISTORY_KEY);
        if (stored) {
          setHistory(JSON.parse(stored));
        }
      } catch (error) {
        console.error('Failed to load history:', error);
      }
    };
    loadHistory();
  }, []);

  const addToHistory = (item: Omit<HistoryItem, 'id' | 'timestamp'>) => {
    const newItem: HistoryItem = {
      ...item,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    };

    setHistory((prev) => {
      const updated = [newItem, ...prev].slice(0, MAX_HISTORY_ITEMS);
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error('Failed to save history:', error);
      }
      return updated;
    });
  };

  const removeFromHistory = (id: string) => {
    setHistory((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error('Failed to update history:', error);
      }
      return updated;
    });
  };

  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(HISTORY_KEY);
    } catch (error) {
      console.error('Failed to clear history:', error);
    }
  };

  return { history, addToHistory, removeFromHistory, clearHistory };
};
