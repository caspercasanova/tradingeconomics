import { createEffect, on, onCleanup } from "solid-js";
import * as d3 from "d3";
import { useElementSize } from "../useElementSize";

type GlobeProps = {
  data: GeoJSON.FeatureCollection;
  selectedCountry?: string;
  onSelect?: (country: string) => void;
};

export function Globe(props: GlobeProps) {
  let el!: HTMLDivElement;
  const box = useElementSize();

  let countries:
    | d3.Selection<SVGPathElement, any, SVGGElement, unknown>
    | undefined;

  const updateSelection = () => {
    if (!countries) return;

    const selected = props.selectedCountry;

    countries
      .attr("fill", (d: any) =>
        d.properties.name === selected ? "#ffcc66" : "#f4f4f4",
      )
      .attr("stroke", (d: any) =>
        d.properties.name === selected ? "#111" : "#aaa",
      )
      .attr("stroke-width", (d: any) =>
        d.properties.name === selected ? 1.5 : 0.5,
      );
  };

  createEffect(
    on(
      () => box.size().width,
      (width) => {
        if (width <= 0) return;

        const height = width;
        const globeSize = Math.min(width, height);

        let rotate: [number, number] = [0, 0];

        let mouseDownInfo: {
          mouse: [number, number] | null;
          rotate: [number, number];
        } = {
          mouse: null,
          rotate: [0, 0],
        };

        el.innerHTML = "";

        const svg = d3
          .select(el)
          .append("svg")
          .attr("viewBox", `0 0 ${width} ${height}`)
          .attr("width", "100%")
          .attr("height", height);

        const projection = d3
          .geoOrthographic()
          .scale(globeSize * 0.48)
          .translate([width / 2, height / 2])
          .rotate(rotate);

        const path = d3.geoPath(projection);

        svg
          .append("path")
          .datum(d3.geoCircle()())
          .attr("fill", "#aadaff")
          .attr("d", path as any);

        countries = svg
          .append("g")
          .selectAll("path")
          .data(props.data.features as any[])
          .enter()
          .append("path")
          .attr("d", path as any)
          .attr("fill", "#f4f4f4")
          .attr("stroke", "#aaa")
          .attr("stroke-width", 0.5)
          .style("cursor", "pointer")
          .on("click", function (event, d: any) {
            event.stopPropagation();
            props.onSelect?.(d.properties.name);
          });

        countries.append("title").text((d: any) => d.properties.name);

        updateSelection();

        svg.on("mousedown", (event) => {
          mouseDownInfo.mouse = [event.pageX, event.pageY];
          mouseDownInfo.rotate = [...rotate];
          event.preventDefault();
        });

        d3.select(window)
          .on("mousemove.globe", (event) => {
            if (!mouseDownInfo.mouse) return;

            const mouse: [number, number] = [event.pageX, event.pageY];

            rotate = [
              mouseDownInfo.rotate[0] -
                (mouseDownInfo.mouse[0] - mouse[0]) / 8,
              mouseDownInfo.rotate[1] -
                (mouse[1] - mouseDownInfo.mouse[1]) / 8,
            ];

            projection.rotate(rotate);
            countries?.attr("d", path as any);
          })
          .on("mouseup.globe", () => {
            mouseDownInfo.mouse = null;
          });

        onCleanup(() => {
          d3.select(window)
            .on("mousemove.globe", null)
            .on("mouseup.globe", null);

          svg.remove();
          countries = undefined;
        });
      },
    ),
  );

  createEffect(
    on(
      () => props.selectedCountry,
      () => {
        updateSelection();
      },
    ),
  );

  return (
    <div ref={box.ref} class="w-full max-w-[600px]">
      <div ref={el} />
    </div>
  );
}