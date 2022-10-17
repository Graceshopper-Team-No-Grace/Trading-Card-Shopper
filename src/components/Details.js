import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import '../stylesheets/Details.css';
const path = process.env.REACT_APP_BASE_URL;

let purchaseItems = [];
const Details = ({
    setPriceTotal,
    priceTotal,
    token,
    loggedIn
}) => {
    const { productId } = useParams();
    
    const [product, setProduct] = useState({})
    const [error, setError] = useState("")
    // const setCartItems = props.setCartItems;
    let quantity = 1;
    let checkLocalStorage = [];
    
    checkLocalStorage = localStorage.getItem("cartItems");
    console.log("checkLocalStorage is", checkLocalStorage);
    if (checkLocalStorage === null || checkLocalStorage === [] || !checkLocalStorage.length) {
        purchaseItems = [];
    }
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async() => {

        
        // const selectedProduct = async (id) => {
            setProduct(await fetchProductById(productId))
        // }
        // selectedProduct(productId);
        
        // const getCart = async() => {
            // console.log("PRODUCT", product)
            await getCustomerCart()
            // console.log("TESTER", test)
        }
        fetchData();
        // getCart()
        
    }, []);

    useEffect(() => {

        console.log("Inside useEffect for product", product);
        const thisProduct = fetchProductById(product.id);
        if (thisProduct.inventorycount === 0) {
            document.getElementById("addcard").disabled = true;
        }
        
    }, [product]);

    const getCustomerCart = async() => {
        if(loggedIn) {
            try {
                const response = await fetch(`${path}/cart_products`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                })
                const customerCart = await response.json();
                console.log("CART", customerCart)
                if (customerCart && customerCart.length) {
                    Promise.all(customerCart.map(existingProduct => {
                        console.log("IDs", existingProduct.id, productId)
                        if (existingProduct.id == productId && customerCart.quantity <= 1) {
                            setError("Already in your cart");
                            console.log("ERROR:", error)
                            // return error;
                        }
                    }))
                }
                
            } catch (error) {
                console.error(error);
            }
        }
    }


    const fetchProductById = async (id) => {
        try {
            const response = await fetch(`${path}/products/${id}`);
            const singleProduct = await response.json();
            return singleProduct.data;
        } catch (error) {
            console.error(error);
            setProduct(null)
        }
    }

    const adjustQuantity = (op) => {

        if (op === "add") {
            if (quantity < product.inventorycount) {
                quantity++;
            }
        } else {
            if (quantity > 1) quantity--;
        }

        document.getElementById("quantity-count").innerHTML = quantity;
    }

    const addToCart = async (name, price, quantity, productId) => {
      setPriceTotal(priceTotal +
        price.replace(",", "") * quantity)

      if (!quantity) {
          alert("Please select a quantity");
      } else {

        let item = {
          name: name,
          price: price,
          quantity: quantity,
          id: productId,
        };

        purchaseItems.push(item);
        console.log("Purchase Items is", purchaseItems);
        localStorage.setItem("cartItems", JSON.stringify([...purchaseItems]));
        setProduct(item);
        purchaseItems.pop();

          if(loggedIn) {
              const response = await fetch(`${path}/cart_products`, {
                  method: "POST",
                  headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${token}`
                  },
                  body: JSON.stringify({
                      productid: productId,
                      quantity: quantity
                  
                  })
              });
              const data = await response.json();
              if (!data.success) {
                  alert("Error adding purchase item to cart");
              } else {
                  console.log('data', data);
                  alert("Item successfully added to your cart");
              }

          } else {
              alert("Item successfully added to your cart");
          }

      }
    }

    const navToCart = () => {
        navigate("/mycart")
    }

    return(
        <div>
            <div className="grid-container">
                <div className="caption"><img className="grid-item" src={product.imagelink} alt="Pokemon"/>
            </div>
            <div className="v1"></div>
            <div className="main">
            <h2 id="details-header">{product.name} Details</h2>
            <hr></hr>
            <h4>Condition: {product.condition}</h4>
            <h4>Rarity: {product.rarity}</h4>
            <h4>Ability 1: {product.ability1}</h4>
            {
                product.ability2
                ?
                <h4>Ability 2: {product.ability2}</h4>
                :
                null
            }
            <h4 id="instock">In Stock: {product.inventorycount}</h4>
            <h4 id="price">Price: ${product.price}</h4>
            <hr></hr>
            <div>
            <button  onClick={() => adjustQuantity("subtract")} id="minus">-</button>
                <div>
                    <p id="quantity-count" value={quantity}>{quantity}</p>
                </div>
            <button onClick={() => adjustQuantity("add")} id="plus">+</button>
            <div>{ error
            ? <button onClick={() => navToCart()} id="addcard">Already In Cart</button>
            : <button onClick={() => addToCart(product.name, product.price, quantity, product.id)} id="addcard">Add To Cart</button>
            }</div>
            </div>
            </div>
            </div>
        </div>
        
        
    )

}

export default Details;