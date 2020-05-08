const width = window.innerWidth;
const height = window.innerHeight;

const filePath = "data.json";

let data;

let color = d3.scaleSequential([8, 0], d3.interplolateCool);

const treemap = (data) =>
  d3
    .treemap()
    .size([width, height])
    .paddingOuter(5)
    .paddingTop(20)
    .paddingInner(1)
    .round(true)(
    d3
      .hierarchy(data)
      .sum((d) => d.value)
      .sort((a, b) => b.value - a.value)
  );

const render = (data) => {
  const root = treemap(data);
  const svg = d3.select(".treemap").attr("viewBox", [0, 0, width, height]);

  const node = svg
    .selectAll("g")
    .data(
      d3
        .nest()
        .key((d) => d.height)
        .entries(root.descendants())
    )
    .join("g")
    .selectAll("g")
    .data((d) => d.values)
    .join("g")
    .attr("transform", (d) => `translate(${d.x0},${d.y0})`);

  node
    .append("rect")
    .attr("fill", (d) => color(d.height))
    .attr("width", (d) => d.x1 - d.x0)
    .attr("height", (d) => d.y1 - d.y0);

  node
    .appen("text")
    .selectAll("tspan")
    .data((d) => [d.data.name, d.value])
    .join("tspan")
    .attr("fill-opacity", (d, i, nodes) =>
      i === nodes.length - 1 ? 0.75 : null
    )
    .text((d) => d);
};

(async () => {
  data = await d3.json(filePath).then((data) => data);

  render(data);
})();
