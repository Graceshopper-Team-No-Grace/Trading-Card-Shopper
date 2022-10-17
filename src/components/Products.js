import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import '../stylesheets/Products.css'

const Products = (props) => {

    //const [error, setError] = useState("");
    //const [errorMessage, setErrorMessage] = useState("");
    
    const allProducts = props.allProducts;
    const setAllProducts = props.setAllProducts;
    // // const chosenCard = props.chosenCard;
    // // const setChosenCard = props.setChosenCard;

    const navigate = useNavigate();

    useEffect(() => {
        const getAllData = async () => {
          await getAllProducts();
        };
        getAllData();
    }, []);

    const BASE_URL = process.env.REACT_APP_BASE_URL;

    const getAllProducts = async () => {
        try {
            const response = await fetch(`${BASE_URL}/products`);
            const result = await response.json();
            if (result.success) {
                console.log("SUCCESS! RESULT:", result);
                setAllProducts(result.data);
            }
        } catch (err) {
            console.error(err);
        }
    }
    
    const seeDetails = (productId) => {

        // console.log("Clicked on Card:", product);
        navigate(`/products/${productId}`);

    }


    return (
        <>
            <h1 id="products-heading">Cards For Sale</h1>
            <div id="products-wrapper">
            {
                allProducts.map((product, i) => {
                    console.log("PRODUCT", product)
                    return (
                        
                        <div className="product-container" key={i}>
                            <img className="card" src={product.imagelink} onClick={() => seeDetails(product.id)} alt="Pokemon"/>
                            <div className="caption">
                                <p>Price: ${product.price}</p>
                                <p>Cards in Stock: {product.inventorycount}</p>
                            </div>
                        </div>
                    )
                })
            }
            </div>
        </>
    );

}

export default Products;