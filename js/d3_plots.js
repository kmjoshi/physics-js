// const margin = {top: 0, right: 0, bottom: 0, left: 0},
//     width = 400 - margin.left - margin.right,
//     height = 400 - margin.top - margin.bottom;
//
// const data_x = [4, 8, 15, 16, 23, 42],
//     data_y = [... new Array(6)].map(()=>Math.random());
//
// // for scaling in the x-direction
// const x = d3.scaleLinear()
//     .domain([0, d3.max(data_x)])
//     .range([0, 400]);
// // for scaling in the y-direction
// const y = d3.scaleLinear()
//     .domain([0, d3.max(data_y)])
//     .range([0, 400]);
//
// // redefine data in scaled context
// const line = d3.line()
//     .x(function(d) {return x(d);})
//     .y(function(d) {return y(d);});
//
// const svg = d3.select('.chart')
//     .selectAll('div')
//     .append('canvas')
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom)
//     .append('g')
//     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
//
// svg.append("path")
//     .data([data_x])
//     .attr("class", "line")
//     .attr("d", line);
//
// // Add the X Axis
// svg.append("g")
//     .attr("transform", "translate(0," + height + ")")
//     .call(d3.axisBottom(x));
//
// // Add the Y Axis
// svg.append("g")
//     .call(d3.axisLeft(y));

// d3.select(".chart")
//     .selectAll("div")
//     .data(data_x)
//     .enter().append("div")
//     .style("width", function(d) { return x(d) + "px"; })
//     .style('background-color', greyColor)
//     .text(function(d) { return d; })
//     .selectAll('.chart text')
//     .style('fill', 'white');

// module.exports = {
//     plot_vars: function(new_data) {
function plot_vars(new_data) {
        var data = [{'date': 500, 'close': 98}, {'date': 400, 'close': 99},
            {'date': 300, 'close': 97}, {'date': 200, 'close': 96}]

        var svg = d3.select("#d3"),
            margin = {top: 20, right: 20, bottom: 30, left: 50},
            width = +svg.attr("width") - margin.left - margin.right,
            height = +svg.attr("height") - margin.top - margin.bottom,
            g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var x = d3.scaleLinear()
            .rangeRound([0, width]);

        var y = d3.scaleLinear()
            .rangeRound([height, 0]);

        var line = d3.line()
            .x(function(d) { return x(d.date); })
            .y(function(d) { return y(d.close); });

        x.domain(d3.extent(data, function(d) { return d.date; }));
        y.domain(d3.extent(data, function(d) { return d.close; }));

        g.append("g")
            .attr("transform", "translate(0," + height + ")")
            .attr('class', 'axisBlack')
            .call(d3.axisBottom(x))
            .append("text")
            .attr("fill", "white")
            .attr("x", 6)
            .attr("dy", "3em")
            .attr('dx', '32em')
            .attr("text-anchor", "end")
            .text("Time");

        g.append("g")
            .attr('class', 'axisBlack')
            .call(d3.axisLeft(y))
            .append("text")
            .attr("fill", "white")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "0.71em")
            .attr("text-anchor", "end")
            .text("Price ($)");

        g.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke-width", 1.5)
            .attr("d", line);
    // }
}
