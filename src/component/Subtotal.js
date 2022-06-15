import { Fragment } from "react";
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import "./Subtotal.css";
import CurrencyFormat from "react-currency-format";
import { useStateValue } from "../context/StateProvider";
import { getBasketTotal } from "../context/reducer";
import { useForm } from "react-hook-form";

function Subtotal() {
  const [{ basket, user }, dispatch] = useStateValue();
  const [userDetails, setUserDetails] = useState(null);
  const [show, setShow] = useState(false);
  const [userData,setUserData]=useState({
    Name:"",
    Email:"",
    PhoneNo:"",
    CardNo:"",
    Price:""
  });

  let name , value;
  const postUserData=(event)=>{
  name=event.target.name;
  value=event.target.value;
  setUserData({...userData,[name]:value});
  };

//connect with firebase
const submitData=async(event)=>{
 event.preventDefault();
 const{Name,Email,PhoneNo,CardNo}=userData;
 if(Name && Email && PhoneNo && CardNo){
 const res=await fetch(
  'https://reactfirebasewebsite-dfa15-default-rtdb.firebaseio.com/userDataRecords.json',
 {
  method:"POST",
  headers:{
    "Content-Type":"application/json",
  },
  body:JSON.stringify({
    Name,
    Email,
    PhoneNo,
    CardNo
  }),
}
  );
  if(res){
    setUserData({
    Name:"",
    Email:"",
    PhoneNo:"",
    CardNo:""
    })
    alert("Data Stored successfully ")
    setShow(true);
      dispatch({
        type: "CLEAR_CART",
      });
  }
  else{
    alert("Please fill the data")
  }
}
else{
  alert("Please fill the data")
}
}

  const { handleSubmit, reset, register, errors } = useForm();

  const onSubmit = (values) => {
    if (values != null) {
      Swal.fire({
        position: "top",
        icon: "success",
        customClass: "swal-wide",
        title: "Order Is Confirmed " + values.name,
        text: "Confirmation mail send on  " + values.email,

        showConfirmButton: false,
        showCloseButton: true,

        timer: 2500,
      });
      setShow(true);
      dispatch({
        type: "CLEAR_CART",
      });
    }
    setUserDetails(values);
    reset();
  };
  useEffect(() => {
    localStorage.setItem("basket", JSON.stringify(basket));
  });

  const unique = [...new Set(basket.map((item) => item.id))];

  return (
    <div className="checkoutSubtotal">
      <div className="checkoutSubtotal__form">
        <CurrencyFormat
          renderText={(value) => (
            <>
              <p>
                <b>Subtotal</b> ( {unique?.length} items):{" "}
                <strong>{value}</strong>
              </p>
            </>
          )}
          decimalScale={2}
          value={getBasketTotal(basket)}
          displayType={"text"}
          thousandSeparator={true}
          prefix={"$"}
        />
        
        <strong>Items</strong>

        <Fragment>
          <div>
            {basket.length > 0 ? (
              <form
                className="checkoutSubtotal__formSection"
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="exampleInputEmail1"
                    name="Name"
                    ref={register({
                      required: true,
                      minLength: 2,
                      maxLength: 120,
                    })}
                    placeholder="Your  name"
                    value={userData.Name}
                    onChange={postUserData}
                  />
                  {errors.name && (
                    <span className="error">Enter your name</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">Email</label>
                  <input
                    className="form-control"
                    id="exampleInputEmail1"
                    name="Email"
                    ref={register({ required: true, pattern: /\S+@\S+\.\S+/ })}
                    placeholder="Your email"
                    value={userData.Email}
                    onChange={postUserData}
                  />
                  {errors.email && (
                    <span className="error">Enter a valid email address</span>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">Phone</label>
                  <input
                    type="number"
                    className="form-control"
                    id="exampleInputEmail1"
                    name="PhoneNo"
                    ref={register({
                      required: true,
                      minLength: 10,
                      maxLength: 10,
                    })}
                    placeholder="Enter phone no. +91-XX"
                    value={userData.PhoneNo}
                    onChange={postUserData}
                  />
                  {errors.phone && (
                    <span className="error">
                      The mobile number you entered does not seem to be valid
                    </span>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">Cradit Card No</label>
                  <input
                    type="number"
                    className="form-control"
                    id="exampleInputEmail1"
                    name="CardNo"
                    ref={register({
                      required: true,
                      minLength: 16,
                      maxLength: 16,
                    })}
                    placeholder="Enter credit card co. 16 digit"
                    value={userData.CardNo}
                    onChange={postUserData}
                  />
                  {errors.credit && (
                    <span className="error">
                      The credit card number you entered does not seem to be
                      valid
                    </span>
                  )}
                </div>

                <button className="" onClick={submitData}> Order Confirm </button>
              </form>
            ) : (
              ""
            )}
          </div>
        </Fragment>
      </div>
    </div>
  );
}

export default Subtotal;
