import React, { useEffect, useMemo, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb.js';
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
import { getAPIAuth, postAPIAuth } from './../../service/apiInstance.js';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { ROUTES_CONST } from '../../constants/routeConstant.js';
import { useAuth } from '../../hooks/useAuth.jsx';
import { withPageGuard } from '../../utils/withPageGuard.jsx';
import { useCheckPermission } from '../../utils/useCheckPermission.jsx';
import ExportButtonContent from '../../utils/ExportButtonContent.jsx';
import AddIcon from '@mui/icons-material/Add';

const NewUserListTable = () => {
  //   const [openAddModal, setOpenAddModal] = React.useState(false);
  const navigate = useNavigate();
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [pageState, setPageState] = useState({ pageIndex: 0, pageSize: 10 });
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState([]);
  const { token } = useAuth();
  const hasDeleteUserPermission = useCheckPermission('Manage user', 'delete');
  const hasAddUserPermission = useCheckPermission('Manage user', 'add user');
  const hasEditUserPermission = useCheckPermission('Manage user', 'edit');
  const hasEditUserExport = useCheckPermission('Manage user', 'export'); 

  // const hasExportPermission =

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getAPIAuth(
        `/supplier/get?page=${pageState.pageIndex + 1}&perPage=${pageState.pageSize}&search=${globalFilter == undefined ? '' : globalFilter}&sortBy=${sorting?.length ? sorting?.[0]?.id : ''}&sortOrder=${sorting?.length ? (sorting?.[0]?.desc ? 'desc' : 'aesc') : ''}`,
        token,
        "Manage user",
        "List"
      );
      console.log('response data', res?.data);
      if (res?.data?.success) {
        setData(res?.data?.data?.documents || []);
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
    if (token) {
      fetchData();
    }
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
        accessorKey: 'username',
        header: 'User Name',
        enableColumnActions: false,
        enableSorting: true,
        size: 200,
      },
      {
        accessorKey: 'mobile',
        header: 'User Mobile',
        enableColumnActions: false,
        size: 150,
        // enableSorting: false
      },
      {
        accessorKey: 'role',
        header: 'Role',
        enableColumnActions: false,
        size: 150,
        enableSorting: true,
      },
      {
        accessorKey: 'salary',
        header: 'salary',
        size: 150,
        enableSorting: false,
        enableColumnActions: false,
      },
      {
        accessorKey: 'allowedLeaves',
        header: 'Allowed Leaves',
        size: 150,
        enableSorting: false,
        enableColumnActions: false,
      },

      {
        accessorKey: 'action',
        header: 'Actions',
        enableSorting: false,
        enableColumnActions: false,
        Cell: ({ row }) => (
          <Dropdown>
            <MenuButton>
              <MoreHorizIcon />
            </MenuButton>
            <Menu slots={{ listbox: Listbox }} className="z-99">
              <MenuItem onClick={() => handleEditFarmer(row.original?._id)}>
                Edit
              </MenuItem>
              <MenuItem onClick={() => handleDeleteFarmer(row.original?._id)}>
                Delete
              </MenuItem>
            </Menu>
          </Dropdown>
        ),
      },
    ],
    [hasDeleteUserPermission, pageState?.pageIndex],
  );

  const handleEditFarmer = async (id) => {
    if (hasEditUserPermission) {
      navigate(`${ROUTES_CONST.EDIT_USER}/${id}`);
    } else {
      toast.error('Access Denied');
    }
  };

  const handleDeleteFarmer = async (id) => {
    if (hasDeleteUserPermission) {
      try {
        const response = await postAPIAuth(`supplier/delete/${id}`, {});
        if (response.status === 200) {
          setData((prevData) => prevData.filter((item) => item._id !== id));
          toast.success('User Deleted Successfully');
        }
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    } else {
      toast.error('Access Denied');
    }
  };

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
        <Breadcrumb pageName="Manage User" />
        <div className="flex gap-3">
          {}

          {hasEditUserExport ? (
            <>
              <ExportButtonContent apikey="supplier/get" module = {"Manage user"}  label = {"export"} />
            </>
          ) : ('')}

          <button
            onClick={() => {
              if (hasAddUserPermission) {
                navigate(ROUTES_CONST.ADD_USER);
              } else {
                toast.error('Access Denied');
              }
            }}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-black px-5 py-3 text-center font-medium text-white hover:bg-opacity-90 "
          >
            <span>
              <AddIcon />
            </span>
            Add User
          </button>
        </div>
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
    </>
  );
};

export default withPageGuard(NewUserListTable, 'Manage user', 'List');
