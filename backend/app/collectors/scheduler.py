import logging
import traceback
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.database.connection import SessionLocal
from app.collectors.nsp import NSPCollector
from app.collectors.aicte import AICTECollector
from app.collectors.ugc import UGCCollector
from app.collectors.state_portals import StatePortalsCollector
from app.collectors.universities import UniversityCollector
from app.collectors.foundations import FoundationsCollector
from app.collectors.csr import CSRCollector
from app.collectors.processor import process_and_upsert_scholarships

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("meritmind.scheduler")

COLLECTORS = [
    NSPCollector(),
    AICTECollector(),
    UGCCollector(),
    StatePortalsCollector(),
    UniversityCollector(),
    FoundationsCollector(),
    CSRCollector()
]

def run_all_collectors() -> Dict[str, Any]:
    """
    Executes all independent official collectors with complete fault-tolerance.
    If one collector fails, errors are logged and remaining collectors continue.
    Returns detailed summary metrics and execution status per source.
    """
    logger.info("Starting MeritMind Automatic Scholarship Collection Engine...")
    all_records: List[Dict[str, Any]] = []
    collector_status = []

    for collector in COLLECTORS:
        source = collector.source_name
        try:
            logger.info(f"Running collector: {source}")
            records = collector.collect()
            all_records.extend(records)
            collector_status.append({
                "source": source,
                "status": "Success",
                "count": len(records),
                "error": None
            })
            logger.info(f"Successfully collected {len(records)} records from {source}")
        except Exception as e:
            err_msg = f"{str(e)}\n{traceback.format_exc()}"
            logger.error(f"Error executing collector {source}: {err_msg}")
            collector_status.append({
                "source": source,
                "status": "Failed",
                "count": 0,
                "error": str(e)
            })

    # Process and upsert collected records into MySQL database
    db: Session = SessionLocal()
    try:
        results = process_and_upsert_scholarships(db, all_records)
    finally:
        db.close()

    summary = {
        "status": "Completed",
        "collected_records": len(all_records),
        "db_results": results,
        "sources": collector_status
    }
    logger.info(f"Collection Run Completed Summary: {summary}")
    return summary
