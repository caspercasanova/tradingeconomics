import { createEffect, onCleanup } from "solid-js";
import * as d3 from "d3";
import { CountrySearchResponse } from "../data";
import { useElementSize } from "../useElementSize";

type Props = {
  country: string;
  response: CountrySearchResponse | undefined;
};

const normalize = (value: unknown) =>
  String(value ?? "unknown").toLowerCase().replace(/\s+/g, " ").trim();



export function Chart(props: Props) {
  let el!: HTMLDivElement;
  const box = useElementSize();

  createEffect(() => {
    const response = props.response;
    const { width } = box.size();

    if (!response || width <= 0) return;

    const rows = response.hits ?? [];

    const byType = d3.rollups(
      rows,
      (v) => v.length,
      (d) => normalize(d.type),
    );

    const byCategory = d3.rollups(
      rows,
      (v) => v.length,
      (d) => normalize(d.category),
    );

    const data = [
      ...byType.map(([key, count]) => ({
        group: `type: ${key}`,
        count,
      })),
      ...byCategory.map(([key, count]) => ({
        group: `cat: ${key}`,
        count,
      })),
    ]
      .filter((d) => d.group !== "cat: unknown")
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const height = Math.max(260, data.length * 32 + 90);

    const margin = {
      top: 48,
      right: 36,
      bottom: 40,
  left: width < 500 ? 90 : 140,

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
      .attr("y", 24)
      .attr("font-size", width < 500 ? 12 : 14)
      .attr("font-weight", 700)
      .text(`${props.country}: breakdown`);

    const x = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.count) || 1])
      .nice()
      .range([margin.left, width - margin.right]);

    const y = d3
      .scaleBand()
      .domain(data.map((d) => d.group))
      .range([margin.top, height - margin.bottom])
      .padding(0.2);

    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).ticks(width < 500 ? 3 : 5));

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y))
      .selectAll("text")
      .attr("font-size", width < 500 ? 10 : 11);

    svg
      .selectAll("rect")
      .data(data)
      .join("rect")
      .attr("x", margin.left)
      .attr("y", (d) => y(d.group)!)
      .attr("width", (d) => Math.max(0, x(d.count) - margin.left))
      .attr("height", y.bandwidth())
      .attr("rx", 4)
      .attr("fill", "currentColor")
      .attr("opacity", 0.75);

    svg
      .selectAll("text.value")
      .data(data)
      .join("text")
      .attr("class", "value")
      .attr("x", (d) => Math.min(x(d.count) + 6, width - 24))
      .attr("y", (d) => y(d.group)! + y.bandwidth() / 2)
      .attr("dominant-baseline", "middle")
      .attr("font-size", 11)
      .text((d) => d.count);
  });

  onCleanup(() => {
    if (el) el.innerHTML = "";
  });

  return (
    <div ref={box.ref} class="w-full border p-2 ">
      <div ref={el} />
    </div>
  );
}