import asyncio
import json
import os
from http.server import BaseHTTPRequestHandler, HTTPServer
from typing import Any

DATASET_NAME = os.environ.get("COGNEE_LOCAL_DATASET", "audit_rescue_desk_policy_memory")
SESSION_ID = os.environ.get("COGNEE_SESSION_ID", "audit_rescue_desk_demo")
PORT = int(os.environ.get("COGNEE_SDK_PORT", "8787"))
ALLOWED_ORIGIN = os.environ.get("COGNEE_ALLOWED_ORIGIN", "http://localhost:5173")


def load_dotenv() -> None:
    env_path = os.path.join(os.getcwd(), ".env")
    if not os.path.exists(env_path):
        return

    with open(env_path, "r", encoding="utf-8") as handle:
        for raw_line in handle:
            line = raw_line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, value = line.split("=", 1)
            os.environ.setdefault(key.strip(), value.strip().strip("\"'"))


load_dotenv()


def get_cognee():
    import cognee  # type: ignore

    return cognee


def compact_payload(payload: Any) -> str:
    text = json.dumps(payload, ensure_ascii=True, default=str)
    return text[:6000]


async def sdk_status() -> dict[str, Any]:
    try:
        get_cognee()
        return {
            "configured": True,
            "connected": True,
            "mode": "local_sdk",
            "datasetName": DATASET_NAME,
            "baseUrl": "local Cognee SDK",
            "message": "Cognee SDK is installed. Local session memory is available.",
            "llmConfigured": bool(os.environ.get("LLM_API_KEY") or os.environ.get("OPENAI_API_KEY")),
        }
    except Exception as error:
        return {
            "configured": False,
            "connected": False,
            "mode": "local_sdk",
            "datasetName": DATASET_NAME,
            "baseUrl": "local Cognee SDK",
            "message": f"Cognee SDK is not available: {error}",
            "llmConfigured": bool(os.environ.get("LLM_API_KEY") or os.environ.get("OPENAI_API_KEY")),
        }


async def remember_session_entry(body: dict[str, Any]) -> dict[str, Any]:
    cognee = get_cognee()
    text = (
        "Audit Rescue Desk agent trace\n"
        f"Agent: {body.get('agent', 'Audit Rescue Desk')}\n"
        f"Note: {body.get('note', '')}\n"
        f"Payload: {compact_payload(body.get('payload', {}))}"
    )
    result = await cognee.remember(
        text,
        dataset_name=body.get("datasetName", DATASET_NAME),
        session_id=body.get("sessionId", SESSION_ID),
        self_improvement=False,
    )
    return {"ok": True, "operation": "remember_session", "result": str(result)}


async def remember_policy(body: dict[str, Any]) -> dict[str, Any]:
    cognee = get_cognee()
    policy_text = body.get("policyText", "")
    if not policy_text:
        raise ValueError("policyText is required")

    text = (
        "Audit Rescue Desk reusable policy memory\n"
        f"Policy note: {policy_text}\n"
        f"User risk ranking: {compact_payload(body.get('riskRanking', []))}\n"
        f"Final remediation plan: {compact_payload(body.get('remediationPlan', []))}"
    )

    if body.get("permanent") is True:
        result = await cognee.remember(
            text,
            dataset_name=body.get("datasetName", DATASET_NAME),
            self_improvement=body.get("selfImprovement", False),
        )
        return {"ok": True, "operation": "remember_permanent_policy", "result": str(result)}

    result = await cognee.remember(
        text,
        dataset_name=body.get("datasetName", DATASET_NAME),
        session_id=body.get("sessionId", SESSION_ID),
        self_improvement=False,
    )
    return {"ok": True, "operation": "remember_session_policy", "result": str(result)}


async def recall_memory(body: dict[str, Any]) -> dict[str, Any]:
    cognee = get_cognee()
    results = await cognee.recall(
        query_text=body.get("query") or "What policy memory should affect this audit review?",
        datasets=[body.get("datasetName", DATASET_NAME)],
    )
    return {"ok": True, "operation": "recall", "results": [str(result) for result in results]}


async def improve_memory(body: dict[str, Any]) -> dict[str, Any]:
    cognee = get_cognee()
    result = await cognee.improve(
        dataset_name=body.get("datasetName", DATASET_NAME),
        session_ids=[body.get("sessionId", SESSION_ID)],
    )
    return {"ok": True, "operation": "improve", "result": str(result)}


class Handler(BaseHTTPRequestHandler):
    def _send(self, status: int, payload: dict[str, Any]) -> None:
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", ALLOWED_ORIGIN)
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Access-Control-Allow-Methods", "GET,POST,OPTIONS")
        self.end_headers()
        self.wfile.write(json.dumps(payload).encode("utf-8"))

    def do_OPTIONS(self) -> None:
        self._send(200, {})

    def do_GET(self) -> None:
        if self.path == "/api/cognee/status":
            self._send(200, asyncio.run(sdk_status()))
            return
        self._send(404, {"message": "Route not found"})

    def do_POST(self) -> None:
        length = int(self.headers.get("Content-Length", "0"))
        body = json.loads(self.rfile.read(length).decode("utf-8") or "{}")
        try:
            if self.path == "/api/cognee/remember-entry":
                self._send(200, asyncio.run(remember_session_entry(body)))
                return
            if self.path == "/api/cognee/remember-policy":
                self._send(200, asyncio.run(remember_policy(body)))
                return
            if self.path == "/api/cognee/search":
                self._send(200, asyncio.run(recall_memory(body)))
                return
            if self.path == "/api/cognee/improve":
                self._send(200, asyncio.run(improve_memory(body)))
                return
            self._send(404, {"message": "Route not found"})
        except Exception as error:
            self._send(502, {"ok": False, "message": str(error)})


if __name__ == "__main__":
    print(f"Cognee SDK bridge listening on http://localhost:{PORT}")
    print(f"Dataset: {DATASET_NAME}")
    print("Mode: local Cognee SDK")
    HTTPServer(("localhost", PORT), Handler).serve_forever()
