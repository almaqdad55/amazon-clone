import React, { useState, useEffect } from "react";
import "./Orders.css";
import { db } from "./firebase";
import { doc, setDoc } from "firebase/firestore";
import { useStateValue } from "./StateProvider";

function Orders() {
  const [{ basket, user }, dispatch] = useStateValue();

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // const data = {
    //   basket: basket,
    //   amount: paymentIntent.amount,
    //   created: paymentIntent.created,
    // };
    const yes = setDoc(doc(db, "users", user.uid, "orders")).orderBy(
      "created",
      "desc"
    );
  }, []);

  return (
    <div className="orders">
      <h1>Orders</h1>
    </div>
  );
}

export default Orders;
