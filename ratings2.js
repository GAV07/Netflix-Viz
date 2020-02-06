
d3.csv("edited_netflix.csv", function(d) {

    const parseTime = d3.timeParse("%B %-d, %Y")
    const formatTime = d3.timeFormat("%b %Y")

    return {

        id: +d["show_id"],
        title: d.title,
        director: d.director,
        cast: d.cast,
        country: d.country,
        date: parseTime(d["date_added"]), 
        release: d["release_year"],
        rating: d.rating,
        duration: +d.duration.replace("min", ""),
        listed: d["listed_in"],
        description: d.description,
        type: d.type

    } 


}).then(data => {

    const w = 500
    const h = 500
    const m = ({t: 30, b: 10, l: 30, r: 10})
    const r = 3
    const o = .6

    const hXBrush = 40
        , wYBrush = 40
        , mYBrush = {t: 10, b: 15, l: 30, r: 10}
        , mXBrush = {t: 10, b: 20, l: 0, r: 10}
  
  const wSVG = w + m.l + m.r + wYBrush + mYBrush.l + mYBrush.r
      , hSVG = h + m.t + m.b + hXBrush + mXBrush.t + mXBrush.b
  
  const svg = d3.select("svg")
    .attr("width", wSVG)
    .attr("height", hSVG)

  
  const scatterpolot = svg.append("g")
      .attr('transform', `translate(${m.l + mYBrush.l + mYBrush.r + wYBrush}, ${m.t})`);
  
  const clip = d3.select("clip")
  
  scatterpolot.append("defs")
    .append("clipPath")
    .attr("id", clip.id)
    .append("rect")
    .attr("width", w)
    .attr("height", h - hXBrush);

  const xScale = d3.scaleTime()
    .range([0, w])
    .domain(d3.extent(data, d => d.date)).nice();
  
  const xAxis = scatterpolot.append("g")
    .attr("class", "x axis")
    .attr("transform", `translate(0, ${h - hXBrush})`)
    .call(d3.axisBottom(xScale));
  
  const yScale = d3.scaleLinear()
    .range([h - hXBrush, 0])
    .domain(d3.extent(data, d => d.duration)).nice();
  
  const yAxis = scatterpolot.append("g")
    .attr("class", "y axis")
    .call(d3.axisLeft(yScale));
  
  const circles = scatterpolot.selectAll("circle")
    .data(data)
    .join("circle")
    .attr("clip-path", clip)
    .attr("cx", d => xScale(d.date))
    .attr("cy", d => yScale(d.duration))
    .attr("r", r)
    .style("fill-opacity", o)
    .style("fill", "steeblue");
  
  
  // Brushing Sections
  
  // X Brushing
  const contextX = svg.append("g")
    .attr("class", "context")
    .attr("transform", 
          `translate(${wYBrush + m.l + mXBrush.l + mYBrush.l + mYBrush.r},${h + m.t + m.b + mXBrush.t})`);
  
  const xXScaleBrush = d3.scaleTime()
    .range([0, w])
    .domain(d3.extent(data, d => d.date)).nice();
  
  const yXScaleBrush = d3.scaleLinear()
    .range([hXBrush, 0])
    .domain(d3.extent(data, d => d.duration)).nice();
  
     //X Brushing
  function brushedX() {
    let extent = d3.event.selection.map(xXScaleBrush.invert, xXScaleBrush);
    xScale.domain(extent);
    circles.attr("cx", d => xScale(d.date))
    xAxis.call(d3.axisBottom(xScale));
   }
  
  const brushX = d3.brushX().extent([[0, 0],[w, hXBrush]]).on("brush", brushedX);

  contextX.append("g")
    .attr("class", "x axis")
    .attr("transform",  `translate(0,${hXBrush})`)
    .call(d3.axisBottom(xXScaleBrush));

  
  contextX.selectAll("circle")
    .data(data)
    .join("circle")
    .style("fill", "#555")
    .attr("r", 2)
    .attr("cx", d => xScale(d.date))
    .attr("cy", d => yXScaleBrush(d.duration))

  contextX.append("g")
    .attr("class", "x brush")
    .call(brushX);

})

