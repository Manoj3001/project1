import React, { useState, useRef } from "react";
import { Modal, Button } from 'antd';
import axios from "axios";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toWords } from 'number-to-words';
import '../components/style.css'

const MonthlyInvoice = () => {
    const [isInvoiceVisible, setIsInvoiceVisible] = useState(false);
    const [invoiceData, setInvoiceData] = useState([]);
    const [totAmount, setTotAmount] = useState(0);
    const previewInvoice = useRef(null);
    const today = new Date();
    const formattedDate = today.toLocaleDateString();
    
    const number = totAmount;
    const total_amt_words = toWords(number);

    const [formData, setFormData] = useState({
        search_name: '',
        start_date: '',
        end_date: '',
        invoice_no: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setIsInvoiceVisible(true);

        try {
            const res = await axios.post("http://localhost:5000/filterinvoice", {
                exp_name: formData.search_name,
                startDate: formData.start_date,
                endDate: formData.end_date,
            });

            if (res.status === 200) {
                setInvoiceData(res.data);
                const invoices = res.data;
                const total = invoices.reduce((acc, invoice) => parseFloat(acc) + parseFloat(invoice.amount), 0);
                setTotAmount(total);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const downloadInvoice = () => {
        console.log("Starting invoice generation..."); // Debugging log
    
        html2canvas(previewInvoice.current, {
            scale: 2,
            backgroundColor: null, // Removes background color
            ignoreElements: (element) => {
            // Optionally ignore specific elements (for example, those with a specific class)
            return element.classList.contains('no-print'); 
        }
        }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdfWidth = 210;
            const pdfHeight = 297;
            const paddingLeftRight = 10; 
            const paddingBottom = 10; // Padding at the bottom
            const paddingTop = 4; // No padding at the top
    
            // Debugging logs for canvas size
            console.log(`Canvas Width: ${canvas.width}`);
            console.log(`Canvas Height: ${canvas.height}`);
            
            // Calculate the scaling factor based on the content size
            const imgProps = canvas.width / canvas.height;
            const pdf = new jsPDF('p', 'mm', 'a4');
    
            let pdfHeightToUse = pdfHeight - paddingBottom; // Subtract bottom padding from height
            let pdfWidthToUse = pdfWidth - 2 * paddingLeftRight; // Subtract left and right padding from width
            
            const scaledHeight = pdfWidthToUse / imgProps;
            if (scaledHeight < pdfHeightToUse) {
                pdfHeightToUse = scaledHeight;
            } else {
                pdfWidthToUse = pdfHeightToUse * imgProps;
            }
    
            // Set x position with left-right padding, but y position starts at the top (no top padding)
            const xPosition = paddingLeftRight + (pdfWidth - pdfWidthToUse - 2 * paddingLeftRight) / 2;
            const yPosition = paddingTop; // Align content to the top
            
            console.log(`PDF Width: ${pdfWidthToUse}, PDF Height: ${pdfHeightToUse}`);
            console.log(`X Position: ${xPosition}, Y Position: ${yPosition}`); // Debugging log
            
            const fileName = `BulkInvoice_${formData.search_name || 'unknown'}.pdf`;
    
            // Add the image to the PDF at the calculated positions
            pdf.addImage(imgData, 'PNG', xPosition, yPosition, pdfWidthToUse, pdfHeightToUse);
            pdf.save(fileName);
            
            console.log("Invoice generated successfully!"); // Debugging log
    
            setTimeout(() => {
                window.location.reload();
            }, 500);
        }).catch(err => {
            console.error("Error generating invoice:", err); // Error handling
        });
    };
    
    
    

    return (
        <div className="flex justify-center p-5">
            <form onSubmit={handleFormSubmit} className="gov_style text-left">
                <table className="w-full border-collapse">
                    <tbody>
                        <tr>
                            <td className="px-4 py-2 font-semibold">Name to be searched:</td>
                            <td className="px-4 py-2">
                                <input type="text" name="search_name" onChange={handleChange} className="border-2 border-black w-full" />
                            </td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2 font-semibold">Invoice No:</td>
                            <td className="px-4 py-2">
                                <input type="text" name="invoice_no" onChange={handleChange} className="border-2 border-black w-full" />
                            </td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2 font-semibold">Start Date:</td>
                            <td className="px-4 py-2">
                                <input type="text" name="start_date" onChange={handleChange} placeholder="YYYY-MM-DD" className="border-2 border-black w-full" />
                            </td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2 font-semibold">End Date:</td>
                            <td className="px-4 py-2">
                                <input type="text" name="end_date" onChange={handleChange} placeholder="YYYY-MM-DD" className="border-2 border-black w-full" />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div className="mt-4">
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </div>
            </form>

            <Modal
                open={isInvoiceVisible}
                onCancel={() => setIsInvoiceVisible(false)}
                width="90%"
                height="100%"
                footer={[
                    <Button key="submit" type="primary" onClick={downloadInvoice}>
                        Download Invoice
                    </Button>,
                ]}
            >
                <div ref={previewInvoice}>
                    <div className="w-full">
                        <table className="w-full border border-1 border-b-0">
                            <tr>
                                <td className="text-left p-[3%]">
                                    <b>M/s Tranz Pak</b>
                                    <p>151 Road No.7A2, Police Office Road, St Thomas Mount, Chennai, Tamil Nadu - 600016</p>
                                    <p>Phone: 9556612847</p>
                                    <p>GSTIN/UIN: 33CUHPG6752B2ZP</p>
                                </td>
                            </tr>
                        </table>

                        <table className="w-full border border-b-0">
                            <tr className="flex justify-between p-4">
                                <td className="text-left">
                                    <b>To</b>
                                    <p className="uppercase">{formData.search_name}</p>
                                </td>
                                <td className="text-right">
                                    <p>Invoice No: {formData.invoice_no}</p>
                                    <p>Invoice Date: {formattedDate}</p>
                                </td>
                            </tr>
                        </table>

                        <table className="fixed-table w-full border-collapse border border-b-0 text-[8px]">
                            <thead>
                                <tr>
                                    <th className="border px-5 py-5">Invoice No</th>
                                    <th className="border px-5 py-5">Invoice Date</th>
                                    <th className="border px-5 py-5">Amount Rs.</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoiceData.length > 0 ? (
                                    invoiceData.map(invoice => (
                                        <tr key={invoice._id}>
                                            <td className="border px-5 py-5">{invoice.invoice_no}</td>
                                            <td className="border px-5 py-5">{invoice.invoice_date}</td>
                                            <td className="border px-5 py-5">{invoice.amount}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td className="border px-1 py-12" colSpan="3" style={{ textAlign: 'center' }}>No Records Found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        <table className="w-full border-collapse border-t-0 text-[8px]">
                            <tbody>
                                <tr>
                                    <td className="px-1 py-1 text-right border border-t-0 border-b-1 w-[80%]">Total Amount before Tax:</td>
                                    <td className="px-1 py-1 text-right border border-b-1 border-t-0">{totAmount}</td>
                                </tr>
                                <tr>
                                    <td className="px-1 py-1 text-right border border-b-1">RoundOff:</td>
                                    <td className="px-1 py-1 text-right border border-b-1">0.00</td>
                                </tr>
                                <tr>
                                    <td className="px-1 py-1 text-right font-bold border border-b-1">GRAND TOTAL:</td>
                                    <td className="px-1 py-1 text-right font-bold border border-b-1">{totAmount}</td>
                                </tr>
                            </tbody>
                        </table>

                        <table className="w-full border border-1 border-t-0 text-[8px]">
                            <tbody>
                                <tr>
                                    <td className="px-1 py-1 text-left uppercase">Rupee (in words):</td>
                                    <td className="px-1 py-1 text-left uppercase font-bold">{total_amt_words}</td>
                                </tr>
                                <tr>
                                    <td className="px-1 py-1 text-right" colSpan="2">Authorized Signatory</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default MonthlyInvoice;
