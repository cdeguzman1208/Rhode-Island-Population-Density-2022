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
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// define svg
var svg = d3.select("body")
.append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// helper function for reading in dataset
function rowConverter(data) {
    return {
        geoID : data.geoID,
        geoID2 : +data.geoID2,
        state : data.geoDisplayLabel,
        targetID : data.GCT_STUB_targetGeoID,
        targetID2 : +data.GCT_STUB_targetGeoID2,
        name : data.GCT_STUB_displayLabel,
        density : +data.densityPerSquareMileOfLandArea
    }
}

// read in dataset
d3.csv("rhodeisland.csv",rowConverter).then(function(data) {
    
    // check if actually reading dataset correctly
    dataset = data;
    console.table(dataset, ["geoID", "geoID2", "state", "targetID", "targetID2", "name", "density"]);
    
    
});