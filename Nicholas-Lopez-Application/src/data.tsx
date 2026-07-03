export type CountrySearchResponse = {
  info: {
    hits: number;
    page: number;
    facets: Record<string, { key: string; doc_count: number }[]>;
  };
  hits: CountrySeries[];
  stance: string;
};

export type CountrySeries = {
  country: string | null;
  category: string | null;
  currency: string | null;
  iids: string;
  esID: string;
  s: string;
  importance: number;
  name: string;
  type: string;
  group: string | null;
  frequency: string;
  unit: string | null;
  pretty_name: string;
  source: string;
  url: string;
};

export const CACHE_PREFIX = "country-data:";
export const CACHE_VERSION = "v1";

export const getCacheKey = (country: string) =>
  `${CACHE_PREFIX}${CACHE_VERSION}:${country}`;

export const getSeriesCacheKey = (series: string) =>
  `${CACHE_PREFIX}${CACHE_VERSION}:series:${series}`;

export const fetchCountryData = async ({
  country = "Nigeria",
}: {
  country: string;
}): Promise<CountrySearchResponse> => {
  const cacheKey = getCacheKey(country);
  const cached = localStorage.getItem(cacheKey);

  if (cached) {
    return JSON.parse(cached);
  }

  const uriCountry = encodeURIComponent(country);

  const response = await fetch(
    `https://brains.tradingeconomics.com/v2/search/wb,fred,comtrade?q=${uriCountry}&pp=50&p=0&_=1557934352427&stance=2`,
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch ${country}: ${response.status}`);
  }

  const res: CountrySearchResponse = await response.json();

  localStorage.setItem(cacheKey, JSON.stringify(res));
  console.log(res);
  return res;
};

export const clearCountryCache = (country?: string) => {
  if (country) {
    localStorage.removeItem(getCacheKey(country));
    return;
  }

  Object.keys(localStorage)
    .filter((key) => key.startsWith(CACHE_PREFIX))
    .forEach((key) => localStorage.removeItem(key));
};

export function getCachedCountryResponses(): CountrySearchResponse[] {
  return Object.keys(localStorage)
    .filter((key) => key.startsWith(CACHE_PREFIX))
    .map((key) => {
      try {
        return JSON.parse(localStorage.getItem(key) ?? "null");
      } catch {
        return null;
      }
    })
    .filter(Boolean) as CountrySearchResponse[];
}
