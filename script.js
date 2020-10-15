let data  = d3.csv('wealth-health-2014.csv', d3.autoType).then(data=>{


    const margin = ({top: 50, right: 20, bottom: 20, left: 40});
    const width = 800 - margin.left - margin.right;
    const height = 550 - margin.top - margin.bottom;
    let regions = data.map(d=>d.Region);
    let population = data.map(d=>d.Population);

    let colorPal = d3.scaleOrdinal(d3.schemeSet2)
        .domain(regions);
    

    var plot = d3.select('.chart').append('svg')
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    let popMax = d3.max(data, d => d.Population)

    const xScale = d3
        .scaleLinear()
        .domain([d3.min(data, d => d.Income)-3000, 140000])
        .range([0,width]);

    const yScale = d3
        .scaleLinear()
        .domain([d3.min(data, d => d.LifeExpectancy)-15 , d3.max(data, d => d.LifeExpectancy)])
        .range([height,0]);

    const rScale = d3.scaleSqrt()
        .domain(d3.extent(data,d=>d.Population))
        .range([2,18]);

    plot.selectAll("circle") // <-- No longer "rect"
        .data(data)
        .enter()
        .append("circle") 
        .attr('cx', d=>xScale(d.Income))
        .attr('cy', d=>yScale(d.LifeExpectancy))
        .attr('r',  d=>rScale(d.Population))
        .attr('stroke','#D7EAF4')
        .attr('fill', d => { return colorPal(d.Region); })
        .on("mouseenter", (event, d) => {
            let pos = d3.pointer(event, window)
    
            d3.select(".tooltip")
                .style('display','inline-block')
                .style('left',pos[0]+'px')
                .style('top',pos[1]+'px')
                .html("<h6>Country: " +d.Country + "</h6>" +" Region: " + d.Region + "<br> Population: " + d3.format(',d')(d.Population) + "<br> Income: $" + d3.format(',d')(d.Income) + "<br> Life Expectancy: " + d.LifeExpectancy + " years");
    
        })

        .on("mouseleave", (event, d) => {
            d3.select('.tooltip')
                .style('display', 'none');
        });

    const xAxis = d3.axisBottom()
        .scale(xScale)
        .ticks(10, "$s");  

    
    const yAxis = d3.axisLeft()
        .scale(yScale)
        

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
        .attr("fill", "#F2F2F2")
        // add attrs such as alignment-baseline and text-anchor as necessary
        .text("Income");

    plot.append("text")
        .attr('x', 10)
        .attr('y', 10)
        .attr("font-family", "sans-serif")
        .attr("font-size", "15px")
        .attr("fill", "#F2F2F2")
        // add attrs such as alignment-baseline and text-anchor as necessary
        .text("Life Expectancy");

    let legend = group.selectAll('rect')
        .data(colorPal.domain())
        .enter()
        .append('rect')
        .attr('class','box')
        .attr('width', 20)
        .attr('height', 20)
        .attr('x',width -100)
        .attr('y',(d,i)=>height-i*15)
        .attr('fill', d=>colorPal(d));
    

});

