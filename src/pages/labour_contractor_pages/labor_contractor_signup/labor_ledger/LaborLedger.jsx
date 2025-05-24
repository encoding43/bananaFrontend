import React, { useState, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux';
import Breadcrumb from '../../../../components/Breadcrumbs/Breadcrumb';
import { Box, MenuItem, Select, Typography } from '@mui/material';
import { monthList, yearList } from '../../../../constants/year_month';
import { MaterialReactTable } from 'material-react-table';
import { getAPIAuth } from '../../../../service/apiInstance';
import moment from 'moment';
import { useAuth } from '../../../../hooks/useAuth';

const LaborLedger = () => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });
  const {token} = useAuth();
  const user = useSelector((state) => state?.user);
  const [year, setYear] = React.useState(currentYear);
  const [month, setMonth] = React.useState(currentMonth);
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [pageState, setPageState] = useState({ pageIndex: 0, pageSize: 10 });
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState([]);
  const [showLaborModal, setShowLaborModal] = useState(false)
  const [selectedParty, setSelectedParty] = useState({})
  const lastDateOfMonth = moment(`${year}-${month}`, 'YYYY-MMMM').endOf('month');
  const formattedLastDate = lastDateOfMonth.format('MM');
  const [openAddModal, setOpenAddModal] = useState(false)
  const [AddPaymentData, setAddPaymentData] = useState({})


  const handleYearChange = (event) => {
    setYear(event.target.value);
  };

  const handleMonthChange = (event) => {
    setMonth(event.target.value);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getAPIAuth(
        `supplier/labor/contractorLedger?page=${pageState.pageIndex + 1}&perPage=${pageState.pageSize}&month=${formattedLastDate}&year=${year ? year : "" }&search=${globalFilter == undefined ? "" :  globalFilter}&sortBy=${sorting?.length ? sorting?.[0]?.id : ''}&sortOrder=${sorting?.length ? (sorting?.[0]?.desc ? 'desc' : 'asc') : ''}`,
        token
      );
      console.log("ress2025202520252025",res);
      

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
        setTotalPages(res?.data?.data?.pagination?.totalChildrenCount);
      }
      else{
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
  }, [pageState?.pageIndex, token, globalFilter, sorting , month , year]);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'rowNumber',
        header: 'Sr. No',
        size: 60,
        Cell: ({ row }) => row.index + 1 + pageState.pageIndex * pageState.pageSize,
        enableColumnActions: false,
        enableSorting: false,
      },
      {
        header: 'Date ',
        size: 150,
        enableColumnActions: false,
        enableSorting: false,
        Cell : ({row}) => (
          moment(row?.original?.date).format('DD-MM-YYYY')
        )
      },
      {
        header: 'Particular',
        size: 250,
        enableColumnActions: false,
        enableSorting: false,
        Cell : ({row})=> (
          row?.original?.transactionType === 'credit' ? row?.original?.companyName : row?.original?.laborName
        )
      },
      {
        accessorKey: 'debitAmount',
        header: 'Debit',
        size: 150,
        enableColumnActions: false,
        enableSorting: false,
      },
      {
        accessorKey: 'creditAmount',
        header: 'Credit',
        size: 150,
        enableColumnActions: false,
        enableSorting: false,
      },
      {
        accessorKey: 'balance',
        header: 'Balance',
        size: 300,
        enableColumnActions: false,
        enableSorting: false,
      }
    ],
    [pageState.pageIndex, 
      // activeInputs, inputValues
    ]
  );

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <Breadcrumb pageName="Labor Ledger" />
        <Box display="flex" justifyContent="end" alignItems="center" bgcolor="" color="white" p={2}>
          <Typography variant="p" className='text-black'>Year</Typography>
          <Select
          className='dfgyuiorftyuio'
            value={year}
            onChange={handleYearChange}
            placeholder='fdsjdhjh'
            variant="outlined"
            size="small"
            sx={{
              bgcolor: 'white',
              color: 'black',
              width: '100px',
              marginLeft: '8px',
              marginRight: '24px'
            }}
          >
            {
              yearList?.map(item=> (
                <MenuItem key={item?.value} value={item?.value}>{item?.title}</MenuItem>
              ))
            }
          </Select>
          <Typography variant="p" className='text-black'>Month</Typography>
          <Select
            value={month}
            onChange={handleMonthChange}
            variant="outlined"
            className=''
            size="small"
            sx={{
              bgcolor: 'white',
              color: 'black',
              width: '150px',
              marginLeft: '8px',
            }}
          >
            {
              monthList?.map(item=> (
                <MenuItem key={item?.value} value={item?.value}>{item?.title}</MenuItem>
              ))
            }
          </Select>
        </Box>
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
    </>
  )
}

export default LaborLedger