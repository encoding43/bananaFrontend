import React, { useEffect, useMemo, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';
import { FaCalendarAlt } from 'react-icons/fa';
import { IoMdNotifications } from 'react-icons/io';

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
import { getAPIAuth, postAPIAuth } from '../../service/apiInstance';
import { toast } from 'sonner';
import { useAuth } from '../../hooks/useAuth';
// import CompanyBillList from './CompanyBillList';
import LabourBillList from './LabourBillList';
import { withPageGuard } from '../../utils/withPageGuard';
import WhatsAppComponent from '../../components/whatsApp/WhatsAppComponent';
import moment from 'moment';
import AddPaymentModal from './AddPayment';
import AddReceivingPaymentModal from './ReceivingPayment';
import { CheckCircle } from '@mui/icons-material';
import ExportButtonContent from '../../utils/ExportButtonContent';
import { useCheckPermission } from '../../utils/useCheckPermission';

const BussinessPaySalary = () => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });
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
  const [year, setYear] = React.useState(currentYear);
  const [month, setMonth] = React.useState(currentMonth);
  const [modaladdpayment, setModalPayment] = useState({});
  const [modalreceivingpayment, setModalRecivingPayment] = useState({});

  const checkMarkAttendancePermission = useCheckPermission(
    'B.Intelligence-salary',
    'mark attendance',
  );
  const checkNotificationPermission = useCheckPermission(
    'B.Intelligence-salary',
    'notification of leave',
  );
  const checkaddPaymentPermission = useCheckPermission(
    'B.Intelligence-salary',
    'add payment',
  );
  const checkExportPermission = useCheckPermission(
    'B.Intelligence-salary',
    'export',
  );

  console.log('checkMarkAttendancePermission', checkMarkAttendancePermission);

  const monthNumber = moment(month, 'MMMM').format('MM');

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getAPIAuth(
        `/Supplier/getUserSalary?page=${pageState.pageIndex + 1}&perPage=${pageState.pageSize}&year=${year}&month=${monthNumber}&search=${globalFilter == undefined ? '' : globalFilter}&sortBy=${sorting?.length ? sorting?.[0]?.id : ''}&sortOrder=${sorting?.length ? (sorting?.[0]?.desc ? 'desc' : 'asc') : ''}`,
        token,
      );

      if (res?.data?.success) {
        setData(res?.data?.data?.[0]?.documents || []);
        setTotalPages(res?.data?.data?.[0]?.pagination?.totalChildrenCount);

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
        accessorKey: 'username',
        header: 'User',
        size: 120,
        enableColumnActions: false,
        enableSorting: false,
        Cell: ({ row }) => <div>{row?.original?.userId?.username}</div>,
      },
      {
        accessorKey: 'role',
        header: 'Role',
        size: 100,
        enableColumnActions: false,
        enableSorting: false,
        Cell: ({ row }) => <div>{row?.original?.userId?.role}</div>,
      },
      {
        accessorKey: 'salary',
        header: 'Salary',
        size: 100,
        enableColumnActions: false,
        enableSorting: false,
      },
      {
        accessorKey: 'allowedLeaves',
        header: 'Allowed Off Days',
        size: 100,
        enableColumnActions: false,
        enableSorting: false,
        Cell: ({ row }) => (
          <div>
            {row?.original?.userId?.allowedLeaves
              ? row?.original?.userId?.allowedLeaves
              : '-'}
          </div>
        ),
      },
      {
        accessorKey: 'leave',
        header: 'Leave Taken',
        size: 100,
        enableColumnActions: false,
        enableSorting: false,
      },
      {
        header: 'Amount Payable',
        size: 100,
        enableColumnActions: false,
        enableSorting: false,
        Cell: ({ row }) => row?.original?.totalSalary?.toFixed(0),
      },
      {
        header: 'Amount Paid',
        size: 100,
        enableColumnActions: false,
        enableSorting: false,
        Cell: ({ row }) => {
          const totalPaidAmount = row?.original?.amount?.length
            ? row?.original?.amount?.reduce(
                (sum, transaction) =>
                  sum + (transaction?.amount ? transaction?.amount : 0),
                0,
              )
            : 0;
          return <div>{totalPaidAmount}</div>;
        },
      },
      {
        header: 'Remaining Payable Amount',
        size: 200,
        enableColumnActions: false,
        enableSorting: false,
        Cell: ({ row }) => {
          const totalPaidAmount = row?.original?.amount?.length
            ? (
                row?.original?.totalSalary -
                row?.original?.amount?.reduce(
                  (sum, transaction) =>
                    sum + (transaction?.amount ? transaction?.amount : 0),
                  0,
                )
              )?.toFixed(0)
            : row?.original?.totalSalary?.toFixed(0);
          return <div>{totalPaidAmount}</div>;
        },
      },

      ...(checkMarkAttendancePermission
        ? [
            {
              accessorKey: 'markAttendance',
              header: 'Mark Attendance',
              size: 80,
              enableColumnActions: false,
              enableSorting: false,
              Cell: ({ row }) => (
                <div
                  className="flex items-center"
                  onClick={() => handleReminderDate(row.original)}
                >
                  <FaCalendarAlt className="text-black-500 text-xl align-center flex justify-center" />
                </div>
              ),
            },
          ]
        : []),
      // ...(checkNotificationPermission
      //   ? [
      //       {
      //         accessorKey: 'notificationOfLeaves',
      //         header: 'Notification of Leaves',
      //         size: 100,
      //         enableColumnActions: false,
      //         enableSorting: false,
      //         Cell: ({ row }) => (
      //           <div className="flex items-center">
      //             <IoMdNotifications className="text-black-500 text-xl align-center flex justify-center" />
      //           </div>
      //         ),
      //       },
      //     ]
      //   : []),

      ...(checkaddPaymentPermission
        ? [
            {
              accessorKey: 'addPayment',
              header: 'Add Payment & Date',
              size: 150,
              enableColumnActions: false,
              enableSorting: false,
              Cell: ({ row }) => (
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
              ),
            },
          ]
        : []),
    ],
    [
      pageState.pageIndex,
      activeInputs,
      inputValues,
      checkaddPaymentPermission,
      checkNotificationPermission,
      checkMarkAttendancePermission,
    ],
  );

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
  const apikey = `Supplier/getUserSalary?year=${year}&month=${monthNumber}`;
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <Breadcrumb pageName="Pay Salary" />

        {checkExportPermission ? (
          <ExportButtonContent
            apikey={apikey}
            year={year}
            months={monthNumber}
          />
        ) : (
          ''
        )}
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
      <div className="table-container capitalize">
        <MaterialReactTable
          columns={columns}
          data={data}
          paginationDisplayMode={'pages'}
          manualPagination
          enableDensityToggle={false}
          rowCount={totalPages}
          enableColumnFilters={false}
          initialState={{
            density: 'comfortable',
          }}
          manualFiltering={true}
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

export default withPageGuard(
  BussinessPaySalary,
  'B.Intelligence-salary',
  'mark attendance',
);
