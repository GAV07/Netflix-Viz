function ratingsChart(data) {

    nest = d3.nest()
        .key(d => d.rating)
        .entries(data)

    //console.log(nest)

    
    const height = document.querySelector('#chart-1').clientHeight
    const width = document.querySelector('#chart-1').clientWidth
    const padding = 30

    const svg = d3.select("#chart-1")

    const xScale = d3.scaleTime()
                .domain([
                    d3.min(data, function(d) { return d.date; }),
                    d3.max(data, function(d) { return d.date; })
                ])
                .range([padding, width - padding])

    const yScale = d3.scaleLinear()
                .domain([
                    d3.min(data, function(d) { return d.duration; }),
                    d3.max(data, function(d) { return d.duration; })
                ])
                .range([height - padding, padding]);

    const xAxis = d3.axisBottom()
                .scale(xScale)
                .ticks(5)
        
    const yAxis = d3.axisLeft()
                .scale(yScale)
                .ticks(5)

    svg.append("g")
                .attr("class", "x-axis")
                .attr("transform", "translate(0," + (height - padding) + ")")
                .call(xAxis)
         
    svg.append("g")
                .attr("class", "y-axis")
                .attr("transform", "translate(" + padding + ",0)")
                .call(yAxis)

    // Add a clipPath: everything out of this area won't be drawn.
    let clip = svg.append("defs").append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", width )
        .attr("height", height )
        .attr("x", 0)
        .attr("y", 0)

    function filterType(data, group) {
        return data.filter(d => d.type == group);
    }

    function filterRating(data, group) {
        return data.filter(d => d.rating == group);
    }
    
    // Helper function to add new points to our data
    function enterPoints(data) {
        // Add the points!

        let noTV = filterType(data, "Movie")

        const tooltip = d3.select("circle")
            .data(noTV)
            .enter().append("text")
            .style("position", "absolute")
            .style("z-index", "10")
            .style("visibility", "hidden")
            .text(d => d.title)  

        svg.selectAll("circle")
            .data(noTV)
            .enter().append("circle")
            .attr("class", "point")
            .attr('fill', 'grey')
            .attr("cx", d => xScale(d.date))
            .attr("cy", d => yScale(d.duration))
            .attr("r", 3)
            .style("opacity", .5)
            .on("mouseover", () => tooltip.style("visibility", "visible"))
            .on("mousemove", () => tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px"))
            .on("mouseout", () => tooltip.style("visibility", "hidden"))  
            
        
            
        
    }
    
    function exitPoints(data) {
        svg.selectAll("circle")
            .data(data)
            .exit()
            .remove();
    }
    
    function updatePoints(data) {
        svg.selectAll("circle")
            .data(data)
            .attr("cx", d => xScale(d.date))
            .attr("cy", d => yScale(d.duration))
            .attr("r", 3)
            .style("opacity", .5)
    }

    //Initial placement of points
    enterPoints(data)


    //Event listener for dropdown
    d3.select("select")
        .on("change", () => {
            //const selectTags = document.querySelectorAll("select")
            let input = document.querySelector("select[name=ratings]")
            let value = input.value

            noTV = filterType(data, "Movie")
            groupedRatings = filterRating(noTV, value)

            updatePoints(groupedRatings)
            enterPoints(groupedRatings)
            exitPoints(groupedRatings)

    })
}