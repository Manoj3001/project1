import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from '../components/login';
import RegisterPage from '../components/register';
import FormLayout from '../components/form';
import DashboardPage from './dashboard';
import InvoiceLayout from '../components/invoice';
import CertificateComp from '../components/gov_certificate';
import MonthlyInvoice from '../components/montly_inv';

const MainPage = () => {
  return (
    <Router>
      <div className='App'>
        <Routes>
            <Route path='/' element={<LoginPage/>}></Route>
            <Route path='/login' element={<LoginPage/>}></Route>
            <Route path='/signup' element={<RegisterPage/>}></Route>
            <Route path='/certificate' element={<FormLayout/>}></Route>
            <Route path='/dashboard' element={<DashboardPage/>}></Route>
            <Route path='/invoice' element={<InvoiceLayout/>}></Route>
            <Route path='/gov-certificate' element={<CertificateComp/>}></Route>
            <Route path='/monthly-invoice' element={<MonthlyInvoice/>}></Route>

        </Routes>
      </div>
    </Router>
  );
};

export default MainPage;
