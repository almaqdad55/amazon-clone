import React from "react";
import "./Header.css";
import amazonLogo from "./img/amazon_logo.png";
import { SearchOutlined, ShoppingBasketOutlined } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useStateValue } from "./StateProvider";
import { auth } from "./firebase";

const Header = () => {
  const [{ basket, user }, dispatch] = useStateValue();

  const handleAuthentication = () => {
    if (user) {
      auth.signOut();
    }
  };
  return (
    <div className="header">
      <Link to="/">
        <img src={amazonLogo} alt="logo" className="header__logo" />
      </Link>

      {/*  */}
      <div className="header__search">
        <input className="header__searchInput" type="text" />
        <SearchOutlined className="header__searchIcon" />
      </div>
      {/*  */}
      <div className="header__nav">
        <Link to={!user && "login"}>
          <div className="header__option" onClick={handleAuthentication}>
            <span className="header__optionLineOne">
              {user ? `Hello, ${user.email}` : `Hello, Guest`}
            </span>
            <span className="header__optionLineTwo">
              {user ? "Sign Out" : "Sign In"}{" "}
            </span>
          </div>
        </Link>
        <div className="header__option">
          <span className="header__optionLineOne">Returns</span>
          <span className="header__optionLineTwo">& Orders</span>
        </div>
        <div className="header__option">
          <span className="header__optionLineOne">Your</span>
          <span className="header__optionLineTwo">Prime</span>
        </div>

        <Link to="/checkout">
          <div className="header__optionBasket">
            <ShoppingBasketOutlined />
            <span className="header__optionLineTwo header__basketCount">
              {basket?.length}
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Header;
