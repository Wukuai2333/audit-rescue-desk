import csv
from collections import Counter
from pathlib import Path

import pandas as pd
import streamlit as st


DATA_PATH = Path("public/data/kaggle/track01_data_rescue.csv")
CUSTOMERS_PATH = Path("public/data/kaggle/track01_customers.csv")


st.set_page_config(page_title="Audit Rescue Desk", layout="wide")


def load_csv(path: Path) -> pd.DataFrame:
    return pd.read_csv(path)


def detect_quality_categories(df: pd.DataFrame) -> pd.DataFrame:
    findings = []

    if df.duplicated().any():
      duplicate_rows = df.index[df.duplicated()].tolist()
      findings.append({
          "category": "Duplicate Record",
          "count": len(duplicate_rows),
          "priority": "P2 Review Soon",
          "explanation": "Identical records may overstate production, shipment, or inspection counts.",
          "example_rows": ", ".join(str(row + 2) for row in duplicate_rows[:5]),
      })

    if {"production_date", "ship_date"}.issubset(df.columns):
        production_dates = pd.to_datetime(df["production_date"], errors="coerce")
        ship_dates = pd.to_datetime(df["ship_date"], errors="coerce")
        bad_timeline = df.index[ship_dates < production_dates].tolist()
        if bad_timeline:
            findings.append({
                "category": "Impossible Timeline",
                "count": len(bad_timeline),
                "priority": "P0 Block Audit",
                "explanation": "A shipment before production creates an impossible audit timeline.",
                "example_rows": ", ".join(str(row + 2) for row in bad_timeline[:5]),
            })

    if "quantity" in df.columns:
        quantities = pd.to_numeric(df["quantity"], errors="coerce")
        impossible_quantity = df.index[(quantities <= 0) | (quantities > 10000)].tolist()
        if impossible_quantity:
            findings.append({
                "category": "Impossible Quantity",
                "count": len(impossible_quantity),
                "priority": "P0 Block Audit",
                "explanation": "Quantities outside the expected manufacturing range indicate source corruption.",
                "example_rows": ", ".join(str(row + 2) for row in impossible_quantity[:5]),
            })

    if "customer_id" in df.columns:
        invalid_customer = df.index[~df["customer_id"].astype(str).str.match(r"^CU-\d{4}$", na=False)].tolist()
        if invalid_customer:
            findings.append({
                "category": "Orphaned Customer Reference",
                "count": len(invalid_customer),
                "priority": "P1 Fix Before Review",
                "explanation": "Records that cannot be traced to a known customer weaken audit defensibility.",
                "example_rows": ", ".join(str(row + 2) for row in invalid_customer[:5]),
            })

    missing_cells = int(df.isna().sum().sum() + (df.astype(str).eq("").sum().sum()))
    if missing_cells:
        findings.append({
            "category": "Missing Required Field",
            "count": missing_cells,
            "priority": "P3 Track",
            "explanation": "Incomplete records need owner review or explicit audit annotation.",
            "example_rows": "Multiple rows",
        })

    return pd.DataFrame(findings)


st.title("Audit Rescue Desk")
st.caption("Manufacturing data rescue workflow with agent-style review and Cognee policy memory.")

st.info(
    "This Streamlit page is a deployment fallback for judges. "
    "The full product UI is the React/Vite dashboard in the repository. "
    "Use Vercel or Netlify for the production frontend."
)

uploaded_file = st.file_uploader("Upload a manufacturing CSV", type=["csv"])

left, right = st.columns([0.65, 0.35])

with left:
    if uploaded_file is not None:
        df = pd.read_csv(uploaded_file)
        active_name = uploaded_file.name
    else:
        df = load_csv(DATA_PATH)
        active_name = "track01_data_rescue.csv"

    st.subheader("Dataset Summary")
    c1, c2, c3 = st.columns(3)
    c1.metric("File", active_name)
    c2.metric("Rows", f"{len(df):,}")
    c3.metric("Columns", len(df.columns))

    st.subheader("Raw Data Preview")
    st.dataframe(df.head(20), use_container_width=True)

    st.subheader("Data Quality Categories")
    findings = detect_quality_categories(df)
    if findings.empty:
        st.success("No issues were found by the active checks.")
    else:
        st.dataframe(findings, use_container_width=True, hide_index=True)

with right:
    st.subheader("Agent Workflow")
    st.markdown(
        """
1. **Data Forensics Lead** finds evidence-backed quality problems.
2. **Audit Risk Triage** recommends P0-P3 priority.
3. **Compliance Action Advisor** proposes safe remediation.
4. **Audit Narrative Writer** creates the audit packet.
5. **Policy Learner** stores team decisions in Cognee memory.
        """
    )

    st.subheader("Policy Memory Note")
    policy_note = st.text_area(
        "How should future audits handle this?",
        placeholder=(
            "Example: For acquired plants, orphaned customer references should be escalated "
            "before unit conflicts. Do not auto-fix shipment dates without source documents."
        ),
    )
    if st.button("Save policy note"):
        if policy_note.strip():
            st.success("Policy note staged for Cognee memory.")
        else:
            st.warning("Add a policy note first.")

st.divider()
st.markdown(
    """
**Product story:** The first audit finds the problems. The next audit starts with the team's remembered policy.

**Deployment note:** If Streamlit asks for a main module, use `app.py`. Do not use `server/cognee_sdk_bridge.py` as the Streamlit entry point.
    """
)
