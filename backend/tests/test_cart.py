from fastapi.testclient import TestClient

from src.main import app

client = TestClient(app)


def test_get_cart_should_return_cart_structure():
    response = client.get("/cart")

    assert response.status_code == 200
    data = response.json()

    assert "items" in data
    assert "subtotal" in data
    assert "discount" in data
    assert "total" in data
    assert "coupon" in data


def test_add_cart_item_should_add_new_item():
    response = client.post(
        "/cart/items",
        json={"product_id": 1, "quantity": 2},
    )

    assert response.status_code == 200
    data = response.json()

    assert len(data["items"]) >= 1
    assert any(item["product_id"] == 1 for item in data["items"])


def test_add_cart_item_should_not_allow_out_of_stock_product():
    response = client.post(
        "/cart/items",
        json={"product_id": 4, "quantity": 1},
    )

    assert response.status_code == 409
    assert response.json() == {"detail": "Product is out of stock"}


def test_add_cart_item_should_not_allow_quantity_above_stock():
    response = client.post(
        "/cart/items",
        json={"product_id": 6, "quantity": 2},
    )

    assert response.status_code == 409
    assert response.json() == {"detail": "Insufficient stock for requested quantity"}


def test_update_cart_item_should_update_quantity():
    create_response = client.post(
        "/cart/items",
        json={"product_id": 2, "quantity": 1},
    )
    item_id = next(item["id"] for item in create_response.json()["items"] if item["product_id"] == 2)

    response = client.patch(
        f"/cart/items/{item_id}",
        json={"quantity": 2},
    )

    assert response.status_code == 200
    data = response.json()

    updated_item = next(item for item in data["items"] if item["id"] == item_id)
    assert updated_item["quantity"] == 2


def test_delete_cart_item_should_remove_item():
    create_response = client.post(
        "/cart/items",
        json={"product_id": 5, "quantity": 1},
    )
    item_id = next(item["id"] for item in create_response.json()["items"] if item["product_id"] == 5)

    response = client.delete(f"/cart/items/{item_id}")

    assert response.status_code == 200
    data = response.json()

    assert all(item["id"] != item_id for item in data["items"])