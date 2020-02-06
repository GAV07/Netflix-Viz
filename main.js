function responsivefy(svg) {
    // container will be the DOM element
    // that the svg is appended to
    // we then measure the container
    // and find its aspect ratio
    const container = d3.select(svg.node().parentNode),
        width = parseInt(svg.style('width'), 10),
        height = parseInt(svg.style('height'), 10),
        aspect = width / height;
   
    // set viewBox attribute to the initial size
    // control scaling with preserveAspectRatio
    // resize svg on inital page load
    svg.attr('viewBox', `0 0 ${width} ${height}`)
        .attr('preserveAspectRatio', 'xMinYMid')
        .call(resize);
   
    // add a listener so the chart will be resized
    // when the window resizes
    // multiple listeners for the same event type
    // requires a namespace, i.e., 'click.foo'
    // api docs: https://goo.gl/F3ZCFr
    d3.select(window).on(
        'resize.' + container.attr('id'), 
        resize
    );
   
    // this is the code that resizes the chart
    // it will be called on load
    // and in response to window resizes
    // gets the width of the container
    // and resizes the svg to fill it
    // while maintaining a consistent aspect ratio
    function resize() {
        const w = parseInt(container.style('width'));
        svg.attr('width', w);
        svg.attr('height', Math.round(w / aspect));
    }
  }

function createChart(number) {

    d3.select(".container")
        .append("div")
        .attr("class", "chart-frames")
        .attr("id", `chart-${number}`)
        .append("svg")
        //.call(responsivefy)
}

createChart(1)


d3.csv("./netflix_titles_nov_2019.csv", function(d) {

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
    
    //console.log(data)

    ratingsChart(data)
    //countryChart(data)

        
})