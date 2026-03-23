from fastapi.testclient import TestClient

from src.main import app


client = TestClient(app)


def test_list_products_should_return_seeded_products():
    response = client.get("/products")

    assert response.status_code == 200
    data = response.json()

    assert isinstance(data, list)
    assert len(data) >= 6
    assert data[0]["name"] == "Camiseta Básica Preta"


def test_list_products_by_category_should_filter_results():
    response = client.get("/products?category=roupas")

    assert response.status_code == 200
    data = response.json()

    assert len(data) >= 1
    assert all(product["category"] == "roupas" for product in data)


def test_get_product_by_id_should_return_product():
    response = client.get("/products/1")

    assert response.status_code == 200
    data = response.json()

    assert data["id"] == 1
    assert data["name"] == "Camiseta Básica Preta"


def test_get_product_by_id_should_return_404_when_not_found():
    response = client.get("/products/9999")

    assert response.status_code == 404
    assert response.json() == {"detail": "Product not found"}