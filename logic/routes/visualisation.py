import pandas as pd
import numpy as np
from fastapi import APIRouter, UploadFile, File

visualization_router = APIRouter()


@visualization_router.post("/visualization")
async def visualization(file: UploadFile = File(...)):

    # Read CSV
    df = pd.read_csv(file.file)

    # -----------------------------------------
    # Numeric columns
    # -----------------------------------------

    numeric_columns = df.select_dtypes(
        include=np.number
    ).columns.tolist()

    # -----------------------------------------
    # Categorical columns
    # -----------------------------------------

    categorical_columns = df.select_dtypes(
        include=["object", "category", "bool"]
    ).columns.tolist()

    # -----------------------------------------
    # Numeric data
    # -----------------------------------------

    numeric_data = {}

    for column in numeric_columns:

        values = df[column].dropna().tolist()

        numeric_data[column] = [
            float(value) for value in values
        ]

    # -----------------------------------------
    # Categorical data
    # -----------------------------------------

    categorical_data = {}

    for column in categorical_columns:

        counts = (
            df[column]
            .value_counts()
            .head(10)
        )

        categorical_data[column] = {
            str(key): int(value)
            for key, value in counts.items()
        }

    # -----------------------------------------
    # Correlation
    # -----------------------------------------

    if len(numeric_columns) >= 2:

        correlation = (
            df[numeric_columns]
            .corr()
            .round(4)
            .to_dict()
        )

    else:

        correlation = {}

    # -----------------------------------------
    # Return visualization data
    # -----------------------------------------

    return {
        "filename": file.filename,

        "numeric_columns": numeric_columns,

        "categorical_columns": categorical_columns,

        "numeric_data": numeric_data,

        "categorical_data": categorical_data,

        "correlation": correlation
    }