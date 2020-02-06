function ratingsChart(data) {


    const height = document.querySelector('#chart-1').clientHeight
    const h = height / 1.5
    const w = document.querySelector('#chart-1').clientWidth

    function filterType(data, group) {
        return data.filter(d => d.type == group);
    }

    function filterRating(data, group) {
        return data.filter(d => d.rating == group);
    }

    const noTV = filterType(data, "Movie") 

    //const w = 500
    //const h = 500
    const r = 3
    const o = .6
    const padding = 20
    const hXBrush = 40
    const wYBrush = 40
  
    const wSVG = w - padding
        , hSVG = h + hXBrush + padding

    const svg = d3.select("svg")
        .attr("width", wSVG)
        .attr("height", hSVG)


    const scatterplot = svg.append("g")
        .attr('transform', `translate(${wYBrush}, ${padding})`)


    const clip = scatterplot.append("defs")
        .append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", w - padding)
        .attr("height", h - hXBrush + padding)

    const xScale = d3.scaleTime()
        .range([0, w])
        .domain(d3.extent(data, d => d.date)).nice()

    const xAxis = scatterplot.append("g")
        .attr("class", "x axis")
        .attr("transform", `translate(0, ${h - hXBrush})`)
        .call(d3.axisBottom(xScale))

    const yScale = d3.scaleLinear()
        .range([h - hXBrush, 0])
        .domain(d3.extent(data, d => d.duration)).nice()

    const yAxis = scatterplot.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(yScale))

    const circles = scatterplot.selectAll("circle")
        .data(noTV)
        .join("circle")
        .attr("clip-path", clip)
        .attr("cx", d => xScale(d.date))
        .attr("cy", d => yScale(d.duration))
        .attr("r", r)
        .style("fill-opacity", o)
        .style("fill", "steeblue")


    // Brushing Sections

    // X Brushing
    const contextX = svg.append("g")
        .attr("class", "context")
        .attr("transform", 
                `translate(${wYBrush},${h})`)

    const xXScaleBrush = d3.scaleTime()
        .range([0, w])
        .domain(d3.extent(data, d => d.date))
        .nice()

    const yXScaleBrush = d3.scaleLinear()
        .range([hXBrush, 0])
        .domain(d3.extent(data, d => d.duration))
        .nice()

        //X Brushing
    function brushedX() {
        let extent = d3.event.selection.map(xXScaleBrush.invert, xXScaleBrush);
        xScale.domain(extent);
        circles.attr("cx", d => xScale(d.date))
        xAxis.call(d3.axisBottom(xScale))
    }

    const brushX = d3.brushX()
        .extent([[0, 0],[w, hXBrush]])
        .on("brush", brushedX);

    contextX.append("g")
        .attr("class", "x axis")
        .attr("transform",  `translate(0,${hXBrush})`)
        .call(d3.axisBottom(xXScaleBrush))


    contextX.selectAll("circle")
        .data(noTV)
        .join("circle")
        .style("fill", "#555")
        .attr("r", 2)
        .attr("cx", d => xScale(d.date))
        .attr("cy", d => yXScaleBrush(d.duration))

    contextX.append("g")
        .attr("class", "x brush")
        .call(brushX)


    //Event listener for dropdown
    d3.select("select")
        .on("change", () => {
            //const selectTags = document.querySelectorAll("select")
            let input = document.querySelector("select[name=ratings]")
            let value = input.value

            // noTV = filterType(data, "Movie")
            groupedRatings = filterRating(noTV, value)

            circles
                .data(noTV)
                .join("circle")
                .attr("cx", d => xScale(d.date))
                .attr("cy", d => yScale(d.duration))
                .attr("r", r)
                .style("fill-opacity", o)
                .style("fill", "steeblue")

    })
}