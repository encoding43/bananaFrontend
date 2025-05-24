import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { exportToExcel } from './excelExport';
import { getAPIAuth } from '../service/apiInstance';
import moment from 'moment';

const ExportButtonContent = ({
  apikey,
  companyId,
  months,
  year,
  module,
  label,
  type,
}) => {
  // console.log("companyIdcompanyId" , apikey , type , companyId);

  const [exportData, setExportData] = useState([]);

  console.log('exportDataexportDataexportData', exportData);

  const { token } = useAuth();

  const getUserList = async () => {
    try {
      const res = await getAPIAuth(apikey, token, module, label);
      console.log('Response:', res);

      if (res?.data?.status === 200) {
        const apiResponse =
          res?.data?.data?.farmerBill ||
          res?.data?.data?.documents ||
          res?.data?.data?.[0]?.documents;
        console.log('apiResponse', apiResponse);

        const results = apiResponse?.map((item, index) => {
          switch (apikey) {
            case 'farmer/getfarmerBill':
              return {
                'Sr. No': index + 1,
                'Vehicle No.': item?.vehicleNo || 'N/A',
                'Alias Name': item?.companyName || 'N/A',
                Team: item?.laborName || 'N/A',
                "Farmer's Name": item?.farmerName || 'N/A',
                Weight: item?.weight || 0,
                'Empty box weight': item?.emptyBoxweight || 0,
                'Subtotal Weight': item?.subtotalWeight || 0,
                Wastage: item?.wastage || 0,
                'Net weight': item?.netWeight || 0,
                Danda: item?.danda || 'N/A',
                totalWeight: item.totalWeight || 'N/A',
                weightDifference: item.weightDifference || 'N/A',
                rate: item.rate || 'N/A',
                initialAmount: item.initialAmount || 'N/A',
                labourTransport: item.labourTransport || 'N/A',
                amountPayable: item.amountpayable || 'N/A',
                exception: item.exception || 'N/A',
                jamaBy: item.isFruitSupplier
                  ? item.jamaBy?.ownerName
                  : item.jamaBy?.username || 'N/A',
              };

            case 'farmer/getBankDetail':
              return {
                'Sr. No': index + 1,
                FarmersName: item?.farmerName,
                'Bank Name': item?.bankName,
                'Name on Account': item?.accountHolder,
                Mobile: item?.farmerMobile,
                'Account No': item?.accountNumber,
                'IFSC Code': item?.ifscCode,
                'Account Type': item?.accountType,
              };
            case 'supplier/labor/get':
              return {
                'Sr. No': index + 1,
                'Labor Name': item.name,
                Mobile: item.mobile,
                'Team Contractor': item.teamContractor,
                'Contractor Mobile': item.ContractorMobile,
              };
            case 'supplier/get':
              return {
                'Sr. No': index + 1,
                'User Name': item?.username,
                'User Mobile': item?.mobile,
                Role: item?.role,
                Salary: item?.salary,
                'Allowed Leaves': item?.allowedLeaves,
              };
            case 'farmer/getFarmerDetail':
              return {
                'Sr. No': index + 1,
                Location: item.location,
                GeoLocation: item.geoLocation
                  ? `Lat: ${item.geoLocation[0]}, Lng: ${item.geoLocation[1]}`
                  : 'N/A',
                Name: item.name,
                Mobile: item.mobileNo,
                Block: item.isBlocked ? 'Yes' : 'No',
              };
            case 'farmer/getHarvestingDetail':
              return {
                'Sr. No': index + 1,
                'Farmer Name': item?.farmerName || '',
                'Farmer Mobile': item?.farmerMobileNo || '',
                Date: moment(item?.date).format('L'),
                Location: item?.location || '',
                'Vehicle Number': item?.vehicleNo || '',
                'Labor Name': item?.laborName || 'N/A',
                'Company Name': item?.companyName || 'N/A',
                Rate: item?.rate || 0,
                Weight: item?.weight || 'N/A',
                'Cold Storage': item?.csName || 'N/A',
                'Company Rate': item?.rate || 0,
                'Company Wastage': item?.wastage || 0,
              };
            case 'supplier/company/get':
              return {
                'Sr. No': index + 1,
                'Company Name': item?.companyName,
                'Company Address': item?.companyAddress,
                'Company Short form/ Alias': item?.companyAliasName,
                'Company Email': item?.companyEmail,
                'Owner Name': item?.ownerName,
                'Owner Mobile': item?.ownersMobile,
                'Payment Related Person': item?.paymentRelatedPerson,
                'Payment Related Person Contact':
                  item?.paymentRelatedPersonContact,
                GSTIN: item?.gstIn || 'N/A',
                'IEC Code': item?.iecCode || 'N/A',
                'Billing By': item?.billingBy,
                'Service Charges': item?.serviceCharges || 'N/A',
              };

            case `supplier/company/companyBill?companyId=${companyId}&type=${type}`:
              return {
                'Sr. No': index + 1,
                Date: moment(item?.createdAt).format('MMM-YY-DD'),
                'Party Name': item?.companyName,
                'Total Weight': item?.totalWeight || 'N/A',
                'Company Rate': item?.companyRate,
                'Initial Amount': item?.initalAmount || 'N/A',
                'Service Charge Amount': item?.serviceCharageAmount || 'N/A',
                'Service Charge': item?.serviceCharge,
                'Amount Payable': item?.AmountPaybel || 'N/A',
              };

            case `supplier/labor/bill?laborId=${companyId}`:
              return {
                'Sr. No': index + 1,
                Date: moment(item.date).format('YYYY-MM-DD'),
                'V No.': item.vehicleNo || 'N/A',
                Team: item.laborName || 'N/A',
                Location: item.location || 'N/A',
                Alias: item.companyAliasName || 'N/A',
                'Remaining Filled box weight': item.filledBoxWeight || 'N/A',
                'Amount payable to team': item.amountPayable || 'N/A',
                // 'Box Detail': item.box || [], // Assuming item.box is an array of boxes
              };

            case `transport/getTransportDetail?type=dailyWeight`:
              return {
                'Sr. No': index + 1,
                Date: item?.date
                  ? new Date(item?.date).toLocaleDateString()
                  : '--',
                Location: item?.farmer.location || '--',
                'Farmer Name': item?.farmer.name || '--',
                'Vehicle No': item?.vehicleNo || '--',
                'Distance-Km': item?.distance || '--',
                Charge: item?.charge || '--',
                'Weight-kg': item?.weight || '--',
              };

            case `transport/transportBill?vehicleNo=${companyId}&transportType=dailyWeight`:
              return {
                'Sr. No': index + 1,
                Date: item?.createdAt
                  ? moment(item?.createdAt).format('YYYY-MM-DD')
                  : 'N/A',
                Location: item?.location || 'N/A',
                'Farmer Name': item?.farmerName || 'N/A',
                Weight: item?.weight || 'N/A',
                'Distance(KM)': item?.distance || 'N/A',
                'Diesel in Ltrs': item?.DieselINLeter || 'N/A',
                'Rate/ltrs': item?.rate || 'N/A',
                'Sub Total': item?.subTotal || 'N/A',
                'Charge/Trip': item?.charge || 'N/A',
                Total: item?.total || 'N/A',
              };

            case `transport/getTransportDetail?type=pickUp&sortOrder`:
              return {
                'Sr. No': index + 1,
                date: item?.date,
                location: item?.farmer.location,
                vehicleNo: item?.vehicleNo,
                name: item?.farmer.name,
                distance: item?.distance,
                pickUpNo: item?.pickUpNo,
              };

            case `transport/transportBill?vehicleNo=${companyId}&transportType=pickUp`:
              return {
                'Sr. No': index + 1,
                date: item.createdAt,
                location: item.location,
                farmerName: item.farmerName,
                distance: item.distance,
                DieselINLeter: item.DieselINLeter,
                rate: item.rate,
                subTotal: item.subTotal,
                total: item.total,
              };

            case `Supplier/getUserSalary?year=${year}&month=${months}`:
              return {
                'Sr. No': index + 1,
                User: item?.username,
                Role: item?.role,
                Salary: item?.salary,
                'Allowed Off Days': item?.userId?.allowedLeaves,
                'Leave Taken': item?.leave,
                'Amount Payable': item?.totalSalary?.toFixed(0),
                'Amount Paid': item?.amount?.length
                  ? item?.amount?.reduce(
                      (sum, transaction) => sum + transaction.amount,
                      0,
                    )
                  : 0,
                'Remaining Payable Amount': item?.amount?.length
                  ? (
                      item?.totalSalary -
                      item?.amount?.reduce(
                        (sum, transaction) => sum + transaction.amount,
                        0,
                      )
                    )?.toFixed(0)
                  : item?.totalSalary?.toFixed(0),
              };

            case `farmer/getRegisterFarmer`:
              return {
                'Sr. No': index + 1,
                Date: new Date(item?.date).toLocaleDateString(),
                Location: item?.location,
                Geolocation: `Lat: ${item?.geoLocation?.[0]}, Lng: ${item?.geoLocation?.[1]}`,
                Name: item?.name,
                Mobile: item?.mobileNo,
                'Area in Acres': item?.areaInAcres,
                'Variety Of Banana': item?.varietyOfBanana,
                'number Of Plants': item?.numberOfPlants,
                'Plantation Date': new Date(
                  item?.plantationDate,
                ).toLocaleDateString(),
              };

            case `bussinessIntelligence/getPlotVisit`:
              return {
                'Sr. No': index + 1,
                'Box kg': item?.boxKg,
                Ratio: item?.ratio,
                'Rate Expect': item?.rateExpect,
                Farmer: item?.farmerName,
                Mobile: item?.mob,
                GeoLocation: `Lat: ${item?.geoLocation?.[0]}, Lng: ${item?.geoLocation?.[1]}`,
                Nos: item?.NOS,
                Area: item?.area,
                Variety: item?.variety,
                'Planting Date': moment(item?.platingDate).format('YYYY-MM-DD'),
                'Cutting No.': item?.cuttingNo,
                Note: item?.note,
              };

            case `bussinessIntelligence/getBananaBoxes`:
              return {
                'Sr. No': index + 1,
                'Box KG': item?.boxKg,
                Count: item?.count,
                'Packing Date': moment(item?.packingDate).format('YYYY-MM-DD'),
                Ratio: item?.ratio,
                CS: item?.coldStore?.csName,
                'Rate/box': item?.ratePerBox,
                Party: item?.company?.companyAliasName,
                Note: item?.note,
                isAsked: !item?.isAsked ? 'Ask' : 'N/A',
              };

            case `bussinessIntelligence/getPlot`:
              return {
                'Sr. No': index + 1,
                Area: item?.area,
                Variety: item?.variety,
                'NO of Plantains': item?.rateExpect,
                'Plantation date': moment(item?.platingDate).format(
                  'YYYY-MM-DD',
                ),
                'Box type': item?.boxType,
                Recovery: item?.recovery,
                'Desired weight': item?.desireWeight,
                'Expected Rate': item?.rateExpect,
                'Cutting Cycle No': item?.cuttingCycleNo
                  ? item?.cuttingCycleNo
                  : 'N/A',
                'Seller info': item?.sellerInfo,
                'Expected Commission': item?.expectedCommission,
              };

            case `farmer/farmerLedger`:
              return {
                'Sr. No': index + 1,
                'Farmer Name': item?.farmerName,
                Mobile: item?.mobileNo,
                Location: item?.location,
                'Total Due': item?.amountDue,
              };

            case `farmer/farmerLedger?farmerId=${companyId}`:
              return {
                'Sr. No': index + 1,
                date: item?.date
                  ? moment(item?.date).format('YYYY-MM-DD')
                  : 'N/A',
                farmerName: item?.farmerName || 'N/A',
                particular: item?.particular || 'N/A',
                debitAmount: item?.debitAmount || 'N/A',
                creditAmount: item?.creditAmount || 'N/A',
                charge: item?.charge || 'N/A',
              };

            case `supplier/company/companyLedger?companyId=${companyId}`:
              return {
                'Sr. No': index + 1,
                date: item?.date
                  ? moment(item?.date).format('YYYY-MM-DD')
                  : 'N/A',
                particular: item?.particular || 'N/A',
                debitAmount: item?.debitAmount || 'N/A',
                creditAmount: item?.creditAmount || 'N/A',
                Balance: item?.charge || 'N/A',
              };
            case `audit/allTranasactions`:
              return {
                'Sr. No': index + 1,
                date: item?.date
                  ? moment(item?.date).format('YYYY-MM-DD')
                  : 'N/A',

                billType: item?.billType || 'N/A',
                name: item?.name || 'N/A',
                otherDetail: item?.other || 'N/A',

                transactionType: item?.transactionType || 'N/A',
                debit: item?.debitAmount || 'N/A',
                credit: item?.creditAmount || 'N/A',
                Balance: item?.charge || 'N/A',
              };
            case `admin/supplierList`:
              return {
                'Sr. No': index + 1,
                userName: item?.ownerName || 'N/A',
                userMobile: item?.ownerMobile || 'N/A',
                companyEmail: item?.companyEmail || 'N/A',
                companyName: item?.companyName || 'N/A',
                companyAddress: item?.companyAddress || 'N/A',
                role: item?.role || 'N/A',
              };
            case `admin/coldStoreList`:
              return {
                'Sr. No': index + 1,
                userName: item?.ownerName || 'N/A',
                userMobile: item?.ownerMobile || 'N/A',
                companyEmail: item?.companyEmail || 'N/A',
                companyName: item?.companyName || 'N/A',
                companyAddress: item?.companyAddress || 'N/A',
                role: item?.role || 'N/A',
              };

            case `task/viewAssignTask?taskId=${companyId}`:
              return {
                'Sr. No': index + 1,
                assignedToUsername: item.assignedTo?.username || 'N/A',
                assignedToRole: item.assignedTo?.role || 'N/A',
                assignedToMobile: item.assignedTo?.mobile || 'N/A',
                dateAssign: item.createdAt
                  ? moment(item.createdAt).format('YYYY-MM-DD')
                  : 'N/A',
                status: item.status || 'N/A',
              };

            case `vendor/getVendorDetail`:
              return {
                'Sr. No': index + 1,
                'Vendor Name': item?.companyName,
                'Vendor Address': item?.companyAddress,
                'Vendor Short form/ Alias': item?.companyAliasName,
                'Vendor Email': item?.companyEmail,
                'Owner Name': item?.ownerName,
                'Owner Mobile': item?.ownersMobile,
                GSTIN: item?.gstIn || 'N/A',
                'IEC Code': item?.iecCode || 'N/A',
                'Billing By': item?.billingBy,
                'Service Charges': item?.serviceCharges || 'N/A',
              };

            case `commissionAgent/getCommissionAgentDetail`:
              return {
                'Sr. No': index + 1,
                'Commission Agent Name': item?.companyName,
                'Commission Agent Address': item?.companyAddress,
                'Commission Agent Short form/ Alias': item?.companyAliasName,
                'Commission Agent Email': item?.companyEmail,
                'Owner Name': item?.ownerName,
                'Owner Mobile': item?.ownersMobile,
                GSTIN: item?.gstIn || 'N/A',
                'IEC Code': item?.iecCode || 'N/A',
                'Billing By': item?.billingBy,
                'Service Charges': item?.serviceCharges || 'N/A',
              };

            default:
              console.warn('Unsupported apikey:', apikey);
              return null;
          }
        });
        const filteredResults = results?.filter((item) => item !== null);
        console.log('filteredResultsfilteredResults', filteredResults);

        setExportData(filteredResults);
      }
    } catch (error) {
      console.error('Error:', error);
      if (error?.response?.status === 401) {
        console.log('Unauthorized Error:', error);
      } else {
        console.log('Error:', error);
      }
    }
  };

  useEffect(() => {
    getUserList();
  }, [apikey, token]);

  return (
    <div>
      <button
        className="inline-flex items-center justify-center gap-2 rounded-md bg-black px-5 py-3 text-center font-medium text-white hover:bg-opacity-90"
        onClick={() => exportToExcel(exportData)}
      >
        Export
      </button>
    </div>
  );
};

export default ExportButtonContent;
