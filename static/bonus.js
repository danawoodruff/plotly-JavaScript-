
// Retrieve data from local JSON file and build charts
function charts(sample) {
    d3.json("data/samples.json").then((data) => {
        let samples = data.samples;
        let samplesarray = samples.filter(sampleobject =>
            sampleobject.id == sample);
        let sampleID = samplesarray[0]
        
        let otu_ids = sampleID.otu_ids;
        let otu_labels = sampleID.otu_labels;
        let sample_values = sampleID.sample_values;

        let metadata = data.metadata;
        let metadataarray = metadata.filter(metadataobject =>
            metadataobject.id == sample);
        let metadataID = metadataarray[0]
        
        let washFreq = metadataID.wfreq;


        // Bar chart - horizontal ***********************************
        let bar = [
            {
                y: otu_ids.slice(0, 10).map(IDs => `OTU ${IDs}`).reverse(),
                x: sample_values.slice(0, 10).reverse(),
                text: otu_labels.slice(0, 10).reverse(),
                type: "bar",
                colorscale: 'YlOrRd',
                orientation: "h",
                marker: {
                    color: otu_ids,
                    opacity: 0.6,
                    line: {
                        color: 'orange',
                        width: 1.5
                    }
                }
            }
        ];

        let barLayout = {
            title: "Top 10 Bacteria Cultures Found",
            width: 750,
            height: 500,
            margin: { t: 100, l: 70 },
            barmode: 'stack',
            xaxis: { 
                title: "Sample Value",
                showline: true,
                autotick: true,
                ticks: 'outside',
                tickwidth: 1,
            },
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)'
        };

        Plotly.newPlot("bar", bar, barLayout);
        
        // Gauge Chart ***************************************************
        
        let gauge = [
            {
                domain: { x: [0, 1], y: [0, 1] },
                value: washFreq,
                title: { 
                    text: "Wash Frequency" },
                gauge: {
                    bar: {
                        color: 'indianred'
                    },
                    bgcolor: 'oldlace'
                },
                type: "indicator",
                mode: "gauge+number"
            }
        ];

        let gaugeLayout = {
            width: 400,
            height: 300,
            margin: { t: 170, b: 0 },
            paper_bgcolor: 'rgba(0,0,0,0)'
        };

        Plotly.newPlot("gauge", gauge, gaugeLayout);

        // Bubble chart ***********************************************
        var bubble = [
            {
                x: otu_ids,
                y: sample_values,
                text: otu_labels,
                mode: "markers",
                marker: {
                    color: otu_ids,
                    size: sample_values,
                }
            }
        ];

        var bubbleLayout = {
            width: 1000,
            height: 600,
            margin: { t: 100, l: 100 },
            xaxis: { 
                title: "OTU ID",
            },
            yaxis: { title: "Sample Value" },
            hovermode: "closest",
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)',
            title: 'OTU IDs are represented by bubble color while the magnitude of sample values is represented by bubble size.'
        };

        Plotly.newPlot("bubble", bubble, bubbleLayout);

    });
}


// Dropdown function in response to user selection *********************

function dropDown() {
    // Grab a reference to the dropdown select element
    let selector = d3.select("#selDataset");

    // Use the list of sample names to populate the dropdown
    d3.json("data/samples.json").then((data) => {
        let names = data.names;
        names.forEach((sample) => {
            selector
                .append("option")
                .text(sample)
                .property("value", sample);
        });

        // Use the first ID from the list to build the initial plots
        const firstID = names[0];
        charts(firstID);
        demoBox(firstID)
    });
}

function optionChanged(newID) {
    // Return new data each time a new ID is selected
    charts(newID);
    demoBox(newID)
}

// Initialize the dropdown
dropDown();

// Demographics Box ***************************************************
function demoBox(sample) {
    d3.json("data/samples.json").then((data) => {
        let boxData = data.metadata;
        let samplesarray = boxData.filter(sampleobject =>
            sampleobject.id == sample);
        let sampleID = samplesarray[0]

        let panel = d3.select("#sample-metadata");
        panel.html("");
        Object.entries(sampleID).forEach(([key, value]) => {
            panel.append("h6").text(`${key}: ${value}`);
        });
    });
};


