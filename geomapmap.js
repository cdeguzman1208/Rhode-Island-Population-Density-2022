/*-----------------------------------------------------------------------------
Tasks:
1. create a simple county-wise population density map for the state.
2. display the color legend and create a variation where a different color
   binding and color legend is chosen so that it brings out the variations of
   population density within your state better + provide a clickable button
   that will flip between the two visualizations.
3. create a variation where the visualization will toggle county boundaries
   using the following button names "toggle county boundary".
4. create a tooltip to display information associated with a county.
-----------------------------------------------------------------------------*/

// define margin
var margin = {left: 80, right: 80, top: 50, bottom: 50 },
    width =  960 - margin.left - margin.right,
    height = (200 + 500) - margin.top - margin.bottom;

// define svg
var svg = d3.select("body")
.append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
.call(d3.zoom().on('zoom', zoomed))
.append('g');

function zoomed() {
	svg.attr('transform', d3.event.transform)
}

// define path
var path = d3.geoPath()
.projection(null);

// define color
var color = d3.scaleThreshold()
    .domain([1, 10, 50, 200, 500, 1000, 2000, 4000])
    .range(d3.schemeBlues[9]);

// define x
var x = d3.scaleSqrt()
    .domain([0, 4500])
    .rangeRound([440, 950]);

// define g
var g = svg.append("g")
    .attr("class", "key")
    .attr("transform", "translate(0,40)");

// make legend
g.selectAll("rect")
  .data(color.range().map(function(d) {
      d = color.invertExtent(d);
      if (d[0] == null) d[0] = x.domain()[0];
      if (d[1] == null) d[1] = x.domain()[1];
      return d;
    }))
  .enter().append("rect")
    .attr("height", 8)
    .attr("x", function(d) { return x(d[0]); })
    .attr("width", function(d) { return x(d[1]) - x(d[0]); })
    .attr("fill", function(d) { return color(d[0]); });

// add text to legend
g.append("text")
    .attr("class", "caption")
    .attr("x", x.range()[0])
    .attr("y", -6)
    .attr("fill", "#000")
    .attr("text-anchor", "start")
    .attr("font-weight", "bold")
    .text("Population per square mile");

// show legend tick lines
g.call(d3.axisBottom(x)
    .tickSize(13)
    .tickValues(color.domain()))
    .select(".domain")
    .remove();

d3.json('https://s3-us-west-2.amazonaws.com/s.cdpn.io/25240/ca-counties.json', function(error, california) {
    if(error) throw error;
    
    svg.selectAll('path')
        .data(topojson.feature(california, california.objects.counties).features)
        .enter().append('path')
        .attr('fill', function(d, i) {
            return color(i);
        })
        .attr('class', 'land')
        .attr('id', function(d, i) {
            return california.objects.counties.geometries[i].name;
        })
        .attr('d', path)
        .append('title')
        .text(function(d,i) { return california.objects.counties.geometries[i].name + ' County'; });
    
    svg.append('path')
        .datum(topojson.mesh(california, california.objects.counties, function(a, b) { return a !== b; }))
        .attr('class', 'boundry')
        .attr('d', path);
    
    g.append("g")
        .selectAll("path")
        .on("mouseover", function(d) { // show tooltip
            d3.select("#tooltip")
                .select("#name")
                .text(d.name.value);
            d3.select("#tooltip")
                .select("#density")
                .text(d.density.value);
            d3.select("#tooltip")
                .style("left", (d3.event.pageX - 50) + "px")
                .style("top", (d3.event.pageY - 50) + "px")
                .classed("hidden", false);
        })
        .on("mouseout", function() { // hide tooltip
            d3.select("#tooltip").classed("hidden", true);
        })
});
