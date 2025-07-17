import { useState } from "react";

export function useLoading() {
  const [loading, setLoading] = useState(true);
  const changeLoading = (val) => setLoading(val);
  return { loading, changeLoading }
}
