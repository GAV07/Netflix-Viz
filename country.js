function countryChart(data) {

    const height = document.querySelector('#chart-2').clientHeight
    const width = document.querySelector('#chart-2').clientWidth
    const svg = d3.select("#chart-2")
    const g = svg.append("g")

    const projection = d3.geoMercator()
        .translate([width/2, (height/2) + 100])
        .scale([100])

    const path = d3.geoPath()
        .projection(projection)


    d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json").then(geo => {

        //console.log(geo)
        world = topojson.feature(geo,geo.objects.countries).features

        g.selectAll("path")
                .data(world)
                .enter().append("path")
                .attr("d", path)
                .attr("fill", "white")
                .style("stroke", "black")
                .style("stroke-width", 1.5)

        const byCountry = d3.nest()
            .key(d => d.country)
            .entries(data)

        console.log(byCountry)


    })


}