import React, { useState } from 'react';
import { PDFDocument,StandardFonts } from 'pdf-lib';
import { saveAs } from 'file-saver';
import { Modal, Button } from 'antd'; // Import Modal and Button from Ant Design
import samplePdf from '../assets/govcertificate.pdf';

const CertificateComp = () => {
  // State to hold form input values
  const [formData, setFormData] = useState({
    tnfnumber: '',
    Des_Goods: '',
    Quantity_Declared: '',
    invoice: '',
    exporter_address: '',
    port: '',
    destination: '',
    link: '',
    consignee_address: '',
    container_no: '',
    vessel: '',
    name_fumigant: '',
    place: '',
    duration: '',
    temp: '',
    Distinguish_Marks: '',
    performed_under: '',
    Dosage:'',
  });

  const today = new Date();
  const previousDate = new Date(today);
  previousDate.setDate(today.getDate() - 1);
  const formattedDate = today.toLocaleDateString();
  const prev_date = previousDate.toLocaleDateString();
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState(null);

  // State for modal visibility
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const fillPdf = async () => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]); // A4 size in points
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Define form field positions and sizes
    page.drawText(formData.tnfnumber, { x: 150, y: 659, size: 8, font: boldFont });
    page.drawText(formattedDate, { x: 420, y: 657, size: 8, font: boldFont });
    page.drawText(formData.destination, { x: 250, y: 618, size: 12, font: boldFont });
    page.drawText(formData.Des_Goods, { x: 150, y: 584, size: 8, font: boldFont });
    page.drawText(formData.Quantity_Declared, { x: 432, y: 584, size: 8, font: boldFont });
    page.drawText(formData.invoice, { x: 100, y: 569, size: 8, font: boldFont });
    page.drawText(formData.exporter_address, { x: 130, y: 482, size: 8, font: boldFont });
    page.drawText(formData.port, { x: 150, y: 533, size: 8, font: boldFont });
    page.drawText(formData.destination, { x: 150, y: 516, size: 8, font: boldFont });
    page.drawText(formData.link, { x: 425, y: 552, size: 8, font: boldFont });
    page.drawText(formData.consignee_address, { x: 450, y: 517, size: 8, font: boldFont });
    page.drawText(formData.container_no, { x: 425, y: 533, size: 8, font: boldFont });
    page.drawText(formData.vessel, { x: 470, y: 446, size: 8, font: boldFont });
    page.drawText(formData.name_fumigant, { x: 113, y: 411, size: 8, font: boldFont });
    page.drawText(prev_date, { x: 273, y: 411, size: 8, font: boldFont });
    page.drawText(formData.place, { x: 440, y: 411, size: 8, font: boldFont });
    page.drawText(formData.Dosage + "gms/m3", { x: 140, y: 394, size: 8, font: boldFont });
    page.drawText(formData.duration + "hrs", { x: 290, y: 394, size: 8, font: boldFont });
    page.drawText(formData.temp + "°C", { x: 435, y: 394, size: 8, font: boldFont });
    page.drawText(formData.Distinguish_Marks, { x: 120, y: 550, size: 8, font: boldFont });
    page.drawText(formData.performed_under, { x: 160, y: 377, size: 8, font: boldFont });
    page.drawText("NIL", { x: 110, y: 67, size: 8, font: boldFont });
    page.drawText("CHENNAI," + formattedDate, { x: 110, y: 48, size: 8, font: boldFont });

    // Serialize the PDFDocument to bytes
    const pdfBytes = await pdfDoc.save();

    // Generate a Blob URL to preview the PDF in an iframe
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    setPdfPreviewUrl(url);

    // Show modal with PDF preview
    setIsModalVisible(true);
};

// Adjusted download function
const downloadPdf = () => {
    if (pdfPreviewUrl) {
        const link = document.createElement('a');
        link.href = pdfPreviewUrl;
        link.download = 'filled-fumigation-certificate.pdf';
        link.click();
        
        // Close the modal after downloading
        // handleCancel();
    }
};

  return (
    <div>
      <table className="w-full border-collapse">
        <tbody>
          {/* Map through form fields to reduce repetition */}
          {Object.entries(formData).map(([key, value]) => (
            <tr key={key}>
              <td className="px-4 py-2 font-semibold">{key.replace(/_/g, ' ')}:</td>
              <td className="px-4 py-2">
                {key === 'exporter_address' || key === 'consignee_address' ? (
                  <textarea
                    name={key}
                    onChange={handleChange}
                    className="border-2 border-black w-full"
                  />
                ) : (
                  <input
                    type="text"
                    name={key}
                    value={value}
                    onChange={handleChange}
                    className="border-2 border-black w-full"
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Button type="primary" onClick={fillPdf}>
        Preview PDF
      </Button>

      {/* PDF Preview Modal */}
      <Modal
        title="PDF Preview"
        visible={isModalVisible}
        // onCancel={handleCancel}
        footer={[
          <Button key="download" onClick={downloadPdf}>
            Download PDF
          </Button>,
          // <Button key="cancel" onClick={handleCancel}>
          //   Close
          // </Button>,
        ]}
        width={800}
      >
        {pdfPreviewUrl && (
          <iframe
            src={pdfPreviewUrl}
            title="PDF Preview"
            width="100%"
            height="500px"
          ></iframe>
        )}
      </Modal>
    </div>
  );
};

export default CertificateComp;
