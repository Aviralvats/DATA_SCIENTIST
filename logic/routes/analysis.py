import pandas as pd
import numpy as np


def analysis(df):

    rows, columns = df.shape

    # Data types
    dtypes = df.dtypes.astype(str).to_dict()

    # Missing values
    missing = df.isna().sum().astype(int).to_dict()

    # Duplicate rows
    duplicates = int(df.duplicated().sum())

    # Numeric columns
    numeric_columns = df.select_dtypes(
        include=np.number
    ).columns.tolist()

    # Categorical columns
    categorical_columns = df.select_dtypes(
        include=["object", "category", "bool"]
    ).columns.tolist()

    # Descriptive statistics
    describe = df.describe().to_dict()

    # Unique values
    unique_values = df.nunique().astype(int).to_dict()

    # Outliers
    outliers = {}

    for column in numeric_columns:

        Q1 = df[column].quantile(0.25)
        Q3 = df[column].quantile(0.75)

        IQR = Q3 - Q1

        lower = Q1 - 1.5 * IQR
        upper = Q3 + 1.5 * IQR

        count = (
            (df[column] < lower) |
            (df[column] > upper)
        ).sum()

        outliers[column] = int(count)

    # Correlation
    if len(numeric_columns) >= 2:
        correlation = (
            df[numeric_columns]
            .corr()
            .round(4)
            .to_dict()
        )
    else:
        correlation = {}

    return {
        "rows": int(rows),
        "columns": int(columns),

        "column_names": df.columns.tolist(),

        "dtypes": dtypes,

        "missing": missing,

        "duplicates": duplicates,

        "numeric_columns": numeric_columns,

        "categorical_columns": categorical_columns,

        "unique_values": unique_values,

        "describe": describe,

        "outliers": outliers,

        "correlation": correlation
    }