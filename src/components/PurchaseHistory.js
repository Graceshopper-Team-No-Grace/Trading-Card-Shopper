import { useState, useEffect } from "react";
import "../stylesheets/PurchaseHistory.css";

const BASE_URL = "http://localhost:4000/api";

const PurchaseHistory = () => {
  const [purchases, setPurchases] = useState([]);
  const [clicked, setClicked] = useState(false);

  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  const getPurchaseHistory = async () => {
    try {
      const response = await fetch(`${BASE_URL}/cart_products/closedcarts`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      setPurchases(result);
      console.log("PURCHASE HISTORY RESULT", result);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getPurchaseHistory();
  }, []);

  if (purchases.length) {
  return (
    <div id="purchase-history-table">
      <fieldset>
        <legend id="form-legend">
          <h2 id="profile-header">{username}'s Purchase History</h2>
        </legend>
        {purchases.map((purchase, i) => {
          console.log("PURCHASE", purchase);
          return (
            <div className="purchase-container" key={i}>
              <div>
                {purchase.isopen ? (
                  <div>"No Purchase History"</div>
                ) : clicked ? (
                  <div id="purchase">
                    <div id="purchase-info">
                      <img
                        className="purchase-picture"
                        src={purchase.imagelink}
                      ></img>
                      <p className="purchase-info-text">
                        <b className="purchase-info-text">Name:</b>{" "}
                        {purchase.name}
                      </p>{" "}
                      {""}
                      <p className="purchase-info-text">
                        <b className="purchase-info-text">Price: </b>{" "}
                        {purchase.price}
                      </p>{" "}
                      {""}
                      <p className="purchase-info-text">
                        <b className="purchase-info-text">Quantity: </b>
                        {purchase.quantity}
                      </p>
                      {""}
                      <button
                        className="view-order-btn"
                        onClick={() => {
                          setClicked(false);
                        }}
                      >
                        Close Purchase Order
                      </button>
                    </div>
                    <div></div>
                  </div>
                ) : (
                  <button
                    className="view-order-btn"
                    onClick={() => {
                      setClicked(true);
                    }}
                  >
                    View Purchase Order Number {purchase.cartid}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </fieldset>
    </div>
  );
  }
};

export default PurchaseHistory;
