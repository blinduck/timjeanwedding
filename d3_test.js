const h = 500;
const w = 500;

var data = [30, 45, 100, 200, 800 , 40]
var svg = d3.select('svg')

function renderChart() {

  let bars_required = data.length;
  let bar_width = ~~(w/bars_required);
  let max_val = Math.max(...data);



  function add_rect(x,y,w,h) {
    svg.append('rect').attr('x', 10).attr('y', 10)
  }
    
  var scaled_heights = data.map(d => { return (d/max_val) * h; })
  console.log('scaled heights', scaled_heights);
  svg.selectAll('rect').data(data).enter()
      .append('rect')
      .attr('x', (d,i) =>  i*bar_width)
      .attr('y', d =>  h - 30)
      .attr('width', bar_width - 10)
      .attr('height', d => d)
      .attr('fill', 'blue')

  svg.selectAll('text').data(data).enter()
      .append('text')
      .attr('x', (d,i) =>  i*bar_width + (bar_width/2))
      .attr('y', d => h - 10)
      .attr('text-anchor', 'middle')
      .text(d => d)
}
renderChart()


svg.append('text').attr('x', 100).attr('y', 100).text("Test");



svg.append('rect').attrs({x: 10, y: 10, width: 10, height: -20, fill: 'black'})


//  svgDoc.append("circle")
//  svg.append()

