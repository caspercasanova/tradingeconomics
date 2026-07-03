import { createEffect, onCleanup } from "solid-js";
import * as d3 from "d3";
import { CountrySearchResponse } from "../data";
import { useElementSize } from "../useElementSize";

type Props = {
  countryALabel: string;
  countryBLabel: string;
  countryAResponse: CountrySearchResponse | undefined;
  countryBResponse: CountrySearchResponse | undefined;
};

const normalize = (value: unknown) =>
  String(value ?? "unknown")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();

const getBreakdown = (response: CountrySearchResponse | undefined) => {
  const rows = response?.hits ?? [];

  const byCategory = d3.rollups(
    rows,
    (v) => v.length,
    (d) => `cat: ${normalize(d.category)}`,
  );

  const byType = d3.rollups(
    rows,
    (v) => v.length,
    (d) => `type: ${normalize(d.type)}`,
  );

  return new Map(
    [...byCategory, ...byType].filter(([key]) => key !== "cat: unknown"),
  );
};

export function CompareChart(props: Props) {
  let el!: HTMLDivElement;
  const box = useElementSize();

  createEffect(() => {
    const { width } = box.size();

    if (width <= 0 || !props.countryAResponse || !props.countryBResponse) {
      return;
    }

    const countryAMap = getBreakdown(props.countryAResponse);
    const countryBMap = getBreakdown(props.countryBResponse);

    const groups = Array.from(
      new Set([...countryAMap.keys(), ...countryBMap.keys()]),
    );

    const data = groups
      .map((group) => ({
        group,
        countryA: countryAMap.get(group) ?? 0,
        countryB: countryBMap.get(group) ?? 0,
      }))
      .sort((a, b) => b.countryA + b.countryB - (a.countryA + a.countryB))
      .slice(0, 10);

    const height = Math.max(240, data.length * 32 + 72);

    const margin = {
      top: 32,
      right: 20,
      bottom: 36,
      left: width < 500 ? 90 : 130,
    };

    el.innerHTML = "";

    const svg = d3
      .select(el)
      .append("svg")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("width", "100%")
      .attr("height", height);

    svg
      .append("text")
      .attr("x", margin.left)
      .attr("y", 18)
      .attr("font-size", 13)
      .attr("font-weight", 700)
      .text(`${props.countryALabel} vs ${props.countryBLabel}`);

    const x = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => Math.max(d.countryA, d.countryB)) || 1])
      .nice()
      .range([margin.left, width - margin.right]);

    const y0 = d3
      .scaleBand()
      .domain(data.map((d) => d.group))
      .range([margin.top, height - margin.bottom])
      .padding(0.2);

    const y1 = d3
      .scaleBand()
      .domain(["countryA", "countryB"])
      .range([0, y0.bandwidth()])
      .padding(0.12);

    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).ticks(width < 500 ? 3 : 5));

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y0))
      .selectAll("text")
      .attr("font-size", 10);

    const series = [
      { key: "countryA", label: props.countryALabel, opacity: 0.85 },
      { key: "countryB", label: props.countryBLabel, opacity: 0.35 },
    ] as const;

    svg
      .append("g")
      .selectAll("g")
      .data(data)
      .join("g")
      .attr("transform", (d) => `translate(0,${y0(d.group)})`)
      .selectAll("rect")
      .data((d) =>
        series.map((s) => ({
          key: s.key,
          label: s.label,
          value: d[s.key],
          opacity: s.opacity,
        })),
      )
      .join("rect")
      .attr("x", margin.left)
      .attr("y", (d) => y1(d.key)!)
      .attr("width", (d) => Math.max(0, x(d.value) - margin.left))
      .attr("height", y1.bandwidth())
      .attr("rx", 3)
      .attr("fill", "currentColor")
      .attr("opacity", (d) => d.opacity);

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},${height - 10})`)
      .selectAll("text")
      .data(series)
      .join("text")
      .attr("x", (_, i) => i * 160)
      .attr("font-size", 11)
      .attr("opacity", (d) => d.opacity)
      .text((d) => `■ ${d.label}`);
  });

  onCleanup(() => {
    if (el) el.innerHTML = "";
  });

  return (
    <div ref={box.ref} class="w-full border p-2">
      <div ref={el} />
    </div>
  );
}