<template>
  <svg width="1400" height="750"></svg>
</template>

<script>

const d3 = require('d3');
const topojson = require('topojson')

export default {
  mounted: function() {
    var v = this;
    var svg = d3.select(this.$el);
    var width = +svg.attr('width');
    var height = +svg.attr('height');

    var projection = d3.geoEquirectangular();
    var path = d3.geoPath().projection(projection);

    d3.json("static/data/world-50m.json", function(error, world) {
      var g = svg.append('g');
        g
          .selectAll('.state')
          .data(topojson.feature(world, world.objects.countries).features)
          .enter()
          .append("path")
          .attr("class", "state")
          .attr("d", path)
          .on('mouseover', function(d) {
            v.$emit('stateSelected', d.properties.STATE_ABBR)
      		})
          .on('mouseout', function(d) {
            v.$emit('stateDeselected', d.properties.STATE_ABBR)
          })
      g.attr('transform', 'scale(1.4)')

      // Testing stuff for route visualizations
      var route = svg.append("path")
               .datum({type: "LineString", coordinates: [[-40,15], [70, 35]]})
               .attr("class", "route")
               .attr("d", path);

      var route = svg.append("path")
               .datum({type: "LineString", coordinates: [[-40,15], [120, 40]]})
               .attr("class", "route")
               .attr("d", path);
    });

  }
  // TODO: fire events
}
</script>

<style>
.state {
  fill: #303030;
  stroke: #fff;
}
.state:hover {
  fill: dimgray;
}
.route { 
  fill-opacity: 0;
  stroke: #0066ff;
  stroke-width: 3;
}
</style>