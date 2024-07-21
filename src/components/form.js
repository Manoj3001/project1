import React, { useRef, useState } from 'react';
import { Modal, Button, Checkbox } from 'antd';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import moment from 'moment';
import ippc from '../assets/logo.png'
import header from '../assets/Header.png'
import signature from '../assets/signature.png'


const temperatures = [];
for (let i = 20; i <= 40; i++) {
  temperatures.push(i);
}

const today = new Date();
const previousDate = new Date(today);
previousDate.setDate(today.getDate() - 1);
const formattedDate = today.toLocaleDateString();
const prev_date= previousDate.toLocaleDateString();

const FormLayout = () => {
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [formData, setFormData] = useState({});
  const previewRef = useRef(null);
  const [hideSignature, setHideSignature] = useState(false);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setIsPreviewVisible(true);
  };

  const downloadPDF = () => {
    const formInputs = document.querySelectorAll('input, select, textarea, button');
    formInputs.forEach(input => {
      input.style.display = 'none';
    });
  
    setTimeout(() => {
      html2canvas(previewRef.current, {
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
        const fileName = `fumigationcertificate_${formData.tnfnumber || 'unknown'}.pdf`;
  
        
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
    
    <div className="flex justify-center items-center min-h-screen bg-gray-100 font-bold">
      <div className="p-5 bg-white shadow-md rounded-lg">
        <p className="text-2xl font-semibold text-center">FUMIGATION CERTIFICATE</p>
        <div className="flex justify-end items-center text-right">
        <label className="mb-0">
              <b>Date of Issue:{formattedDate}</b>
              <div className="mt-4 font-bold">
                <Checkbox onChange={(e) => setHideSignature(e.target.checked)}>
                  Hide Signature
                </Checkbox>
              </div>
        </label>
        </div>

        <form onSubmit={handleFormSubmit} className="mt-4">
          <table className="border-2 border-black w-full">
            <tbody>
              <tr>
                <td className="p-2 text-left">
                  <p className="font-bold text-sm">Dte PPQS Registration No. 1033/MB DT: 05-07-2024</p>
                  <p className="text-sm">
                    Treatment Certificate No. <b className="text-lg">TNF <input className='border-2 rounded-md border-black w-[6%] h-[6%]' 
                    type="text"
                    name="tnfnumber"
                    onChange={handleInputChange}></input> / <input className='border-2 rounded-md border-black w-[6%] h-[6%]' 
                    type="text"
                    name="year"
                    onChange={handleInputChange}/></b>
                  </p>
                  <p className="text-sm w-full">
                    This is to certify that the goods described below were treated in accordance with the fumigation
                    treatment requirement of importing country(USA) and declared that the consignment has been verified
                    free off impervious surfaces/layers such as plastic wrapping or laminated plastic films, lacquered
                    or painted surfaces, aluminum foil, tarred or waxed paper, etc. that may adversely affect the
                    penetration of the fumigant, prior to fumigation.
                  </p>
                </td>
              </tr>
              <tr className="border-t-2 border-b-2 border-black">
                <td className="p-2 text-left">
                  <p className="font-bold flex justify-start ml-1">Details of Treatment</p>
                </td>
              </tr>
              <tr className="m-6">
                <td className="p-2 text-left">
                <table className="p-2 text-left text-1xs leading-8 flex flex-row space-x-8">
                  <div className=''>
                    <tr>
                      <td>Name of fumigant:</td>
                      <td><b>METHYL BROMIDE</b></td>
                    </tr>
                    <tr>
                      <td>Place of fumigant:</td>
                      <td><b>CHENNAI</b></td>
                    </tr>
                    <tr>
                      <td>Duration of fumigant (hours):</td>
                      <td><b>24 HOURS</b></td>
                    </tr>
                    <tr>
                      <td>Fumigation performed under gastight sheets:</td>
                      <td><b>YES</b></td>
                    </tr>
                    </div>

                    <div>
                    <tr className=''>
                      <td>Date of fumigation:</td>
                      <td><b>{prev_date}</b></td>
                    </tr>
                    <tr>
                      <td>Dosage of fumigant:</td>
                      <td>
                        <select name="dosage" onChange={handleInputChange} className="ml-2 border-2 border-black rounded-md">
                          <option value="12gm/m3">12gm/m3</option>
                          <option value="24gm/m3">24gm/m3</option>
                          <option value="32gm/m3">32gm/m3</option>
                          <option value="48gm/m3">48gm/m3</option>
                          <option value="60gm/m3">60gm/m3</option>
                          <option value="72gm/m3">72gm/m3</option>
                          <option value="84gm/m3">84gm/m3</option>
                          <option value="96gm/m3">96gm/m3</option>
                        </select>
                      </td>
                    </tr>
                    <tr>
                      <td>Average ambient temperature during fumigation:</td>
                      <td>
                        <select name="temperature" onChange={handleInputChange} className="ml-2 border-2 border-black rounded-md">
                          {temperatures.map((temp) => (
                            <option key={temp} value={temp}>
                              {temp} °C
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                    </div>
              </table>

                </td>
              </tr>
              <tr className="border-t-2 border-black">
                <td className="p-2 text-left">
                  <p className="font-bold flex justify-start ml-1">Description of Goods</p>
                </td>
              </tr>
              <tr className="border-t-2 border-black">
                <td className="p-2 text-left">
                  <div className="m-3">
                    <table className="w-full">
                      <tbody>
                        <tr>
                          <td className="p-2 text-left">
                            <label className="block mb-1">Name of Exporter:</label>
                            <input
                              type="text"
                              name="exporterName"
                              onChange={handleInputChange}
                              className="border border-black rounded-md p-1 w-full"
                            />
                          </td>

                          <td className="p-2 text-left">
                            <label className="block mb-1">Address of Exporter:</label>
                            <input
                              type="text"
                              name="exporterAddress"
                              onChange={handleInputChange}
                              className="border border-black rounded-md p-1 w-full"
                            />
                          </td>
                          <td className="p-2 text-left">
                            <label className="block mb-1">Exporter Invoice:</label>
                            <input
                              type="text"
                              name="exporterInvoice"
                              onChange={handleInputChange}
                              className="border border-black rounded-md p-1 w-full"
                            />
                          </td>
                        </tr>
                        <tr>
                          <td className="p-2 text-left">
                            <label className="block mb-1">Name Consignee:</label>
                            <input
                              type="text"
                              name="consigneeName"
                              onChange={handleInputChange}
                              className="border border-black rounded-md p-1 w-full"
                            />
                          </td>

                          <td className="p-2 text-left">
                            <label className="block mb-1">Address of Consignee:</label>
                            <input
                              type="text"
                              name="consigneeAddress"
                              onChange={handleInputChange}
                              className="border border-black rounded-md p-1 w-full"
                            />
                          </td>
                          <td className="p-2 text-left">
                            <label className="block mb-1">Type and Description of Cargo:</label>
                            <input
                              type="text"
                              name="cargoDescription"
                              onChange={handleInputChange}
                              className="border border-black rounded-md p-1 w-full"
                            />
                          </td>
                        </tr>
                        <tr>
                          <td className="p-2 text-left">
                            <label className="block mb-1">Quantity (MT5) / No of Packages:</label>
                            <input
                              type="text"
                              name="quantityPackages"
                              onChange={handleInputChange}
                              className="border border-black rounded-md p-1 w-full"
                            />
                          </td>
                          <td className="p-2 text-left">
                            <label className="block mb-1">Description of Packing Material:</label>
                            <input
                              type="text"
                              name="packingMaterialDescription"
                              onChange={handleInputChange}
                              className="border border-black rounded-md p-1 w-full"
                            />
                          </td>
                        </tr>
                        <tr>
                          <td className="p-2 text-left">
                            <label className="block mb-1">Shipping Mark or Brand:</label>
                            <input
                              type="text"
                              name="shippingMarkBrand"
                              onChange={handleInputChange}
                              className="border border-black rounded-md p-1 w-full"
                            />
                          </td>
                          <td className="p-2 text-left">
                            <label className="block mb-1">Port of Loading:</label>
                            
                            <b>CHENNAI/INDIA</b>
                          </td>
                        </tr>
                        <tr>
                          <td className="p-2 text-left">
                            <label className="block mb-1">Port of Discharge:</label>
                            <input
                              type="text"
                              name="portOfDischarge"
                              onChange={handleInputChange}
                              className="border border-black rounded-md p-1 w-full"
                            />
                          </td>
                          <td className="p-2 text-left">
                            <label className="block mb-1">Vessel Name:</label>
                            <input
                              type="text"
                              name="vesselName"
                              onChange={handleInputChange}
                              className="border border-black rounded-md p-1 w-full"
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </td>
              </tr>
              <tr className="border-t-2 border-black">
                <td className="font-bold flex justify-start p-2 text-left">Additional Declaration</td>
              </tr>
              <tr className="border-t-2 border-black">
                <td className='text-left p-5'>I declare that the details are true & correct and the fumigation has been carried out in accordance with NSPM-12  </td>
              </tr>
              
              <tr className="border-t-2 border-black">
              <td className='text-left p-5'>
                  <div className=''>
                      <div className='flex justify-between'>
                          <p className=''><b>CHENNAI & {formattedDate}    <br/><b>TAMILNADU</b></b>
                          <div className='ml-[10%] '>
                              <img src={ippc} width="120" className='mt-[40%]'></img>
                              <p className='text-2xs w-[100%]'>FUMIGATED AS PER ISPM 13 STANDARDS"</p>
                          </div>
                          </p>
                          
                          <div className='text-left'>
                            {!hideSignature && <div>
                              <img src={signature} width="100" className='ml-[30%]'></img>
                              <p className='text-1xs text-center'>Signature</p>
                            </div>}
                              <strong>Mr. S. Ajithkumar</strong><br/>
                              <strong>(Accreditation No. 1033010724)</strong><br/>
                              <strong>M/s. Tranz Fumigation</strong>
                              <p>No.7/45 G, Ground Floor,</p>
                              <p>Police Office Road,</p>
                              <p>St. Thomas Mount,</p>
                              <p>Chennai-600016(T.N)</p>
                              <p>Email: tranzfumigation@gmail.com</p>
                              <p>Mob. 9791131047</p>
                          </div>
                      </div>
                      <br />
                  
                      
                  </div>
              </td>
              </tr>

              <tr className='text-left flex justify-end'>
                <td>
                <div className=''>
                  <p>Name of the Accredited Fumigation Operator: <strong>Mr. S. Ajithkumar</strong></p>
                  <p>DPPQS Accreditation No: <strong>1033/MB DT: 05-07-2024</strong></p>
                </div>
                </td>
              </tr>
            </tbody>
          </table>
          <p className='text-xs'>Neither the certifying company nor its representative bears any financial liability concerning this certificate.</p>
        </form>
        
        <Button type="primary" htmlType="submit" className="mt-4" onClick={handleFormSubmit}>
          Submit
        </Button>

        
        <Modal
          visible={isPreviewVisible}
          onCancel={() => setIsPreviewVisible(false)}
          width="90%"
          footer={[
            <Button key="submit" type="primary" onClick={downloadPDF}>
              Download PDF
            </Button>,
          ]}
        >
          <div ref={previewRef} className="font-bold">
            <div>
              <img src={header} className="w-[100%]"></img>
            </div>
            <h1 className="text-xl text-center">FUMIGATION CERTIFICATE</h1>
            <div className="flex justify-end items-center mr-[6%]">
              <p>Date of Issue: <b>{formattedDate}</b></p>
            </div>
            <table className="border-2 border-black m-[3%] mb-[0%]">
              <tbody>
                <tr className="grid justify-items-start ml-3">
                  <td className="p-2 text-left">
                    <p className="font-bold text-1xs">Dte PPQS Registration No. 303/MB DT: 17-03-2009</p>
                    <p className="text-1xs">
                      Treatment Certificate No. <b className="text-lg">JUNNEX{formData.tnfnumber}/{formData.year}</b>
                    </p>
                    <p className="text-1xs w-full">
                      This is to certify that the goods described below were treated in accordance with the fumigation
                      treatment requirement of importing country(USA) and declared that the consignment has been verified
                      free off impervious surfaces/layers such as plastic wrapping or laminated plastic films, lacquered
                      or painted surfaces, aluminum foil, tarred or waxed paper, etc. that may adversely affect the
                      penetration of the fumigant, prior to fumigation.
                    </p>
                  </td>
                </tr>
                <tr className="border-t-2 border-b-2 border-black w-full">
                  <td className="p-2 text-left">
                    <p className="font-bold flex justify-start ml-1">Details of Treatment</p>
                  </td>
                </tr>
                <tr className="m-6">
                  <td className="p-2 text-left">
                  <table className="p-2 text-left text-1xs leading-8 flex flex-row space-x-8">
                  <div className=''>
                    <tr>
                      <td>Name of fumigant:</td>
                      <td><b>METHYL BROMIDE</b></td>
                    </tr>
                    <tr>
                      <td>Place of fumigant:</td>
                      <td><b>CHENNAI</b></td>
                    </tr>
                    <tr>
                      <td>Duration of fumigant (hours):</td>
                      <td><b>24 HOURS</b></td>
                    </tr>
                    <tr>
                      <td>Fumigation performed under gastight sheets:</td>
                      <td><b>YES</b></td>
                    </tr>
                    </div>

                    <div>
                    <tr className=''>
                      <td>Date of fumigation:</td>
                      <td><b>{prev_date}</b></td>
                    </tr>
                    <tr>
                      <td>Dosage of fumigant:</td>
                      <td>
                      <b>{formData.dosage}</b>
                      </td>
                    </tr>
                    <tr>
                      <td>Average ambient temperature during fumigation:</td>
                      <td>
                      <b>{formData.temperature}°C</b>
                      </td>
                    </tr>
                    </div>
              </table>

                  </td>
                </tr>
                <tr className="border-t-2 border-black">
                  <td className="p-2 text-left">
                    <p className="font-bold flex justify-start ml-1">Description of Goods</p>
                  </td>
                </tr>
                <tr className="border-t-2 border-black w-full">
                <table className="p-2 text-left text-1xs leading-8">
                  <tr>
                    <td>Name of Exporter:</td>
                    <td className='text-left'><b>{formData.exporterName}</b></td>
                  </tr>

                  <tr>
                    <td>Address of Exporter:</td>
                    <td className='text-left'><b>{formData.exporterAddress}</b></td>
                  </tr>
                  
                  <tr>
                    <td>Exporter Invoice No:</td>
                    <td className='text-left'><b>{formData.exporterInvoice}</b></td>
                  </tr>
                  <tr>
                    <td>Name of Consignee:</td>
                    <td className='text-left'><b>{formData.consigneeName}</b></td>
                  </tr>

                  <tr>
                    <td>Address of Consignee:</td>
                    <td className='text-left'><b>{formData.consigneeAddress}</b></td>
                  </tr>
                  <tr>
                    <td>Type and Description of Cargo:</td>
                    <td className='text-left'><b>{formData.cargoDescription}</b></td>
                  </tr>
                  <tr>
                    <td>Quantity (MTs) / No of Packages:</td>
                    <td className='text-left'><b>{formData.quantityPackages}</b></td>
                  </tr>
                  <tr>
                    <td>Description of Packaging Material:</td>
                    <td className='text-left'><b>{formData.packingMaterialDescription}</b></td>
                  </tr>
                  <tr>
                    <td>Shipping Mark or Brand:</td>
                    <td className='text-left'><b>{formData.shippingMarkBrand}</b></td>
                  </tr>
                  <tr>
                    <td>Port of Loading:</td>
                    <td className='text-left'><b>CHENNAI / INDIA</b></td>
                  </tr>
                  <tr>
                    <td>Port of Discharge:</td>
                    <td className='text-left'><b>{formData.portOfDischarge}</b></td>
                  </tr>
                  <tr>
                    <td>Vessel Name:</td>
                    <td className='text-left'><b>{formData.vesselName}</b></td>
                  </tr>
                </table>
                </tr>
                <tr className="border-t-2 border-black">
                <td className="font-bold flex justify-start p-2 text-left">Additional Declaration</td>
              </tr>
              <tr className="border-t-2 border-black">
                <td className='text-left p-5'>I declare that the details are true & correct and the fumigation has been carried out in accordance with NSPM-12  </td>
              </tr>

              <tr className="border-t-2 border-black">
              <td className='text-left p-5'>
                  <div className=''>
                      <div className='flex justify-between'>
                          <p className=''><b>CHENNAI & {formattedDate}    <br/><b>TAMILNADU</b></b>
                          <div className='ml-[10%] '>
                              <img src={ippc} width="120" className='mt-[40%]'></img>
                              <p className='text-3xs w-[100%]'>FUMIGATED AS PER ISPM 13 STANDARDS"</p>
                          </div>
                          </p>
                          
                          <div className='text-left text-1xs'>
                          {!hideSignature && <div>
                              <img src={signature} width="100" className='ml-[30%]'></img>
                              <p className='text-1xs text-center'>Signature</p>
                            </div>}
                              <strong>Mr. S. Ajithkumar</strong><br/>
                              <strong>(Accreditation No. 1033010724)</strong><br/>
                              <strong>M/s. Tranz Fumigation</strong>
                              <p>No.7/45 G, Ground Floor,</p>
                              <p>Police Office Road,</p>
                              <p>St. Thomas Mount,</p>
                              <p>Chennai-600016(T.N)</p>
                              <p>Email: tranzfumigation@gmail.com</p>
                              <p>Mob. 9791131047</p>
                          </div>

                          
                      </div>
                      <br />
                  </div>
              </td>
              </tr>
              <tr className='text-left flex justify-end pr-2' >
                <td>
                <div className='text-1xs mb-[2%]'>
                  <p>Name of the Accredited Fumigation Operator: <strong>Mr. S. Ajithkumar</strong></p>
                  <p>DPPQS Accreditation No: <strong>1033/MB DT: 05-07-2024</strong></p>
                </div>
                </td>
              </tr>
              </tbody>
            </table>
            <p className='text-1xs text-center p-2'>Neither the certifying company nor its representative bears any financial liability concerning this certificate.</p>
          </div>
          
        </Modal>        
      </div>
    </div>
  );
};

export default FormLayout;
