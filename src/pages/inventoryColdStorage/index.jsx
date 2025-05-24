import React, { useEffect, useMemo, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { MaterialReactTable } from 'material-react-table';
import { useAuth } from '../../hooks/useAuth';
import { getAPIAuth } from '../../service/apiInstance';
import moment from 'moment';
import { button } from '@nextui-org/react';
import ViewBoxDetailsModal from './ViewBoxDetailsModal';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ColdStorageModal from './ColdStorageModal';
import { toast } from 'sonner';
import ColdstorageOutwardModal from './ColdstorageOutward';
import { withPageGuard } from '../../utils/withPageGuard.jsx';
import { useCheckPermission } from '../../utils/useCheckPermission.jsx';

const InventColdStorage = () => {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [pageState, setPageState] = useState({ pageIndex: 0, pageSize: 10 });
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState([]);
  const [openBoxModal, setOpenBoxModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const [selectedItemOutward, setSelectedItemOutward] = useState({});
  console.log('selectedItemOutward', selectedItemOutward);

  const { token } = useAuth();
  const [coldStorageList, setColdStorageList] = React.useState([]);
  const [expanded, setExpanded] = React.useState(false);
  const [selectedColdStprageId, setSelectedColdStorageId] = useState('');
  const [showColdStorageModal, setShowColdStorageModal] = useState(false);
  const [selectedKg, setSelectedKg] = useState([]);
  const [showOutwardModal, setShowOutwardModal] = useState(false);
  const [selectedOutward, setSelectedOutward] = useState({});
  const checkOutwardPermission = useCheckPermission(
    'Inventory - CS',
    'Outward',
  );

  const checkViewPermission = useCheckPermission('Inventory - CS', 'View');

  // const checkExportPermission = useCheckPermission('Manage Labor', 'Export');
  console.log('selectedItemselectedItem', selectedItem);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
    setSelectedColdStorageId(panel);
  };

  // get cold storage data
  const getColdStorageList = async () => {
    try {
      const res = await getAPIAuth('user/getColdStorage');
      if (res?.data?.success) {
        setColdStorageList(res?.data?.data?.user);
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  React.useEffect(() => {
    getColdStorageList();
  }, []);

  const fetchData = async (id) => {
    setLoading(true);
    try {
      const res = await getAPIAuth(
        `coldStorage/inward/get?page=${pageState.pageIndex + 1}&perPage=${pageState.pageSize}&coldStoreId=${selectedColdStprageId}`,
        token,
      );
      if (res?.data?.success) {
        setData(res?.data?.data?.documents || []);
        setTotalPages(res?.data?.data?.pagination?.totalChildrenCount);
      } else {
        setData([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && selectedColdStprageId) {
      fetchData();
    }
  }, [
    pageState?.pageIndex,
    token,
    globalFilter,
    sorting,
    selectedColdStprageId,
  ]);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'rowNumber',
        header: 'Sr. No',
        size: 60,
        Cell: ({ row }) =>
          row.index + 1 + pageState.pageIndex * pageState.pageSize,
        enableColumnActions: false,
        enableSorting: false,
      },
      // {
      //   accessorKey: 'csName',
      //   header: 'Cold Storage',
      //   enableColumnActions: false,
      //   size: 150,
      //   // enableSorting: false
      // },
      {
        header: 'Date',
        enableColumnActions: false,
        size: 200,
        Cell: ({ row }) => moment(row?.original?.time).format('L'),
      },
      {
        accessorKey: 'BillNo',
        header: 'Bill No.',
        enableColumnActions: false,
        size: 150,
        // enableSorting: false
      },
      {
        header: 'Time',
        enableColumnActions: false,
        size: 150,
        enableSorting: false,
        Cell: ({ row }) => moment(row?.original?.time).format('h:mm:ss A'),
      },
      {
        accessorKey: 'partyName',
        header: 'Company Name',
        size: 150,
        enableSorting: false,
        enableColumnActions: false,
      },
      {
        accessorKey: 'VehicleNo',
        header: 'Vehicle No.',
        size: 150,
        enableSorting: false,
        enableColumnActions: false,
      },
      {
        accessorKey: 'DriverMobile',
        header: 'Driver Mobile',
        size: 150,
        enableSorting: false,
        enableColumnActions: false,
      },
      {
        accessorKey: 'UnitLocation',
        header: 'Unit Location',
        size: 150,
        enableSorting: false,
        enableColumnActions: false,
      },
      {
        header: 'Box Weight',
        size: 150,
        enableSorting: false,
        enableColumnActions: false,
        Cell: ({ row }) => row?.original?.Box?.boxKgType,
      },
      {
        header: 'Hands/Qty',
        size: 150,
        enableSorting: false,
        enableColumnActions: false,
        Cell: ({ row }) =>
          row?.original?.Box?.boxKgType < 13 ? (
            row?.original?.Box?.count
          ) : (
            <button
              onClick={() => {
                setOpenBoxModal(true);
                setSelectedItem(row?.original?.Box?.handsRatio);
              }}
              className="inline-flex items-center justify-center text-sm rounded-md bg-black px-4 py-1 text-center font-medium text-white hover:bg-opacity-90 "
            >
              View
            </button>
          ),
      },
      {
        header: 'Total',
        size: 150,
        enableSorting: false,
        enableColumnActions: false,
        Cell: ({ row }) =>
          row?.original?.Box?.boxKgType < 13
            ? row?.original?.Box?.count
            : Object.values(row?.original?.Box?.handsRatio).reduce(
                (sum, value) => sum + value,
                0,
              ),
      },
    ],
    [pageState?.pageIndex],
  );

  const add_Same_Box_Brand_Count_Of_Same_Company = (array, id) => {
    // alert("hiiiiiiiiiii");
    const result = array?.reduce((acc, item) => {
      const {
        partyName,
        Box: { brand, count },
      } = item;

      // Generate a unique key based on partyName and brand
      const key = `${partyName}-${brand}`;

      // If the key already exists in the accumulator, add to the existing count
      if (acc[key]) {
        acc[key].Box.count += count;
      } else {
        // Otherwise, create a new entry in the accumulator
        acc[key] = {
          ...item,
          Box: { ...item.Box, count },
        };
      }

      return acc;
    }, {});

    console.log('wwwwresultresult', result);

    if (result) {
      const finalResult = Object.values(result);
      return finalResult?.map((item) => (
        <div
          onClick={() => {
            if (id >= 13) {
              const data = get_hands_ratio_count(array);
              // console.log("wwwwwwwwwwdatadatadatadatadata" , data);

              setOpenBoxModal(true);
              setSelectedItem(data?.[item?.partyName]?.[item?.Box?.brand]);
            } else {
              toast.error('Hands ratio is not available under 13 Kg box type');
              return;
            }
          }}
          className="flex items-center justify-center flex-row text-nowrap border rounded px-1 ps-2 py-1 gap-2 cursor-pointer"
        >
          {item?.partyName} - <span className="">{item?.Box?.brand}</span>
          <span className="flex bg-black text-white py-[2px] px-2 rounded text-[12px] font-bold">
            {item?.Box?.count}
          </span>
        </div>
      ));
    } else {
      return array?.map((item) => (
        <div className="flex items-center justify-center flex-row text-nowrap border rounded px-1 ps-2 py-1 gap-2">
          {item?.partyName} - {item?.Box?.brand}
          <span className="flex bg-black text-white py-[2px] px-2 rounded text-[12px] font-bold">
            {item?.Box?.count}
          </span>
        </div>
      ));
    }
  };

  const get_hands_ratio_count = (array) => {
    const result = {};

    array.forEach((entry) => {
      const companyName = entry.partyName;
      const boxBrand = entry.Box.brand; // Extract the boxBrand
      const handsRatio = entry.Box.handsRatio;

      // Initialize the company and brand in the result object if they don't exist
      if (!result[companyName]) {
        result[companyName] = {};
      }
      if (!result[companyName][boxBrand]) {
        result[companyName][boxBrand] = {};
      }

      // Sum up each hand ratio based on both companyName and boxBrand
      for (const hand in handsRatio) {
        if (result[companyName][boxBrand][hand]) {
          result[companyName][boxBrand][hand] += Number(handsRatio[hand]);
        } else {
          result[companyName][boxBrand][hand] = Number(handsRatio[hand]);
        }
      }
    });
    return result;
  };

  const OutwanrdHandreatioHandle = (array, id) => {
    if (id >= 13) {
      const data = get_hands_ratio_count(array);
      console.log('wwwwwwwwwwdatadatadatadatadata', data);
      setSelectedItemOutward(data?.Prabhuti?.Star);
    } else {
      // toast.error('Hands ratio is not available under 13 Kg box type')
      return;
    }
  };

  return (
    <>
      <div className="flex justify-between items-start sm:items-center mb-6 gap-3 flex-col sm:flex-row">
        <Breadcrumb pageName="Cold Storage" />
        {/* <button className="inline-flex items-center justify-center gap-2 rounded-md bg-black px-5 py-3 text-center font-medium text-white hover:bg-opacity-90 ">
            <span><AddIcon /></span>
            Add User
          </button> */}
      </div>
      {coldStorageList?.length
        ? coldStorageList?.map((item) => (
            <Accordion
              expanded={expanded === item?._id}
              onChange={handleChange(item?._id)}
              className="mb-3 rounded-md border-0 shadow-none customAccordian customAccordianNew"
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
                className="font-medium"
              >
                {item?.csName}
              </AccordionSummary>
              <AccordionDetails>
                <div className="table-container capitalize">
                  <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                      <thead className="text-xs text-nowrap text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
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
                         
                          {checkViewPermission ? (
                            <th scope="col" className="px-6 py-3">
                            View Details
                          </th>
                          ) : (
                            ''
                          )}
                          {checkOutwardPermission ? (
                            <th scope="col" className="px-6 py-3">
                              Outward
                            </th>
                          ) : (
                            ''
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {data?.length ? (
                          data?.map((el) => {
                            return (
                              // {
                              el?.totalCount > 0 ? (
                                <tr className="bg-white border-b border-slate-300 dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                  <td className="px-6 py-4">{el?.kgType}</td>
                                  <td className="px-6 py-4">
                                    {el?.totalCount}
                                  </td>
                                  <td className="px-6 py-4">
                                    <div className="flex flex-wrap gap-3 min-w-[350px]">
                                      {el?.data?.length
                                        ? add_Same_Box_Brand_Count_Of_Same_Company(
                                            el?.data,
                                            el?.kgType,
                                          )
                                        : '--'}
                                      {/* {
                                              el?.data?.length ? get_hands_ratio_count(el?.data) : ''
                                            } */}
                                    </div>
                                  </td>
                                 
                                  {checkViewPermission ? (
                                    <td className="px-6 py-4">
                                    <button
                                      onClick={() => {
                                        setShowColdStorageModal(true);
                                        setSelectedKg(el?.data);
                                      }}
                                      className="inline-flex items-center justify-center text-sm rounded-md bg-black px-4 py-1 text-center font-medium text-white hover:bg-opacity-90 "
                                    >
                                      View
                                    </button>
                                  </td>
                                  ) : (
                                    ''
                                  )}
                                  {checkOutwardPermission ? (
                                    <td className="px-6 py-4">
                                      <button
                                        onClick={() => {
                                          setShowOutwardModal(true);
                                          setSelectedOutward(el);
                                          // add_Same_Box_Brand_Count_Of_Same_Company(el?.data, el?.kgType)
                                          OutwanrdHandreatioHandle(
                                            el?.data,
                                            el?.kgType,
                                          );
                                        }}
                                        className="inline-flex items-center justify-center text-sm rounded-md bg-black px-4 py-1 text-center font-medium text-white hover:bg-opacity-90 "
                                      >
                                        Outward
                                      </button>
                                    </td>
                                  ) : (
                                    ''
                                  )}
                                </tr>
                              ) : (
                                ''
                              )
                              // }
                            );
                          })
                        ) : (
                          <tr className="bg-white border-b border-slate-300 dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                            <td
                              colSpan={4}
                              className="px-6 py-6 text-center text-bold"
                            >
                              No Data Found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </AccordionDetails>
            </Accordion>
          ))
        : 'No Data Available'}

      {
        <ColdStorageModal
          showColdStorageModal={showColdStorageModal}
          setShowColdStorageModal={setShowColdStorageModal}
          data={selectedKg}
        />
      }

      {openBoxModal ? (
        <ViewBoxDetailsModal
          openBoxModal={openBoxModal}
          setOpenBoxModal={setOpenBoxModal}
          selectedItem={selectedItem}
        />
      ) : (
        ''
      )}
      {showOutwardModal ? (
        <ColdstorageOutwardModal
          showOutwardModal={showOutwardModal}
          setShowOutwardModal={setShowOutwardModal}
          selectedOutward={selectedOutward}
          fetchData={fetchData}
          // selectedItem={selectedItemOutward}
        />
      ) : (
        ''
      )}
    </>
  );
};

export default withPageGuard(InventColdStorage, 'Inventory - CS', 'List');
