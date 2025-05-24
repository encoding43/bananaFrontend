import React from 'react';

const CompanyBill = React.forwardRef(({ details }, ref) => {
  console.log(details);
  const borderColor = '#fcd34d'; // Yellow color matching the outer border

  const tableCellStyle = {
    padding: '0.25rem 0.5rem',
    borderBottom: `1px solid ${borderColor}`,
    borderRight: `1px solid ${borderColor}`,
  };

  const tableHeaderStyle = {
    ...tableCellStyle,
    backgroundColor: '#f9fafb',
    fontWeight: 600,
  };

  return (
    <div
      ref={ref}
      style={{
        maxWidth: '48rem',
        margin: '0 auto',
        border: `1px solid ${borderColor}`,
        background: 'white',
      }}
    >
      {/* Header section */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          background: '#38bdf8',
          padding: '1rem',
          color: 'white',
        }}
      >
        <div
          style={{
            width: '4rem',
            height: '4rem',
            background: 'white',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0.25rem',
            overflow: 'hidden', // Ensure the image fits within the circle
          }}
        >
          <img
            src="./banana.webp"
            alt="Banana Logo"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover', // Ensure the image covers the entire circle
            }}
          />
        </div>
        <h1
          style={{
            fontSize: '1.9rem',
            fontWeight: 'bold',
            letterSpacing: '0.05em',
            textAlign: 'center',
          }}
        >
          REVA FRUIT SUPPLIER
        </h1>
      </div>
      {/* Address section with yellow border */}
      <div
        style={{
          fontSize: '0.75rem',
          padding: '0.5rem 1rem',
          borderBottom: `1px solid ${borderColor}`,
        }}
      >
        <p>
          15, NISHAL VALUFALIYU, AT : THARI,PO : THARI, NANDOD (RAJPIPLA), DIST
          : NARMADA, STATE – GUJARAT PIN – 393145
        </p>
        <p>Email : revafruitsupplier@gmail.com, Mo. 8141203434</p>
      </div>
      {/* Title with yellow border */}
      <div
        style={{
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: '1.25rem',
          padding: '0.5rem 0',
          borderBottom: `1px solid ${borderColor}`,
        }}
      >
        HARVESTING SLIP
      </div>
      {/* Form Details with yellow borders */}
      <div
        style={{
          padding: '0.5rem 1rem',
          fontSize: '0.875rem',
          borderBottom: `1px solid ${borderColor}`,
        }}
      >
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            border: `1px solid ${borderColor}`,
          }}
        >
          <tbody>
            {/* Rest of the table rows remain the same, using updated tableCellStyle */}
            <tr>
              <td style={tableHeaderStyle}>SUPPLIER (BILL FROM)</td>
              <td style={tableCellStyle}></td>
              <td style={tableHeaderStyle}>DATE :</td>
              <td style={tableCellStyle}>12-Jan-24</td>
            </tr>
            <tr>
              <td style={tableHeaderStyle}>FARMER NAME :</td>
              <td style={tableCellStyle}></td>
              <td style={tableHeaderStyle}>NO. :</td>
              <td style={tableCellStyle}>MH/23-24/115</td>
            </tr>
            <tr>
              <td style={tableHeaderStyle}>ADDRESS :</td>
              <td style={tableCellStyle} colSpan="3"></td>
            </tr>
            <tr>
              <td style={tableHeaderStyle}>MOBILE NO. :</td>
              <td style={tableCellStyle} colSpan="3"></td>
            </tr>
            <tr>
              <td style={tableHeaderStyle}>VENDOR NAME :</td>
              <td style={tableCellStyle} colSpan="3">
                AMIT TABER
              </td>
            </tr>
            <tr>
              <td style={tableHeaderStyle}>TEAM :</td>
              <td style={tableCellStyle} colSpan="3">
                TINKU DAS
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      {/* Main Table with yellow borders */}
      <div style={{ padding: '0.5rem 1rem' }}>
        <table
          style={{
            width: '100%',
            fontSize: '0.875rem',
            borderCollapse: 'collapse',
            border: `1px solid ${borderColor}`,
          }}
        >
          <tbody>
            <tr>
              <td style={tableCellStyle}>GROIS WEIGHT :</td>
              <td style={tableCellStyle}>GJ22U9945</td>
              <td style={tableCellStyle}>agro+saab</td>
              <td style={{ ...tableCellStyle, textAlign: 'right' }}>740</td>
              <td style={{ ...tableCellStyle, textAlign: 'right' }}>0</td>
              <td style={{ ...tableCellStyle, textAlign: 'right' }}>10920</td>
            </tr>
            <tr>
              <td style={tableCellStyle}>LESS : EMPTY BOX</td>
              <td style={tableCellStyle}>1.0</td>
              <td style={tableCellStyle} colSpan="3"></td>
              <td style={{ ...tableCellStyle, textAlign: 'right' }}>-740</td>
            </tr>
            <tr>
              <td style={tableCellStyle}>BANANA (CLASS - A)</td>
              <td style={{ ...tableCellStyle, textAlign: 'right' }}>29.00</td>
              <td style={tableCellStyle} colSpan="3"></td>
              <td style={{ ...tableCellStyle, textAlign: 'right' }}>10180</td>
            </tr>
            <tr>
              <td style={tableCellStyle}>BANANA (CLASS - C)</td>
              <td style={{ ...tableCellStyle, textAlign: 'right' }}>28.50</td>
              <td style={tableCellStyle} colSpan="3"></td>
              <td style={{ ...tableCellStyle, textAlign: 'right' }}>250</td>
            </tr>
            <tr>
              <td style={tableCellStyle}>TOTAL WEIGHT</td>
              <td style={tableCellStyle} colSpan="4"></td>
              <td style={{ ...tableCellStyle, textAlign: 'right' }}>10430</td>
            </tr>
            <tr>
              <td style={tableCellStyle}>STALK WEIGHT (8%)</td>
              <td style={{ ...tableCellStyle, textAlign: 'right' }}>28.50</td>
              <td style={tableCellStyle} colSpan="3"></td>
              <td style={{ ...tableCellStyle, textAlign: 'right' }}>834</td>
            </tr>
            <tr>
              <td style={tableCellStyle}>NET WEIGHT</td>
              <td style={tableCellStyle} colSpan="4"></td>
              <td style={{ ...tableCellStyle, textAlign: 'right' }}>11264</td>
            </tr>
            <tr>
              <td style={tableCellStyle}>RATE</td>
              <td style={tableCellStyle} colSpan="4"></td>
              <td style={{ ...tableCellStyle, textAlign: 'right' }}>28.50</td>
            </tr>
            <tr>
              <td style={tableCellStyle}>AMOUNT</td>
              <td style={tableCellStyle} colSpan="4"></td>
              <td style={{ ...tableCellStyle, textAlign: 'right' }}>326114</td>
            </tr>
          </tbody>
        </table>

        {/* Additional Costs with yellow borders */}
        <div
          style={{ marginTop: '1rem', borderTop: `1px solid ${borderColor}` }}
        >
          <p
            style={{
              fontSize: '0.875rem',
              fontWeight: 600,
              padding: '0.5rem 0',
              borderBottom: `1px solid ${borderColor}`,
            }}
          >
            ADD COST :
          </p>
          <table
            style={{
              width: '100%',
              fontSize: '0.875rem',
              borderCollapse: 'collapse',
              border: `1px solid ${borderColor}`,
            }}
          >
            <tbody>
              <tr>
                <td style={tableCellStyle}>TRANSPORTATION</td>
                <td style={{ ...tableCellStyle, textAlign: 'right' }}></td>
              </tr>
              <tr>
                <td style={tableCellStyle}>LABOUR CHARGES</td>
                <td style={{ ...tableCellStyle, textAlign: 'right' }}></td>
              </tr>
              <tr>
                <td style={tableCellStyle}>BEHATI</td>
                <td style={{ ...tableCellStyle, textAlign: 'right' }}>-3379</td>
              </tr>
              <tr>
                <td style={tableCellStyle}></td>
                <td
                  style={{
                    ...tableCellStyle,
                    textAlign: 'right',
                    fontWeight: 'bold',
                  }}
                >
                  322735
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      {/* Footer with yellow border */}
      <div
        style={{
          textAlign: 'right',
          padding: '0 1rem',
          marginTop: '2rem',
          paddingBottom: '1rem',
          borderTop: `1px solid ${borderColor}`,
        }}
      >
        <p style={{ fontSize: '0.875rem' }}>FOR REVA FRUIT SUPPLIER</p>
        <p
          style={{
            marginTop: '2rem',
            color: '#1e40af',
            fontWeight: 600,
          }}
        >
          AUTHORISED
        </p>
      </div>
    </div>
  );
});

CompanyBill.displayName = 'CompanyBill';

export default CompanyBill;
