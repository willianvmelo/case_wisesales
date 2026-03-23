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

    assert response.status_code == 201
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


def test_apply_percentage_coupon_should_return_discounted_total():
    client.post("/cart/items", json={"product_id": 1, "quantity": 2})

    response = client.post(
        "/cart/coupon",
        json={"code": "DESCONTO10"},
    )

    assert response.status_code == 201
    data = response.json()

    assert data["coupon"]["code"] == "DESCONTO10"
    assert float(data["subtotal"]) == 99.8
    assert float(data["discount"]) == 9.98
    assert float(data["total"]) == 89.82


def test_apply_fixed_coupon_should_not_make_total_negative():
    client.post("/cart/items", json={"product_id": 5, "quantity": 1})

    response = client.post(
        "/cart/coupon",
        json={"code": "VALE15"},
    )

    assert response.status_code == 201
    data = response.json()

    assert data["coupon"]["code"] == "VALE15"
    assert float(data["subtotal"]) == 39.9
    assert float(data["discount"]) == 15.0
    assert float(data["total"]) == 24.9


def test_apply_expired_coupon_should_return_409():
    response = client.post(
        "/cart/coupon",
        json={"code": "EXPIRADO20"},
    )

    assert response.status_code == 409
    assert response.json() == {"detail": "Coupon is expired"}


def test_apply_invalid_coupon_should_return_404():
    response = client.post(
        "/cart/coupon",
        json={"code": "NAOEXISTE"},
    )

    assert response.status_code == 404
    assert response.json() == {"detail": "Coupon not found"}


def test_remove_coupon_should_clear_applied_coupon():
    client.post("/cart/items", json={"product_id": 1, "quantity": 1})
    client.post("/cart/coupon", json={"code": "DESCONTO10"})

    response = client.delete("/cart/coupon")

    assert response.status_code == 200
    data = response.json()

    assert data["coupon"] is None
    assert float(data["discount"]) == 0.0


def test_remove_coupon_should_return_404_when_none_is_applied():
    response = client.delete("/cart/coupon")

    assert response.status_code == 404
    assert response.json() == {"detail": "No coupon applied to cart"}