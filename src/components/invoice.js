import React, { useRef, useState,useEffect } from 'react';
import { Modal, Button } from 'antd';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import moment from 'moment';
import '../components/style.css'
import { toWords } from 'number-to-words';
import axios from 'axios';
import {useSelector,useDispatch} from 'react-redux'
import { fetchinvoicedata, getAllData } from '../features/slice';

const temperatures = [];
for (let i = 20; i <= 40; i++) {
  temperatures.push(i);
}

const InvoiceLayout = () => {
  const [isInvoiceVisible, setIsInvoiceVisible] = useState(false);
  const previewInvoice=useRef(null); 
  const[invoice_no,setinvoice_no]=useState('')
  const[exp_name,setexp_name]=useState('')
  const[amount,set_amount]=useState('')
  const[formatted_Date,set_date]=useState('')
  
  

  const [formData, setFormData] = useState({
    Buyer:'',
    invoice:'',
    Amount:0,
    cgst:0,
    sgst:0,
    total_amt:0,
    Tax_value:0,
    total_amt_words:'',
    tot_tax:0,
    tax_no_words:'',
    exporter_name:'',
    formatted_Date:'',
    destination: '',
    container_no: '', 
    vessel: '', 
    quantity_declared: '',
  });

  const today = new Date();
    const previousDate = new Date(today);
    previousDate.setDate(today.getDate() - 1);
    const formattedDate = today.toLocaleDateString();
    const prev_date= previousDate.toLocaleDateString();

    
    
    useEffect(() => {
      const amount =parseFloat(formData.Amount) || 0;
      const cgst = (amount * 0.09).toFixed(2);
      const sgst = (amount * 0.09).toFixed(2);
      const total_amt = (amount + parseFloat(cgst) + parseFloat(sgst)).toFixed(2);
      const number=total_amt;
      const total_amt_words = toWords(number);
      const Tax_value = (parseFloat(cgst) + parseFloat(sgst)).toFixed(2);
      const tax_no=Tax_value;
      const tax_no_words=toWords(tax_no);



      setFormData(prevData => ({
        ...prevData,
        cgst,
        sgst,
        total_amt,
        Tax_value,
        total_amt_words,
        tax_no_words,
      }));
    }, [formData.Amount]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);

    
  };

  const handleFormSubmit = async(e) => {
    e.preventDefault();
    // console.log({ invoice_no, amount, exp_name,date });
    console.log(formData)
    setIsInvoiceVisible(true);
      try{
        const res= await axios.post("http://localhost:5000/invoicedata",{
          invoice_no: formData.invoice,
          amount: formData.Amount,
          exp_name: formData.exporter_name,
          invoice_date: formData.formatted_Date,
    });

    if(res.status===200)
    {
        alert("Data Successfully loaded");
    }

    }

    catch(err)
    {
        alert("Error");
    }


    try
    {
      const response= await axios.post("http://localhost:5000/filtercertificate",{
           invoice:formData.invoice
        });

        console.log('Response:', response);
        console.log('Response Data:', response.data);
        
        if (response.status === 200) {
          const data = response.data;
          setFormData(prevData => ({
            ...prevData,
            destination: data.destination || '',
            container_no: data.container_no || '',
            vessel: data.vessel || '',
            quantity_declared: data.quantity_declared || '',
          }));
          alert("Invoice found");
        } else {
          alert("Not found");
        }
      } catch (err) {
        console.error("An error occurred:", err);
      }

  };

  const GenerateInvoice=()=>
  {
    // alert('Hello')
    setIsInvoiceVisible(true)
  }


  const downloadInvoice = () => {
    const formInputs = document.querySelectorAll('input, select, textarea, button');
    formInputs.forEach(input => {
      input.style.display = 'none';
    });
  
    setTimeout(() => {
      html2canvas(previewInvoice.current, {
        scale: 2 
      }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
  
        
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
  
        
        const imgAspectRatio = imgProps.width / imgProps.height;
        const pdfAspectRatio = pdfWidth / pdfHeight;
  
        let scaledWidth, scaledHeight;
  
        if (imgAspectRatio > pdfAspectRatio) {
         
          scaledWidth = pdfWidth;
          scaledHeight = (imgProps.height * pdfWidth) / imgProps.width;
        } else {
          
          scaledWidth = (imgProps.width * pdfHeight) / imgProps.height;
          scaledHeight = pdfHeight;
        }
  
        
        const xPosition = (pdfWidth - scaledWidth) / 2;
        const yPosition = (pdfHeight - scaledHeight) / 2;
        const fileName = `Invoice_${formData.exporter_name || 'unknown'}.pdf`;
  
        
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(fileName);
  
        formInputs.forEach((input) => {
          input.style.display = 'block';
        });
        setTimeout(() => {
          window.location.reload();
        }, 500);
      });
    }, 1000);
  };
  
  return (
    <div className="flex justify-center p-5">
            <form onSubmit={handleSubmit} className="gov_style text-left">
  <table className="w-full border-collapse">
    <tbody>
      <tr>
        <td className="px-4 py-2 font-semibold">Buyer:</td>
        <td className="px-4 py-2">
          <textarea type="text" name="Buyer" onChange={handleChange} className="border-2 border-black w-full" />
        </td>
      </tr>
      <tr>
        <td className="px-4 py-2 font-semibold">Invoice:</td>
        <td className="px-4 py-2">
          <input type="text" name="invoice" onChange={handleChange} className="border-2 border-black w-full" />
        </td>
      </tr>
      <tr>
        <td className="px-4 py-2 font-semibold">Amount:</td>
        <td className="px-4 py-2">
          <input type="text" name="Amount" onChange={handleChange} className="border-2 border-black w-full" />
        </td>
      </tr>

      <tr>
        <td className="px-4 py-2 font-semibold">Exporter Name:</td>
        <td className="px-4 py-2">
          <input type="text" name="exporter_name" onChange={handleChange} className="border-2 border-black w-full" />
        </td>
      </tr>

      <tr>
        <td className="px-4 py-2 font-semibold">Date:</td>
        <td className="px-4 py-2">
          <input type="text" name="formatted_Date" onChange={handleChange} placeholder="YYYY-MM-DD" className="border-2 border-black w-full" />
        </td>
      </tr>
      
    </tbody>
  </table>
  <div className="mt-4">
    <Button type="primary" htmlType="submit" onClick={handleFormSubmit}>
      Submit
    </Button>
  </div>
</form>
        <Modal
        open={isInvoiceVisible}
        onCancel={() => setIsInvoiceVisible(false)}
        width="90%"
        footer={[
          <Button key="cancel" onClick={() => setIsInvoiceVisible(false)}>
            Cancel
          </Button>,
          // <Button key="download" type="primary" onClick={downloadPDF}>
          //   Download PDF
          // </Button>,
          <Button key="submit" type="primary" onClick={downloadInvoice}>
              Download Invoice
          </Button>,
          
        ]}
      >
        <div ref={previewInvoice}>
        <h1 className='text-center mb-[1%]'>Tax Invoice</h1>
        <div className="invoice">
        
      
      <div className="invoice-details">
        <table className="from">
          <tr>
            <td>
            <b>M/s Tranz Pak</b>
              <p>151 Road No.7A2, Police Office Road, St Thomas Mount, Chennai, Tamil Nadu - 600016</p>
              <p>Phone: 9556612847</p>
              <p>GSTIN/UIN: 33CUHPG6752B2ZP</p>
            </td>
          </tr>
        </table>
        <table className="to">
          <tr>
            <td>
              <h1><b>Buyer</b></h1>
              {formData.Buyer}
              
            </td>
          </tr>
        </table>
      </div>
      <div className="invoice-info">
      <div className="invoice-detail-container">
      <table className="invoice-detail-table">
        <tbody>
          <tr>
            <td className="detail-label">Invoice No.</td>
            <td className="detail-value">{formData.invoice}</td>
            <td className="detail-label">Dated</td>
            <td className="detail-value">{formattedDate}</td>
          </tr>
          <tr>
            <td className="detail-label">Delivery Note</td>
            <td className="detail-value"></td>
            <td className="detail-label">Mode/Terms of Payment</td>
            <td className="detail-value"></td>
          </tr>
          <tr>
            <td className="detail-label">Supplier's Ref.</td>
            <td className="detail-value"></td>
            <td className="detail-label">Other Reference(s)</td>
            <td className="detail-value"></td>
          </tr>
          <tr>
            <td className="detail-label">Buyer's Order No.</td>
            <td className="detail-value"></td>
            <td className="detail-label">Dated</td>
            <td className="detail-value"></td>
          </tr>
          <tr>
            <td className="detail-label">Despatch Document No.</td>
            <td className="detail-value"></td>
            <td className="detail-label">Delivery Note Date</td>
            <td className="detail-value"></td>
          </tr>
          <tr>
            <td className="detail-label">Despatched through</td>
            <td className="detail-value"></td>
            <td className="detail-label">Destination</td>
            <td className="detail-value"></td>
          </tr>
          <tr >
          <td className="detail-label">Terms of Delivery</td>
            <td className="detail-value" colSpan="6" rowSpan="4"></td>
          </tr>
        </tbody>
      </table>
      
    </div>
      </div>
      <table className="invoice-table">
        <thead>
          <tr>
            <th>Sl</th>
            <th>Particulars</th>
            <th>HSN/SAC</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>Fumigation Charges<br />Towards Bill for fumigation carried out for {formData.container_no} on: {prev_date}<br />Exporter Name: {formData.exporter_name}<br />INV. NO: {formData.invoice} DT: {formattedDate}<br />PORT: {formData.destination}<br />BY {formData.vessel}<br />{formData.quantity_declared}<br /></td>
            <td>998531</td>
            <td>{formData.Amount}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="3">CGST @ 9%</td>
            <td>{formData.cgst}</td>
          </tr>
          <tr>
            <td colSpan="3">SGST @ 9%</td>
            <td>{formData.sgst}</td>
          </tr>
          <tr>
            <td colSpan="3"><strong>Total</strong></td>
      
            <td><strong>{formData.total_amt}</strong></td>  
          </tr>

          <tr>
          
          <td colSpan="6" className='capitalize'>Amount Chargeable (in words) <b>INR {formData.total_amt_words} Only</b></td>

          </tr>

          
          
        </tfoot>

               
      </table>
      
      
      <div className="overflow-x-auto">
      <table className="min-w-full bg-white border-3 border-black">
        <thead>
          <tr>
            <th className="px-4 py-2 border border-black">HSN/SAC</th>
            <th className="px-4 py-2 border border-black">Taxable Value</th>
            <th className="px-4 py-2 border border-black">Central Tax Rate</th>
            <th className="px-4 py-2 border border-black">Central Tax Amount</th>
            <th className="px-4 py-2 border border-black">State Tax Rate</th>
            <th className="px-4 py-2 border border-black">State Tax Amount</th>
            <th className="px-4 py-2 border border-black">Total Tax Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="px-4 py-2 border border-black">998531</td>
            <td className="px-4 py-2 border border-black">{formData.Amount}</td>
            <td className="px-4 py-2 border border-black">9%</td>
            <td className="px-4 py-2 border border-black">{formData.cgst}</td>
            <td className="px-4 py-2 border border-black">9%</td>
            <td className="px-4 py-2 border border-black">{formData.sgst}</td>
            <td className="px-4 py-2 border border-black">{formData.Tax_value}</td>
          </tr>
          <tr>
            <td className="px-4 py-2 border border-black font-bold">Total</td>
            <td className="px-4 py-2 border border-black font-bold">{formData.Amount}</td>
            <td className="px-4 py-2 border border-black"></td>
            <td className="px-4 py-2 border border-black font-bold">{formData.cgst}</td>
            <td className="px-4 py-2 border border-black"></td>
            <td className="px-4 py-2 border border-black font-bold">{formData.sgst}</td>
            <td className="px-4 py-2 border border-black font-bold">{formData.Tax_value}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p className='text-left mt-[4%] capitalize'>Tax Amount (in words):<b>INR {formData.tax_no_words} Only</b> </p>
      <div className="invoice-footer flex flex-row space-x-[35%]">
      
        <div className='mt-[5%] text-left p-[2%]'>
            <p>Company's Service Tax No.: CQEPK3928BSD002</p>
            <p>Company's PAN: CQEPK3928B</p>
        </div>
        <div className='text-right'>
        <p>Company's Bank Details:</p>
        <p>Bank Name: Bank of Baroda</p>
        <p>A/c No.: 05204600000212</p>
        </div>
        
      </div>
    </div>
    <p className='text-center'>This is a Computer Generated Invoice</p>
        </div>
        
      </Modal>

        

        


        
      </div>
  );
};

export default InvoiceLayout;
