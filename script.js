let data  = d3.csv('wealth-health-2014.csv', d3.autoType).then(data=>{


    const margin = ({top: 20, right: 20, bottom: 20, left: 40});
    const width = 700 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;
    let regions = data.map(d=>d.Region);

    let colorPal = d3.scaleOrdinal(d3.schemeSet2)
        .domain(regions);

    var plot = d3.select('.chart').append('svg')
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    let incomeMax = d3.max(data, d => d.Income)

    const xScale = d3
        .scaleLinear()
        .domain([d3.min(data, d => d.Income)-3000, 140000])
        .range([0,width]);

    const yScale = d3
        .scaleLinear()
        .domain([d3.min(data, d => d.LifeExpectancy)-15 , d3.max(data, d => d.LifeExpectancy)])
        .range([height,0]);

    plot.selectAll("circle") // <-- No longer "rect"
        .data(data)
        .enter()
        .append("circle") 
        .attr('cx', d=>xScale(d.Income))
        .attr('cy', d=>yScale(d.LifeExpectancy))
        .attr('r', 5)
        .attr('stroke','#D7EAF4')
        .attr('fill', d => { return colorPal(d.Region); })

    const xAxis = d3.axisBottom()
        .scale(xScale)
        .ticks(10, "$s");  

    
    const yAxis = d3.axisLeft()
        .scale(yScale);
        

    plot.append("g")
        .attr("class", "axis x-axis")
        .call(xAxis)
        .attr("transform", `translate(0, ${height})`);
    
    plot.append("g")
        .attr("class", "axis y-axis")
        .call(yAxis)
   
    plot.append("text")
        .attr('x', width-50)
        .attr('y', height-10)
        .attr("font-family", "sans-serif")
        .attr("font-size", "15px")
        .attr("fill", "black")
        // add attrs such as alignment-baseline and text-anchor as necessary
        .text("Income");

    plot.append("text")
        .attr('x', 10)
        .attr('y', 10)
        .attr("font-family", "sans-serif")
        .attr("font-size", "15px")
        .attr("fill", "black")
        // add attrs such as alignment-baseline and text-anchor as necessary
        .text("Life Expectancy");

});

