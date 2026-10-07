const fileInput = document.getElementById("csvFile");
const uploadBtn = document.getElementById("uploadBtn");
const status = document.getElementById("status");
const analysisResult = document.getElementById("analysisResult");


uploadBtn.addEventListener("click", async () => {

    const file = fileInput.files[0];

    // Check file
    if (!file) {
        status.textContent = "Please select a CSV file.";
        return;
    }

    // Create FormData
    const formData = new FormData();
    formData.append("file", file);

    status.textContent = "Uploading and analyzing...";

    try {

        // Send CSV to FastAPI
        const response = await fetch(
            "http://127.0.0.1:8000/upload",
            {
                method: "POST",
                body: formData
            }
        );

        const data = await response.json();

        // Check backend response
        if (!response.ok) {
            throw new Error(
                data.detail || "Upload failed"
            );
        }

        const analysis = data.analysis;

        // Clear old result
        analysisResult.innerHTML = "";


        // ==========================================
        // FILE NAME
        // ==========================================

        let html = `
            <h2>${data.filename}</h2>
        `;


        // ==========================================
        // DATASET OVERVIEW
        // ==========================================

        html += `
            <h3>Dataset Overview</h3>

            <p>
                <strong>Rows:</strong>
                ${analysis.rows}
            </p>

            <p>
                <strong>Columns:</strong>
                ${analysis.columns}
            </p>

            <p>
                <strong>Duplicate Rows:</strong>
                ${analysis.duplicates}
            </p>
        `;


        // ==========================================
        // COLUMNS
        // ==========================================

        html += `
            <h3>Columns</h3>

            <ul>
        `;

        analysis.column_names.forEach(column => {

            html += `
                <li>${column}</li>
            `;

        });

        html += `
            </ul>
        `;


        // ==========================================
        // DATA TYPES
        // ==========================================

        html += `
            <h3>Data Types</h3>

            <table>

                <thead>
                    <tr>
                        <th>Column</th>
                        <th>Data Type</th>
                    </tr>
                </thead>

                <tbody>
        `;

        Object.entries(analysis.dtypes).forEach(
            ([column, dtype]) => {

                html += `
                    <tr>
                        <td>${column}</td>
                        <td>${dtype}</td>
                    </tr>
                `;

            }
        );

        html += `
                </tbody>

            </table>
        `;


        // ==========================================
        // MISSING VALUES
        // ==========================================

        html += `
            <h3>Missing Values</h3>

            <table>

                <thead>
                    <tr>
                        <th>Column</th>
                        <th>Missing Values</th>
                    </tr>
                </thead>

                <tbody>
        `;

        Object.entries(analysis.missing).forEach(
            ([column, count]) => {

                html += `
                    <tr>
                        <td>${column}</td>
                        <td>${count}</td>
                    </tr>
                `;

            }
        );

        html += `
                </tbody>

            </table>
        `;


        // ==========================================
        // NUMERIC COLUMNS
        // ==========================================

        html += `
            <h3>Numeric Columns</h3>

            <p>
                ${
                    analysis.numeric_columns.length > 0
                    ? analysis.numeric_columns.join(", ")
                    : "None"
                }
            </p>
        `;


        // ==========================================
        // CATEGORICAL COLUMNS
        // ==========================================

        html += `
            <h3>Categorical Columns</h3>

            <p>
                ${
                    analysis.categorical_columns.length > 0
                    ? analysis.categorical_columns.join(", ")
                    : "None"
                }
            </p>
        `;


        // ==========================================
        // UNIQUE VALUES
        // ==========================================

        html += `
            <h3>Unique Values</h3>

            <table>

                <thead>
                    <tr>
                        <th>Column</th>
                        <th>Unique Values</th>
                    </tr>
                </thead>

                <tbody>
        `;

        Object.entries(analysis.unique_values).forEach(
            ([column, count]) => {

                html += `
                    <tr>
                        <td>${column}</td>
                        <td>${count}</td>
                    </tr>
                `;

            }
        );

        html += `
                </tbody>

            </table>
        `;


        // ==========================================
        // DESCRIPTIVE STATISTICS
        // ==========================================

        html += `
            <h3>Descriptive Statistics</h3>

            <table>

                <thead>
                    <tr>
                        <th>Statistic</th>
        `;

        const columns = Object.keys(analysis.describe);

        columns.forEach(column => {

            html += `
                <th>${column}</th>
            `;

        });

        html += `
                    </tr>
                </thead>

                <tbody>
        `;

        if (columns.length > 0) {

            const statistics = Object.keys(
                analysis.describe[columns[0]]
            );

            statistics.forEach(statistic => {

                html += `
                    <tr>
                        <td>${statistic}</td>
                `;

                columns.forEach(column => {

                    let value =
                        analysis.describe[column][statistic];

                    if (typeof value === "number") {
                        value = value.toFixed(2);
                    }

                    html += `
                        <td>${value}</td>
                    `;

                });

                html += `
                    </tr>
                `;

            });
        }

        html += `
                </tbody>

            </table>
        `;


        // ==========================================
        // OUTLIERS
        // ==========================================

        html += `
            <h3>Outliers</h3>

            <table>

                <thead>
                    <tr>
                        <th>Column</th>
                        <th>Outlier Count</th>
                    </tr>
                </thead>

                <tbody>
        `;

        Object.entries(analysis.outliers).forEach(
            ([column, count]) => {

                html += `
                    <tr>
                        <td>${column}</td>
                        <td>${count}</td>
                    </tr>
                `;

            }
        );

        html += `
                </tbody>

            </table>
        `;


        // ==========================================
        // CORRELATION
        // ==========================================

        html += `
            <h3>Correlation</h3>
        `;

        const correlationColumns =
            Object.keys(analysis.correlation);

        if (correlationColumns.length === 0) {

            html += `
                <p>
                    Not enough numeric columns for correlation.
                </p>
            `;

        } else {

            html += `
                <table>

                    <thead>
                        <tr>
                            <th>Column</th>
            `;

            correlationColumns.forEach(column => {

                html += `
                    <th>${column}</th>
                `;

            });

            html += `
                        </tr>
                    </thead>

                    <tbody>
            `;

            correlationColumns.forEach(row => {

                html += `
                    <tr>
                        <td>${row}</td>
                `;

                correlationColumns.forEach(column => {

                    let value =
                        analysis.correlation[row][column];

                    if (typeof value === "number") {
                        value = value.toFixed(2);
                    }

                    html += `
                        <td>${value}</td>
                    `;

                });

                html += `
                    </tr>
                `;

            });

            html += `
                    </tbody>

                </table>
            `;
        }


        // ==========================================
        // DISPLAY RESULT
        // ==========================================

        analysisResult.innerHTML = html;

        status.textContent =
            "CSV uploaded and analyzed successfully!";


    } catch (error) {

        console.error(error);

        status.textContent =
            "Error uploading or analyzing CSV.";

        analysisResult.innerHTML = `
            <p>
                Error: ${error.message}
            </p>
        `;
    }

});