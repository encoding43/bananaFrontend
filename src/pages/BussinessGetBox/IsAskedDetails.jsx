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

export default function IsAskedDetailsList({
  openAddModal,
  setOpenAddModal,
  party,
}) {
  // console.log("partyparty" , party);
  
  const [totalPages, setTotalPages] = React.useState(1);
  const [pageState, setPageState] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [sorting, setSorting] = React.useState([]);
  // const [data, setData] = React.useState(party);
  const { token } = useAuth();

  const handleClose = () => {
    setOpenAddModal(false);
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
        accessorKey: 'ownerName',
        header: 'Owner Name',
        size: 150,
        enableColumnActions: false,
        enableSorting: false,
      },
      {
        accessorKey: 'companyEmail',
        header: 'Company Email',
        size: 150,
        enableColumnActions: false,
        enableSorting: false,
      },
      {
        accessorKey: 'companyAddress',
        header: 'Company Address',
        size: 150,
        enableColumnActions: false,
        enableSorting: false,
      },
      //   {
      //     accessorKey: 'amountDue',
      //     header: 'Amount Due',
      //     size: 150,
      //     enableColumnActions: false,
      //     enableSorting: false,
      //   },
      //   {
      //     accessorKey: 'receivedAmount',
      //     header: 'Received Amount',
      //     size: 150,
      //     enableColumnActions: false,
      //     enableSorting: false,
      //   },
      //   {
      //     accessorKey: 'receivedDate',
      //     header: 'Receiving Date',
      //     size: 150,
      //     enableColumnActions: false,
      //     enableSorting: false,
      //   },
    ],
    [pageState.pageIndex],
  );

  return (
    <Dialog
      open={openAddModal}
      onClose={handleClose}
      fullWidth={true}
      maxWidth={'md'}
    >
      <DialogTitle>IsAsked Details</DialogTitle>
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
            data={party}
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
                companyRate: true,
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
