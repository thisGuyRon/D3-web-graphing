//Initial variable setup
var svgWidth = 800;
var svgHeight = 800;
var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

//========================================================================

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
var svg = d3
  .select(".scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);
// Append an SVG group
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);
//=======================================================================

// Initial Params
//var chosenXAxis = "healthcare";
/*
// function used for updating x-scale var upon click on axis label
function xScale(demoData, chosenXAxis){
      // create scales
    var xLinearScale = d3.scaleLinear()
    .domain([d3.min(data, d=> d[chosenXAxis]) * .8, d3.max(data, d => d[chosenXAxis]) * 1.2
])
.range([0, width]);
return xLinearScale;
}

// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis){
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

    return xAxis;
}

function renderCircles(circlesGroup, newXScale, chosenXAxis){
    circlesGroup.transition()
    .duration(1000)
    .attr("cx", d=>newXScale(d[chosenXAxis]));
    return circlesGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup){

}
*/
// Retrieve data from the CSV file and execute everything below

console.log("checkpoint#2");
d3.csv("assets/data/data.csv")
    .then(function(demoData)
    {
        // parse data
        console.log(demoData);
        demoData.forEach(function(data){
        console.log("data");
        console.log(data);
        data.healthcare = +data.healthcare;
        data.age = +data.age;
        data.poverty = +data.poverty;
        data.smokes = +data.smokes;
    });

    // Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
        .domain(20, d3.max(demoData, d=> d.poverty))
        .range([0, width]);

    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(demoData, d=> d.healthcare)])
        .range([height, 0]);
    console.log("checkpoint linear scales");
    // Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append Axises to the chart
    // ==============================
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);
    console.log("axises");

    // Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
        .data(demoData)
        .enter()
        .append("circle")
        .attr("cx", d=>xLinearScale(d.poverty))
        .attr("cy", d=>yLinearScale(d.healthcare))
        .attr("r", "10")
        .attr("fill", "green");

    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(d){
            return(`${d.state}<br>Poverty(%): ${d.poverty}<br>without Healthcare(%): ${d.healthcare}`);
        });
    console.log("circles created");
    // Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    circlesGroup.on("mouseover", function(data){
        toolTip.show(data, this);
    })
        .on("mouseout", function(data, index){
            toolTip.hide(data);
        })
    // Create axes labels
    chartGroup.append("text")
        .attr("transform", "rotate(-90")
        .attr("y", 0 - margin.left+ 40)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Lacks Healthcare");

    chartGroup.append("text")
        .attr("transform", `translate(${width /2}, ${height + margin.top+30})`)
        .attr("class", "axisText")
        .text("In Poverty");
    console.log("tooltip created");
    });  

