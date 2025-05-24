import React, { useEffect, useMemo, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { Button, TextField, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { getAPIAuth, postAPIAuth } from '../../service/apiInstance';
import { toast } from 'sonner';
import { useAuth } from '../../hooks/useAuth';
import CompanyBillList from './CompanyBillList';
import { withPageGuard } from '../../utils/withPageGuard';
import moment from 'moment';
import WhatsAppComponent from '../../components/whatsApp/WhatsAppComponent';
import AddPaymentModal from './AddPayment';
import AddReceivingPaymentModal from './ReceivingPayment';
import { useSelector } from 'react-redux';
import { useCheckPermission } from '../../utils/useCheckPermission';

const CommissionAgentBill = () => {
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
  const [modaladdpayment, setModalPayment] = useState({});
  const [modalreceivingpayment, setModalRecivingPayment] = useState({});
  const [companyType, setCompanyType] = useState('perKg');
  const user = useSelector((state) => state.user);

  //
  const checkAddReceivedPaymentPermission = useCheckPermission(
    'Company bill',
    'Add received payment',
  );
  const checkPaymentReminderPermission = useCheckPermission(
    'Company bill',
    'Payment reminder',
  );
  // const checkEditInPerBoxPermission = useCheckPermission(
  //   'Company bill',
  //   'Edit in per box cal.',
  // );
  const checkNotificationPermission = useCheckPermission(
    'Company bill',
    'notification',
  );

  //

  console.log('datadatadata', data);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getAPIAuth(
        `supplier/company/companyBill?page=${
          pageState.pageIndex + 1
        }&perPage=${pageState.pageSize}&search=${globalFilter == undefined ? '' : globalFilter}&sortBy=${
          sorting?.length ? sorting?.[0]?.id : ''
        }&sortOrder=${
          sorting?.length ? (sorting?.[0]?.desc ? 'desc' : 'asc') : ''
        }&type=${companyType}`,
        token,
      );

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
  }, [pageState?.pageIndex, token, globalFilter, sorting, companyType]);

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
      companyId: row.original._id,
      scheduleDate: inputValues[rowIndex]?.date,
      recivedAmount: inputValues[rowIndex]?.payment,
      initialAmount: String(row.original.amountDue),
      isSchedule: true,
    };
    try {
      const res = await postAPIAuth(
        `supplier/company/sheduleBill`,
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
      companyId: row.original._id,
      recivedAmount: inputValues[rowIndex]?.payment,
      initialAmount: String(row.original.amountDue),
      scheduleDate: inputValues[rowIndex]?.date,
      isSchedule: false,
    };
    try {
      const res = await postAPIAuth(
        `supplier/company/sheduleBill`,
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
        `supplier/company/delScheduleBill?companyId=${row.original._id}`,
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

  const handleAddPayment = (item) => {
    setModalPayment(item);
    setOpenAddPayment(true);
  };

  const handleReminderDate = (item) => {
    setModalRecivingPayment(item);
    setOpenAddReceivingPayment(true);
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
        accessorKey: 'companyName',
        header: 'Party Name ',
        size: 150,
        enableColumnActions: false,
        enableSorting: false,
        Cell: ({ row }) => (
          <button
            className="text-blue-600 hover:font-medium capitalize text-left"
            onClick={() => handlePartyClick(row.original)}
          >
            {row.original.companyAliasName}
          </button>
        ),
      },
      {
        accessorKey: 'amountDue',
        header: 'Amount Due',
        size: 150,
        enableColumnActions: false,
        enableSorting: false,
      },
      {
        accessorKey: 'addPayment',
        header: 'Add Payment & Date',
        size: 300,
        enableColumnActions: false,
        enableSorting: false,
        Cell: ({ row }) => {
          console.log({ row });
          return (
            <Box className="flex gap-4 ">
              {checkAddReceivedPaymentPermission ? (
                <button
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-black px-3 py-2 text-center font-medium text-white hover:bg-opacity-90"
                  onClick={() => {
                    handleAddPaymentClick(row.index, 'payment'),
                      handleAddPayment(row.original);
                  }}
                >
                  Add Payment
                </button>
              ) : (
                ''
              )}

              {checkPaymentReminderPermission ? (
                <button
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-black px-3 py-2 text-center font-medium text-white hover:bg-opacity-90"
                  onClick={() => {
                    handleAddPaymentClick(row.index, 'date'),
                      handleReminderDate(row.original);
                  }}
                >
                  Reminder Date
                </button>
              ) : (
                ''
              )}
            </Box>
          );
        },
      },
      {
        accessorKey: 'companyName',
        header: 'ScheduleDetails ',
        size: 200,
        enableColumnActions: false,
        enableSorting: false,
        Cell: ({ row }) => {
          // console.log("ddddddddsfaadfsa" , row.original);
          return (
            <>
              {row?.original?.isSchedule ? (
                <>
                  <div>
                    <span>
                      {' '}
                      Date :-{' '}
                      <b>
                        {moment(row?.original?.scheduleDate).format(
                          'YYYY-MM-DD',
                        )}
                      </b>
                    </span>{' '}
                    <br />
                    <span>
                      {' '}
                      Amount :- <b>{row?.original?.scheduleAmount}</b>
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <p>N/A</p>
                  </div>
                </>
              )}
            </>
          );
        },
      },

      ...(checkNotificationPermission
        ? [
            {
              header: 'Notification',
              size: 150,
              enableColumnActions: false,
              enableSorting: false,
              Cell: ({ row }) =>
                row?.original?.scheduleDate ? (
                  <WhatsAppComponent
                    phoneNumber={row?.original?.companyMobile}
                    message={`Dear%20${row?.original?.companyName},%0A%0AI%20hope%20you%20are%20doing%20well.%0A%0AThis%20is%20a%20gentle%20reminder%20regarding%20the%20pending%20payments%20scheduled%20as%20per%20our%20agreed%20dates.%20Below%20are%20the%20details:%0A%0A%20Due%20Date:%20${moment(row?.original?.scheduleDate).format('DD-MM-YYYY')}%0A%20Amount:%20${row?.original?.scheduleAmount}%0A%0ATotal%20Due%20Amount:%20${row?.original?.amountDue}%0A%0APlease%20ensure%20the%20payments%20are%20made%20as%20per%20the%20agreed%20schedule.%20If%20you%20have%20already%20made%20any%20payments,%20kindly%20disregard%20this%20reminder%20for%20those%20specific%20amounts.%0A%0AFor%20any%20queries,%20feel%20free%20to%20reach%20out%20to%20us.%0A%0AThank%20you%20for%20your%20prompt%20attention.%0A%0ABest%20regards,%0A${user?.data?.ownerName}%0A${user?.data?.companyName}%0A${user?.data?.ownerMobile}`}
                  />
                ) : (
                  ''
                ),
            },
          ]
        : []),
    ],
    [
      pageState.pageIndex,
      activeInputs,
      inputValues,
      checkAddReceivedPaymentPermission,
      checkPaymentReminderPermission,
      checkNotificationPermission,
    ],
  );

  const handlePartyClick = (party) => {
    setSelectedParty(party);
    setOpenAddModal(true);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <Breadcrumb pageName="CommissionAgent Bill" />
        <select
          onChange={(e) => setCompanyType(e.target.value)}
          className="bg-white rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
        >
          <option value="perKg">Per Kg</option>
          <option value="perBox">Per Box</option>
        </select>
      </div>
      <div className="table-container capitalize">
        <MaterialReactTable
          columns={columns}
          data={data}
          paginationDisplayMode={'pages'}
          manualPagination
          rowCount={totalPages}
          enableDensityToggle={false}
          enableColumnFilters={false}
          initialState={{
            density: 'comfortable',
            columnVisibility: {
              laborName: false,
              companyName: true,
              rate: false,
              weight: true,
              wastage: false,
              coldStorage: false,
              companyRate: false,
              companyWastage: false,
            },
          }}
          manualFiltering={true} //turn off client-side filtering
          onGlobalFilterChange={setGlobalFilter} //hoist internal global state to your state
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
      {openAddModal && (
        <CompanyBillList
          openAddModal={openAddModal}
          setOpenAddModal={setOpenAddModal}
          party={selectedParty}
          type={companyType}
        />
      )}
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

export default withPageGuard(CommissionAgentBill, 'Company bill', 'List');
