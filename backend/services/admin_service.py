from datetime import datetime, timedelta
import random

# Seed data for fallback (Mandatory 5-Seed Rule)
SEED_FARMERS = [
    {
        "id": "f_1001", "name": "Ramesh Kumar", "email_or_phone": "+91 9876543210", 
        "selected_language": "hi", "total_scans": 12, "last_scan_date": (datetime.utcnow() - timedelta(days=1)).isoformat(),
        "location": "Nashik, Maharashtra", "registered_at": (datetime.utcnow() - timedelta(days=40)).isoformat(), "status": "Active"
    },
    {
        "id": "f_1002", "name": "Sunil Patil", "email_or_phone": "sunil.p@email.com", 
        "selected_language": "mr", "total_scans": 5, "last_scan_date": (datetime.utcnow() - timedelta(days=3)).isoformat(),
        "location": "Pune, Maharashtra", "registered_at": (datetime.utcnow() - timedelta(days=15)).isoformat(), "status": "Active"
    },
    {
        "id": "f_1003", "name": "Vijay Singh", "email_or_phone": "+91 9123456780", 
        "selected_language": "hi", "total_scans": 28, "last_scan_date": (datetime.utcnow() - timedelta(hours=5)).isoformat(),
        "location": "Ludhiana, Punjab", "registered_at": (datetime.utcnow() - timedelta(days=120)).isoformat(), "status": "Active"
    },
    {
        "id": "f_1004", "name": "Prakash Rao", "email_or_phone": "prakash.agri@email.com", 
        "selected_language": "en", "total_scans": 2, "last_scan_date": (datetime.utcnow() - timedelta(days=10)).isoformat(),
        "location": "Hyderabad, Telangana", "registered_at": (datetime.utcnow() - timedelta(days=11)).isoformat(), "status": "Inactive"
    },
    {
        "id": "f_1005", "name": "Arvind Desai", "email_or_phone": "+91 9988776655", 
        "selected_language": "mr", "total_scans": 8, "last_scan_date": (datetime.utcnow() - timedelta(days=2)).isoformat(),
        "location": "Solapur, Maharashtra", "registered_at": (datetime.utcnow() - timedelta(days=60)).isoformat(), "status": "Active"
    }
]

SEED_DISEASE_LOGS = [
    {"crop": "Wheat", "pathogen": "Brown Rust", "confidence": 92.4, "severity": "High", "timestamp": (datetime.utcnow() - timedelta(hours=2)).isoformat(), "farmer_id": "f_1003"},
    {"crop": "Cotton", "pathogen": "Aphids", "confidence": 88.1, "severity": "Medium", "timestamp": (datetime.utcnow() - timedelta(hours=14)).isoformat(), "farmer_id": "f_1001"},
    {"crop": "Tomato", "pathogen": "Early Blight", "confidence": 95.7, "severity": "Critical", "timestamp": (datetime.utcnow() - timedelta(days=1)).isoformat(), "farmer_id": "f_1005"},
    {"crop": "Sugarcane", "pathogen": "Red Rot", "confidence": 81.0, "severity": "Medium", "timestamp": (datetime.utcnow() - timedelta(days=2)).isoformat(), "farmer_id": "f_1002"},
    {"crop": "Wheat", "pathogen": "Powdery Mildew", "confidence": 78.5, "severity": "Low", "timestamp": (datetime.utcnow() - timedelta(days=3)).isoformat(), "farmer_id": "f_1004"}
]

SEED_AI_TELEMETRY = [
    {"query_intent": "Fertilizer Advice", "language": "hi", "timestamp": (datetime.utcnow() - timedelta(minutes=15)).isoformat(), "resolved": True},
    {"query_intent": "Govt Subsidy (PM-Kisan)", "language": "mr", "timestamp": (datetime.utcnow() - timedelta(minutes=45)).isoformat(), "resolved": True},
    {"query_intent": "Weather Forecast", "language": "hi", "timestamp": (datetime.utcnow() - timedelta(hours=2)).isoformat(), "resolved": True},
    {"query_intent": "Pest Control (Whitefly)", "language": "en", "timestamp": (datetime.utcnow() - timedelta(hours=3)).isoformat(), "resolved": False},
    {"query_intent": "Crop Selection (Rabi)", "language": "mr", "timestamp": (datetime.utcnow() - timedelta(hours=5)).isoformat(), "resolved": True}
]

class AdminService:
    def __init__(self, db):
        self.db = db

    async def get_overview_metrics(self):
        # Count actual farmers from DB
        total_farmers = await self.db.users.count_documents({"role": "FARMER"})
        
        # If DB is empty, use seed metrics
        if total_farmers == 0:
            return {
                "total_farmers": 124,
                "monthly_growth": "+12.4%",
                "total_scans": 845,
                "active_alerts": 18,
                "top_crop": "Wheat"
            }
        
        # If DB has data, compute actuals (with mock computations for missing tables)
        # Assuming we don't have a 'scans' collection yet, we fallback to intelligent mock numbers tied to farmer count
        return {
            "total_farmers": total_farmers,
            "monthly_growth": "+4.2%",
            "total_scans": total_farmers * 3 + 12, # mock scalar
            "active_alerts": max(1, total_farmers // 10),
            "top_crop": "Wheat"
        }

    async def get_farmers_directory(self, language_filter=None):
        query = {"role": "FARMER"}
        if language_filter and language_filter != "all":
            query["selected_language"] = language_filter
            
        cursor = self.db.users.find(query).sort("createdAt", -1)
        farmers = await cursor.to_list(length=100)
        
        if not farmers:
            # 5-Seed Rule Fallback
            if language_filter and language_filter != "all":
                return [f for f in SEED_FARMERS if f["selected_language"] == language_filter]
            return SEED_FARMERS
            
        result = []
        for f in farmers:
            # Safely extract robust details
            created_at = f.get("createdAt", datetime.utcnow())
            last_login = f.get("lastLogin", created_at)
            
            result.append({
                "id": str(f.get("_id")),
                "name": f.get("name", "Unknown Farmer"),
                "email_or_phone": f.get("email") or f.get("phone") or "N/A",
                "selected_language": f.get("selected_language", "en"),
                "total_scans": f.get("total_scans", random.randint(0, 15)), # Mock until we have a scans table
                "last_scan_date": (last_login - timedelta(hours=random.randint(1, 48))).isoformat() if hasattr(last_login, "isoformat") else str(last_login),
                "location": f"{f.get('district', 'Unknown')}, {f.get('state', 'India')}" if f.get("district") else f.get("state", "India"),
                "registered_at": created_at.isoformat() if hasattr(created_at, "isoformat") else str(created_at),
                "status": "Active" if (datetime.utcnow() - (last_login if isinstance(last_login, datetime) else datetime.utcnow())).days < 30 else "Inactive"
            })
        return result

    async def get_disease_telemetry(self):
        # Placeholder for actual scan logs collection
        # Returning seed data immediately per 5-Seed Rule to ensure Recharts works
        return {
            "logs": SEED_DISEASE_LOGS,
            "crop_distribution": [
                {"name": "Wheat", "value": 45},
                {"name": "Cotton", "value": 25},
                {"name": "Tomato", "value": 15},
                {"name": "Sugarcane", "value": 10},
                {"name": "Other", "value": 5}
            ]
        }

    async def get_ai_assistant_telemetry(self):
        # Calculate real language breakdown from actual users
        total_farmers = await self.db.users.count_documents({"role": "FARMER"})
        
        if total_farmers == 0:
            return {
                "logs": SEED_AI_TELEMETRY,
                "language_distribution": [
                    {"name": "Hindi (hi)", "value": 55},
                    {"name": "Marathi (mr)", "value": 30},
                    {"name": "English (en)", "value": 15}
                ]
            }
            
        # Calculate real demographic spread
        hi_count = await self.db.users.count_documents({"role": "FARMER", "selected_language": "hi"})
        mr_count = await self.db.users.count_documents({"role": "FARMER", "selected_language": "mr"})
        en_count = total_farmers - (hi_count + mr_count)
        
        return {
            "logs": SEED_AI_TELEMETRY, # Feed mock for now
            "language_distribution": [
                {"name": "Hindi (hi)", "value": hi_count or 40},
                {"name": "Marathi (mr)", "value": mr_count or 40},
                {"name": "English (en)", "value": en_count or 20}
            ]
        }
