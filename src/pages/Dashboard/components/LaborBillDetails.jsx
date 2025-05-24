import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { toast } from 'sonner';
import { MaterialReactTable } from 'material-react-table';
import moment from 'moment';
import { useAuth } from '../../../hooks/useAuth';
import { getAPIAuth } from '../../../service/apiInstance';

export default function LabourBillDetails({ showLaborModal, setShowLaborModal, party , formattedLastDate , year }) {

  const [totalPages, setTotalPages] = React.useState(1);
  const [pageState, setPageState] = React.useState({ pageIndex: 0, pageSize: 10 });
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [sorting, setSorting] = React.useState([]);
  const [data, setData] = React.useState([]);
  const { token } = useAuth();


  const handleClose = () => {
    setShowLaborModal(false);
  };

  const fetchData = async () => {
    try {
      const res = await getAPIAuth(
        `supplier/labor/contractorFsBill?laborId=${party?.laborId}&month=${formattedLastDate}&year=${year ? year : "" }&page=${pageState.pageIndex + 1}&perPage=${pageState.pageSize}&search=${globalFilter == undefined ? "" :  globalFilter}&sortBy=${sorting?.length ? sorting?.[0]?.id : ''}&sortOrder=${sorting?.length ? (sorting?.[0]?.desc ? 'desc' : 'asc') : ''}`,
        token
      );     

      if (res?.data?.status == 200) {
        setData(res?.data?.data?.documents || []);
        setTotalPages(res?.data?.data?.pagination?.totalChildrenCount);
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

  const columns = React.useMemo(
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
        accessorKey: 'date',
        header: 'Date',
        size: 120,
        enableColumnActions: false,
        enableSorting: true,
        Cell: ({ cell }) => {
            const dateValue = cell.getValue();
            return dateValue ? moment(dateValue).format('YYYY-MM-DD') : 'N/A';
        },
    },
    {
        accessorKey: 'vehicleNo',
        header: 'V No.',
        size: 80,
        enableColumnActions: false,
    enableSorting: false,
    Cell: ({ cell }) => cell.getValue() || 'N/A',
    },
    {
        accessorKey: 'laborName',
        header: 'Team',
        size: 100,
        enableColumnActions: false,
    enableSorting: true,
    Cell: ({ cell }) => cell.getValue() || 'N/A',
    },
    {
      accessorKey: 'companyAliasName',
      header: 'For',
      size: 120,
      enableColumnActions: false,
  enableSorting: false,
  Cell: ({ cell }) => cell.getValue() || 'N/A',
  },
    {
        accessorKey: 'location',
        header: 'Location',
        size: 300,
        enableColumnActions: false,
    enableSorting: false,
    Cell: ({ cell }) => cell.getValue() || 'N/A',
    },
    {
        accessorKey: 'filledBoxWeight',
        header: 'Remaining Filled box weight',
        size: 150,
        enableColumnActions: false,
    enableSorting: false,
    Cell: ({ cell }) => cell.getValue() || 'N/A',
    },
  
    {
        accessorKey: 'amountPayable',
        header: 'Amount payable to team',
        size: 200,
        enableColumnActions: false,
    enableSorting: false,
    Cell: ({ cell }) => cell.getValue() || 'N/A',
    },
    {
        header: 'Box Detail',
        size: 150,
        enableColumnActions: false,
    enableSorting: false,
    Cell: ({ cell }) => (
      <>
        <div className="flex flex-wrap gap-3 min-w-[350px]">
          {
            cell?.row?.original?.box?.length ? cell?.row?.original?.box?.map(item=> (
              <div className='flex items-center justify-center flex-row text-nowrap border rounded px-1 ps-2 py-1 gap-2'>
                {item?.boxKgType} Kg -  
                <span className=''>{item?.brand}</span>
                <span className='flex bg-black text-white py-[2px] px-2 rounded text-[12px] font-bold'>{item?.count}</span>
              </div>
            )) : '--'
          }
        </div>
      </>
    ),
    }
  
    
    ],
    [pageState.pageIndex]
  );

  return (
    <Dialog open={showLaborModal} onClose={handleClose} fullWidth={true} maxWidth={'lg'}>
      <DialogTitle>Labour Bill Details</DialogTitle>
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
      <DialogActions sx={{ paddingInline: '20px' }}>
      </DialogActions>
    </Dialog>
  );
}
