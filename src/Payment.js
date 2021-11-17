import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import CheckoutProduct from "./CheckoutProduct";
import "./Payment.css";
import { useStateValue } from "./StateProvider";
import { Link } from "react-router-dom";
import CurrencyFormat from "react-currency-format";
import { getBasketTotal } from "./reducer";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "./axios";
import { db } from "./firebase";
import { doc, setDoc } from "firebase/firestore";
function Payment() {
  const navigate = useNavigate();
  const [{ basket, user }, dispatch] = useStateValue();

  const stripe = useStripe();
  const element = useElements();

  const [succeeded, setSucceeded] = useState(false);
  const [processing, setProcessing] = useState("");

  const [error, setError] = useState(null);
  const [disabled, setDisabled] = useState(true);
  const [clientSecret, setClientSecret] = useState(true);

  useEffect(() => {
    // generate the special stripe secret which allows us to charge a customer
    const getClientSecret = async () => {
      const response = await axios({
        method: "post",
        // Stripe expects the total in a currencies subunits
        url: `/payments/create?total=${getBasketTotal(basket) * 100}`,
      });
      setClientSecret(response.data.clientSecret);
    };

    getClientSecret();
  }, [basket]);

  console.log("The secret is >>>>>>>", clientSecret);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    const payLoad = await stripe
      .confirmCardPayment(clientSecret, {
        payment_method: {
          card: element.getElement(CardElement),
        },
      })
      .then(({ paymentIntent }) => {
        // paymentIntent is pyament confirmation in Stripe
        // db.collection("users").
        //doc(user?.uid)
        //.collection("orders");
        // .doc(paymentIntent.id)
        // .set({
        //   basket: basket,
        //   amount: paymentIntent.amount,
        //   created: paymentIntent.created,
        // });

        // addDoc(collection(db, "coolers"), {
        //   users: user?.uid,
        // });
        const data = {
          basket: basket,
          amount: paymentIntent.amount,
          created: paymentIntent.created,
        };
        setDoc(doc(db, "users", user.uid, "orders", paymentIntent.id), data);

        // doc(db, "kimo", user?.email);

        // console.log("Document written with ID: ", docRef.id);

        // Add a second document with a generated ID.

        // const aTuringRef = db.collection('users').doc('aturing');

        // await aTuringRef.set({
        //   'first': 'Alan',
        //   'middle': 'Mathison',
        //   'last': 'Turing',
        //   'born': 1912
        // });

        setSucceeded(true);
        setError(null);
        setProcessing(false);

        dispatch({
          type: "EMPTY_BASKET",
        });

        navigate("/orders", { replace: true });
      });
  };

  const handleChange = (e) => {
    //listen for changes in the CardElement
    // display errors as customer types their card details
    setDisabled(e.empty);
    setError(e.error ? e.error.message : "");
  };

  return (
    <div className="payment">
      <div className="payment__container">
        <h1>
          Checkout (<Link to="/checkout">{basket?.length} items </Link>)
        </h1>

        {/* payment section - delivery address */}
        <div className="payment__section">
          <div className="payment__title">
            <h3>Delivery Address</h3>
          </div>
          <div className="payment__address">
            <p>{user?.email}</p>
            <p>35 Barons St</p>
            <p>Adelaide, South Australia</p>
          </div>
        </div>

        {/* payment section - review items  */}
        <div className="payment__section">
          <div className="payment__title">
            <h3>Review items & delivery</h3>
          </div>
          <div className="payment__items">
            {basket.map((item, index) => {
              return (
                <CheckoutProduct
                  // key={new Date().getMilliseconds().toString()}
                  id={item.id}
                  title={item.title}
                  image={item.image}
                  price={item.price}
                  rating={item.rating}
                />
              );
            })}
          </div>
        </div>

        {/* payment section - payment method */}
        <div className="payment__section">
          <div className="payment__title">
            <h3>Payment Method</h3>
          </div>
          <div className="payment__details">
            {/* Stripe  */}
            <form onSubmit={handleSubmit}>
              <CardElement onChange={handleChange} />

              <div className="payment__priceContainer">
                <CurrencyFormat
                  renderText={(value) => (
                    <>
                      <h3>Order Total: {value}</h3>
                    </>
                  )}
                  decimalScale={2}
                  value={getBasketTotal(basket)} // Part of the homework
                  displayType={"text"}
                  thousandSeparator={true}
                  prefix={"AU$"}
                />

                <button disabled={processing || disabled || succeeded}>
                  <span>{processing ? <p>Processing</p> : "Buy Now"}</span>
                </button>
              </div>
              {/* Error Message */}
              {error && <div>{error}</div>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;
