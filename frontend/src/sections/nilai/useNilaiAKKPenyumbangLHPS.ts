import { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import useAxiosJWT from '../../hooks/useAxiosJWT';
import { AKKContributorLHPSResponse, NilaiAKKError } from './types';

type RefreshOptions = {
  silent?: boolean;
};

const getError = (error: unknown): NilaiAKKError => {
  if (axios.isAxiosError(error)) {
    return {
      status: error.response?.status ?? null,
      message: String(error.response?.data?.message || 'Gagal mengambil nilai AKK penyumbang LHPS'),
    };
  }

  return {
    status: null,
    message: error instanceof Error ? error.message : 'Terjadi kesalahan yang tidak diketahui',
  };
};

export default function useNilaiAKKPenyumbangLHPS(
  periodId: number | null | undefined,
  peraturanId: number | null | undefined,
  enabled: boolean
) {
  const axiosJWT = useAxiosJWT();
  const abortControllerRef = useRef<AbortController | null>(null);
  const requestIdRef = useRef(0);
  const [data, setData] = useState<AKKContributorLHPSResponse | null>(null);
  const [error, setError] = useState<NilaiAKKError | null>(null);
  const [refreshError, setRefreshError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(enabled);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refresh = useCallback(async ({ silent = false }: RefreshOptions = {}) => {
    if (!enabled) return;

    if (!periodId || (peraturanId !== 1 && peraturanId !== 2)) {
      abortControllerRef.current?.abort();
      requestIdRef.current += 1;
      setData(null);
      setIsLoading(false);
      setIsRefreshing(false);
      setError({
        status: null,
        message: 'Periode atau peraturan pada profil user belum dikonfigurasi.',
      });
      return;
    }

    abortControllerRef.current?.abort();
    const abortController = new AbortController();
    abortControllerRef.current = abortController;
    const requestId = ++requestIdRef.current;

    if (silent) {
      setIsRefreshing(true);
    } else {
      setData(null);
      setIsLoading(true);
      setError(null);
    }

    try {
      const response = await axiosJWT.get(
        `/scoringEngine/akk/lhps/${periodId}/${peraturanId}`,
        { signal: abortController.signal }
      );
      if (requestId !== requestIdRef.current) return;

      setData(response.data.rows as AKKContributorLHPSResponse);
      setError(null);
      setRefreshError(null);
    } catch (requestError: unknown) {
      if (axios.isCancel(requestError) || requestId !== requestIdRef.current) return;

      const normalizedError = getError(requestError);
      if (silent) {
        setRefreshError(normalizedError.message);
      } else {
        setData(null);
        setError(normalizedError);
      }
    } finally {
      if (requestId === requestIdRef.current) {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    }
  }, [axiosJWT, enabled, peraturanId, periodId]);

  useEffect(() => {
    if (enabled) {
      void refresh();
    } else {
      abortControllerRef.current?.abort();
      requestIdRef.current += 1;
      setData(null);
      setError(null);
      setRefreshError(null);
      setIsLoading(false);
      setIsRefreshing(false);
    }

    return () => abortControllerRef.current?.abort();
  }, [enabled, refresh]);

  const clearRefreshError = useCallback(() => setRefreshError(null), []);

  return {
    data,
    error,
    refreshError,
    isLoading,
    isRefreshing,
    refresh,
    clearRefreshError,
  };
}
