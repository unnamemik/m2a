from sqlalchemy import Column, Integer, String, Table

from database import metadata

operation = Table(
    "operation",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("quantity", String),
    Column("figi", String),
    Column("instrument_type", String, nullable=True),
    Column("date", String, nullable=True),
    Column("type", String),
)
