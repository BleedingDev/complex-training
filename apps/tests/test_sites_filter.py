"""API tests for the /api/sites status filter."""

from fastapi.testclient import TestClient

from api.main import app
from api.models import SiteStatus

client = TestClient(app)


def test_list_sites_without_filter_returns_all():
    res = client.get("/api/sites")
    assert res.status_code == 200
    data = res.json()
    assert len(data) >= 3
    assert all("status" in s for s in data)


def test_list_sites_filters_active():
    res = client.get("/api/sites", params={"status": "active"})
    assert res.status_code == 200
    data = res.json()
    assert data
    assert all(item["status"] == SiteStatus.ACTIVE for item in data)


def test_list_sites_filters_maintenance():
    res = client.get("/api/sites", params={"status": "maintenance"})
    assert res.status_code == 200
    data = res.json()
    assert data
    assert all(item["status"] == SiteStatus.MAINTENANCE for item in data)


def test_list_sites_filters_offline_empty():
    res = client.get("/api/sites", params={"status": "offline"})
    assert res.status_code == 200
    data = res.json()
    assert data == []


def test_list_sites_rejects_invalid_status():
    res = client.get("/api/sites", params={"status": "foo"})
    assert res.status_code == 422
    body = res.json()
    assert "detail" in body
    assert any("status" in str(err).lower() for err in body["detail"])
