import React, { useEffect, useMemo, useState } from 'react';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../../layout/DefaultLayout';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import {
  Button,
  TextField,
  Box,
  Typography,
  Select,
  MenuItem,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { getAPIAuth, postAPIAuth } from '../../../service/apiInstance';
import { toast } from 'sonner';
import { useAuth } from '../../../hooks/useAuth';
// import CompanyBillList from './CompanyBillList';
import LabourBillList from './LabourBillList';
import { withPageGuard } from '../../../utils/withPageGuard';
import WhatsAppComponent from '../../../components/whatsApp/WhatsAppComponent';
import moment from 'moment';
import AddPaymentModal from './AddPayment';
import AddReceivingPaymentModal from './ReceivingPayment';
import { useCheckPermission } from '../../../utils/useCheckPermission';

const TransportPaymet = () => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });
  const [openAddModal, setOpenAddModal] = React.useState(false);
  const [openAddPayment, setOpenAddPayment] = React.useState(false);
  const [openAddReceivingPayment, setOpenAddReceivingPayment] =
    React.useState(false);
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [pageState, setPageState] = useState({ pageIndex: 0, pageSize: 10 });
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState([]);
  const { token } = useAuth();
  const [activeInputs, setActiveInputs] = useState({});
  const [inputValues, setInputValues] = useState({});
  const [selectedParty, setSelectedParty] = useState(null);
  const [year, setYear] = React.useState(currentYear);
  const [month, setMonth] = React.useState(currentMonth);
  const [modaladdpayment, setModalPayment] = useState({});
  const [modalreceivingpayment, setModalRecivingPayment] = useState({});

  // console.log("wwwwwwwwwwyear" , year);

  const monthNumber = moment(month, 'MMMM').format('M');

  // console.log("formattedLastDateformattedLastDate" , monthNumber);

  console.log('20252025', { year, month });
  const checkAddPaymentPermission = useCheckPermission('Trans.Payment', 'Add Payment');
  // const checkExportPermission = useCheckPermission('Trans.Payment', 'Pay.details Export');


  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getAPIAuth(
        `transport/transportBill?page=${pageState.pageIndex + 1}&perPage=${pageState.pageSize}&year=${year}&month=${monthNumber}&search=${globalFilter == undefined ? '' : globalFilter}&sortBy=${sorting?.length ? sorting?.[0]?.id : ''}&transportType=dailyWeight&sortOrder=${sorting?.length ? (sorting?.[0]?.desc ? 'desc' : 'asc') : ''}`,
        token,
      );
      console.log('ress2025202520252025', res);

      if (res?.data?.success) {
        setData(res?.data?.data?.documents || []);

        console.log(res?.data?.data?.documents, 'uuuuuuuuuuuuu');
        const active = res?.data?.data?.documents.map((item, i) => {
          return (i = item.isSchedule);
        });
        const date = res?.data?.data?.documents.map((item, i) => {
          const dateformet = moment(item.scheduleDate).format('YYYY-MM-DD');
          const amount = item?.scheduleAmount;
          return (i = {
            date: dateformet,
            payment: item?.isSchedule ? amount : '',
          });
        });
        setInputValues(date);
        setActiveInputs(active);
        console.log('dateeeeeeeeeeeeeeeee', date);
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
    fetchData();
  }, [pageState?.pageIndex, token, globalFilter, sorting, month, year]);

  const handleAddPaymentClick = (rowIndex, type) => {
    setActiveInputs((prev) => ({
      ...prev,
      [rowIndex]: prev[rowIndex] === type ? null : type,
    }));
  };

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
        accessorKey: 'type',
        header: 'Transport Type ',
        size: 150,
        enableColumnActions: false,
        enableSorting: false,
      },
      {
        accessorKey: '_id',
        header: 'Vehicle Number',
        size: 150,
        enableColumnActions: false,
        enableSorting: false,
        Cell: ({ row }) => (
          <button
            className="text-blue-600 hover:font-medium capitalize"
            onClick={() => handlePartyClick(row.original)}
          >
            {row.original._id}
          </button>
        ),
      },
      {
        accessorKey: 'amountPaybel',
        header: 'Amount Due',
        size: 150,
        enableColumnActions: false,
        enableSorting: false,
        Cell: ({ row }) => <p> {row.original.amountDue}</p>,
      },
    

      ...(checkAddPaymentPermission ?  [
        {
          accessorKey: 'addPayment',
          header: 'Add Payment & Date',
          size: 200,
          enableColumnActions: false,
          enableSorting: false,
          Cell: ({ row }) => {
            return (
              <Box className="flex gap-4">
                <button
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-black px-3 py-2 text-center font-medium text-white hover:bg-opacity-90"
                  onClick={() => {
                    handleAddPaymentClick(row.index, 'payment');
                    handleAddPayment(row.original);
                  }}
                >
                  Add Payment
                </button>
              </Box>
            );
          },
        },
      ]:[]),
    ],
    [pageState.pageIndex, pageState.pageSize, activeInputs, inputValues],
  );

  const handlePartyClick = (party) => {
    console.log('Labour Team Name', party);

    setSelectedParty(party);
    setOpenAddModal(true);
  };
  const handleYearChange = (event) => {
    setYear(event.target.value);
  };

  const handleMonthChange = (event) => {
    setMonth(event.target.value);
  };

  const handleAddPayment = (item) => {
    setModalPayment(item);
    setOpenAddPayment(true);
  };

  const handleReminderDate = (item) => {
    setModalRecivingPayment(item);
    setOpenAddReceivingPayment(true);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <Breadcrumb pageName="Transport Payment" />
      </div>
      <Box
        display="flex"
        justifyContent="end"
        alignItems="center"
        bgcolor=""
        color="white"
        p={2}
      >
        <Typography variant="p" className="text-black">
          Year
        </Typography>
        <Select
          className="dfgyuiorftyuio"
          value={year}
          onChange={handleYearChange}
          placeholder="fdsjdhjh"
          variant="outlined"
          size="small"
          sx={{
            bgcolor: 'white',
            color: 'black',
            width: '100px',
            marginLeft: '8px',
            marginRight: '24px',
          }}
        >
          <MenuItem value={2015}>2015</MenuItem>
          <MenuItem value={2016}>2016</MenuItem>
          <MenuItem value={2017}>2017</MenuItem>
          <MenuItem value={2018}>2018</MenuItem>
          <MenuItem value={2019}>2019</MenuItem>
          <MenuItem value={2020}>2020</MenuItem>
          <MenuItem value={2021}>2021</MenuItem>
          <MenuItem value={2022}>2022</MenuItem>
          <MenuItem value={2023}>2023</MenuItem>
          <MenuItem value={2024}>2024</MenuItem>
          <MenuItem value={2025}>2025</MenuItem>
          <MenuItem value={2026}>2026</MenuItem>
          <MenuItem value={2027}>2027</MenuItem>
          <MenuItem value={2028}>2028</MenuItem>
          <MenuItem value={2029}>2029</MenuItem>
          <MenuItem value={2030}>2030</MenuItem>
          <MenuItem value={2031}>2031</MenuItem>
          {/* Add more years as needed */}
        </Select>
        <Typography variant="p" className="text-black">
          Month
        </Typography>
        <Select
          value={month}
          onChange={handleMonthChange}
          variant="outlined"
          className=""
          size="small"
          sx={{
            bgcolor: 'white',
            color: 'black',
            width: '150px',
            marginLeft: '8px',
          }}
        >
          <MenuItem value="January">January</MenuItem>
          <MenuItem value="February">February</MenuItem>
          <MenuItem value="March">March</MenuItem>
          <MenuItem value="April">April</MenuItem>
          <MenuItem value="May">May</MenuItem>
          <MenuItem value="June">June</MenuItem>
          <MenuItem value="July">July</MenuItem>
          <MenuItem value="August">August</MenuItem>
          <MenuItem value="September">September</MenuItem>
          <MenuItem value="October">October</MenuItem>
          <MenuItem value="November">November</MenuItem>
          <MenuItem value="December">December</MenuItem>
        </Select>
      </Box>
      {/* <div className="table-container capitalize">
        <MaterialReactTable
          columns={columns}
          data={data}
          paginationDisplayMode={'pages'}
          manualPagination
          enableDensityToggle={false}
          rowCount={totalPages}
          enableColumnFilters={false}
          enableGlobalFilter={false}
          initialState={{
            density: 'comfortable',
          }}
          manualFiltering={true}
          onGlobalFilterChange={false}
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
      </div> */}
        <div className="table-container capitalize">
        <MaterialReactTable
          columns={columns}
          data={data}
          paginationDisplayMode={'pages'}
          manualPagination
          enableDensityToggle={false}
          enableFullScreenToggle={false}
          enableGlobalFilter={false}
          enableHiding={false}
          rowCount={totalPages}
          // rowCount={data.length}
          enableColumnFilters={false}
          initialState={{
            density: 'comfortable',
           
          }
        }
        manualFiltering={true}
        onGlobalFilterChange={false}
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
      {/* </DefaultLayout> */}
      <LabourBillList
        openAddModal={openAddModal}
        setOpenAddModal={setOpenAddModal}
        party={selectedParty}
      />

      {openAddPayment && (
        <AddPaymentModal
          openAddModal={openAddPayment}
          setOpenAddModal={setOpenAddPayment}
          AddPaymentData={modaladdpayment}
          fetchData={fetchData}
        />
      )}
      {openAddReceivingPayment && (
        <AddReceivingPaymentModal
          openAddModal={openAddReceivingPayment}
          setOpenAddModal={setOpenAddReceivingPayment}
          AddPaymentData={modalreceivingpayment}
          fetchData={fetchData}
        />
      )}
    </>
  );
};

export default withPageGuard(TransportPaymet , "Trans.Payment" , "List" );

