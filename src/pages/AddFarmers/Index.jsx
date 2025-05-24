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
import AddIcon from '@mui/icons-material/Add';
import { Button, Switch } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddVFarmerModal from './AddFarmersModal';
import { getAPIAuth } from '../../service/apiInstance';
import { toast } from 'sonner';
import { useAuth } from '../../hooks/useAuth';
import { withPageGuard } from '../../utils/withPageGuard';
import { useCheckPermission } from '../../utils/useCheckPermission';
import ViewMap from '../../components/viewMap/ViewMap';
import ExportButtonContent from '../../utils/ExportButtonContent';

const AddFarmers = () => {
  const navigate = useNavigate();
  const [openAddModal, setOpenAddModal] = React.useState(false);
  const [farmerdata, setFarmerData] = React.useState([]);
  const [editfarmerdata, setEditFarmerData] = React.useState({});
  const [totalPages, setTotalPages] = useState(1);
  const [pageState, setPageState] = useState({ pageIndex: 0, pageSize: 10 });
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState([]);
  const { token } = useAuth();
  const checkEditPermission = useCheckPermission('Add New Farmer', 'edit');
  const checkDeletePermission = useCheckPermission('Add New Farmer', 'delete');
  const checkAddPermission = useCheckPermission('Add New Farmer', 'Add Farmer');
  const checkExportPermission = useCheckPermission('Add New Farmer', 'Export');

  console.log('farmerdatafarmerdata', pageState);

  const getFarmersData = async (page = 1, perPage = 5) => {
    try {
      const res = await getAPIAuth(
        `farmer/getFarmerDetail?page=${pageState.pageIndex + 1}&perPage=${pageState.pageSize}&name=${globalFilter ?? ''}&sortBy=${sorting?.length ? sorting?.[0]?.id : ''}&sortOrder=${sorting?.length ? (sorting?.[0]?.desc ? 'desc' : 'aesc') : ''}`,
        token,
      );
      if (res.status === 200) {
        setFarmerData(res?.data?.data?.documents || []);
        setTotalPages(res?.data?.data?.pagination?.totalChildrenCount);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred');
    }
  };

  useEffect(() => {
    if (token) {
      getFarmersData();
    }
  }, [pageState?.pageIndex, token, globalFilter, sorting]);

  const SwitchhandleChange = async (row) => {
    try {
      const res = await getAPIAuth(
        `farmer/blockUnblockFarmer?id=${row._id}&block=${!row.isBlocked}`,
        token,
      );
      toast.success(res?.data?.message);
      getFarmersData();
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
        Cell: ({ row }) => {
          console.log('llllllllllllllllllllllllllllllllll', row);

          return row.index + 1 + pageState.pageIndex * pageState.pageSize;
        },
        enableColumnActions: false,
        enableSorting: false,
      },
      {
        accessorKey: 'location',
        header: 'Location',
        size: 300,
        enableColumnActions: false,
        enableSorting: false,
      },
      {
        accessorKey: 'geoLocation',
        header: 'GeoLocation',
        // size: 150,
        enableColumnActions: false,
        enableSorting: false,
        Cell: ({ row }) => (
          <>
            <div className="text-nowrap">
              Lat : {row?.original?.geoLocation?.[0]} {' , '} Lng :{' '}
              {row?.original?.geoLocation?.[1]}
            </div>
            <ViewMap
              lat={row?.original?.geoLocation?.[0]}
              lng={row?.original?.geoLocation?.[1]}
            />
          </>
        ),
      },
      {
        accessorKey: 'name',
        header: 'Name',
        size: 150,
        enableColumnActions: false,
        enableSorting: true,
      },
      {
        accessorKey: 'mobileNo',
        header: 'Mobile',
        size: 100,
        enableColumnActions: false,
        enableSorting: true,
      },

      ...(checkDeletePermission
        ? [
            {
              accessorKey: 'isBlocked',
              header: 'Block',
              size: 100,
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
          ]
        : []),
      {
        accessorKey: 'actions',
        size: 100,
        header: 'Actions',
        enableColumnActions: false,
        enableSorting: false,
        Cell: ({ row }) => (
          <Dropdown>
            <MenuButton>
              <MoreHorizIcon />
            </MenuButton>
            <Menu slots={{ listbox: Listbox }} className="z-99">
              <MenuItem onClick={() => handleEditFarmer(row.original)}>
                Edit
              </MenuItem>
            </Menu>
          </Dropdown>
        ),
      },
    ],
    [checkEditPermission, pageState?.pageIndex],
  );

  const handleEditFarmer = (item) => {
    if (checkEditPermission) {
      setEditFarmerData(item);
      setOpenAddModal(true);
    } else {
      toast.error('Access Denied');
    }
  };

  const Listbox = styled('ul')`
    font-size: 0.875rem;
    box-sizing: border-box;
    padding: 12px;
    margin: 12px 0;
    min-width: 150px;
    border-radius: 12px;
    overflow: auto;
    outline: 0px;
    background: #fff;
    border: 1px solid #dae2ed;
    color: #1c2025;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.05);
    z-index: 1;
  `;

  const MenuItem = styled(BaseMenuItem)`
    list-style: none;
    padding: 8px;
    border-radius: 8px;
    cursor: pointer;
    user-select: none;

    &:last-of-type {
      border-bottom: none;
    }

    &:focus {
      outline: 3px solid #99ccf3;
      background-color: #e5eaf2;
      color: #1c2025;
    }

    &.${menuItemClasses.disabled} {
      color: #b0b8c4;
    }
  `;

  const MenuButton = styled(BaseMenuButton)`
    font-weight: 600;
    font-size: 0.875rem;
    line-height: 1.5;
    padding: 3px 6px;
    border-radius: 8px;
    color: white;
    transition: all 150ms ease;
    cursor: pointer;
    color: #b0b8c4;

    &:hover {
      background: #f3f6f9;
      border-color: #c7d0dd;
    }

    &:active {
      background: #e5eaf2;
    }

    &:focus-visible {
      box-shadow: 0 0 0 4px #99ccf3;
      outline: none;
    }
  `;

  return (
    <>
      <div className="flex justify-between items-start sm:items-center mb-6 gap-3 flex-col sm:flex-row">
        <Breadcrumb pageName="View Farmer " />
        <div className="flex gap-3">
          {checkExportPermission ? (
            <ExportButtonContent apikey="farmer/getFarmerDetail" />
          ) : (
            ''
          )}
          <button
            onClick={() => {
              if (checkAddPermission) {
                setOpenAddModal(true);
              }
            }}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-black px-5 py-3 text-center font-medium text-white hover:bg-opacity-90"
          >
            <AddIcon />
            Add Farmers
          </button>
        </div>
      </div>
      <div className="table-container capitalize">
        <MaterialReactTable
          columns={columns}
          data={farmerdata}
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
            // console.log("onPaginationChangeonPaginationChange" , onPaginationChange);
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
      <AddVFarmerModal
        openAddModal={openAddModal}
        setOpenAddModal={setOpenAddModal}
        getFarmersData={getFarmersData}
        editfarmerdata={editfarmerdata}
        setEditFarmerData={setEditFarmerData}
      />
    </>
  );
};

export default withPageGuard(AddFarmers, 'Add New Farmer', 'List');
