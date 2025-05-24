import React, { useEffect, useMemo, useState } from 'react';
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
import WhatsAppComponent from '../../components/whatsApp/WhatsAppComponent';
import ExportButtonContent from '../../utils/ExportButtonContent';
import { useCheckPermission } from '../../utils/useCheckPermission';

const TransactionsandBills = () => {
  const [openAddModal, setOpenAddModal] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [pageState, setPageState] = useState({ pageIndex: 0, pageSize: 10 });
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState([]);
  const { token } = useAuth();
  const [selectedData, setSelectedData] = useState({});
  console.log('datadatadatadata', data);
  const checkExportPermission = useCheckPermission(
    'Transaction bills',
    'export',
  );
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getAPIAuth(
        `audit/allTranasactions?page=${pageState.pageIndex + 1}&perPage=${pageState.pageSize}&search=${globalFilter == undefined ? '' : globalFilter}&sortBy=${sorting?.length ? sorting?.[0]?.id : ''}&sortOrder=${sorting?.length ? (sorting?.[0]?.desc ? 'desc' : 'aesc') : ''}`,
        token,
      );
      console.log('resresresresresresres', res);
      if (res?.data?.status == 200) {
        // alert("hii")
        setData(res?.data?.data?.documents);
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
        enableSorting: false,
        size: 150,
        Cell: ({ cell }) => {
          const date = cell.getValue();
          return date ? moment(date).format('YYYY-MM-DD') : 'N/A';
        },
      },
      {
        accessorKey: 'vehicleNo',
        header: 'Particular',
        enableColumnActions: false,
        enableSorting: false,
        size: 450, // Adjust size if necessary to accommodate content
        Cell: ({ row }) => {
          const billType = row.original.billType || 'N/A';
          const name = row.original.name || 'N/A';
          const otherDetail = row.original.other || 'N/A'; // Any other detail you want to display

          return (
            <div className="grid grid-cols-3">
              <div className="table-row">
                <div className="table-cell">{billType}</div>
              </div>
              <div className="table-row">
                <div className="table-cell">{name}</div>
              </div>
              <div className="table-row">
                <div className="table-cell">{otherDetail}</div>
              </div>
            </div>
          );
        },
      },

      {
        accessorKey: 'transactionType',
        header: 'Transaction Type',
        enableColumnActions: false,
        enableSorting: false,
        size: 150,
        Cell: ({ cell }) => cell.getValue() || 'N/A',
      },

      {
        accessorKey: 'debitAmount',
        header: 'Debit',
        enableColumnActions: false,
        enableSorting: false,
        size: 150,
        Cell: ({ cell }) => cell.getValue() || 'N/A',
      },
      {
        accessorKey: 'creditAmount',
        header: 'Credit',
        enableColumnActions: false,
        enableSorting: false,
        size: 150,
        Cell: ({ cell }) => cell.getValue() || 'N/A',
      },
      {
        accessorKey: 'charge',
        header: 'Balance',
        enableColumnActions: false,
        enableSorting: false,
        size: 200,
        Cell: ({ cell }) => {
          return `${cell?.row?.original?.charge}` || 'N/A';
        },
      },
    ],
    [pageState?.pageIndex],
  );

  // const handleEditFarmer = (labor) => {
  //   setEditingLabor(labor);
  //   setOpenAddModal(true);
  // };

  // const handleDeleteFarmer = async (id) => {
  //   try {
  //     const response = await postAPIAuth(`supplier/labor/delete/${id}`, {});
  //     if (response.status === 200) {
  //       setData((prevData) => prevData.filter(item => item._id !== id));
  //       toast.success("Labor Deleted Successfully");
  //     }
  //   } catch (error) {
  //     console.error('Error deleting user:', error);
  //   }
  // };

  const Listbox = styled('ul')(
    ({ theme }) => `
      font-size: 0.875rem;
      box-sizing: border-box;
      padding: 12px;
      margin: 12px 0;
      min-width: 150px;
      border-radius: 12px;
      overflow: auto;
      outline: 0px;
      background : #fff;
      border: 1px solid #DAE2ED;
      color: #1C2025;
      box-shadow: 0px 4px 6px 'rgba(0,0,0, 0.05)';
      z-index: 1;
      `,
  );

  const MenuItem = styled(BaseMenuItem)(
    ({ theme }) => `
      list-style: none;
      padding: 8px;
      border-radius: 8px;
      cursor: pointer;
      user-select: none;
    
      &:last-of-type {
        border-bottom: none;
      }
    
      &:focus {
        outline: 3px solid #99CCF3;
        background-color: #E5EAF2;
        color: #1C2025;
      }
    
      &.${menuItemClasses.disabled} {
        color: #B0B8C4;
      }
      `,
  );

  const MenuButton = styled(BaseMenuButton)(
    ({ theme }) => `
      font-weight: 600;
      font-size: 0.875rem;
      line-height: 1.5;
      padding: 3px 6px;
      border-radius: 8px;
      color: white;
      transition: all 150ms ease;
      cursor: pointer;
      color: #B0B8C4;
    
      &:hover {
        background: #F3F6F9;
        border-color: #C7D0DD;
      }
    
      &:active {
        background: #E5EAF2;
      }
    
      &:focus-visible {
        box-shadow: 0 0 0 4px #99CCF3;
        outline: none;
      }
      `,
  );

  return (
    <>
      {/* <DefaultLayout> */}
      <div className="pt-10 w-[calc(100%_-_45px)] flex justify-between pr-4 items-start sm:items-center mb-6 gap-3 flex-col sm:flex-row">
        <Breadcrumb pageName="Transactions & Bills" />

        {checkExportPermission ? (
          <ExportButtonContent apikey="audit/allTranasactions" />
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
              laborName: false,
              companyName: true,
              rate: false,
              weight: false,
              wastage: false,
              coldStorage: false,
              companyRate: false,
              companyWastage: false,
              weightDifference: false,
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

export default withPageGuard(TransactionsandBills, 'Transaction bills', 'List');
