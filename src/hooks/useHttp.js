import { useCallback, useEffect, useState } from "react";

async function sendHttpReques(url, config) {
  const response = await fetch(url, config);
  const respData = await response.json();
  if (!response.ok) {
    throw new Error(response.message || "Something went wrong...");
  }

  return respData;
}

export function useHttp(url, config, initialData) {
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(initialData);
  function clearData() {
    setData(initialData);
  }
  const sendRequest = useCallback(
    async function sendRequest(data) {
      try {
        setIsLoading(true);
        const respData = await sendHttpReques(url, { ...config, body: data });

        setData(respData);
      } catch (error) {
        setError(error.message || "Something went wrong...");
      }
      setIsLoading(false);
    },
    [url, config]
  );
  useEffect(() => {
    if ((config && (config.method === "GET" || !config.method)) || !config) {
      sendRequest();
    }
  }, [sendRequest, config]);

  return {
    data,
    isLoading,
    error,
    sendRequest,
    clearData,
  };
}
