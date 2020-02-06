function ratingsChart(data) {


    const height = document.querySelector('#chart-1').clientHeight
    const chartHeight = height / 1.5
    const w = document.querySelector('#chart-1').clientWidth
    const miniChartHeight = 100
    const padding = 30
    const miniPadding = 20
    const radius = 3
    const miniRadius = 1.5

    function filterType(data, group) {
        return data.filter(d => d.type == group);
    }

    function filterRating(data, group) {
        return data.filter(d => d.rating == group);
    }

    const noTV = filterType(data, "Movie") 

    //const w = 500
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
        .attr('transform', `translate(${m.l + mYBrush.l + mYBrush.r + wYBrush}, ${m.t})`)

    const clip = d3.select("clip")

    scatterpolot.append("defs")
        .append("clipPath")
        .attr("id", clip.id)
        .append("rect")
        .attr("width", w)
        .attr("height", h - hXBrush)

    const xScale = d3.scaleTime()
        .range([0, w])
        .domain(d3.extent(data, d => d.date)).nice()

    const xAxis = scatterpolot.append("g")
        .attr("class", "x axis")
        .attr("transform", `translate(0, ${h - hXBrush})`)
        .call(d3.axisBottom(xScale))

    const yScale = d3.scaleLinear()
        .range([h - hXBrush, 0])
        .domain(d3.extent(data, d => d.duration)).nice()

    const yAxis = scatterpolot.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(yScale))

    const circles = scatterpolot.selectAll("circle")
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
                `translate(${wYBrush + m.l + mXBrush.l + mYBrush.l + mYBrush.r},${h + m.t + m.b + mXBrush.t})`)

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



    
    // Helper function to add new points to our data
//     function enterPoints(data) {


//         const noTV = filterType(data, "Movie") 

//         circles
//             .data(noTV)
//             .enter().append("circle")
//             .attr("class", "points")
//             .attr("clip-path", "url(#clip)")
//             .attr('fill', 'steelblue')
//             .attr("cx", d => xScale(d.date))
//             .attr("cy", d => yScale(d.duration))
//             .attr("r", 0)
//             .transition().duration(1000)
//             .attr("r", radius)
//             .style("opacity", .5)

//         miniChart.selectAll("circle")
//             .data(noTV)
//             .enter().append("circle")
//             .attr("class", "mini-points")
//             .attr("fill", "blue")
//             .attr("cx", d => xScaleMin(d.date))
//             .attr("cy", d => yScaleMin(d.duration))
//             .attr("r", miniRadius)
        
//         miniChart.selectAll("circle")
//             .data(noTV)
//             .join("circle")
//             .style("fill", "#555")
//             .attr("r", miniRadius)
//             .attr("cx", d => xScaleMin(d.date))
//             .attr("cy", d => yScaleMin(d.duration))
        
        
                      
//     }
    
//     function exitPoints(data) {
//         circles
//             .data(data)
//             .exit()
//             .remove();
//     }
    
//     function updatePoints(data) {
//         circles
//             .data(data)
//             .attr("cx", d => xScale(d.date))
//             .attr("cy", d => yScale(d.duration))
//             .attr("r", 3)
//             .style("opacity", .5)
//     }

//     //Initial placement of points
//     enterPoints(data)


//     //Event listener for dropdown
//     d3.select("select")
//         .on("change", () => {
//             //const selectTags = document.querySelectorAll("select")
//             let input = document.querySelector("select[name=ratings]")
//             let value = input.value

//             noTV = filterType(data, "Movie")
//             groupedRatings = filterRating(noTV, value)

//             //updatePoints(groupedRatings)
//             enterPoints(groupedRatings)
//             //exitPoints(groupedRatings)

//     })
}