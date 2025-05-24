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
import { button } from '@nextui-org/react';
import CsChargeModal from './CsChargeModal';
import ExportButtonContent from '../../utils/ExportButtonContent';
import { useCheckPermission } from '../../utils/useCheckPermission';

import { useReactToPrint } from 'react-to-print';
import { use } from 'react';
import CompanyBill from '../../components/CompanyBill';
export default function CompanyBillList({
  openAddModal,
  setOpenAddModal,
  party,
  type,
}) {
  const [totalPages, setTotalPages] = React.useState(1);
  const [pageState, setPageState] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [sorting, setSorting] = React.useState([]);
  const [data, setData] = React.useState([]);
  const { token } = useAuth();
  const [showChargeModal, setShowChargeModal] = React.useState(false);
  const [selectedHarvesting, setSelectHarvesting] = React.useState({});
  const checkExportPermission = useCheckPermission('Company bill', 'export');
  const handleClose = () => {
    setOpenAddModal(false);
  };
  const [selectedData, setSelectedData] = React.useState({});
  const companyBillRef = React.useRef(null);
  const fetchData = async () => {
    try {
      const res = await getAPIAuth(
        `supplier/company/companyBill?companyId=${party._id}&page=${pageState.pageIndex + 1}&perPage=${pageState.pageSize}&search=${globalFilter == undefined ? '' : globalFilter}&sortBy=${sorting?.length ? sorting?.[0]?.id : ''}&type=${type}&sortOrder=${sorting?.length ? (sorting?.[0]?.desc ? 'desc' : 'asc') : ''}`,
        token,
      );
      console.log('ressssssssssssssssssssssssssssssssssssssssssss', res);
      if (res?.data?.success) {
        setData(res?.data?.data?.documents || []);
        setTotalPages(res?.data?.data?.pagination?.totalChildrenCount);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch data');
    }
  };

  const handleDownloadBill = useReactToPrint({
    contentRef: companyBillRef,
    content: () => companyBillRef.current,
  });

  React.useEffect(() => {
    if (party) {
      fetchData();
    }
  }, [party, pageState.pageIndex, globalFilter, sorting]);

  // const columns = React.useMemo(
  //   () => [
  //     {
  //       accessorKey: 'rowNumber',
  //       header: 'Sr. No',
  //       size: 60,
  //       Cell: ({ row }) =>
  //         row.index + 1 + pageState.pageIndex * pageState.pageSize,
  //       enableColumnActions: false,
  //       enableSorting: false,
  //     },
  //     {
  //       accessorKey: 'createdAt',
  //       header: 'Date',
  //       size: 150,
  //       enableColumnActions: false,
  //       enableSorting: true,
  //       Cell: ({ cell }) => {
  //         const dateValue = cell.getValue();
  //         if (!dateValue) return 'N/A';

  //         const formattedDate = new Date(dateValue).toLocaleDateString(
  //           undefined,
  //           {
  //             year: 'numeric',
  //             month: '2-digit',
  //             day: '2-digit',
  //           },
  //         );

  //         return formattedDate;
  //       },
  //     },
  //     {
  //       accessorKey: 'companyName',
  //       header: 'Party Name',
  //       size: 150,
  //       enableColumnActions: false,
  //       enableSorting: false,
  //     },
  //     {
  //       accessorKey: 'totalWeight',
  //       header: 'Total Weight',
  //       size: 150,
  //       enableColumnActions: false,
  //       enableSorting: false,
  //       Cell: ({ cell }) => Number(cell.getValue()) || 'N/A',
  //     },
  //     ...(
  //       type === 'perBox' ? [{
  //           header: 'CS Charge/Container',
  //           size: 100,
  //           enableColumnActions: false,
  //           enableSorting: false,
  //           Cell : ({row}) => (
  //             <button
  //               onClick={()=> {
  //                 setSelectHarvesting(row?.original)
  //                 setShowChargeModal(true)
  //               }}
  //               className='inline-flex items-center justify-center gap-2 rounded-md bg-black px-3 py-2 text-center font-medium text-white hover:bg-opacity-90'>View</button>
  //           )

  //       }] : []
  //     ),
  //     {
  //       accessorKey: 'companyRate',
  //       header: 'Company Rate',
  //       size: 150,
  //       enableColumnActions: false,
  //       enableSorting: false,
  //     },
  //     {
  //       accessorKey: 'initalAmount',
  //       header: 'Initial Amount',
  //       size: 150,
  //       enableColumnActions: false,
  //       enableSorting: false,
  //       Cell: ({ cell }) => Number(cell.getValue()) || 'N/A',
  //     },
  //     {
  //       accessorKey: 'serviceCharageAmount',
  //       header: 'Service Charge Amount',
  //       size: 150,
  //       enableColumnActions: false,
  //       enableSorting: false,
  //       Cell: ({ cell }) => Number(cell.getValue()) || 'N/A',
  //     },
  //     {
  //       accessorKey: 'serviceCharge',
  //       header: 'Service Charge',
  //       size: 150,
  //       enableColumnActions: false,
  //       enableSorting: false,
  //     },
  //     {
  //       accessorKey: 'AmountPaybel',
  //       header: 'Amount Payable',
  //       size: 150,
  //       enableColumnActions: false,
  //       enableSorting: true,
  //       Cell: ({ cell }) => Number(cell.getValue()) || 'N/A',
  //     },
  //     //   {
  //     //     accessorKey: 'amountDue',
  //     //     header: 'Amount Due',
  //     //     size: 150,
  //     //     enableColumnActions: false,
  //     //     enableSorting: false,
  //     //   },
  //     //   {
  //     //     accessorKey: 'receivedAmount',
  //     //     header: 'Received Amount',
  //     //     size: 150,
  //     //     enableColumnActions: false,
  //     //     enableSorting: false,
  //     //   },
  //     //   {
  //     //     accessorKey: 'receivedDate',
  //     //     header: 'Receiving Date',
  //     //     size: 150,
  //     //     enableColumnActions: false,
  //     //     enableSorting: false,
  //     //   },
  //   ],
  //   [pageState.pageIndex],
  // );

  // const columns = React.useMemo(
  //   () => [
  //     {
  //       accessorKey: 'rowNumber',
  //       header: 'Sr. No',
  //       size: 60,
  //       Cell: ({ row }) =>
  //         row.index + 1 + pageState.pageIndex * pageState.pageSize,
  //       enableColumnActions: false,
  //       enableSorting: false,
  //     },
  //     {
  //       accessorKey: 'createdAt',
  //       header: 'Date',
  //       size: 150,
  //       enableColumnActions: false,
  //       enableSorting: true,
  //       Cell: ({ cell }) => {
  //         const dateValue = cell.getValue();
  //         if (!dateValue) return 'N/A';

  //         const formattedDate = new Date(dateValue).toLocaleDateString(
  //           undefined,
  //           {
  //             year: 'numeric',
  //             month: '2-digit',
  //             day: '2-digit',
  //           },
  //         );

  //         return formattedDate;
  //       },
  //     },
  //     {
  //       accessorKey: 'companyName',
  //       header: 'Party Name',
  //       size: 150,
  //       enableColumnActions: false,
  //       enableSorting: false,
  //     },
  //     {
  //       accessorKey: 'totalWeight',
  //       header: 'Total Weight',
  //       size: 150,
  //       enableColumnActions: false,
  //       enableSorting: false,
  //       Cell: ({ cell }) => Number(cell.getValue()) || 'N/A',
  //     },
  //     {
  //       accessorKey: 'companyRate',
  //       header: 'Company Rate',
  //       size: 150,
  //       enableColumnActions: false,
  //       enableSorting: false,
  //     },
  //     {
  //       accessorKey: 'initalAmount',
  //       header: 'Initial Amount',
  //       size: 150,
  //       enableColumnActions: false,
  //       enableSorting: false,
  //       Cell: ({ cell }) => Number(cell.getValue()) || 'N/A',
  //     },
  //     {
  //       accessorKey: 'serviceCharageAmount',
  //       header: 'Service Charge Amount',
  //       size: 150,
  //       enableColumnActions: false,
  //       enableSorting: false,
  //       Cell: ({ cell }) => Number(cell.getValue()) || 'N/A',
  //     },
  //     {
  //       accessorKey: 'serviceCharge',
  //       header: 'Service Charge',
  //       size: 150,
  //       enableColumnActions: false,
  //       enableSorting: false,
  //     },
  //     {
  //       accessorKey: 'AmountPaybel',
  //       header: 'Amount Payable',
  //       size: 150,
  //       enableColumnActions: false,
  //       enableSorting: true,
  //       Cell: ({ cell }) => Number(cell.getValue()) || 'N/A',
  //     },

  //   ],
  //   [pageState.pageIndex],
  // );

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
        accessorKey: 'createdAt',
        header: 'Date',
        size: 150,
        enableColumnActions: false,
        enableSorting: true,
        Cell: ({ cell }) => {
          const dateValue = cell.getValue();
          if (!dateValue) return 'N/A';

          const formattedDate = new Date(dateValue).toLocaleDateString(
            undefined,
            {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
            },
          );

          return formattedDate;
        },
      },

      ...(type === 'perBox'
        ? []
        : [
            {
              accessorKey: 'companyName',
              header: 'Party Name',
              size: 150,
              enableColumnActions: false,
              enableSorting: false,
            },
            {
              accessorKey: 'totalWeight',
              header: 'Total Weight',
              size: 150,
              enableColumnActions: false,
              enableSorting: false,
              Cell: ({ cell }) => Number(cell.getValue()) || 'N/A',
            },
            {
              accessorKey: 'companyRate',
              header: 'Company Rate',
              size: 150,
              enableColumnActions: false,
              enableSorting: false,
            },
            {
              accessorKey: 'initalAmount',
              header: 'Initial Amount',
              size: 150,
              enableColumnActions: false,
              enableSorting: false,
              Cell: ({ cell }) => Number(cell.getValue()) || 'N/A',
            },
            {
              accessorKey: 'serviceCharageAmount',
              header: 'Service/Commision Charge Amount',
              size: 150,
              enableColumnActions: false,
              enableSorting: false,
              Cell: ({ cell }) => Number(cell.getValue()) || 'N/A',
            },
            {
              accessorKey: 'serviceCharge',
              header: 'Service/Commision Charge',
              size: 150,
              enableColumnActions: false,
              enableSorting: false,
              Cell: ({ cell }) => Number(cell.getValue()) || 'N/A',
            },
            {
              accessorKey: 'AmountPaybel',
              header: 'Amount Payable',
              size: 150,
              enableColumnActions: false,
              enableSorting: true,
              Cell: ({ cell }) => Number(cell.getValue()) || 'N/A',
            },
            {
              header: 'Download Bill',
              size: 150,
              enableColumnActions: false,
              enableSorting: false,
              Cell: ({ row }) => (
                <button
                  onClick={() => {
                    setSelectedData(row.original);
                    setTimeout(() => handleDownloadBill(), 1000);
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-black px-3 py-2 text-center font-medium text-white hover:bg-opacity-90"
                >
                  Download
                </button>
              ),
            },
          ]),
      ...(type === 'perBox'
        ? [
            {
              accessorKey: 'vehicleNo',
              header: 'Vehicle No.',
              size: 150,
              enableColumnActions: false,
              enableSorting: false,
              Cell: ({ cell }) => cell.getValue() || 'N/A',
            },
            {
              accessorKey: 'farmerName', // Add accessorKey
              header: 'Farmer Name',
              size: 150,
              enableColumnActions: false,
              enableSorting: false,
              Cell: ({ cell }) => cell.getValue() || 'N/A',
            },
            {
              accessorKey: 'farmerPayment',
              header: 'Farmer Payment',
              size: 150,
              enableColumnActions: false,
              enableSorting: false,
              Cell: ({ cell }) => cell.getValue() || 'N/A',
            },
            {
              accessorKey: 'serviceCharageAmount', // This accessorKey is repeated, use unique ones
              header: 'Service Charge',
              size: 150,
              enableColumnActions: false,
              enableSorting: false,
              Cell: ({ cell }) => cell.getValue() || 'N/A',
            },
            {
              id: 'csChargeContainer',
              header: 'CS Charge/Container',
              size: 100,
              enableColumnActions: false,
              enableSorting: false,
              Cell: ({ row }) => (
                <button
                  onClick={() => {
                    setSelectHarvesting(row?.original);
                    setShowChargeModal(true);
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-black px-3 py-2 text-center font-medium text-white hover:bg-opacity-90"
                >
                  View
                </button>
              ),
            },
            {
              accessorKey: 'coldStorageAmount',
              header: 'Cold Storage Amount',
              size: 90,
              enableColumnActions: false,
              enableSorting: false,
              Cell: ({ cell }) => cell.getValue() || 'N/A',
            },
            {
              accessorKey: 'transportCharge',
              header: 'Transport',
              size: 150,
              enableColumnActions: false,
              enableSorting: false,
              Cell: ({ cell }) => cell.getValue() || '0',
            },
            {
              accessorKey: 'boxes',
              header: 'Box',
              size: 150,
              enableColumnActions: false,
              enableSorting: false,
              Cell: ({ cell }) => cell.getValue() || 'N/A',
            },
            {
              accessorKey: 'packingMaterialCost',
              header: 'Packing Material Cost',
              size: 150,
              enableColumnActions: false,
              enableSorting: false,
              Cell: ({ cell }) => cell.getValue() || '0',
            },
            {
              accessorKey: 'wastage',
              header: 'Wastage',
              size: 150,
              enableColumnActions: false,
              enableSorting: false,
              Cell: ({ cell }) => cell.getValue() || 'N/A',
            },
            {
              accessorKey: 'totalAmount',
              header: 'Total Amount',
              size: 150,
              enableColumnActions: false,
              enableSorting: false,
              Cell: ({ cell }) => cell.getValue() || 'N/A',
            },
            {
              accessorKey: 'totalKgInLabor',
              header: 'Total kg in Labor',
              size: 150,
              enableColumnActions: false,
              enableSorting: false,
              Cell: ({ cell }) => cell.getValue() || 'N/A',
            },
            {
              accessorKey: 'expAmountPerKg',
              header: 'Expenses',
              size: 200,
              enableColumnActions: false,
              enableSorting: false,
              Cell: ({ cell }) => cell.getValue() || 'N/A',
            },
            {
              header: 'Box Cost',
              size: 150,
              enableColumnActions: false,
              enableSorting: false,
              Cell: ({ row }) => {
                const boxCost = row.original.boxCost;
                let data = [];

                for (const key in boxCost) {
                  if (boxCost.hasOwnProperty(key)) {
                    const value = boxCost[key];
                    data.push(
                      <span key={key}>
                        {key}: {value}
                        <br />
                      </span>,
                    );
                  }
                }

                return <>{data.length > 0 ? data : 'N/A'}</>;
              },
            },
            {
              accessorKey: 'quotedCost',
              header: 'Quoted Cost',
              size: 150,
              enableColumnActions: false,
              enableSorting: false,
              Cell: ({ cell }) => cell.getValue() || 'N/A',
            },
          ]
        : []),
    ],
    [pageState.pageIndex],
  );

  const apiKey = `supplier/company/companyBill?companyId=${party._id}&type=${type}`;
  return (
    <>
      <Dialog
        open={openAddModal}
        onClose={handleClose}
        fullWidth={true}
        maxWidth={'lg'}
      >
        <div className="pt-10 w-[calc(100%_-_45px)] flex justify-between pr-4 items-start sm:items-center mb-6 gap-3 flex-col sm:flex-row">
          <DialogTitle>Company Bill Details</DialogTitle>

          {checkExportPermission ? (
            <ExportButtonContent
              apikey={apiKey}
              companyId={party._id}
              type={type}
            />
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

      <div style={{ display: 'none' }}>
        <CompanyBill ref={companyBillRef} details={selectedData} />
      </div>

      <CsChargeModal
        showChargeModal={showChargeModal}
        setShowChargeModal={setShowChargeModal}
        selectedHarvesting={selectedHarvesting}
      />
    </>
  );
}
