function countryChart(data) {

    const height = document.querySelector('#chart-2').clientHeight
    const width = document.querySelector('#chart-2').clientWidth

    const svg = d3.select("#chart-2 svg")
        .attr("height", height)
        .attr("width", width)

    const map = svg.append("g")

    const projection = d3.geoMercator()
        .translate([width/2, (height/2) + 100])
        .scale([140])

    const path = d3.geoPath()
        .projection(projection)

    const byCountry = d3.nest()
        .key(d => d.country)
        .entries(data)

    const colorScale = d3.scaleSequentialPow(d3.interpolatePlasma)
        .domain([0, d3.max(byCountry, d => d.values.length)])
        .exponent(.4)

    const color = d3.scaleQuantize()
        .range(["rgb(237,248,233)","rgb(186,228,179)","rgb(116,196,118)","rgb(49,163,84)","rgb(0,109,44)"])


    d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json").then(geo => {

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

        }).then(edited => {

            world = topojson.feature(geo,geo.objects.countries).features

            map.selectAll("path")
                    .data(world)
                    .enter().append("path")
                    .attr("class", "base-map")
                    .attr("d", path)
                    .data(byCountry)
                    .attr("fill", d => {

                        return color(d.values.length)
                    })



        })
        

        
            
        // const print = d3.nest()
        //     .key(d => d.country)
        //     //.rollup(d => d3.max(d.values))
        //     .entries(data)
        

        // console.log(print)

        // const radius = d3.scaleSqrt()
        //     .domain([0,
        //         d3.max(byCountry, function(d) { return d.values.length })
        //     ])
        //     .range([0, 30])

        // svg.append("g")
        //     .attr("class", "bubble")
        // .selectAll("circle")
        //     .data(world)
        // .enter().append("circle")
        //     .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"})
        //     .data(byCountry)
        //     .attr("r", d => radius(d.values.length))


    })


}