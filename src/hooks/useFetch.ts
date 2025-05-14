import { useState, useEffect } from 'react';

/**
 * Hook customizado para realizar requisições HTTP
 * @param urlOrGetter URL a ser requisitada ou função que retorna uma Promise com os dados
 * @returns Objeto contendo os dados, estado de carregamento e erros
 */
function useFetch<T>(urlOrGetter: string | (() => Promise<T>)) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const { signal } = controller;

    const fetchData = async () => {
      try {
        setLoading(true);
        
        let result: any;
        
        if (typeof urlOrGetter === 'string') {
          console.log('Fetching URL:', urlOrGetter);
          const response = await fetch(urlOrGetter, { signal });
          
          if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status}`);
          }
          
          result = await response.json();
        } else {
          result = await urlOrGetter();
        }
        
        if (isMounted) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          if (err instanceof Error) {
            if (err.name !== 'AbortError') {
              console.error('Erro ao buscar dados:', err);
              setError(err.message);
            }
          } else {
            setError('Ocorreu um erro desconhecido');
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [urlOrGetter]);

  return { data, loading, error };
}

export default useFetch; 