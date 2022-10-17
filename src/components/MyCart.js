import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
const BASE_URL = "http://localhost:4000/api";
import "../stylesheets/MyCart.css";
const path = process.env.REACT_APP_BASE_URL;

const MyCart = ({
  loggedIn,
  token,
  priceTotal,
  setPriceTotal
  }) => {

    const navigate = useNavigate();
    const [cart, setCart] = useState([]);
    const [updateQuantity, setUpdateQuantity] = useState(0)
    const [error, setError] = useState("")


    useEffect(() => {

      console.log("Inside useEffect for cart", cart);
      if (!cart.length) {
        setPriceTotal(0);
      } else {
        //localStorage.setItem("cartItems", JSON.stringify(cart));
        cartTotal();
      }

    }, [cart]);

    
    useEffect(() =>{
      const awaitCart = async() =>{
        await getCurrentCart()
        console.log("Inside initialization useEffect");
      }
      awaitCart()

    }, []);
    
    const getCurrentCart = async () => {
        const sessionCart = localStorage.getItem("cartItems");
        const cartArr = sessionCart ? JSON.parse(sessionCart) : null;
        const cartid = loggedIn ? getCartId() : null;
        if (!loggedIn && sessionCart) {
          setCart(cartArr);
        } else if (loggedIn && !sessionCart) {
          const CartTest = await fetchCustomerCart();
          console.log("Cart Test is", CartTest);
          setCart(CartTest);
        } else if (loggedIn && sessionCart) {
          console.log("If logged In and there is a session cart");
          if (cartArr.length) {
            await Promise.all(cartArr.map(cartItem => {
              addCartItemsToExistingCart({
                cartid,
                productid: cartItem.id,
                quantity: cartItem.quantity
              })
            }))
          }
          setCart(await fetchCustomerCart());
          //localStorage.removeItem("cartItems")
        } else {
          setCart([])
          localStorage.removeItem("cartItems")
          
      }
      console.log("total", priceTotal)
    }

    const cartTotal = async() => {
       let tempTotal = 0;
       if (cart.length) {
          cart.map(product => {
            console.log("PROD", product);
            tempTotal += Number(product.price.replace(",", "") * product.quantity);
          })
          setPriceTotal(tempTotal);
        }
    }

    const getCartId = async() => {
        try {
            const response = await fetch(`${BASE_URL}/cart_products`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            )
            const result = await response.json();
            // console.log("CART ID", result)
            return result;
        } catch (error) {
            console.error(error);
        }
    } 

    const fetchCustomerCart = async() => {
        try {
            const response = await fetch(`${BASE_URL}/cart_products`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            )
            const result = await response.json();
            // console.log("FETCH CART", result)
            return result;
        } catch (error) {
            console.error(error);
            setCart([])
        }
    }

    const addCartItemsToExistingCart = async({cartid, productid, quantity}) => {
        // console.log("CART ITEM", cartItem)
        try {
            const response = await fetch(`${BASE_URL}/cart_products`, {
                method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        cartid,
                        productid,
                        quantity
                    })
            })
            const result = await response.json();
            console.log("RESULT", result);
        } catch (error) {
            console.error(error);
            setCart([])
        }
    }
      
    const handleDelete = async (id, cartItemPrice) => {
      setPriceTotal(priceTotal - cartItemPrice)
      console.log("Inside delete routine and id/cartItemPrice is", id, cartItemPrice);
        if (loggedIn) {
            try {
                const response = await fetch(`${path}/cart_products`, {
                    method: "DELETE",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body : JSON.stringify({
                        id
                    })
                });
                const result = await response.json();
                console.log("DEL RESULT", id, result.deletedProduct.id);
                //We have to make some other call here besides re-calling the getCurrentCall function. 
                //
                //await getCurrentCart();  
                const cartAfterDelete = await fetchCustomerCart();
                setCart(cartAfterDelete);            
            } catch (error) {
                console.error(error);
            }
        } else {
            console.log("CART? Del", cart)
            const storageCart = JSON.parse(localStorage.getItem("cartItems"))
            console.log("storage cart", storageCart)
            storageCart.map((item, i) => {
              console.log("IDs", item.id, id);
              item.id === id ? storageCart.splice(i, 1) : null;
            });
            if (storageCart.length) {
                localStorage.setItem("cartItems", JSON.stringify(storageCart))
            } else {
                localStorage.removeItem("cartItems")
            }
            console.log("AFTER SPLICE", storageCart)     
            getCurrentCart()
        }
    }

    const handleQuantity = async(id, priceDifference) => {
      const currentTotal = priceTotal

      console.log("DIFF, TTL", priceDifference, priceTotal)

      if (priceDifference + priceTotal < 0) {
        setError("Nice Try")
      } else {
      try {
        const response = await fetch(`${path}/products/${id}`);
        const { data } = await response.json();
        console.log("DATA", data)

        if (data) {
          if (updateQuantity > data.inventorycount) {
            await setError("Quantity exceeds Inventory");
            console.log("ERROR", error)
            await setPriceTotal(currentTotal)
            //await getCurrentCart()
          } else if(loggedIn) {
            console.log("ELLO?")
            const response = await fetch(`${path}/cart_products`, {
              method: 'PATCH',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                  id,
                  quantity: updateQuantity,
              })
            });
          console.log("RESPONSE", response)
          const result = await response.json();
          console.log("RESULT", result)
          // setError("")
          await setPriceTotal(priceTotal + priceDifference)
          //await getCurrentCart()
        } else {
          console.log("CART? Del", cart)
          const storageCart = JSON.parse(localStorage.getItem("cartItems"))
          console.log("storage cart", storageCart)
          storageCart.map((item, i) => {
            console.log("IDs", item.id, id);
            item.id === id ? item.quantity = updateQuantity : null;
          });
          localStorage.setItem("cartItems", JSON.stringify(storageCart))
          console.log("QTY", storageCart)   
          // setError("")
          await setPriceTotal(priceTotal + priceDifference)  
          //await getCurrentCart()
      }
        }
      } catch (error) {
        console.error(error)
      }
    }
    }
       
    const goToCheckout = () => {   
       navigate("/checkout")
    }

    const goToLogin = () => {   
      navigate("/login")
   }

    

    return (
        <div>
            <h1>Welcome to your Cart</h1>
            { 
              error ?
              <div className="error">{error}</div>
              : null
            } 
              {
                cart && cart.length ?
                    cart.map((singleItem, i) => {
                      // console.log("singleitem", singleItem)
                      let str = 
                      `
                      ${singleItem.quantity}   
                      ${singleItem.name} 
                      $${
                      Number(singleItem.price.replace(",", "")) * 
                      singleItem.quantity}
                      `
                        {console.log("TOTAL", priceTotal)}
                        return (
                            <div className="cart-item" key={i}>
                                <div>
                                  <h2>{str}</h2>
                                    <i
                                    id="icon"
                                    onClick={() => handleDelete(singleItem.id, Number(singleItem.price.replace(",", "")) * singleItem.quantity)}
                                    className="fa-solid fa-trash-can"
                                    ></i>
                                </div>
                                <div>
                                  <input
                                    type="number"
                                    min="1"
                                    placeholder={singleItem.quantity} 
                                    onChange={
                                      (e) => setUpdateQuantity(e.target.value)}
                                  ></input>
                                  <i
                                  id="icon"
                                  className="fa-solid fa-pen-to-square"
                                  onClick={
                                    () => handleQuantity(singleItem.id,
                                      Number(singleItem.price.replace(",", "")) *
                                      (updateQuantity - singleItem.quantity) 
                                    )}
                                  ></i>
                                  {/* {console.log("QTY", updateQuantity)} */}
                                </div>
                            </div>
                        );
                    })
                  :
                  <h2>No Items In Cart</h2>
              }
            <div>Total: ${priceTotal}</div>
            {
              loggedIn 
              ?
              <button className="form-btn" onClick={goToCheckout}>Proceed to Checkout</button>
              :
              <button className="form-btn" onClick={goToLogin}>Login to Proceed</button>
            }
    </div>
  );
}




export default MyCart;