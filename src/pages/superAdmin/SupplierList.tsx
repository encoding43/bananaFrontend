// @ts-nocheck
import React, { useEffect, useMemo, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
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
import { useAuth } from '../../hooks/useAuth';
import { Button, Switch } from '@mui/material';
import { getAPIAuth } from '../../service/apiInstance';
import { toast } from 'sonner';
import ExportButtonContent from '../../utils/ExportButtonContent';
import { withPageGuard } from '../../utils/withPageGuard.jsx';
import UserModalFullDetails from './UserModalFullDetails.jsx';
import HarvestModalDetails from './HarvestModalDetails.jsx';


const SupplierListTable = () => {
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [pageState, setPageState] = useState({ pageIndex: 0, pageSize: 10 });
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();
  const [openAddModal, setOpenAddModal] = useState(false);
  const [ModalUserdata, setModalUserData] = useState({});
  const [OpenHarvestAddModal, setOpenHarvestAddModal] = useState(false);
  const [ModalHarvestData, setModalHarvestData] = useState({});
  const getSupplierList = async () => {
    try {
      const res = await getAPIAuth(
        `admin/supplierList?page=${pageState.pageIndex + 1}&perPage=${pageState.pageSize}&search=${globalFilter == undefined ? '' : globalFilter}&sortBy=${sorting?.length ? sorting?.[0]?.id : ''}&sortOrder=${sorting?.length ? (sorting?.[0]?.desc ? 'desc' : 'aesc') : ''}`,
        token,
      );
      if (res?.data?.success) {
        setData(res?.data?.data?.documents || []);
        // const totalCount = res?.data?.data?.[0]?.totalCount || 0;
        setTotalPages(res?.data?.data?.pagination?.totalChildrenCount);
      }
    } catch (error) {
      console.error('error', error);
    }
  };

  useEffect(() => {
    if (token) {
      getSupplierList();
    }
  }, [pageState?.pageIndex, token, globalFilter, sorting]);

  const SwitchhandleChange = async (row) => {
    try {
      const res = await getAPIAuth(
        `admin/blockUnblockSupplier?id=${row._id}&block=${!row.isBlocked}`,
        token,
      );
      toast.success(res?.data?.message);
      getSupplierList();
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred');
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
        accessorKey: 'ownerName',
        header: 'User Name',
        size: 200,
        enableColumnActions: false,
        enableSorting: true,
      },
      {
        accessorKey: 'ownerMobile',
        header: 'User Mobile',
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
        accessorKey: 'companyName',
        header: 'Company Name',
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
      {
        accessorKey: 'role',
        header: 'Role',
        size: 150,
        enableColumnActions: false,
        enableSorting: false,
      },
      {
        accessorKey: 'isBlocked',
        header: 'Block',
        enableColumnActions: false,
        enableSorting: false,
        Cell: ({ row }) => (
          <Switch
            checked={row?.original?.isBlocked}
            onChange={() => SwitchhandleChange(row.original)}
            inputProps={{ 'aria-label': 'controlled' }}
          />
        ),
      },
       {
        accessorKey: 'actions',
        header: 'Actions',
        enableColumnActions: false,
        enableSorting: false,
        size: 70,
        Cell: ({ row }) => (
          <Dropdown>
            <MenuButton>
              <MoreHorizIcon />
            </MenuButton>
            <Menu slots={{ listbox: Listbox }} className="z-999">
              <MenuItem onClick={() => {
                  setModalUserData(row.original);
                  setOpenAddModal(true);
                }}>
                User
              </MenuItem>
              <MenuItem onClick={() => {
                  setModalHarvestData(row.original);
                  setOpenHarvestAddModal(true);
                }}>
                Harvest
              </MenuItem>
             
            </Menu>
          </Dropdown>
        ),
      },
      
    ],
    [pageState?.pageIndex],
  );

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
      // background: #fff;
      // border: 1px solid #DAE2ED;
      color: #B0B8C4;
      // box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
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
      <div className="flex justify-between items-start sm:items-center mb-6 gap-3 flex-col sm:flex-row">
        <Breadcrumb pageName="Supplier List" />
        <ExportButtonContent apikey="admin/supplierList" />
        {/* <button 
              onClick={()=>setOpenAddModal(true)}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-black px-5 py-3 text-center font-medium text-white hover:bg-opacity-90 ">
                    <span>
                    <AddIcon />
                    </span>
                    Add Labor
                  </button> */}
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
      {/* <AddLaborModal openAddModal={openAddModal} setOpenAddModal={setOpenAddModal}/> */}
      <UserModalFullDetails
        openAddModal={openAddModal}
        setOpenAddModal={setOpenAddModal}
        UserData={ModalUserdata}
      />
            <HarvestModalDetails
        openAddModal={OpenHarvestAddModal}
        setOpenAddModal={setOpenHarvestAddModal}
        UserData={ModalHarvestData}
      />
      ;
    </>
  );
};

// export default withPageGuard(SupplierListTable , "Super Admin" , "View supplierList" );
export default SupplierListTable;
// withPageGuard(SupplierListTable , "Farmer Manager" , "View Farmer" );
