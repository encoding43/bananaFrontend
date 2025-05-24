import React, { useEffect, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useAuth } from '../../hooks/useAuth';
import { getAPIAuth, postAPIAuth } from '../../service/apiInstance';
import AddIcon from '@mui/icons-material/Add';
import InwardModal from './InwardModal';
import OutwardModal from './OutwardModal';
import { toast } from 'sonner';
import { withPageGuard } from '../../utils/withPageGuard.jsx';
import { useCheckPermission } from '../../utils/useCheckPermission.jsx';

const EmptyBox = () => {
  const { token } = useAuth();
  const [companyList, setCompanyList] = useState([]);
  const [expanded, setExpanded] = React.useState(false);
  const [openInwardModal, setOpenInwardModal] = useState(false);
  const [openOutwardModal, setOpenOutwardModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState({});
  //

  const checkStockPermission = useCheckPermission('Empty box', 'stock');
  const checkDeletePermission = useCheckPermission('Empty box', 'delete');
  const checkInwardePermission = useCheckPermission('Empty box', 'inward');
  const checkOutwardePermission = useCheckPermission('Empty box', 'outward');

  //
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const getCompanyList = async () => {
    try {
      const res = await getAPIAuth('supplier/company/get', token);
      if (res?.data?.success) {
        setCompanyList(res?.data?.data?.documents);
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  useEffect(() => {
    if (token) {
      getCompanyList();
    }
  }, [token]);

  const handleDeleteStock = async (item, element) => {
    try {
      const res = await postAPIAuth(
        `supplier/company/deleteStock/${item?.stock?._id}/${element?._id}`,
        {},
        token,
      );
      if (res?.data?.success) {
        getCompanyList();
        toast.success('Stock deleted successfully');
      }
    } catch (error) {
      toast.error('Oops! something went wrong');
    }
  };
  return (
    <>
      <div className="flex justify-between items-start sm:items-center mb-6 gap-3 flex-col sm:flex-row">
        <Breadcrumb pageName="Empty Boxss" />
      </div>
      <div>
        {companyList?.length
          ? companyList?.map((item) => (
              <Accordion
                expanded={expanded === item?._id}
                onChange={handleChange(item?._id)}
                className="mb-3 rounded-md border-0 shadow-none customAccordian"
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1-content"
                  id="panel1-header"
                  className="font-medium"
                >
                  {item?.companyName}
                </AccordionSummary>
                <AccordionDetails>
                  <div className="flex items-center justify-end mb-3">
                    {checkInwardePermission ? (
                      <button
                        onClick={() => {
                          setSelectedCompany(item);
                          setOpenInwardModal(true);
                        }}
                        className="inline-flex text-sm items-center justify-center gap-1 rounded-md bg-black px-2.5 py-1.5 text-center font-medium text-white hover:bg-opacity-90"
                      >
                        <AddIcon />
                        Inward
                      </button>
                    ) : (
                      ''
                    )}
                     {checkOutwardePermission ? (
                       <button
                       onClick={() => {
                         setSelectedCompany(item);
                         setOpenOutwardModal(true);
                       }}
                       className="inline-flex ms-3 text-sm items-center justify-center gap-1 rounded-md bg-red-600 px-2.5 py-1.5 text-center font-medium text-white hover:bg-opacity-90"
                     >
                       <AddIcon />
                       Outward
                     </button>
                    ) : (
                      ''
                    )}
                  
                  </div>
                  <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                          <th scope="col" className="px-6 py-3">
                            Box Type
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Count
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Box Brand
                          </th>
                          {
                            checkDeletePermission ? (
                              <th scope="col" className="px-6 py-3">
                              Delete Stock
                            </th>
                            ) : (<></>)
                          }
                         
                        </tr>
                      </thead>
                      <tbody>
                        {item?.stock?.box?.length ? (
                          item?.stock?.box?.map((el) => (
                            <tr className="bg-white border-b border-slate-300 dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                              <td className="px-6 py-4">{el?.boxKgType}</td>
                              <td className="px-6 py-4">{el?.count}</td>
                              <td className="px-6 py-4">
                                {el?.brand ? el?.brand : '--'}
                              </td>
                              {
                            checkDeletePermission ? (
                              <td className="px-6 py-4">
                              <button
                                onClick={() => {
                                  handleDeleteStock(item, el);
                                  // setSelectedCompany(item)
                                  // setOpenOutwardModal(true)
                                }}
                                className="inline-flex ms-3 text-sm items-center justify-center gap-1 rounded-md bg-red-600 px-2.5 py-1.5 text-center font-medium text-white hover:bg-opacity-90"
                              >
                                Delete
                              </button>
                            </td>
                            ) : (<></>)
                          }
                           
                            </tr>
                          ))
                        ) : (
                          <tr className="bg-white border-b border-slate-300 dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                            <td
                              colSpan={3}
                              className="px-6 py-6 text-center text-bold"
                            >
                              No Data Found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </AccordionDetails>
              </Accordion>
            ))
          : 'No Data Available'}
      </div>
      <InwardModal
        selectedCompany={selectedCompany}
        openInwardModal={openInwardModal}
        setOpenInwardModal={setOpenInwardModal}
        onSuccessFunction={getCompanyList}
      />
      <OutwardModal
        selectedCompany={selectedCompany}
        openOutwardModal={openOutwardModal}
        setOpenOutwardModal={setOpenOutwardModal}
        onSuccessFunction={getCompanyList}
      />
    </>
  );
};

export default withPageGuard(EmptyBox, 'Empty box', 'Company List');
