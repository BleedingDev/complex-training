"""Tests for the status filter on GET /api/sites."""

from fastapi.testclient import TestClient

from api.main import app

client = TestClient(app)


def test_list_sites_filter_active():
    res = client.get("/api/sites?status=active")
    assert res.status_code == 200
    data = res.json()
    assert isinstance(data, list)
    assert len(data) >= 1
    for site in data:
        assert site["status"] == "active"


def test_list_sites_filter_maintenance():
    res = client.get("/api/sites?status=maintenance")
    assert res.status_code == 200
    data = res.json()
    assert isinstance(data, list)
    for site in data:
        assert site["status"] == "maintenance"


def test_list_sites_filter_offline():
    res = client.get("/api/sites?status=offline")
    assert res.status_code == 200
    data = res.json()
    assert isinstance(data, list)
    for site in data:
        assert site["status"] == "offline"


def test_list_sites_invalid_status():
    res = client.get("/api/sites?status=foo")
    assert res.status_code == 422
    body = res.json()
    assert "detail" in body
