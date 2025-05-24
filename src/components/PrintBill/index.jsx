// import React from 'react'

// const PrintBill = React.forwardRef((props, ref) => {
//   const data = {
//     supplier: 'Deva Farms',
//     farmerName: 'Swapnil Devidas Choudhari',
//     address: 'A/p. Galandwadi No.1, Tal. Indapur, Dist. Pune 413106',
//     mobileNo: '8856887866',
//     vendorName: 'John Doe',
//     team: 'Harvest Team A',
//     date: '12/25/2024',
//     carNo: 'MH12AB1234',
//     weights: [
//       { key: 'गाडी वजन', value: '8070' },
//       { key: 'बॉक्स', value: '629.2' },
//       { key: 'बाकी वजन', value: '7440.8' },
//       { key: 'वेस्टेज', value: '407' },
//       { key: 'एकूण वजन', value: '7847.8' },
//       { key: 'दांडा', value: '627.824' },
//       { key: 'एकूण वजन', value: '8475.624' },
//       { key: 'दर', value: '11.5' },
//       { key: 'प्रथम रक्कम', value: '97469.676' },
//       { key: 'वाहतूक', value: '3390.2496' },
//       { key: 'निव्वळ रक्कम', value: '94079' },
//     ],
//   }

//   return (
//     <div
//       ref={ref}
//       style={{
//         fontFamily: 'Arial, sans-serif',
//         color: '#333',
//         padding: '20px',
//         maxWidth: '800px',
//         margin: '0 auto',
//         border: '1px solid #ccc',
//         borderRadius: '5px',
//         position: 'relative',
//         overflow: 'hidden',
//       }}>
//       {/* Watermark */}
//       <div
//         style={{
//           position: 'absolute',
//           top: '50%',
//           left: '50%',
//           transform: 'translate(-50%, -50%)',
//           fontSize: '80px',
//           color: 'rgba(200, 200, 200, 0.2)',
//           zIndex: '-1',
//           textAlign: 'center',
//         }}>
//         Deva Farms
//       </div>

//       {/* Side Images */}
//       <div
//         style={{
//           position: 'absolute',
//           top: '20px',
//           left: '20px',
//           width: '100px',
//           height: '100px',
//           borderRadius: '50%',
//           background:
//             "url('https://www.jiomart.com/images/product/original/590008622/banana-mrl-pack-5-pcs-approx-600-g-700-g-product-images-o590008622-p590804206-1-202408070949.jpg?im=Resize=(1000,1000)') center center / cover no-repeat",
//         }}></div>

//       {/* Top-Right Circle */}
//       <div
//         style={{
//           position: 'absolute',
//           top: '20px',
//           right: '20px',
//           width: '100px',
//           height: '100px',
//           borderRadius: '50%',
//           background:
//             "url('https://www.jiomart.com/images/product/original/590008622/banana-mrl-pack-5-pcs-approx-600-g-700-g-product-images-o590008622-p590804206-1-202408070949.jpg?im=Resize=(1000,1000)') center center / cover no-repeat",
//         }}></div>

//       {/* Header */}
//       <div style={{ textAlign: 'center', marginBottom: '20px' }}>
//         <h1 style={{ color: '#3A8DFF', margin: '0' }}>Deva Farms Invoice</h1>
//         <p style={{ fontSize: '12px', margin: '5px 0' }}>
//           Date: {data.date} | Due: 01/01/2025
//         </p>
//         <br />
//         <hr
//           style={{
//             backgroundColor: 'black', // Default color is black
//             height: '2px', // Default thickness is 2px
//             border: 'none',
//             margin: '15px 0', // Default margin
//           }}
//         />
//       </div>

//       {/* Company and Client Information */}
//       <div
//         style={{
//           display: 'flex',
//           justifyContent: 'space-between',
//           marginBottom: '20px',
//         }}>
//         <div>
//           <h4 style={{ margin: '0', color: '#3A8DFF' }}>Deva Farms</h4>
//           <p style={{ fontSize: '12px', margin: '5px 0' }}>
//             A/p. Galandwadi No.1, Tal. Indapur, Dist. Pune 413106
//           </p>
//           <p style={{ fontSize: '12px', margin: '5px 0' }}>Phone: 8856887866</p>
//         </div>
//         <div>
//           <h4 style={{ margin: '0', color: '#3A8DFF' }}>BILLED TO</h4>
//           <p style={{ fontSize: '12px', margin: '5px 0' }}>
//             Farmer Name: {data.farmerName}
//           </p>
//           <p style={{ fontSize: '12px', margin: '5px 0' }}>
//             Mobile: {data.mobileNo}
//           </p>
//           <p style={{ fontSize: '12px', margin: '5px 0' }}>
//             Car No: {data.carNo}
//           </p>
//         </div>
//       </div>

//       <hr
//         style={{
//           backgroundColor: 'black', // Default color is black
//           height: '2px', // Default thickness is 2px
//           border: 'none',
//           margin: '5px 0', // Default margin
//         }}
//       />
//       <br />

//       {/* Item Table */}
//       <table
//         style={{
//           width: '100%',
//           borderCollapse: 'collapse',
//           marginBottom: '20px',
//         }}>
//         <thead>
//           <tr
//             style={{
//               backgroundColor: '#3A8DFF',
//               color: '#fff',
//               textAlign: 'left',
//             }}>
//             <th style={{ padding: '8px', border: '1px solid #ccc' }}>
//               Item No
//             </th>
//             <th style={{ padding: '8px', border: '1px solid #ccc' }}>
//               Description
//             </th>
//             <th style={{ padding: '8px', border: '1px solid #ccc' }}>Total</th>
//           </tr>
//         </thead>
//         <tbody>
//           {data.weights.map((item, index) => (
//             <tr
//               key={index}
//               style={{
//                 backgroundColor: index % 2 === 0 ? '#f8f8f8' : '#fff',
//               }}>
//               <td style={{ padding: '8px', border: '1px solid #ccc' }}>
//                 {index + 1}
//               </td>
//               <td style={{ padding: '8px', border: '1px solid #ccc' }}>
//                 {item.key}
//               </td>
//               <td style={{ padding: '8px', border: '1px solid #ccc' }}>
//                 {item.value}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {/* Totals */}
//       <div style={{ textAlign: 'right', marginBottom: '20px' }}>
//         <p style={{ margin: '5px 0' }}>Total: ₹94079</p>
//       </div>

//       {/* Signature Section */}
//       <div style={{ marginTop: '20px', textAlign: 'center' }}>
//         <p>For Deva Farms :</p>
//         <img
//           src='https://via.placeholder.com/200x50'
//           alt='Signature'
//           style={{ marginTop: '10px', width: '200px', height: '50px' }}
//         />
//       </div>

//       {/* Footer */}
//       <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '12px' }}>
//         <p>Thank you for your business!</p>
//       </div>
//     </div>
//   )
// })

// export default PrintBill

import React from 'react';

const PrintBill = React.forwardRef(({ details }, ref) => {
  console.log('props', details);
  const items = [
    {
      sr: 1,
      particular: 'गाडी वजन',
      qty: '-',
      netWt: details?.farmerBillData?.weight || '-',
      rate: '-',
      amount: '-',
    },
    {
      sr: 2,
      particular: 'बॉक्स',
      qty: details?.farmerBillData?.emptyBoxweight || '-',
      netWt: '-',
      rate: '-',
      amount: '-',
    },
    {
      sr: 3,
      particular: 'बाकी वजन',
      qty: '-',
      netWt: details?.farmerBillData?.subtotalWeight || '-',
      rate: '-',
      amount: '-',
    },
    {
      sr: 4,
      particular: 'वेस्टेज',
      qty: '-',
      netWt: details?.farmerBillData?.wastage || '-',
      rate: '-',
      amount: '-',
    },
    {
      sr: 5,
      particular: 'एकूण वजन',
      qty: '-',
      netWt: details?.farmerBillData?.netWeight || '-',
      rate: '-',
      amount: '-',
    },
    {
      sr: 6,
      particular: 'दांडा',
      qty: '-',
      netWt: details?.farmerBillData?.danda || '-',
      rate: '-',
      amount: '-',
    },
    {
      sr: 7,
      particular: 'एकूण वजन',
      qty: '-',
      netWt: details?.farmerBillData?.totalWeight || '-',
      rate: '-',
      amount: '-',
    },
    {
      sr: 8,
      particular: 'दर',
      qty: '-',
      netWt: '-',
      rate: details?.farmerBillData?.rate || '-',
      amount: '-',
    },
    {
      sr: 9,
      particular: 'प्रथम रक्कम',
      qty: '-',
      netWt: '-',
      rate: '-',
      amount: details?.farmerBillData?.initialAmount || '-',
    },
    {
      sr: 10,
      particular: 'वाहतूक',
      qty: '-',
      netWt: '-',
      rate: '-',
      amount: details?.farmerBillData?.labourTransport || '-',
    },
    {
      sr: 11,
      particular: 'निव्वळ रक्कम',
      qty: '-',
      netWt: '-',
      rate: '-',
      amount: details?.farmerBillData?.amountpayable || '-',
    },
  ];

  return (
    <div
      ref={ref}
      style={{
        fontFamily: 'Arial, sans-serif',
        color: '#000',
        padding: '20px',
        maxWidth: '800px',
        margin: '0 auto',
        border: '1px solid #000',
      }}
    >
      {/* Watermark */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%) rotate(-45deg)', // Added rotation for diagonal orientation
          fontSize: '100px',
          color: 'rgba(4, 248, 77, 0.1)',
          zIndex: '-1',
          whiteSpace: 'nowrap',
          fontWeight: 'bold',
          textAlign: 'center', // Ensures text stays aligned properly
        }}
      >
        {details?.companyData?.companyName}
      </div>

      {/* <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '100px',
          color: 'rgba(4, 248, 77, 0.1)',
          zIndex: '-1',
          whiteSpace: 'nowrap',
          fontWeight: 'bold',
        }}
      >
        {details?.companyData?.companyName}
      </div> */}

      <div
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          background: "url('/banana.webp') center center / cover no-repeat",
        }}
      ></div>

      {/* Top-Right Circle */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          background: "url('/banana.webp') center center / cover no-repeat",
        }}
      ></div>

      {/* Header Section */}
      <div style={{ textAlign: 'center', marginBottom: '10px' }}>
        <h1
          style={{
            color: '#3A8DFF',
            margin: '0',
            fontSize: '50px',
            fontWeight: 'bold',
          }}
        >
          {details?.companyData?.companyName || 'Invoice'}
        </h1>
        <p style={{ margin: '5px 0', fontSize: '14px' }}>
          {details?.companyData?.companyAddress || ''}
        </p>
        <p style={{ margin: '5px 0', fontSize: '14px' }}>
          Prop: {details?.companyData?.ownerName || '-'}
        </p>
        <p style={{ margin: '5px 0', fontSize: '14px' }}>
          Mob: {details?.companyData?.ownerMobile || '-'}
        </p>
        <br />
        <hr
          style={{
            backgroundColor: 'black', // Default color is black
            height: '2px', // Default thickness is 2px
            border: 'none',
            margin: '0 0', // Default margin
          }}
        />
      </div>

      {/* Bill Details */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '10px',
        }}
      >
        <div>
          <p style={{ margin: '5px 0', fontSize: '14px' }}>To:</p>
          <p style={{ margin: '5px 0', fontSize: '14px' }}>
            {details?.farmerBillData?.companyName || '-'},
            {details?.farmerBillData?.companyAddress}
          </p>
          <p style={{ margin: '5px 0', fontSize: '14px' }}>
            Car No : {details?.farmerBillData?.vehicleNo || '-'}
          </p>
        </div>
        <div>
          <p style={{ margin: '5px 0', fontSize: '14px' }}>No.: 341</p>
          <p style={{ margin: '5px 0', fontSize: '14px' }}>
            Date:{' '}
            {new Date(details?.farmerBillData?.date).toLocaleDateString() ||
              '-'}
          </p>
        </div>
      </div>

      <hr
        style={{
          backgroundColor: 'black', // Default color is black
          height: '2px', // Default thickness is 2px
          border: 'none',
          margin: '30px 0', // Default margin
        }}
      />
      <br />

      {/* Table Header */}
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          marginBottom: '10px',
          border: '1px solid #000',
        }}
      >
        <thead>
          <tr>
            <th
              style={{
                border: '1px solid #000',
                padding: '5px',
                textAlign: 'center',
                backgroundColor: '#3A8DFF',
                color: '#fff',
              }}
            >
              Sr.
            </th>
            <th
              style={{
                border: '1px solid #000',
                padding: '5px',
                textAlign: 'center',
                backgroundColor: '#3A8DFF',
                color: '#fff',
              }}
            >
              Particular
            </th>
            <th
              style={{
                border: '1px solid #000',
                padding: '5px',
                textAlign: 'center',
                backgroundColor: '#3A8DFF',
                color: '#fff',
              }}
            >
              Qty
            </th>
            <th
              style={{
                border: '1px solid #000',
                padding: '5px',
                textAlign: 'center',
                backgroundColor: '#3A8DFF',
                color: '#fff',
              }}
            >
              Net.Wt.
            </th>
            <th
              style={{
                border: '1px solid #000',
                padding: '5px',
                textAlign: 'center',
                backgroundColor: '#3A8DFF',
                color: '#fff',
              }}
            >
              Rate
            </th>
            <th
              style={{
                border: '1px solid #000',
                padding: '5px',
                textAlign: 'center',
                backgroundColor: '#3A8DFF',
                color: '#fff',
              }}
            >
              Amount
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr
              key={index}
              // style={{
              //   backgroundColor: index % 2 === 0 ? '#f8f8f8' : '#fff',
              // }}
            >
              <td
                style={{
                  border: '1px solid #000',
                  padding: '5px',
                  textAlign: 'center',
                }}
              >
                {item.sr}
              </td>
              <td style={{ border: '1px solid #000', padding: '5px' }}>
                {item.particular}
              </td>
              <td
                style={{
                  border: '1px solid #000',
                  padding: '5px',
                  textAlign: 'center',
                }}
              >
                {item.qty}
              </td>
              <td
                style={{
                  border: '1px solid #000',
                  padding: '5px',
                  textAlign: 'center',
                }}
              >
                {item.netWt}
              </td>
              <td
                style={{
                  border: '1px solid #000',
                  padding: '5px',
                  textAlign: 'center',
                }}
              >
                {item.rate}
              </td>
              <td
                style={{
                  border: '1px solid #000',
                  padding: '5px',
                  textAlign: 'center',
                }}
              >
                {item.amount}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Footer Section */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '10px',
        }}
      >
        <div>
          <p style={{ margin: '5px 0', fontSize: '14px' }}>
            Transport Cost: ₹{items[9]?.amount || '-'}
          </p>
        </div>
        <div>
          <p style={{ margin: '5px 0', fontSize: '14px', fontWeight: 'bold' }}>
            Total: ₹{items[10]?.amount || '-'}
          </p>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '30px',
          alignItems: 'center',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <img
            src="https://via.placeholder.com/150x50"
            alt="Executive Sign"
            style={{ marginTop: '10px' }}
          />
          <p>Executive</p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <img
            src="https://via.placeholder.com/150x50"
            alt="Deva Farms Sign"
            style={{ marginTop: '10px' }}
          />
          <p>For {details?.companyData?.companyName}</p>
        </div>
      </div>
    </div>
  );
});

export default PrintBill;
