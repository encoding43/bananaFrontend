import React, { useEffect, useMemo, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';
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
import moment from 'moment';
import CompanyFarmerLedgerModal from './CompanyFarmerModal';
import ExportButtonContent from '../../utils/ExportButtonContent';
import { withPageGuard } from '../../utils/withPageGuard.jsx';
import { useCheckPermission } from '../../utils/useCheckPermission.jsx';

const CompanyFarmerLedger = () => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });
  const [openAddModal, setOpenAddModal] = React.useState(false);
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
  const [totalsAmount, setTotalAmout] = useState({});

  const lastDateOfMonth = moment(`${year}-${month}`, 'YYYY-MMMM').endOf(
    'month',
  );
  const formattedLastDate = lastDateOfMonth.format('YYYY-MM-DD');
  const checkExportPermission = useCheckPermission(
    'Audit-farmer ledger',
    'export',
  );
  const checkFalseEntryPermission = useCheckPermission(
    'Audit-farmer ledger',
    'Add false entry',
  );

  console.log('formattedLastDateformattedLastDate', data);

  console.log('20252025', { year, month });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getAPIAuth(
        `farmer/farmerLedger?page=${pageState.pageIndex + 1}&perPage=${pageState.pageSize}&search=${globalFilter == undefined ? '' : globalFilter}&sortBy=${sorting?.length ? sorting?.[0]?.id : ''}&sortOrder=${sorting?.length ? (sorting?.[0]?.desc ? 'desc' : 'asc') : ''}`,
        token,
      );
      console.log('ress2025202520252025', res);

      if (res?.data?.success) {
        setData(res?.data?.data?.documents || []);
        setTotalAmout(res?.data?.data?.totals || {});

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

  const handleInputChange = (rowIndex, field, value) => {
    setInputValues((prev) => ({
      ...prev,
      [rowIndex]: {
        ...prev[rowIndex],
        [field]: value,
      },
    }));
  };

  const handleSave = async (rowIndex, row) => {
    console.log('supplieorBill', { row, inputValues });
    const paymentData = inputValues[rowIndex];
    console.log('Saving payment data:', paymentData);
    setActiveInputs((prev) => ({
      ...prev,
      [rowIndex]: true,
    }));
    if (!inputValues[rowIndex]?.payment) {
      toast.error('Please Add Amount');
      return;
    }
    if (inputValues[rowIndex]?.date === 'Invalid date') {
      toast.error('Please Select Schedule Date');
      return;
    }
    const payload = {
      laborId: row.original._id,
      scheduleDate: inputValues[rowIndex]?.date,
      recivedAmount: inputValues[rowIndex]?.payment,
      initialAmount: String(row.original.amountDue),
      isSchedule: true,
    };
    try {
      const res = await postAPIAuth(
        `supplier/labor/scheduleLaborBill`,
        payload,
        token,
      );

      if (res?.status === 200) {
        toast.success('Schedule Added Successfully');
        fetchData();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSaveAmount = async (rowIndex, row) => {
    const paymentData = inputValues[rowIndex];
    console.log('Saving payment data:', paymentData);
    setActiveInputs((prev) => ({
      ...prev,
      [rowIndex]: true,
    }));

    if (!inputValues[rowIndex]?.payment) {
      toast.error('Please Add Amount');
      return;
    }
    if (inputValues[rowIndex]?.date === 'Invalid date') {
      toast.error('Please Select Schedule Date');
      return;
    }
    const payload = {
      laborId: row.original._id,
      recivedAmount: inputValues[rowIndex]?.payment,
      initialAmount: String(row.original.amountDue),
      scheduleDate: inputValues[rowIndex]?.date,
      isSchedule: false,
    };
    try {
      const res = await postAPIAuth(
        `supplier/labor/scheduleLaborBill`,
        payload,
        token,
      );
      console.log(res, 'fjfjfjfjfjfjfj');

      if (res?.status === 200) {
        toast.success('Amount Added Successfully');
        fetchData();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteCompanySchedule = async (row) => {
    try {
      const res = await getAPIAuth(
        `supplier/labor/delScheduleLaborBill?laborId=${row.original._id}`,
        token,
      );
      if (res?.status === 200) {
        toast.success('Schedule Deleted Successfully');
        fetchData();
      }
      console.log(res, 'uuuuuuuuuuuuuuu');
    } catch (error) {
      console.log(error);
    }
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
        accessorKey: 'farmerName',
        header: 'Farmer Name ',
        size: 150,
        enableColumnActions: false,
        enableSorting: false,
        Cell: ({ row }) => (
          <button
            className="text-blue-600 hover:font-medium capitalize"
            onClick={() => handlePartyClick(row.original)}
          >
            {row.original.farmerName}
          </button>
        ),
      },
      {
        accessorKey: 'mobileNo',
        header: 'Mobile',
        size: 150,
        enableColumnActions: false,
        enableSorting: false,
      },
      {
        accessorKey: 'location',
        header: 'Loacation',
        size: 150,
        enableColumnActions: false,
        enableSorting: false,
      },
      {
        accessorKey: 'amountDue',
        header: 'Total Due',
        size: 150,
        enableColumnActions: false,
        enableSorting: false,
      },
    ],
    [pageState.pageIndex, activeInputs, inputValues],
  );

  const handlePartyClick = (party) => {
    // console.log("Labour Team Name" , party);

    setSelectedParty(party);
    setOpenAddModal(true);
  };
  const handleYearChange = (event) => {
    setYear(event.target.value);
  };

  const handleMonthChange = (event) => {
    setMonth(event.target.value);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <Breadcrumb pageName="Farmers Ledger" />

        {checkExportPermission ? (
          <ExportButtonContent apikey="farmer/farmerLedger" />
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
      {/* </DefaultLayout> */}
      <CompanyFarmerLedgerModal
        openAddModal={openAddModal}
        setOpenAddModal={setOpenAddModal}
        party={selectedParty}
        totalsAmount={totalsAmount}
        fetchDataGet={fetchData}
      />
    </>
  );
};

export default withPageGuard(
  CompanyFarmerLedger,
  'Audit-farmer ledger',
  'List',
);
