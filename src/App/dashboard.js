import React,{useEffect} from "react";
import { Navbar, Nav } from 'rsuite';
import ExitIcon from '@rsuite/icons/Exit';
import AdminIcon from '@rsuite/icons/Admin';
import fullhead from '../assets/CompanyName.png'
import ViewsAuthorizeIcon from '@rsuite/icons/ViewsAuthorize';
import DocPassIcon from '@rsuite/icons/DocPass';
import TextImageIcon from '@rsuite/icons/TextImage';
import GridIcon from '@rsuite/icons/Grid';
import { Button } from "antd";
import '../components/style.css'
import { useNavigate,useLocation } from "react-router-dom";
import {useDispatch,useSelector} from 'react-redux'
import { fetchUserData } from "../features/slice";

const DashboardPage=()=>
{
    
   
    const navigate=useNavigate()
    const location=useLocation()
    const {Name}=location.state
    const handleCertificate=()=>
    
    {
        navigate('/certificate');
    }

    const handleInvoice=()=>
    {
        navigate('/invoice')
    }

    const handleGov=()=>
    {
        navigate('/gov-certificate')
    }

    const handleMonthlyInv=()=>
    {
        navigate('/monthly-invoice')
    }

    const handleLogout = () => {
        // Clear user data (e.g., from localStorage)
        localStorage.removeItem('user'); // Assuming user data is stored here
        localStorage.removeItem('token'); // If you're using tokens for authentication
    
        // Redirect to the login page
        navigate('/login');
      };

      
    return(
        <div>
            <Navbar>
                <Navbar.Brand className="w-[50%]">
                    <img src={fullhead} alt="" width={300}></img>
                </Navbar.Brand>
                <Nav className="text-right mr-[5%]">
                    <Button icon={<ExitIcon />} onClick={handleLogout}> Logout</Button>
                </Nav>
            </Navbar>


            <div>
                <p>Welcome,{Name}!!!!</p>
            </div>
            

            <div className="card flex justify-center gap-[5%] mt-[4%]">
                <div className="w-[20%] p-[5%] shadow-lg shadow-blue rounded-lg flex flex-col space-y-6 " onClick={handleCertificate}>
                    <div className="bg-blue w-10 h-10 rounded-full flex items-center justify-center">
                            <ViewsAuthorizeIcon color="white" />
                    </div>

                        <label>CERTIFICATE</label>
                </div>

                <div className="w-[20%] p-[5%] shadow-lg shadow-pink rounded-lg flex flex-col space-y-6" onClick={handleGov}>
                    <div className="bg-pink w-10 h-10 rounded-full flex items-center justify-center">
                            <DocPassIcon color="white"/>
                    </div>

                        <label>GOVERNMENT CERTIFICATE</label>
                </div>

                <div className="w-[20%] p-[5%] shadow-lg shadow-green rounded-lg flex flex-col space-y-6 " onClick={handleInvoice}>
                    <div className="bg-green w-10 h-10 rounded-full flex items-center justify-center">
                            <TextImageIcon color="white" />
                    </div>

                        <label>INVOICE</label>
                </div>

                <div className="w-[20%] p-[5%] shadow-lg shadow-brown rounded-lg flex flex-col space-y-6" onClick={handleMonthlyInv}>
                    <div className="bg-brown w-10 h-10 rounded-full flex items-center justify-center">
                            <GridIcon color="white"/>
                    </div>

                        <label>MONTHLY INVOICE</label>
                </div>
            </div>
        </div>
    )

}

export default DashboardPage;