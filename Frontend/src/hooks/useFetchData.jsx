import { useState, useEffect } from "react";
import { token } from "../utils/config";

const useFetchData = (url) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController(); // Allows aborting the fetch
    const signal = controller.signal;

    const fetchData = async () => {
      setLoading(true);
      setError(null); // Reset error before fetching

      try {
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
          signal, // Link the signal to abort the fetch request
        });

        const result = await res.json();

        if (!res.ok) {
          throw new Error(result.message || "Failed to fetch data");
        }

        setData(result.data);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Cleanup function: abort fetch on component unmount
    return () => {
      controller.abort();
    };
  }, [url]); // Adding `url` as a dependency ensures the effect runs when URL changes

  return { data, loading, error };
};

export default useFetchData;
