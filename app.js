function buildMetadata(sample) {
  console.log("buildMetadata");
  d3.json("http://127.0.0.1:5000/metadata/" + sample).then(function (metadiversity) {
    console.log(metadiversity);
    var panel = d3.select("#sample-metadata");
    panel.html("");

    for (let [key, value] of Object.entries(metadiversity)) {
      panel.append('text').text(key + ": " + value+"\n");

    }
  });

}
function buildCharts(sample) {
  console.log("buildCharts");
  // @TODO: Use `d3.json` to fetch the sample data for the plots
  function buildPlot() {
    d3.json("http://127.0.0.1:5000/samples/" + sample).then(function (diversity) {

      // Grab values from the data json object to build the plots
      console.log(diversity);
      var samples = diversity.sample_values.slice(0, 10);

      var otu_ids = diversity.otu_ids.slice(0, 10);
      var otu_labels = diversity.otu_labels.slice(0, 10);
      console.log(otu_labels);
      var trace = {
        labels: otu_ids,
        values: samples,
        type: 'pie'
      };
      var layout = {
        title: "Biodiversity Distribution",
        height: 400,
        width: 500
      };
      var data = [trace];
      Plotly.newPlot("pie", data, layout);
    });
  }
  function buildPlot2() {
    d3.json("http://127.0.0.1:5000/samples/" + sample).then(function (diversity) {

      console.log(diversity);
      var samples = diversity.sample_values.slice(0, 10);
      var otu_ids = diversity.otu_ids.slice(0, 10);
      var otu_labels = diversity.otu_labels.slice(0, 10);
      console.log(otu_labels);
      var desired_maximum_marker_size = 40;
      var size = [600, 800, 1000, 1400];
      var trace = {
        x: otu_ids,
        y: diversity.sample_values,
        text: otu_labels,
        mode: 'markers',
        marker: {
          size: samples,
          color: otu_ids,
         
        }
      };
      var data = [trace];
      var layout = {
        title: 'BioDiversity Type  &  Distribution',
        showlegend: true,
        height: 600,
        width: 600
      };
      Plotly.newPlot("bubble", data, layout);
    });
  }
  buildPlot();
  buildPlot2();
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  console.log(newSample);
  // Fetch new data each time a new sample is selected
  console.log("optionChanged");
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();