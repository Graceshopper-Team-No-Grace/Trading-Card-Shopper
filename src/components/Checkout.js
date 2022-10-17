import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import '../stylesheets/Checkout.css';

const Checkout = ({
  priceTotal
}) => {
    
    let subTotal = 0;
    let cartItem = [];

    const path = process.env.REACT_APP_BASE_URL;
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
    };

    const cart = localStorage.getItem("cartItems");
    if (cart) {
      cartItem = JSON.parse(cart);
      if (cartItem.length){
        cartItem.map((item, i) => {
          subTotal += Number(item.price.replace(",", "") * item.quantity);
        })
      }
    }
    console.log('Subtotal', subTotal)
    
    const Tax = priceTotal * .0825;
    const Total = priceTotal + Tax;
    console.log("Bill", subTotal, Tax, Total);


    const updateInventory = async (product) => {

      //Call backend to decrease the inventory for product ID
      //We may need to add more items to change but for right now
      //it's probably just inventory count.
      console.log("Product is ", product);
      const response = await fetch(`${path}/products`, {
        method: "PATCH",
        headers: {
              'Content-Type': 'application/json',
              },
              body : JSON.stringify({
                
                  id: product.id,
                  amountToSubtract: product.quantity,
                      
              })
        });
        const data = await response.json();
        console.log('data', data);
    }


    const submitPayment = async () => {

      const token = localStorage.getItem("token");
      let response;
      let data;

      cartItem.map((item, i) => {
        updateInventory(item);
      });

      //now that payment has been received, clear the data from localStorage
      localStorage.setItem("cartItems", []);
      localStorage.setItem("currentDetails", {});

      //Close the order from carts -- but only for a registered customer
      //Otherwise, there won't be an associated cart.
      if (token) {
        response = await fetch(`${path}/carts`, {
          method: "PATCH",
          headers: {
                'Content-Type': 'application/json',
                'Authorization' : `Bearer ${token}`,
                }
          });
          data = await response.json();
          if (data.success) {
            console.log('data', data);
          }

          //Now we need to create a new open Cart for this customer
          response = await fetch(`${path}/carts`, {
            method: "POST",
            headers: {
                  'Content-Type': 'application/json',
                  'Authorization' : `Bearer ${token}`,
                  }
            });
            data = await response.json();
            if (data.success) {
              console.log('data', data);
              navigate("/Thanks");
            } else {
              console.log("Error creating new Open Cart", data.message);
            }
        }
    }

      

    return (
        <div>
          <form id="checkout" className="form" onSubmit={handleSubmit}>
                <h2 className="form-header">Payment Info</h2>
                <hr className="form-divider"></hr>
                <div className="input-wrapper">
                  <input
                    className="form-inputs"
                    type="text"
                    placeholder="Name On Card"
                    required
                  ></input>
                  <input
                    className="form-inputs"
                    required
                    type="CC Number"
                    placeholder="Credit Card Number"
                    minLength={16}
                  ></input>
                  <input
                    className="form-inputs"
                    placeholder="Security Code"
                    required
                    type="Security Code"
                  ></input>
                  <textarea
                    id="billing-address-input"
                    className="form-inputs"
                    type="text"
                    placeholder="Billing Address&#10;City&#10;State&#10;Zip Code"
                    required
                  ></textarea>
                </div>
                <div>
                  <p className="misc-form-text">Subtotal: &emsp; ${priceTotal.toFixed(2)}</p>
                  <p className="misc-form-text">Tax: &emsp; &emsp; &emsp; &nbsp; ${Tax.toFixed(2)}</p>
                  <p className="misc-form-text">Total: &emsp; &emsp; &nbsp; ${Total.toFixed(2)}</p>
                </div>
                <div>
                  <button className="form-btn" type="submit" onClick={submitPayment}>Submit Payment!</button>
                </div>
          </form>
        </div>
      );

    };
  

export default Checkout;
