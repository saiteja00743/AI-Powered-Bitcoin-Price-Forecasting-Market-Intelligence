import { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '../api/client';

export function useMarketData(refreshInterval = 30000) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);

  const fetch = useCallback(async () => {
    try {
      const result = await api.getMarket();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
    intervalRef.current = setInterval(fetch, refreshInterval);
    return () => clearInterval(intervalRef.current);
  }, [fetch, refreshInterval]);

  return { data, loading, error, refetch: fetch };
}

export function useNews(limit = 10) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.getNews(limit)
      .then((res) => { setArticles(res.articles); setLoading(false); })
      .catch((err) => { setError(err.message); setLoading(false); });
  }, [limit]);

  return { articles, loading, error };
}

export function usePredict() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const predict = useCallback(async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.predict(formData);
      setResult(res);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { result, loading, error, predict, reset: () => setResult(null) };
}

export function usePredictionHistory() {
  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('bitsense_history') || '[]');
    } catch {
      return [];
    }
  });

  const addEntry = useCallback((entry) => {
    setHistory((prev) => {
      const updated = [{ ...entry, timestamp: new Date().toISOString(), id: Date.now() }, ...prev].slice(0, 50);
      localStorage.setItem('bitsense_history', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem('bitsense_history');
  }, []);

  return { history, addEntry, clearHistory };
}
