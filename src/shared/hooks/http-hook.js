import { useState, useRef, useEffect } from "react";

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const activeHttpRequests = useRef([]);

  const sendRequest = async (
    url,
    method = "GET",
    body = null,
    headers = {}
  ) => {
    setIsLoading(true);
    const httpAbortCtrl = new AbortController();
    activeHttpRequests.current.push(httpAbortCtrl);
    try {
      const response = await fetch(url, {
        method,
        body,
        headers,
        signal: httpAbortCtrl.signal
      });
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message);
      }
    } catch (err) {
      setError(err.message);
    }
    setIsLoading(false);
  };

  const clearError = () => {
    setError(null);
  };
  useEffect(() => {
    return () => {
      activeHttpRequests.current.forEach(abortCtrl.abort());
    };
  }, []);
  return { isLoading, error, sendRequest, clearError };
};
