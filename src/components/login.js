import React,{useState,useEffect} from "react";
import mainlogo from '../assets/MainLogo.png'
import '../components/style.css'
import {Button } from 'antd';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { fetchallusers, getAllUsers } from "../features/slice";
// import { useEffect } from "react/cjs/react.development";

const LoginPage =()=>
{
    const[email,setemail]=useState('')
    const[password,setpassword]=useState('')
    const [formData, setFormData] = useState({
        email:'',
        password:''
      });
    
    const userDetails=useSelector(getAllUsers);


    const dispatch = useDispatch()

    useEffect(()=>{
    dispatch(fetchallusers());
    },[dispatch])
    
    const handleFormData=async(event)=>
    {
        event.preventDefault();
        console.log(email);
        console.log(password);
        // [setemail,setpassword].forEach(vari=>vari(''));

        try{
            const res= await axios.post("http://localhost:5000/login",{
            email,password
        });

        if(res.status===200)
        {
            alert("Login Successfull");

            const username = userDetails.find((a)=>a.email===email)
            console.log(username);
            // navigate('/dashboard',{state:{Name:username}})
            if (username) {
                console.log(username.name);
                navigate('/dashboard', { state: { Name: username.name } });
            } else {
                console.error("User not found");
            }
        }

        }

        catch(err)
        {
            alert("Access Invaild");
        }
    }

    const navigate=useNavigate();

    const handleRegister=()=>{
        navigate('/signup')
    }

    const handleLogin=()=>
    {
    }

    
    return(
    <div className="flex flex-row space-x-56 justify-center mr-[25%]">
        <div>
            <img src={mainlogo} alt="" width="200" className="mt-[100%] ml-[5%]"></img>
        </div>
        

        <div>
        <div className="w-[100%] text-left border rounded-xl shadow-2xl p-5 mt-[40%] ">
            <strong className="Header" >Login</strong>
            <form className="mt-[15%]" onSubmit={handleFormData}>
                <div>
                    <label>Email</label>
                    <input
                        type="text"
                        name="user_email"
                        value={email}
                        onChange={(e)=>setemail(e.target.value)}
                        className="border border-black border-b-1 border-l-0 border-r-0 border-t-0 p-1 w-full"
                    />
                    </div>
                <div className="mt-[5%]">
                <label>Password</label>
                    <input
                        type="password"
                        name="user_password"
                        value={password}
                        onChange={(e)=>setpassword(e.target.value)}
                        className="border border-black border-b-1 border-l-0 border-r-0 border-t-0 p-1 w-full"
                />
                </div>
                <div className="flex flex-row justify-center gap-4">
                    <Button type="primary" htmlType="submit" className="mt-4  w-[30%]" onClick={handleLogin}>Login</Button>
                    <Button type="primary" htmlType="submit" className="mt-4" onClick={handleRegister}>Register</Button>
                </div>
                
            </form>
        </div>
        </div>

    </div>
    )
    
}
export default LoginPage;