// Global scope variable to hold all data; broad scope important in order to fully capture test subject demo data + complete "samples" data object including nested test subject IDs and OTUs
let globalData = {};

// Step 1: Function to fetch and store all data
function fetchData() {
    d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then(data => {
        globalData = data;
        console.log("Sample Metadata Entry:", globalData.metadata[0]);  // Log a sample entry to check data (included due to early data pull issues resolved by fixing global data object - i.e. moving up to "samples" level in data sample)
        populateDropdown(globalData.metadata);
        if (globalData.metadata.length > 0) {
            optionChanged(globalData.metadata[0].id.toString());
        }
    }).catch(error => console.error('Error fetching data:', error)); // Display readable error message if data doesn't exist for test subject ID
}

// Step 2: Function to populate dropdown
function populateDropdown(metadata) {
    const dropdown = document.getElementById("selDataset");
    dropdown.innerHTML = ''; // Clear existing options
    metadata.forEach(d => {
        const option = document.createElement("option");
        option.value = d.id;
        option.text = `ID ${d.id}`;
        dropdown.appendChild(option);
    });
}

// Step 3: Function called when dropdown value changes - event trigger for repopulating demo card and charts with the appropriate test subject data
function optionChanged(selectedId) {
    updateDemographicInfo(selectedId);
    updateCharts(selectedId);
}

// Step 4: Function to update demographic information based on selected ID
function updateDemographicInfo(selectedId) {
    const selectedMetadata = globalData.metadata.find(d => d.id === parseInt(selectedId));
    if (selectedMetadata) {
        const infoHtml = `
            <strong>ID:</strong> ${selectedMetadata.id}<br>
            <strong>Ethnicity:</strong> ${selectedMetadata.ethnicity}<br>
            <strong>Gender:</strong> ${selectedMetadata.gender}<br>
            <strong>Age:</strong> ${selectedMetadata.age}<br>
            <strong>Location:</strong> ${selectedMetadata.location}<br>
            <strong>BBType:</strong> ${selectedMetadata.bbtype}<br>
            <strong>WFreq:</strong> ${selectedMetadata.wfreq}
        `;
        document.getElementById('sample-metadata').innerHTML = infoHtml;
    } else {
        document.getElementById('sample-metadata').innerHTML = 'No data available';
    }
}

// Step 5: Function to update both charts based on selected ID
function updateCharts(selectedId) {
    const selectedSample = globalData.samples.find(s => s.id === selectedId);
    if (selectedSample) {
        buildBubbleChart(selectedSample.otu_ids, selectedSample.sample_values, selectedSample.otu_labels);
        buildBarChart(selectedSample.otu_ids, selectedSample.sample_values);
    }
}

// Step 6: Define Bubble Chart Function
function buildBubbleChart(otu_ids, sample_values, otu_labels) {
    var trace1 = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: 'Earth'
      }
    };
  
    var data = [trace1];
    var layout = {
      title: 'Bacteria Cultures Per Sample',
      showlegend: false,
      height: 600,
      width: 1000
    };
  
    Plotly.newPlot('bubble', data, layout);
  }

// Step 6: Function to build a bar chart
function buildBarChart(otu_ids, sample_values) {
    var trace2 = {
      x: sample_values.slice(0, 10).reverse(),
      y: otu_ids.slice(0, 10).map(otu => `OTU ${otu}`).reverse(),
      type: 'bar',
      orientation: 'h'
    };
  
    var layout = {
      title: 'Top 10 Bacterial Cultures Found',
      margin: { t: 30, l: 150 }
    };
  
    Plotly.newPlot('bar', [trace2], layout);
  }

  // Step 7: Call to fetch data on page load
document.addEventListener('DOMContentLoaded', fetchData);
