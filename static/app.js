function unpack(rows, index) {
    return rows.map(function (row) {
        return row[index];
    });
}

// Retrieve data from local JSON file and build charts
function charts() {
    d3.json("data/samples.json").then((data) => {
        console.log(data);

        let otu_ids = unpack(data.samples, 'otu_ids');
        console.log(otu_ids);

        let otu_labels = unpack(data.samples, 'otu_labels');
        console.log(otu_labels);

        let sample_values = unpack(data.samples, 'sample_values');
        console.log(sample_values);

        // Bar chart - horizontal ***********************************
        let bar = [
            {
                y: otu_ids.slice(0, 10).map(otuIDs => `OTU ${otuIDs}`).reverse(),
                x: sample_values.slice(0, 10).reverse(),
                text: otu_labels.slice(0, 10).reverse(),
                type: "bar",
                orientation: "h"

            }
        ];

        let barLayout = {
            title: "Top 10 Bellybutton Bacteria Cultures",
            margin: { t: 50, r: 100 }
        };

        Plotly.newPlot("bar", bar, barLayout);

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
            margin: { t: 0 },
            xaxis: { title: "OTU ID" },
            hovermode: "closest",
        };

        Plotly.newPlot("bubble", bubble, bubbleLayout);

    })
};

function dropDown() {
    // Grab a reference to the dropdown select element
    let selector = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    d3.json("samples.json").then((data) => {
        let names = data.names;
        names.forEach((name) => {
            selector
                .append("option")
                .text(name)
                .property("value", name);
        });

        // Use the first name from the list to build the initial plots
        const initial = names[0];
        charts(initial);
        // buildMetadata(initial);
    });
}

function optionChanged(newName) {
    // Return new selection data
    charts(newName);
    // buildMetadata(newName);
}


// Initialize the dashboard
dropDown();

