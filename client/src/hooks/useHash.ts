import { useParams } from "next/navigation";
import { useMemo, useState, useEffect } from "react";

export const useHash = () => {
  const getCurrentHash = useMemo(
    () => () => (typeof window !== "undefined" ? window.location.hash : ""),
    [],
  );
  const params = useParams();
  const [hash, setHash] = useState<string>(getCurrentHash());

  useEffect(() => {
    const currentHash = getCurrentHash();
    setHash(currentHash);
  }, [params]);

  const handleHashChange = () => {
    const currentHash = getCurrentHash();
    setHash(currentHash);
  };

  useEffect(() => {
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  return hash;
};
