// function to create chart
// function to create series
// function to update series
// options to select variables to plot
// trigger update on engine update and choose which series to create/render based on variables

class d3line{
    constructor(x, y, now, limit, duration){
        this.limit = limit;

        this.line = d3.line()
            .x(function(d, i) {
                return x(now - limit*duration + i*duration)
            })
            .y(function(d, i) {
                return y(d)
            })
            .curve(d3.curveNatural);
    }

    add_series(color){
        this.series = {
            value: 0,
            color: color,
            data: d3.range(this.limit).map(function(){return 0})
        };
    }

    append_to_svg(chart){
        this.series.path = chart.g
            .append('g')
                .attr('clip-path', 'url(#clip)')
            .append('path')
                .data([this.series.data])
            // .attr('class', 'target' + ' group')
                .style('stroke', this.series.color)
                .style('stroke-width', 5);
    }

    return_line(){
        return this
    }
}

class d3Chart{
    constructor(){
        this.limit = 60;
        this.duration = 500;

        this.margin = {top: 10, right: 0, bottom: 10, left: 0};
        this.width = 400 - this.margin.left - this.margin.right;
        this.height = 400 - this.margin.top - this.margin.bottom;
        this.padding = 25;
    }

    create_chart(svgElement){
        let now = new Date(Date.now() - this.duration);

        let limit = this.limit,
            duration = this.duration;

        let x = d3.scaleTime()
            .domain([now - this.limit + 1, now - this.duration]) // why the 2?
            .range([0, this.width]);

        // range for velocities: 0-10
        // range for positions: 800, 600
        let y = d3.scaleLinear()
            .domain([-20, 20])
            .range([this.height, 0]);

        this.svg = d3.select(svgElement)
                .attr('class', 'chart')
                .attr('width', this.width)
                .attr('height', this.height);
        this.g = this.svg.append("g")
                .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

        // clip path
        this.g.append("defs").append("clipPath")
                .attr("id", "clip")
            .append("rect")
                .attr("width", this.width)
                .attr("height", this.height);

        this.axis_y = this.g.append('g')
            // .attr('class', 'x axis')
            .attr('transform', 'translate(' + this.padding + ',0)')
            .attr('class', 'axisBlack')
            .call(d3.axisLeft(y));

        this.axis = this.g.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(' + this.padding + ',' + y(0) + ')')
            .attr('class', 'axisBlack')
            .call(d3.axisBottom(x));

        this.x = x;
        this.y = y;
        this.now = now;

        return this;
    }

    add_line(color){
        const x = this.x;
        const y = this.y;

        let line = new d3line(x, y, this.now, this.limit, this.duration);
        line.add_series(color);
        line.append_to_svg(this);
        // line = line.return_line();

        return line;
    }

    add_legend(lines){
        let ordinal = d3.scaleOrdinal()
            .domain(['x-velocity', 'y-velocity'])
            .range(['steelblue', 'red']);

        this.svg.append("g")
            .attr("class", "legendOrdinal")
            .attr("transform", "translate(300,20)");

        let legendOrdinal = d3.legendColor()
            .shape("path", d3.symbol().type(d3.symbolCircle).size(100)())
            .shapePadding(5)
            .scale(ordinal);

        this.svg.select(".legendOrdinal")
            .call(legendOrdinal);
    }

    shift_axis(now){
        // Shift domain
        this.x.domain([now - (this.limit) * this.duration, now - this.duration]);
        // y.domain([-series.data.max(), series.data.max()]);

        // Slide x-axis left
        // this.axis.transition()
        //     .duration(this.duration)
        //     .ease(d3.easeLinear)
        //     .call(d3.axisBottom(this.x));

        // redraw y-axis
        // axis_y.call(d3.axisLeft(y));
    }

    plot_vs_t(new_data, line, now) {
        // console.log(new_data.x);
        // Add new values
        //group.data.push(group.value) // Real values arrive at irregular intervals
        line.series.data.push(new_data);
        line.series.path.attr('d', line.line);

        // console.log(line.line);
        // console.log(this.x);

        // Slide paths left
        // line.series.path
        //     .transition()
        //         .duration(this.duration)
        //         .ease(d3.easeLinear)
        //         .attr('transform', 'translate(' + this.x(now - (this.limit)*this.duration) + ')');

        // Remove oldest data point from each group
        line.series.data.shift();
        // }
    }

}

// let grChart = new d3Chart().create_chart();

class add_equation {
    constructor() {
        this.margin = {top: 10, right: 10, bottom: 10, left: 10};
        this.width = 400 - this.margin.left - this.margin.right;
        this.height = 400 - this.margin.top - this.margin.bottom;
        this.padding = 25;
    }

    create_chart(svgElement) {
        this.svg = d3.select(svgElement)
            .attr('width', this.width)
            .attr('height', this.height)
            // .append("g")
            .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
    }

    add_text(color){
        this.eqn = this.svg.append('foreignObject')
            .attr('width', 400).attr('height', 100)
            .attr("transform", "translate(" + 0 + "," + 300 + ")")
            .attr('fill', 'grey')
            .attr('opacity', 0.9);

        // this.button = this.svg.append('g')
            // .attr('width', 400).attr('height', 100)
            // .attr("transform", "translate(" + 0 + "," + 300 + ")");

        // MathJax.Hub.Config({tex2jax: {preview: "none"}});
        // MathJax.Hub.Queue(['Typeset', MathJax.Hub]);
    }

    change_equation(params){
        let str = '';
        params.forEach(function(d) {
            str += ' \\color{' + d.color + '}{\\textbf{' + d.cst + '}} \\ ';
        });
        console.log(str);
        str = '$$'+str+'$$';
        this.eqn.text(str);
    }

    add_bar(svgElement, data){
        let y = d3.scaleLinear()
            .domain([0, 10])
            .range([0, 300]);

        let width = 20,
            padding = 5,
            height = 300;

        let x = d3.scaleBand().rangeRound([0, 400]).paddingInner(0.1).paddingOuter(1);
        x.domain(data.map(function (d, i) {return i;}));

        // this.bar = this.svg.append('svg')
        //     .attr('width', 400).attr('height', 300);

        this.bar = d3.select(svgElement)
            .selectAll('rect')
            .data(data)
            .enter().append('rect')
            .attr("y", function(d) {return height - y(eval(d.value));})
            // .attr('x', function (d, i) {return i*(width + padding);})
            .attr('x', function (d, i) {return x(i)})
            .attr('fill', function (d) {return d.color;})
            .attr("height", function(d) {return y(eval(d.value));})
            .attr('width', x.bandwidth());

        this.svg.selectAll("text")
            .data(data)
            .enter()
            .append("text")
            .text(function(d) {
                return Number.parseFloat(eval(d.value)).toPrecision(3);
            })
            .attr("text-anchor", "middle")
            .attr('x', function (d, i) {return x(i) + x.bandwidth()/2})
            .attr("y", height - 10)
            .attr("fill", "white");

        this.y = y;
        this.x = x;
    }

    update_bar(data){
        let y = this.y,
            x = this.x,
            height = 300;

        this.bar.data(data);

        this.bar.transition()
            .duration(100)
            .attr("y", function(d) {return height - y(eval(d.value));})
            .attr("height", function(d) {return y(eval(d.value));})
            .text(function(d) {return eval(d.value)});

        this.svg.selectAll("text")
            .data(data)
            .transition()
            .duration(100)
            .text(function(d) {
                return Number.parseFloat(eval(d.value)).toPrecision(3);
            })
    }
}

function changeParams(){

}
