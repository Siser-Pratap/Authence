import React, {useEffect} from "react";
import { useNavigate } from "react-router-dom";
import {useState} from 'react';
import "./SignUp.css";
import axios from "axios";


const SignUp = ({user}) => {

    const [formData, setformData] = useState({});
    const [error, seterror] = useState(false);
    const [loading, setloading] = useState(false);
    const [errorText, seterrorText] = useState("");

    const navigate = useNavigate();

    const handleChange = (e) => {
        setformData({...formData, [e.target.id]:e.target.value});
    }

    const handleConfirm = (e) => {
        seterrorText(e.target.value);
    }

    const handleSubmit = async(e) => {
        e.preventDefault();
        if(formData.password !== confirm){
            seterror(true);
        }
        try {
            setloading(true);
            const res = await axios.post(`${import.meta.env.BACKEND_URL}/api/signup`, formData);
            const data = await res.json();
            console.log(data);
            setloading(false);
            
        }
        catch (error) {
            seterror(true);
        }
    }

    

    return (
        
        <form id="container">
        <h3 id="Heading">Sign Up</h3>
        <label>Username:</label>
        <div className="row">
            <div className="icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="100%"><path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"/></svg>
            </div>
            <input name="username" id="username" type="text" onChange={handleChange} placeholder="Username" required />
        </div>
        <label>Email:</label>
        <div className="row">
            <div className="icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%"><path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z"/></svg>
            </div>
            <input type="email" id="email" placeholder="Email" onChange={handleChange} name="Email" required />
        </div>
        <label>Password:</label>
        <div className="row">
        <div className="icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="30px"><path d="M336 352c97.2 0 176-78.8 176-176S433.2 0 336 0S160 78.8 160 176c0 18.7 2.9 36.8 8.3 53.7L7 391c-4.5 4.5-7 10.6-7 17v80c0 13.3 10.7 24 24 24h80c13.3 0 24-10.7 24-24V448h40c13.3 0 24-10.7 24-24V384h40c6.4 0 12.5-2.5 17-7l33.3-33.3c16.9 5.4 35 8.3 53.7 8.3zM376 96a40 40 0 1 1 0 80 40 40 0 1 1 0-80z"/></svg>
            </div>
            <input type="password" id="password" placeholder="Password" onChange={handleChange} name="Password" required  />
        </div>
        <label>Confirm Password:</label>
        <div className="row">
            <div className="icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="30px"><path d="M336 352c97.2 0 176-78.8 176-176S433.2 0 336 0S160 78.8 160 176c0 18.7 2.9 36.8 8.3 53.7L7 391c-4.5 4.5-7 10.6-7 17v80c0 13.3 10.7 24 24 24h80c13.3 0 24-10.7 24-24V448h40c13.3 0 24-10.7 24-24V384h40c6.4 0 12.5-2.5 17-7l33.3-33.3c16.9 5.4 35 8.3 53.7 8.3zM376 96a40 40 0 1 1 0 80 40 40 0 1 1 0-80z"/></svg>
            </div>
            <input type="password" onChange={handleConfirm} placeholder="Confirm Password" name="ConfirmPassword" required />
        </div>
        <button className="submit" type="submit" onClick={handleSubmit}>{loading?"loading":"Sign Up"}</button>
        <p className="error">{error && "Password does not matches"}</p>
        <span>
        <span>Already have Account <a href="/login/"> Log In</a></span></span>
    </form>
    
    );

};

export default SignUp;