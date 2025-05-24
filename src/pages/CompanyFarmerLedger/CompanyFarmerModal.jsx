import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { getAPIAuth } from '../../service/apiInstance';
import { toast } from 'sonner';
import { useAuth } from '../../hooks/useAuth';
import { MaterialReactTable } from 'material-react-table';
import moment from 'moment';
import CardDataStats from '../../components/CardDataStats';
import { Toaster } from 'react-hot-toast';
import ExportButtonContent from '../../utils/ExportButtonContent';
import { useCheckPermission } from '../../utils/useCheckPermission.jsx';

export default function CompanyFarmerLedgerModal({
  openAddModal,
  setOpenAddModal,
  party,
}) {
  console.log('party', party);

  const [totalPages, setTotalPages] = React.useState(1);
  const [pageState, setPageState] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [sorting, setSorting] = React.useState([]);
  const [data, setData] = React.useState([]);
  const { token } = useAuth();
  const [totalsAmount, setTotalAmout] = React.useState({});
  console.log('reqqqqqqqqqqqqqqqsssss', data);
  const checkExportPermission = useCheckPermission(
    'Audit-farmer ledger',
    'export',
  );
  const checkFalseEntryPermission = useCheckPermission(
    'Audit-farmer ledger',
    'Add false entry',
  );

  const handleClose = () => {
    setOpenAddModal(false);
  };

  const fetchData = async () => {
    try {
      const res = await getAPIAuth(
        `farmer/farmerLedger?farmerId=${party?._id}&page=${pageState.pageIndex + 1}&perPage=${pageState.pageSize}&search=${globalFilter == undefined ? '' : globalFilter}&sortBy=${sorting?.length ? sorting?.[0]?.id : ''}&sortOrder=${sorting?.length ? (sorting?.[0]?.desc ? 'desc' : 'asc') : ''}`,
        token,
      );

      if (res?.data?.status == 200) {
        setData(res?.data?.data?.documents || []);
        setTotalPages(res?.data?.data?.pagination?.totalChildrenCount);
        setTotalAmout(res?.data?.data?.totals || {});
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch data');
    }
  };

  React.useEffect(() => {
    if (party) {
      fetchData();
    }
  }, [party, pageState.pageIndex, globalFilter, sorting]);

  const handleCheckboxChange = async (e, item) => {
    // console.log("dsfgsgsdhfsdh" , item );

    const isChecked = e.target.checked;
    try {
      const res = await getAPIAuth(
        `farmer/farmerLedgerFalse?id=${item._id}&status=${isChecked}`,
        token,
      );
      // console.log("resresres" , res);

      if (res?.data?.status == 200) {
        toast.success(res?.data?.message);
        console.log('eeeeeeeeeeeeeeeparty', party);
        if (party) {
          // alert("hii")
          fetchData();
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch data');
    }
  };

  const columns = React.useMemo(
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
        size: 150,
        enableColumnActions: false,
        enableSorting: true,
        Cell: ({ cell }) => {
          const dateValue = cell.getValue();
          return dateValue ? moment(dateValue).format('YYYY-MM-DD') : 'N/A';
        },
      },
      {
        accessorKey: 'farmerName',
        header: 'Farmer Name',
        size: 150,
        enableColumnActions: false,
        enableSorting: false,
        Cell: ({ cell }) => cell.getValue() || 'N/A',
      },
      {
        accessorKey: 'particular',
        header: 'Particular',
        size: 150,
        enableColumnActions: false,
        enableSorting: false,
        Cell: ({ cell }) => cell.getValue() || 'N/A',
      },
      {
        accessorKey: 'debitAmount',
        header: 'Debit',
        size: 150,
        enableColumnActions: false,
        enableSorting: true,
        Cell: ({ cell }) => cell.getValue() || 'N/A',
      },
      {
        accessorKey: 'creditAmount',
        header: 'Credit',
        size: 150,
        enableColumnActions: false,
        enableSorting: true,
        Cell: ({ cell }) => cell.getValue() || 'N/A',
      },
      {
        accessorKey: 'charge',
        header: 'Balance',
        size: 150,
        enableColumnActions: false,
        enableSorting: true,
        Cell: ({ cell }) => cell.getValue() || 'N/A',
      },

    
      ...(checkFalseEntryPermission ?  [
        {
          header: 'Box Detail',
          size: 150,
          enableColumnActions: false,
          enableSorting: false,
          Cell: ({ cell }) => {
            const item = cell.row.original;
  
            return (
              <input
                type="checkbox"
                className="mr-2"
                onChange={(e) => handleCheckboxChange(e, item)}
                checked={item.isFalse || false}
              />
            );
          },
        },
      ]:[]),
      // {
      //     accessorKey: 'totalEmptyBoxWeight',
      //     header: 'Box Count',
      //     size: 200,
      //     enableColumnActions: false,
      // enableSorting: false,
      // Cell: ({ cell }) => cell.getValue() || 'N/A',
      // },
    ],
    [pageState.pageIndex, party , checkFalseEntryPermission],
  );
  const apikey = `farmer/farmerLedger?farmerId=${party?._id}`;
  return (
    <Dialog
      open={openAddModal}
      onClose={handleClose}
      fullWidth={true}
      maxWidth={'lg'}
    >
      <div className="pt-10 w-[calc(100%_-_45px)] flex justify-between pr-4 items-start sm:items-center mb-6 gap-3 flex-col sm:flex-row">
        <DialogTitle>Farmers Ledger Details</DialogTitle>

        {checkExportPermission ? (
          <ExportButtonContent apikey={apikey} companyId={party?._id} />
        ) : (
          ''
        )}
      </div>
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>

      <DialogContent>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
          <CardDataStats
            title="Total Credits"
            total={totalsAmount?.totalCreditAmount}
            isworked={false}
          ></CardDataStats>
          <CardDataStats
            title="Total Debit"
            total={totalsAmount?.totalDebitAmount}
            isworked={false}
          ></CardDataStats>
          <CardDataStats
            title="Balance"
            total={totalsAmount?.totalchargeAmount}
            isworked={false}
          ></CardDataStats>
          <CardDataStats
            title="False Entry"
            total={totalsAmount?.totalFalseAmount}
            isworked={false}
          ></CardDataStats>
        </div>
        <div className="table-container capitalize mt-4">
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
              columnVisibility: {
                laborName: false,
                companyName: true,
                rate: false,
                weight: false,
                wastage: false,
                coldStorage: false,
                companyRate: false,
                companyWastage: false,
              },
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
      </DialogContent>
      <DialogActions sx={{ paddingInline: '20px' }}></DialogActions>
    </Dialog>
  );
}
