// hooks/useLiveAnalyses.ts
import { useEffect, useState } from 'react';
import { get, keys } from 'idb-keyval';
import { dbObserver } from '@/lib/dbObserver';
import { Analysis } from '@/types/analysis';

export function useLiveAnalyses() {
  const [analyses, setAnalyses] = useState<Analysis[]>([]);

  const loadAnalyses = async () => {
    const analysisKeys = (await keys()).filter(key => 
      typeof key === 'string' && key.startsWith('analysis_')
    );
    return Promise.all(analysisKeys.map(key => get(key)));
  };

  useEffect(() => {
    let mounted = true;

    const updateAnalyses = async () => {
      const loaded = await loadAnalyses();
      if (mounted) setAnalyses(loaded.filter(Boolean) as Analysis[]);
    };

    // Chargement initial
    updateAnalyses();

    // Abonnement aux mises à jour
    dbObserver.on('db-update', updateAnalyses);

    return () => {
      mounted = false;
      dbObserver.off('db-update', updateAnalyses);
    };
  }, []);

  return analyses;
}