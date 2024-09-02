import { fetchWithTimeout } from "from-anywhere";
import { StandardFunctionConfig } from "from-anywhere";
/**
 * Fetches google.com to check if we have an internet connection
 */
export const isOnline = async () => {
  const result = await fetchWithTimeout(
    "https://wikipedia.org",
    undefined,
    10000,
    true,
    false,
  );
  const { status, statusText } = result;
  return status === 200;
};

isOnline.config = { isPublic: true } satisfies StandardFunctionConfig;
