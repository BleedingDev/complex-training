"""Basic API contract tests using FastAPI TestClient."""

from datetime import date

from fastapi.testclient import TestClient

from api.main import app

client = TestClient(app)


def test_health():
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json() == {"status": "ok"}


def test_list_sites():
    res = client.get("/api/sites")
    assert res.status_code == 200
    data = res.json()
    assert isinstance(data, list)
    assert len(data) >= 1
    assert {"id", "name", "location", "capacity_kw", "status"}.issubset(data[0].keys())


def test_get_site_not_found():
    res = client.get("/api/sites/9999")
    assert res.status_code == 404


def test_create_site_and_retrieve():
    payload = {
        "name": "New Site",
        "location": "Test City",
        "capacity_kw": 1500,
        "status": "active",
    }
    created = client.post("/api/sites", json=payload)
    assert created.status_code == 201
    created_body = created.json()
    site_id = created_body["id"]

    fetched = client.get(f"/api/sites/{site_id}")
    assert fetched.status_code == 200
    assert fetched.json()["name"] == payload["name"]


def test_get_forecast():
    today = date.today().isoformat()
    res = client.get(f"/api/sites/1/forecast?for_date={today}")
    assert res.status_code == 200
    body = res.json()
    assert body["site_id"] == 1
    assert body["date"] == today
