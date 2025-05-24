import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { Dropdown } from '@mui/base/Dropdown';
import { Menu } from '@mui/base/Menu';
import { MenuButton as BaseMenuButton } from '@mui/base/MenuButton';
import { MenuItem as BaseMenuItem, menuItemClasses } from '@mui/base/MenuItem';
import { styled } from '@mui/system';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import AddIcon from '@mui/icons-material/Add';
// import AddLaborModal from './AddLaborModal';
import { getAPIAuth, postAPIAuth } from '../../service/apiInstance';
import { toast } from 'sonner';
import { useAuth } from '../../hooks/useAuth';
import moment from 'moment';
import { withPageGuard } from '../../utils/withPageGuard';
import FarmerBillAddPaymentModal from './AddPaymentModal';
// import WhatsAppShareComponent from '../../components/whatsApp/WhatsAppShareComponent';
import { useSelector } from 'react-redux';
import ExportButtonContent from '../../utils/ExportButtonContent';
import { useCheckPermission } from '../../utils/useCheckPermission';
import WhatsAppComponent from '../../components/whatsApp/WhatsAppComponent';
import PrintBill from '../../components/PrintBill';
import { useReactToPrint } from 'react-to-print';

const FarmerBill = () => {
  const [openAddModal, setOpenAddModal] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [pageState, setPageState] = useState({ pageIndex: 0, pageSize: 10 });
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState([]);
  const { token } = useAuth();
  const [selectedData, setSelectedData] = useState({});
  const user = useSelector((state) => state.user);
  //
  const checkAddPermission = useCheckPermission('Farmer Bill', 'Add Payment');
  const checkExportPermission = useCheckPermission('Farmer Bill', 'Export');
  const checkBillMessagePermission = useCheckPermission(
    'Farmer Bill',
    'Bill Message',
  );
  const printBillRef = useRef(null);
  //

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getAPIAuth(
        `farmer/getfarmerBill?page=${pageState.pageIndex + 1}&perPage=${pageState.pageSize}&search=${globalFilter == undefined ? '' : globalFilter}&sortBy=${sorting?.length ? sorting?.[0]?.id : ''}&sortOrder=${sorting?.length ? (sorting?.[0]?.desc ? 'desc' : 'aesc') : ''}`,
        token,
      );
      console.log('resresresresresresres', res);
      if (res?.data?.status == 200) {
        // alert('hii');
        setData(res?.data?.data?.farmerBill);
        // const totalCount = res?.data?.data?.[0]?.totalCount || 0;
        setTotalPages(res?.data?.data?.pagination?.totalChildrenCount);
      } else {
        console.log('else m gya');
        setData([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setData([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };
  console.log({ totalPages });

  useEffect(() => {
    fetchData();
  }, [pageState?.pageIndex, token, globalFilter, sorting]);

  const handleDownloadBill = useReactToPrint({
    contentRef: printBillRef,
    content: () => printBillRef.current,
    documentTitle: `${selectedData?.farmerBillData?.farmerName}`,
    onAfterPrint: () => {
      toast.success('Bill downloaded successfully!');
    },
  });

  const Printdata = (data, user) => {
    console.log('data', data);
    console.log('user', user);
    console.log('selectedData', selectedData);
  };

  useEffect(() => {
    console.log('Selected Data for printing:', selectedData);
  }, [selectedData]);

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
      {
        accessorKey: 'date',
        header: 'Date',
        enableColumnActions: false,
        enableSorting: true,
        size: 150,
        Cell: ({ cell }) => {
          const date = cell.getValue();
          return date ? moment(date).format('YYYY-MM-DD') : 'N/A';
        },
      },
      {
        accessorKey: 'vehicleNo',
        header: 'Vehicle No.',
        enableColumnActions: false,
        enableSorting: false,
        size: 150,
        Cell: ({ cell }) => cell.getValue() || 'N/A',
      },
      {
        accessorKey: 'companyName',
        header: 'Alias Name',
        enableColumnActions: false,
        enableSorting: true,
        size: 150,
        Cell: ({ cell }) => cell.getValue() || 'N/A',
      },
      {
        accessorKey: 'laborName',
        header: 'Team',
        enableColumnActions: false,
        enableSorting: true,
        size: 150,
        Cell: ({ cell }) => cell.getValue() || 'N/A',
      },
      {
        accessorKey: 'farmerName',
        header: "Farmer's Name",
        enableColumnActions: false,
        enableSorting: true,
        size: 200,
        Cell: ({ cell }) => {
          return (
            `${cell?.row?.original?.farmerName} (${cell?.row?.original?.farmerMobileNumber})` ||
            'N/A'
          );
        },
      },

      {
        accessorKey: 'weight',
        header: 'Weight',
        enableColumnActions: false,
        enableSorting: false,
        size: 150,
        Cell: ({ cell }) => cell.getValue() || 'N/A',
      },
      {
        accessorKey: 'emptyBoxweight',
        header: 'Empty box weight',
        enableColumnActions: false,
        enableSorting: false,
        size: 150,
        Cell: ({ cell }) => cell.getValue() || 'N/A',
      },
      {
        accessorKey: 'subtotalWeight',
        header: 'Subtotal Weight',
        enableColumnActions: false,
        enableSorting: false,
        size: 150,
        Cell: ({ cell }) => cell.getValue() || 'N/A',
      },
      {
        accessorKey: 'wastage',
        header: 'Wastage',
        enableColumnActions: false,
        enableSorting: false,
        size: 150,
        Cell: ({ cell }) => cell.getValue() || 'N/A',
      },
      {
        accessorKey: 'netWeight',
        header: 'Net weight',
        enableColumnActions: false,
        enableSorting: false,
        size: 150,
        Cell: ({ cell }) => cell.getValue() || 'N/A',
      },
      {
        accessorKey: 'danda',
        header: 'Danda',
        enableColumnActions: false,
        enableSorting: false,
        size: 150,
        Cell: ({ cell }) => cell.getValue() || 'N/A',
      },
      {
        accessorKey: 'totalWeight',
        header: 'Total Weight',
        enableColumnActions: false,
        enableSorting: false,
        size: 150,
        Cell: ({ cell, row }) => {
          const value = cell.getValue() || 'N/A';
          const bgColor = row?.original?.boxColor || 'transparent';

          return (
            <>
              <span className="mr-2">{value}</span>
              <span
                className="size-4 "
                style={{
                  backgroundColor: bgColor,
                  padding: '6px',
                  borderRadius: '40px',
                  display: 'inline-block',
                }}
              ></span>
            </>
          );
        },
      },
      {
        accessorKey: 'weightDifference',
        header: 'Weight Difference',
        enableColumnActions: false,
        enableSorting: false,
        size: 150,
        Cell: ({ cell }) => cell.getValue() || 'N/A',
      },
      {
        accessorKey: 'rate',
        header: 'Rate',
        enableColumnActions: false,
        enableSorting: false,
        size: 150,
        Cell: ({ cell }) => cell.getValue() || 'N/A',
      },
      {
        accessorKey: 'initialAmount',
        header: 'Initial Amount',
        enableColumnActions: false,
        enableSorting: false,
        size: 150,
        Cell: ({ cell }) => cell.getValue() || 'N/A',
      },
      {
        accessorKey: 'labourTransport',
        header: 'Labour Transport',
        enableColumnActions: false,
        enableSorting: false,
        size: 150,
        Cell: ({ cell }) => cell.getValue() || 'N/A',
      },
      {
        accessorKey: 'amountpayable',
        header: 'Amount payable',
        enableColumnActions: false,
        enableSorting: false,
        size: 150,
        Cell: ({ cell }) => cell.getValue() || 'N/A',
      },
      {
        accessorKey: 'exception',
        header: 'EXCEPTION',
        enableColumnActions: false,
        enableSorting: false,
        size: 150,
        Cell: ({ cell }) => cell.getValue() || 'N/A',
      },
      {
        header: 'Jama By',
        enableColumnActions: false,
        enableSorting: false,
        size: 150,
        Cell: ({ row }) =>
          row?.original?.isFruitSupplier
            ? row.original?.jamaBy?.ownerName
            : row.original?.jamaBy?.username,
      },
      {
        accessorKey: 'farmerBillPaymentcolor',
        header: 'Payment Status',
        enableColumnActions: false,
        enableSorting: true,
        size: 150,
        Cell: ({ cell, row }) => {
          const bgColor = cell.getValue() || 'transparent';
          return (
            <>
              <span
                className="text-white size-4 min-h-4 font-semibold text-[12px]"
                style={{
                  backgroundColor: bgColor,
                  borderRadius: '40px',
                  display: 'inline-block',
                }}
              >
                {/* {
                bgColor === 'red' ? 'Delayed' :
                bgColor === 'green' ? 'Nil Payment' :
                ''
              } */}
              </span>
            </>
          );
        },
      },
      ...(checkAddPermission
        ? [
            {
              header: 'Download Bill',
              enableColumnActions: false,
              enableSorting: false,
              size: 150,
              Cell: ({ row }) => (
                <button
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-black px-3 py-2 text-center font-medium text-white hover:bg-opacity-90"
                  onClick={() => {
                    Printdata(row.original, user.data);
                    setSelectedData({
                      companyData: user.data,
                      farmerBillData: row.original,
                    });
                    setTimeout(() => {
                      handleDownloadBill();
                    }, 100);
                  }}
                >
                  Download
                </button>
              ),
            },
          ]
        : []),
      ...(checkBillMessagePermission
        ? [
            {
              header: 'Payment Reminder',
              enableColumnActions: false,
              enableSorting: false,
              size: 150,
              Cell: ({ row }) => (
                <WhatsAppComponent
                  phoneNumber={row?.original?.farmerMobileNumber}
                  message={`${user?.data?.companyName}%0Aदि.${moment(row?.original?.date).format('YYYY-MM-DD')}%0A${row?.original?.farmerName.charAt(0).toUpperCase() + row?.original?.farmerName.slice(1).toLowerCase()}%20%0Aगाडी%20वजन%20%3D%20${row?.original?.weight}%0Aबॉक्स%3D%20${row?.original?.emptyBoxweight}%0Aबाकी%20वजन%20%3D%20${row?.original?.subtotalWeight}%0Aवेस्टेज%20%3D%20${row?.original?.wastage}%0Aएकूण%20वजन%20%3D%20${row?.original?.netWeight}%0Aदांडा%20%3D%20${row?.original?.danda}%0Aएकूण%20वजन%20%3D%20${row?.original?.totalWeight}%0Aदर%20%3D%20${row?.original?.rate}%0Aप्रथम%20रक्कम%20%3D%20${row?.original?.initialAmount}%0Aवाहतूक%20%3D%20${row?.original?.labourTransport}%0Aनिव्वळ%20रक्कम%20%3D%20${row?.original?.amountpayable}`}
                />
              ),
            },
          ]
        : []),
      ...(checkAddPermission
        ? [
            {
              header: 'Add Payment',
              enableColumnActions: false,
              enableSorting: false,
              size: 150,
              Cell: ({ row }) => (
                <button
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-black px-3 py-2 text-center font-medium text-white hover:bg-opacity-90"
                  onClick={() => {
                    setOpenAddModal(true);
                    setSelectedData(row?.original);
                  }}
                >
                  Add Payment
                </button>
              ),
            },
          ]
        : []),
    ],
    [
      pageState?.pageIndex,
      checkAddPermission,
      checkBillMessagePermission,
      checkExportPermission,
      checkAddPermission,
    ],
  );

  return (
    <>
      {/* <DefaultLayout> */}
      <div className="flex justify-between items-start sm:items-center mb-6 gap-3 flex-col sm:flex-row">
        <Breadcrumb pageName="Farmer Bill" />

        {checkExportPermission ? (
          <ExportButtonContent apikey="farmer/getfarmerBill" />
        ) : (
          ''
        )}
      </div>
      <div className="table-container capitalize">
        <MaterialReactTable
          columns={columns}
          data={data}
          paginationDisplayMode={'pages'}
          manualPagination
          // pageCount={totalPages}
          enableDensityToggle={false}
          rowCount={totalPages}
          enableColumnFilters={false}
          initialState={{
            density: 'comfortable',
            columnVisibility: {
              // laborName: false,
              // companyName: true,
              // rate: false,
              // weight: false,
              // wastage: false,
              // coldStorage: false,
              // companyRate: false,
              // companyWastage: false,
              // weightDifference: false
            },
          }}
          manualFiltering={true} //turn off client-side filtering
          onGlobalFilterChange={setGlobalFilter}
          manualSorting={true}
          onSortingChange={setSorting}
          muiPaginationProps={{
            color: 'primary',
            shape: 'rounded',
            showRowsPerPage: false,
            variant: 'outlined',
          }}
          state={{
            pagination: pageState,
            globalFilter,
            sorting,
          }}
          onPaginationChange={(paginationState) => {
            setPageState(paginationState);
          }}
          // onPageSizeChange={(pageSize) => {
          //   setPageState(pageSize);
          // }}
          muiTableProps={{
            sx: {
              fontFamily: 'Satoshi, sans-serif',
              caption: {
                captionSide: 'top',
              },
            },
          }}
          muiTableHeadCellProps={{
            sx: {
              fontSize: '1rem',
              fontWeight: '500',
              paddingInline: '1rem',
              '&:first-child': {
                paddingLeft: '2rem',
              },
            },
          }}
          muiTableBodyCellProps={{
            sx: {
              paddingInline: '1rem',
              '&:first-child': {
                paddingLeft: '2rem',
              },
            },
          }}
        />
      </div>

      <div style={{ display: 'none' }}>
        <PrintBill ref={printBillRef} details={selectedData} />
      </div>

      {openAddModal && (
        <FarmerBillAddPaymentModal
          openAddModal={openAddModal}
          setOpenAddModal={setOpenAddModal}
          fetchData={fetchData}
          selectedData={selectedData}
        />
      )}
    </>
  );
};

export default withPageGuard(FarmerBill, 'Farmer Bill', 'List');
