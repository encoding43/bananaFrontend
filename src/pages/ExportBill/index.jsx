import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const ExportBill = () => {
  const invoiceRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => invoiceRef.current,
  });

  const handleDownloadPDF = async () => {
    const element = invoiceRef.current;
    const canvas = await html2canvas(element, { scale: 2 });
    const data = canvas.toDataURL('image/png');

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const imgProperties = pdf.getImageProperties(data);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

    pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('commercial_invoice.pdf');
  };

  // Sample data for the invoice
  const sampleData = {
    exporterInfo:
      'Global Export Solutions Inc.\n123 Export Avenue\nSeattle, WA 98101\nUnited States\nTax ID: EX-12345678',
    invoiceNumber: 'INV-2025-0037',
    invoiceDate: '01 Mar 2025',
    billOfLading: 'BOL-3472956',
    reference: 'PO-78965',
    buyerReference: 'BYR-REF-2025-114',
    consignee:
      'Pacific Import Company\n456 Harbor Street\nTokyo, 100-0001\nJapan\nContact: Akira Tanaka\nTel: +81 3-1234-5678',
    buyer:
      'Pacific Import Company\n456 Harbor Street\nTokyo, 100-0001\nJapan\nContact: Akira Tanaka\nTel: +81 3-1234-5678',
    methodOfDispatch: 'Sea Freight',
    typeOfShipment: 'FCL',
    countryOfOrigin: 'United States',
    finalDestination: 'Japan',
    vessel: 'Pacific Voyager',
    voyageNo: 'VO-578923',
    portOfLoading: 'Seattle, USA',
    dateOfDeparture: '03 Mar 2025',
    termsOfPayment: '30 days from invoice date, Wire Transfer',
    portOfDischarge: 'Tokyo, Japan',
    finalDestinationCity: 'Tokyo, Japan',
    marineCoverPolicy: 'MCP-9876543',
    letterOfCredit: 'LC-2025-56789',
    items: [
      {
        code: 'EL-5001',
        description: 'High-Performance Laptop Computers',
        hsCode: '8471.30.00',
        quantity: 50,
        unitType: 'Units',
        price: 1200.0,
        amount: 60000.0,
      },
      {
        code: 'EL-5002',
        description: 'Wireless Noise-Cancelling Headphones',
        hsCode: '8518.30.20',
        quantity: 100,
        unitType: 'Units',
        price: 180.0,
        amount: 18000.0,
      },
      {
        code: 'EL-5003',
        description: 'Smartphone, 256GB Storage',
        hsCode: '8517.12.00',
        quantity: 75,
        unitType: 'Units',
        price: 650.0,
        amount: 48750.0,
      },
      {
        code: 'EL-5004',
        description: 'Portable Power Banks, 20000mAh',
        hsCode: '8507.60.00',
        quantity: 120,
        unitType: 'Units',
        price: 45.0,
        amount: 5400.0,
      },
      {
        code: 'EL-5005',
        description: 'Wireless Bluetooth Speakers',
        hsCode: '8518.22.00',
        quantity: 60,
        unitType: 'Units',
        price: 85.0,
        amount: 5100.0,
      },
    ],
    totalThisPage: 137250.0,
    consignmentTotal: 137250.0,
    additionalInfo:
      'All items are new and in original packaging. Goods manufactured in compliance with international standards. Warranty included as per manufacturer terms and conditions.',
    bankDetails:
      'Bank: International Commerce Bank\nAccount Name: Global Export Solutions Inc.\nAccount Number: 1234567890\nIBAN: US12 3456 7890 1234 5678 90\nSwift/BIC: INTCMUS12345',
    total: 137250.0,
    incoterms: 'FOB Seattle',
    currency: 'USD',
    signatoryCompany: 'Global Export Solutions Inc.',
    authorizedName: 'Emily Johnson, Export Manager',
  };

  // Common styles
  const fieldLabelStyle = {
    fontSize: '8pt',
    fontWeight: 'bold',
    marginBottom: '0.05cm',
    fontFamily: 'Arial, sans-serif',
  };

  const fieldBoxStyle = {
    border: '1px solid #000',
    height: '0.6cm',
    marginBottom: '0.15cm',
    padding: '0.1cm',
    fontSize: '8pt',
    fontFamily: 'Arial, sans-serif',
    display: 'flex',
    alignItems: 'center',
  };

  const multilineFieldStyle = {
    ...fieldBoxStyle,
    height: 'auto',
    padding: '0.1cm',
    fontSize: '8pt',
    fontFamily: 'Arial, sans-serif',
    whiteSpace: 'pre-line',
  };

  return (
    <div className="flex flex-col items-center w-full mx-auto p-0">
      <div
        ref={invoiceRef}
        className="bg-white"
        style={{
          width: '21cm',
          minHeight: '29.7cm',
          padding: '1cm',
          boxSizing: 'border-box',
          border: '1px solid #000',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        {/* Header */}
        <div
          style={{
            fontSize: '18pt',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '0.5cm',
            borderBottom: '1px solid #000',
            paddingBottom: '0.2cm',
            fontFamily: 'Arial, sans-serif',
          }}
        >
          COMMERCIAL INVOICE
        </div>

        {/* First row */}
        <div style={{ display: 'flex', marginBottom: '0.4cm' }}>
          <div style={{ width: '50%', paddingRight: '0.25cm' }}>
            <div style={fieldLabelStyle}>Exporter</div>
            <div style={{ ...multilineFieldStyle, height: '3cm' }}>
              {sampleData.exporterInfo}
            </div>
          </div>
          <div style={{ width: '50%', paddingLeft: '0.25cm' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '8pt',
                marginBottom: '0.05cm',
              }}
            >
              <div style={{ fontWeight: 'bold' }}>Pages</div>
              <div>1 of 1</div>
            </div>

            <div style={{ ...fieldLabelStyle, marginTop: '0.2cm' }}>
              Invoice Number & Date
            </div>
            <div
              style={{
                ...fieldBoxStyle,
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <span>{sampleData.invoiceNumber}</span>
              <span>{sampleData.invoiceDate}</span>
            </div>

            <div style={fieldLabelStyle}>Bill of Lading Number</div>
            <div style={fieldBoxStyle}>{sampleData.billOfLading}</div>

            <div style={fieldLabelStyle}>Reference</div>
            <div style={fieldBoxStyle}>{sampleData.reference}</div>

            <div style={fieldLabelStyle}>Buyer Reference</div>
            <div style={fieldBoxStyle}>{sampleData.buyerReference}</div>
          </div>
        </div>

        {/* Second row */}
        <div style={{ display: 'flex', marginBottom: '0.4cm' }}>
          <div style={{ width: '50%', paddingRight: '0.25cm' }}>
            <div style={fieldLabelStyle}>Consignee</div>
            <div style={{ ...multilineFieldStyle, height: '3cm' }}>
              {sampleData.consignee}
            </div>
          </div>
          <div style={{ width: '50%', paddingLeft: '0.25cm' }}>
            <div style={fieldLabelStyle}>Buyer (If not Consignee)</div>
            <div style={{ ...multilineFieldStyle, height: '3cm' }}>
              {sampleData.buyer}
            </div>
          </div>
        </div>

        {/* Third row */}
        <div style={{ display: 'flex', marginBottom: '0.4cm' }}>
          <div style={{ width: '25%', paddingRight: '0.1cm' }}>
            <div style={fieldLabelStyle}>Method of Dispatch</div>
            <div style={fieldBoxStyle}>{sampleData.methodOfDispatch}</div>
          </div>
          <div
            style={{
              width: '25%',
              paddingLeft: '0.1cm',
              paddingRight: '0.1cm',
            }}
          >
            <div style={fieldLabelStyle}>Type of Shipment</div>
            <div style={fieldBoxStyle}>{sampleData.typeOfShipment}</div>
          </div>
          <div
            style={{
              width: '25%',
              paddingLeft: '0.1cm',
              paddingRight: '0.1cm',
            }}
          >
            <div style={fieldLabelStyle}>Country Of Origin of Goods</div>
            <div style={fieldBoxStyle}>{sampleData.countryOfOrigin}</div>
          </div>
          <div style={{ width: '25%', paddingLeft: '0.1cm' }}>
            <div style={fieldLabelStyle}>Country of Final Destination</div>
            <div style={fieldBoxStyle}>{sampleData.finalDestination}</div>
          </div>
        </div>

        {/* Fourth row */}
        <div style={{ display: 'flex', marginBottom: '0.4cm' }}>
          <div style={{ width: '50%', paddingRight: '0.25cm' }}>
            <div style={fieldLabelStyle}>Vessel / Aircraft</div>
            <div style={fieldBoxStyle}>{sampleData.vessel}</div>
          </div>
          <div style={{ width: '50%', paddingLeft: '0.25cm' }}>
            <div style={fieldLabelStyle}>Voyage No</div>
            <div style={fieldBoxStyle}>{sampleData.voyageNo}</div>
          </div>
        </div>

        {/* Fifth row */}
        <div style={{ display: 'flex', marginBottom: '0.4cm' }}>
          <div style={{ width: '50%', paddingRight: '0.25cm' }}>
            <div style={fieldLabelStyle}>Port of Loading</div>
            <div style={fieldBoxStyle}>{sampleData.portOfLoading}</div>
          </div>
          <div style={{ width: '50%', paddingLeft: '0.25cm' }}>
            <div style={fieldLabelStyle}>Date of Departure</div>
            <div style={fieldBoxStyle}>{sampleData.dateOfDeparture}</div>
          </div>
        </div>

        {/* Sixth row */}
        <div style={{ marginBottom: '0.4cm' }}>
          <div style={fieldLabelStyle}>Terms / Method of Payment</div>
          <div style={fieldBoxStyle}>{sampleData.termsOfPayment}</div>
        </div>

        {/* Seventh row */}
        <div style={{ display: 'flex', marginBottom: '0.4cm' }}>
          <div style={{ width: '33.33%', paddingRight: '0.15cm' }}>
            <div style={fieldLabelStyle}>Port of Discharge</div>
            <div style={fieldBoxStyle}>{sampleData.portOfDischarge}</div>
          </div>
          <div
            style={{
              width: '33.33%',
              paddingLeft: '0.15cm',
              paddingRight: '0.15cm',
            }}
          >
            <div style={fieldLabelStyle}>Final Destination</div>
            <div style={fieldBoxStyle}>{sampleData.finalDestinationCity}</div>
          </div>
          <div style={{ width: '33.33%', paddingLeft: '0.15cm' }}>
            <div style={fieldLabelStyle}>Marine Cover Policy No</div>
            <div style={fieldBoxStyle}>{sampleData.marineCoverPolicy}</div>
          </div>
        </div>

        {/* Eighth row */}
        <div style={{ marginBottom: '0.4cm' }}>
          <div style={fieldLabelStyle}>Letter Of Credit No</div>
          <div style={fieldBoxStyle}>{sampleData.letterOfCredit}</div>
        </div>

        {/* Table */}
        <div style={{ marginBottom: '0.4cm' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '8pt',
              fontFamily: 'Arial, sans-serif',
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    border: '1px solid #000',
                    padding: '0.1cm',
                    textAlign: 'left',
                    fontWeight: 'bold',
                    height: '0.6cm',
                  }}
                >
                  Product Code
                </th>
                <th
                  style={{
                    border: '1px solid #000',
                    padding: '0.1cm',
                    textAlign: 'left',
                    fontWeight: 'bold',
                    height: '0.6cm',
                    width: '25%',
                  }}
                >
                  Description of Goods
                </th>
                <th
                  style={{
                    border: '1px solid #000',
                    padding: '0.1cm',
                    textAlign: 'left',
                    fontWeight: 'bold',
                    height: '0.6cm',
                  }}
                >
                  HS Code
                </th>
                <th
                  style={{
                    border: '1px solid #000',
                    padding: '0.1cm',
                    textAlign: 'left',
                    fontWeight: 'bold',
                    height: '0.6cm',
                  }}
                >
                  Unit Quantity
                </th>
                <th
                  style={{
                    border: '1px solid #000',
                    padding: '0.1cm',
                    textAlign: 'left',
                    fontWeight: 'bold',
                    height: '0.6cm',
                  }}
                >
                  Unit Type
                </th>
                <th
                  style={{
                    border: '1px solid #000',
                    padding: '0.1cm',
                    textAlign: 'right',
                    fontWeight: 'bold',
                    height: '0.6cm',
                  }}
                >
                  Price
                </th>
                <th
                  style={{
                    border: '1px solid #000',
                    padding: '0.1cm',
                    textAlign: 'right',
                    fontWeight: 'bold',
                    height: '0.6cm',
                  }}
                >
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {sampleData.items.map((item, index) => (
                <tr key={index}>
                  <td
                    style={{
                      border: '1px solid #000',
                      height: '0.6cm',
                      padding: '0.1cm',
                    }}
                  >
                    {item.code}
                  </td>
                  <td
                    style={{
                      border: '1px solid #000',
                      height: '0.6cm',
                      padding: '0.1cm',
                    }}
                  >
                    {item.description}
                  </td>
                  <td
                    style={{
                      border: '1px solid #000',
                      height: '0.6cm',
                      padding: '0.1cm',
                    }}
                  >
                    {item.hsCode}
                  </td>
                  <td
                    style={{
                      border: '1px solid #000',
                      height: '0.6cm',
                      padding: '0.1cm',
                      textAlign: 'right',
                    }}
                  >
                    {item.quantity}
                  </td>
                  <td
                    style={{
                      border: '1px solid #000',
                      height: '0.6cm',
                      padding: '0.1cm',
                    }}
                  >
                    {item.unitType}
                  </td>
                  <td
                    style={{
                      border: '1px solid #000',
                      height: '0.6cm',
                      padding: '0.1cm',
                      textAlign: 'right',
                    }}
                  >
                    {item.price.toFixed(2)}
                  </td>
                  <td
                    style={{
                      border: '1px solid #000',
                      height: '0.6cm',
                      padding: '0.1cm',
                      textAlign: 'right',
                    }}
                  >
                    {item.amount.toFixed(2)}
                  </td>
                </tr>
              ))}
              <tr>
                <td
                  colSpan={5}
                  style={{
                    border: '1px solid #000',
                    padding: '0.1cm',
                    textAlign: 'right',
                    fontWeight: 'bold',
                    height: '0.6cm',
                  }}
                >
                  Total This Page
                </td>
                <td
                  colSpan={2}
                  style={{
                    border: '1px solid #000',
                    height: '0.6cm',
                    padding: '0.1cm',
                    textAlign: 'right',
                    fontWeight: 'bold',
                  }}
                >
                  {sampleData.totalThisPage.toFixed(2)} USD
                </td>
              </tr>
              <tr>
                <td
                  colSpan={5}
                  style={{
                    border: '1px solid #000',
                    padding: '0.1cm',
                    textAlign: 'right',
                    fontWeight: 'bold',
                    height: '0.6cm',
                  }}
                >
                  Consignment Total
                </td>
                <td
                  colSpan={2}
                  style={{
                    border: '1px solid #000',
                    height: '0.6cm',
                    padding: '0.1cm',
                    textAlign: 'right',
                    fontWeight: 'bold',
                  }}
                >
                  {sampleData.consignmentTotal.toFixed(2)} USD
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Additional Info and Bank Details */}
        <div style={{ display: 'flex', marginBottom: '0.4cm' }}>
          <div style={{ width: '50%', paddingRight: '0.25cm' }}>
            <div style={fieldLabelStyle}>Additional Info</div>
            <div style={{ ...multilineFieldStyle, height: '2.5cm' }}>
              {sampleData.additionalInfo}
            </div>
          </div>
          <div style={{ width: '50%', paddingLeft: '0.25cm' }}>
            <div style={fieldLabelStyle}>Bank Details</div>
            <div style={{ ...multilineFieldStyle, height: '2.5cm' }}>
              {sampleData.bankDetails}
            </div>
          </div>
        </div>

        {/* Total, Incoterms, Currency */}
        <div style={{ display: 'flex', marginBottom: '0.4cm' }}>
          <div style={{ width: '33.33%', paddingRight: '0.15cm' }}>
            <div style={fieldLabelStyle}>TOTAL:</div>
            <div
              style={{ ...fieldBoxStyle, fontWeight: 'bold', fontSize: '9pt' }}
            >
              {sampleData.total.toFixed(2)} USD
            </div>
          </div>
          <div
            style={{
              width: '33.33%',
              paddingLeft: '0.15cm',
              paddingRight: '0.15cm',
            }}
          >
            <div style={fieldLabelStyle}>Incoterms® 2020</div>
            <div style={fieldBoxStyle}>{sampleData.incoterms}</div>
          </div>
          <div style={{ width: '33.33%', paddingLeft: '0.15cm' }}>
            <div style={fieldLabelStyle}>Currency</div>
            <div style={fieldBoxStyle}>{sampleData.currency}</div>
          </div>
        </div>

        {/* Signature Fields */}
        <div style={{ marginTop: '0.7cm' }}>
          <div style={fieldLabelStyle}>Signatory Company</div>
          <div style={{ ...fieldBoxStyle, marginBottom: '0.2cm' }}>
            {sampleData.signatoryCompany}
          </div>

          <div style={fieldLabelStyle}>Name of Authorized Signatory</div>
          <div style={{ ...fieldBoxStyle, marginBottom: '0.2cm' }}>
            {sampleData.authorizedName}
          </div>

          <div style={fieldLabelStyle}>Signature</div>
          <div
            style={{
              border: '1px solid #000',
              height: '1.5cm',
              padding: '0.1cm',
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'flex-end',
            }}
          >
            <div
              style={{
                fontFamily: 'cursive, Arial, sans-serif',
                fontSize: '12pt',
                marginRight: '0.5cm',
                marginBottom: '0.2cm',
              }}
            >
              Emily Johnson
            </div>
          </div>
        </div>
      </div>

      {/* Button Controls */}
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <button
          onClick={handlePrint}
          style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            padding: '0.5rem 1.5rem',
            borderRadius: '0.25rem',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'Arial, sans-serif',
          }}
        >
          Print Invoice
        </button>
        <button
          onClick={handleDownloadPDF}
          style={{
            backgroundColor: '#22c55e',
            color: 'white',
            padding: '0.5rem 1.5rem',
            borderRadius: '0.25rem',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'Arial, sans-serif',
          }}
        >
          Download as PDF
        </button>
      </div>
    </div>
  );
};

export default ExportBill;
