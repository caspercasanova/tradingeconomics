import {
  Component,
  createMemo,
  createResource,
  createSignal,
  For,
  Show,
} from "solid-js";
import world from "./world.json";
import { Globe } from "./components/globe";
import { Chart } from "./components/chart";
import { CompareChart } from "./components/compare-chart";
import { clearCountryCache, fetchCountryData } from "./data";

const App: Component = () => {
  const [countryA, setCountryA] = createSignal("NIGERIA");
  const [countryB, setCountryB] = createSignal("CANADA");
  const [activeSlot, setActiveSlot] = createSignal<"A" | "B">("A");

  const [countryAData, { refetch: refetchA }] = createResource(
    countryA,
    (country) => fetchCountryData({ country }),
  );

  const [countryBData, { refetch: refetchB }] = createResource(
    countryB,
    (country) => fetchCountryData({ country }),
  );

  const selectedCountry = () =>
    activeSlot() === "A" ? countryA() : countryB();

  const selectedCountryData = createMemo(() =>
    activeSlot() === "A" ? countryAData() : countryBData(),
  );

  const selectCountry = (country: string) => {
    if (activeSlot() === "A") {
      setCountryA(country);
    } else {
      setCountryB(country);
    }
  };

  const clearAll = () => {
    clearCountryCache();
    refetchA();
    refetchB();
  };

  return (
    <main class="relative container mx-auto scroll-my-12 overflow-auto p-4 print:p-12 md:p-16 dark:bg-dark print:space-y-6">
      <section class="relative z-10 mx-auto w-full max-w-7xl space-y-8">
        <header class="space-y-4">
          <div class="space-y-2">
            <h1 class="text-2xl font-bold">
              Nicholas Lopez Developer Exercise
            </h1>
            <div class="flex flex-wrap items-center gap-4 font-mono text-sm">
              <a
                href="https://www.linkedin.com/in/310-nicholas-lopez"
                target="_blank"
                rel="noopener noreferrer"
                class="underline underline-offset-2 hover:text-foreground"
              >
                LinkedIn
              </a>

              <a
                href="https://github.com/caspercasanova"
                target="_blank"
                rel="noopener noreferrer"
                class="underline underline-offset-2 hover:text-foreground"
              >
                GitHub
              </a>

              <a
                href="https://nhjlopez.com"
                target="_blank"
                rel="noopener noreferrer"
                class="underline underline-offset-2 hover:text-foreground"
              >
                Résumé
              </a>
            </div>

            <p class="max-w-2xl text-pretty font-mono text-sm text-muted-foreground">
              Thank you for the opportunity to apply to the team.{" "}
              <span class="font-bold text-foreground">Click a country</span> on
              the globe to fetch, cache, and display its economic search data.
            </p>

            <p class="max-w-2xl text-pretty font-mono text-sm text-muted-foreground">
              <span class="font-bold text-red-500">Note:</span> This demo uses
              the{" "}
              <a
                class="underline underline-offset-2 hover:text-foreground"
                href="https://brains.tradingeconomics.com/v2/search/wb,fred,comtrade?q=nigeria&pp=50&p=0&_=1557934352427&stance=2"
                target="_blank"
                rel="noopener noreferrer"
              >
                Trading Economics search endpoint
              </a>{" "}
              by substituting the country query parameter. I intentionally did
              not use a paid API key for this demonstration.
            </p>

            <p class="max-w-2xl text-pretty font-mono text-sm text-muted-foreground">
              With additional API access, I'd extend this into a country
              relationship explorer by modeling imports, exports, and other
              economic indicators as a connected network graph.
            </p>
          </div>

          <div class="flex flex-wrap items-center justify-between gap-2 font-mono text-sm">
            <div>
              Active selection: <strong>{selectedCountry()}</strong>
            </div>

            <button
              class=" hover:bg-neutral-500 active:scale-95 cursor-pointer border px-2 py-1 "
              onClick={clearAll}
            >
              Clear all cache
            </button>
          </div>
        </header>

        <section class="space-y-3">
          <h2 class="text-xl font-bold">Demo</h2>

          <div class="grid gap-6 lg:grid-cols-[600px_minmax(0,1fr)]">
            <div class="space-y-2">
              <Globe
                data={world as any}
                selectedCountry={selectedCountry()}
                onSelect={selectCountry}
              />

              <Show when={countryAData.loading || countryBData.loading}>
                <div class="font-mono text-sm">Loading comparison...</div>
              </Show>
            </div>

            <div class="min-w-0 space-y-6">
              <div class="flex flex-wrap items-center gap-2 font-mono text-sm">
                <button
                  class={` hover:bg-neutral-500 active:scale-95 cursor-pointer border px-2 py-1 ${
                    activeSlot() === "A" ? "bg-black text-white" : ""
                  }`}
                  onClick={() => setActiveSlot("A")}
                >
                  Set Country A
                </button>

                <button
                  class={`hover:bg-neutral-500 active:scale-95 cursor-pointer border px-2 py-1 ${
                    activeSlot() === "B" ? "bg-black text-white" : ""
                  }`}
                  onClick={() => setActiveSlot("B")}
                >
                  Set Country B
                </button>

                <div>
                  Comparing <strong>{countryA()}</strong> vs{" "}
                  <strong>{countryB()}</strong>
                </div>
              </div>

              <Show when={selectedCountryData()}>
                {(res) => (
                  <Chart country={selectedCountry()} response={res()} />
                )}
              </Show>

              <CompareChart
                countryALabel={countryA()}
                countryBLabel={countryB()}
                countryAResponse={countryAData()}
                countryBResponse={countryBData()}
              />
            </div>
          </div>
        </section>

        <section class="overflow-auto border">
          <Show when={selectedCountryData()}>
            {(res) => (
              <table class="w-full border-collapse font-mono text-xs">
                <thead>
                  <tr class="border-b">
                    <th class="p-2 text-left">Name</th>
                    <th class="p-2 text-left">Category</th>
                    <th class="p-2 text-left">Type</th>
                    <th class="p-2 text-left">Frequency</th>
                    <th class="p-2 text-left">Source</th>
                    <th class="p-2 text-right">Importance</th>
                  </tr>
                </thead>

                <tbody>
                  <For each={res().hits.slice(0, 25)}>
                    {(row) => (
                      <tr class="border-b last:border-b-0">
                        <td class="p-2">{row.pretty_name ?? row.name}</td>
                        <td class="p-2">{row.category ?? "—"}</td>
                        <td class="p-2">{row.type}</td>
                        <td class="p-2">{row.frequency}</td>
                        <td class="p-2">{row.source}</td>
                        <td class="p-2 text-right">{row.importance}</td>
                      </tr>
                    )}
                  </For>
                </tbody>
              </table>
            )}
          </Show>
        </section>
      </section>
    </main>
  );
};

export default App;
