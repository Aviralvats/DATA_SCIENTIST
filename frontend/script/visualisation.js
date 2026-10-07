
const visualizationSection =
    document.getElementById("visualizationSection");


// Create visualizations when Upload button is clicked
uploadBtn.addEventListener("click", async () => {

    const file = fileInput.files[0];

    if (!file) {
        return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {

        const response = await fetch(
            "http://127.0.0.1:8000/visualization",
            {
                method: "POST",
                body: formData
            }
        );

        if (!response.ok) {
            throw new Error("Visualization failed");
        }

        const data = await response.json();


        // Show visualization section
        visualizationSection.style.display = "block";


        // Clear previous visualizations
        visualizationSection.innerHTML = `
            <h2>Visualizations</h2>

            <div class="chart-grid"></div>
        `;


        const chartGrid =
            visualizationSection.querySelector(".chart-grid");


        /*
        ========================================
        NUMERIC DATA
        ========================================
        */

        const numericColumns =
            data.numeric_columns || [];


        numericColumns.forEach((column, index) => {

            const values =
                data.numeric_data[column];


            // Create chart card
            const chartCard =
                document.createElement("div");

            chartCard.className = "chart-card";

            const chartId =
                `numericChart${index}`;

            chartCard.id = chartId;

            chartGrid.appendChild(chartCard);


            const trace = {
                x: values,
                type: "histogram"
            };


            const layout = {

                title: `Distribution of ${column}`,

                xaxis: {
                    title: column
                },

                yaxis: {
                    title: "Frequency"
                },

                margin: {
                    t: 50,
                    r: 20,
                    b: 50,
                    l: 55
                }
            };


            Plotly.newPlot(
                chartId,
                [trace],
                layout,
                {
                    responsive: true,
                    displayModeBar: false
                }
            );

        });


        /*
        ========================================
        CATEGORICAL DATA
        ========================================
        */

        const categoricalColumns =
            data.categorical_columns || [];


        categoricalColumns.forEach((column, index) => {

            const categoryData =
                data.categorical_data[column];


            const categories =
                Object.keys(categoryData);

            const counts =
                Object.values(categoryData);


            const chartCard =
                document.createElement("div");

            chartCard.className = "chart-card";


            const chartId =
                `categoricalChart${index}`;

            chartCard.id = chartId;


            chartGrid.appendChild(chartCard);


            const trace = {

                x: categories,

                y: counts,

                type: "bar"

            };


            const layout = {

                title: `Distribution of ${column}`,

                xaxis: {
                    title: column
                },

                yaxis: {
                    title: "Count"
                },

                margin: {
                    t: 50,
                    r: 20,
                    b: 70,
                    l: 55
                }
            };


            Plotly.newPlot(
                chartId,
                [trace],
                layout,
                {
                    responsive: true,
                    displayModeBar: false
                }
            );

        });


        /*
        ========================================
        CORRELATION HEATMAP
        ========================================
        */

        const correlation =
            data.correlation || {};


        const correlationColumns =
            Object.keys(correlation);


        if (correlationColumns.length >= 2) {

            const z =
                correlationColumns.map(row => {

                    return correlationColumns.map(
                        column =>
                            correlation[row][column]
                    );

                });


            const chartCard =
                document.createElement("div");

            chartCard.className =
                "chart-card chart-wide";


            const chartId =
                "correlationChart";

            chartCard.id = chartId;


            chartGrid.appendChild(chartCard);


            const trace = {

                x: correlationColumns,

                y: correlationColumns,

                z: z,

                type: "heatmap",

                text: z,

                texttemplate: "%{text:.2f}",

                hoverongaps: false

            };


            const layout = {

                title: "Correlation Heatmap",

                xaxis: {
                    title: "Columns"
                },

                yaxis: {
                    title: "Columns"
                },

                margin: {
                    t: 60,
                    r: 20,
                    b: 70,
                    l: 70
                }
            };


            Plotly.newPlot(
                chartId,
                [trace],
                layout,
                {
                    responsive: true,
                    displayModeBar: false
                }
            );

        }


        /*
        ========================================
        NO VISUALIZATIONS
        ========================================
        */

        if (chartGrid.children.length === 0) {

            chartGrid.innerHTML = `
                <p>
                    No suitable visualizations found
                    for this dataset.
                </p>
            `;

        }


    } catch (error) {

        console.error(error);

        visualizationSection.style.display = "block";

        visualizationSection.innerHTML = `
            <h2>Visualizations</h2>

            <p>
                Error creating visualizations.
            </p>
        `;

    }

});