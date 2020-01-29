
const parseTime = d3.timeParse("%B %-d, %Y")
const formatTime = d3.timeFormat("%b %Y")

function createChart(number) {

    d3.select(".container")
        .append("div")
        .attr("class", "chart-frames")
        .append("svg")
        .attr("id", `chart-${number}`)

}

createChart(1)
createChart(2)

d3.csv("./netflix_titles_nov_2019.csv", function(d) {

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
    
    //console.log(data)

    ratingsChart(data)
    countryChart(data)

        
})