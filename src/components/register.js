import React,{useState} from "react";
import mainlogo from '../assets/MainLogo.png'
import '../components/style.css'
import {Button } from 'antd';
import { useNavigate } from "react-router-dom";
import axios from 'axios';




const RegisterPage =()=>
{
    const[email,setemail]=useState('')
    const[name,setname]=useState('')
    const[password,setpassword]=useState('')
    const[confpassword,setconfpassword]=useState('')
    const navigate=useNavigate();

    const handleButton=()=>
    {
       alert('successfull')
    }
    const handleFormData=async(event)=>
    {
        event.preventDefault();
        [setemail,setpassword].forEach(vari=>vari(''));
        if(password!==confpassword)
        {
            alert("Password Mismatch")
        }

        try
        {
            await axios.post("http://localhost:5000/signup",{
                name,email,password
            });

            [setname, setemail, setpassword, setconfpassword].forEach(fn => fn(''));
            alert('Sign up successful');
        }
        catch(err)
        {
            alert("failed"+err)
        }

        navigate('/login')


    }

    
    return(
    <div className="flex flex-row space-x-56 justify-center mr-[25%]">
        <div>
            <img src={mainlogo} alt="" width="200" className="mt-[100%] ml-[5%]"></img>
        </div>
        

        <div>
        <div className="w-[100%] text-left border rounded-xl shadow-2xl p-5 mt-[25%] ">
            <strong className="Header" >Register</strong>
            <form className="mt-[15%]" onSubmit={handleFormData}>
                <div>
                    <label>Name</label>
                    <input
                        type="text"
                        name="user_name"
                        value={name}
                        onChange={(e)=>setname(e.target.value)}
                        className="border border-black border-b-1 border-l-0 border-r-0 border-t-0 p-1 w-full"
                    />
                    </div>
                <div className="mt-[5%]">
                <label>Email</label>
                    <input
                        type="email"
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
                <div className="mt-[5%]">
                <label>Confirm Password</label>
                    <input
                        type="password"
                    
                        value={confpassword}
                        onChange={(e)=>setconfpassword(e.target.value)}
                        className="border border-black border-b-1 border-l-0 border-r-0 border-t-0 p-1 w-full"
                />
                </div>
                <div className="flex flex-row justify-center gap-4">
                    {/* <Button type="primary" htmlType="submit" className="mt-4  w-[30%]">Login</Button> */}
                    <Button type="primary" htmlType="submit" className="mt-4" onClick={handleButton}>Done</Button>
                </div>
                
            </form>
        </div>
        </div>

    </div>
    )
    
}
export default RegisterPage;