import "./App.css";
import Header from "./Header";
import Home from "./Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Checkout from "./Checkout";
import Login from "./Login";
import Payment from "./Payment";
import Orders from "./Orders";
import { auth } from "./firebase";
import { useStateValue } from "./StateProvider";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const promise = loadStripe(
  "pk_test_51JwGDOKLGfGpDPRxCm8KO5CVZrV1aHWxO3PihlnVHbz1S8db0CWO0yZ2rXf3URJ2nKU0HL8er85awdpqraU8IZgo00fAsgMkQ6"
);

function App() {
  const [{}, dispatch] = useStateValue();

  useEffect(() => {
    // run once when app component load
    auth.onAuthStateChanged((authUser) => {
      console.log("The user is ", authUser);

      if (authUser) {
        // the user loged in
        dispatch({
          type: "SET_USER",
          user: authUser,
        });
      } else {
        // the user is loggef out
        dispatch({
          type: "SET_USER",
          user: null,
        });
      }
    });
  }, []);
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route exact path="/checkout" element={<Checkout />}></Route>
          <Route exact path="/login" element={<Login />}></Route>
          <Route exact path="/orders" element={<Orders />}></Route>
          <Route
            exact
            path="/payment"
            element={
              <Elements stripe={promise}>
                <Payment />
              </Elements>
            }
          ></Route>
          <Route exact path="/" element={<Home />}></Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
