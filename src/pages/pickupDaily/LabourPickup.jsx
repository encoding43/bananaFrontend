import React, { useEffect, useMemo, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { MaterialReactTable } from 'material-react-table';
import {
  Dropdown,
  Menu,
  MenuButton as BaseMenuButton,
  MenuItem as BaseMenuItem,
  menuItemClasses,
} from '@mui/base';
import { getAPIAuth } from '../../service/apiInstance';
import { useAuth } from '../../hooks/useAuth';
import { styled } from '@mui/system';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import AddIcon from '@mui/icons-material/Add';
import { toast } from 'sonner';
import AddDailyPickupModal from './AddDailyPickupModal';
import { useNavigate } from 'react-router-dom';
import { ROUTES_CONST } from '../../constants/routeConstant';
import ViewMap from '../../components/viewMap/ViewMap';
import ExportButtonContent from '../../utils/ExportButtonContent';
import { withPageGuard } from '../../utils/withPageGuard';
import { useCheckPermission } from '../../utils/useCheckPermission';

const LabourPickup = () => {
  const navigate = useNavigate();
  const [editFarmerData, setEditFarmerData] = useState(null);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [registerFarmers, setRegisterFarmers] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [pageState, setPageState] = useState({ pageIndex: 0, pageSize: 10 });
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState([]);
  const { token } = useAuth();
  //
  const checkEditPermission = useCheckPermission('Pickups', 'edit');
  const checkDeletePermission = useCheckPermission('Pickups', 'delete');
  // const checkDieselRatePermission = useCheckPermission(
  //   'Pickups',
  //   'Diesel Rate',
  // );

  const checkExportPermission = useCheckPermission('Pickups', 'Export');
  const checkTransportPaymentPermission = useCheckPermission(
    'Pickup payment',
    'List',
  );
  //

  const getTruckDailyWeight = async () => {
    try {
      const res = await getAPIAuth(
        `transport/getTransportDetail?page=${pageState.pageIndex + 1}&perPage=${pageState.pageSize}&search=${globalFilter ?? ''}&sortBy=${sorting?.length ? sorting?.[0]?.id : ''}&type=pickUp&sortOrder=${sorting?.length ? (sorting?.[0]?.desc ? 'desc' : 'asc') : ''}`,
        token,
      );
      console.log('check data', res.data);
      if (res?.data?.success) {
        setRegisterFarmers(res?.data?.data?.documents || []);
        setTotalPages(res?.data?.data?.pagination?.totalChildrenCount);
      } else {
        setData([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  useEffect(() => {
    if (token) {
      getTruckDailyWeight();
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
        accessorKey: 'date',
        header: 'Date',
        size: 100,
        Cell: ({ cell }) =>
          cell.getValue()
            ? new Date(cell.getValue()).toLocaleDateString()
            : '--',
        enableColumnActions: false,
        enableSorting: true,
      },
      {
        // accessorKey: 'farmer.location',
        header: 'Location',
        size: 250,
        enableColumnActions: false,
        enableSorting: false,
        Cell: ({ row }) => (
          <>
            {row?.original?.farmer?.location}
            <ViewMap
              lat={row?.original?.farmer?.geoLocation?.[0]}
              lng={row?.original?.farmer?.geoLocation?.[1]}
            />
          </>
        ),
      },
      {
        accessorKey: 'vehicleNo',
        header: 'Vehicle No',
        size: 150,
        enableColumnActions: false,
        enableSorting: false,
        Cell: ({ cell }) => cell.getValue() || '--',
      },
      {
        accessorKey: 'farmer.name',
        header: 'Farmer Name',
        size: 150,
        enableColumnActions: false,
        enableSorting: true,
        Cell: ({ cell }) => cell.getValue() || '--',
      },
      {
        accessorKey: 'distance',
        header: 'Distance-Km',
        size: 150,
        enableColumnActions: false,
        enableSorting: false,
        Cell: ({ cell }) => cell.getValue() || '--',
      },
      {
        accessorKey: 'pickUpNo',
        header: 'Pickup No',
        size: 150,
        enableColumnActions: false,
        enableSorting: false,
        Cell: ({ cell }) => cell.getValue() || '--',
      },
      {
        accessorKey: 'images',
        header: 'Photos',
        size: 150,
        enableColumnActions: false,
        enableSorting: false,
        Cell: ({ cell }) => {
          const photo = cell.getValue()?.[cell.getValue().length - 1];
          return photo ? (
            <img
              src={photo}
              alt="Truck"
              style={{
                width: '50px',
                height: '50px',
                objectFit: 'cover',
              }}
            />
          ) : (
            'No Image'
          );
        },
      },
      {
        accessorKey: 'actions',
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
              <MenuItem onClick={() => handleDeleteFarmer(row.original._id)}>
                Delete
              </MenuItem>
            </Menu>
          </Dropdown>
        ),
      },
    ],
    [pageState?.pageIndex , checkEditPermission,checkDeletePermission,checkExportPermission,checkTransportPaymentPermission],
  );

  const handleEditFarmer = (farmer) => {
    if(checkEditPermission){
    setEditFarmerData(farmer);
    setOpenAddModal(true);
    console.log({ farmer });
    }
  };

  const handleDeleteFarmer = async (id) => {
    if(checkDeletePermission){
    try {
      const response = await getAPIAuth(
        `transport/deleteTransportDetail?id=${id}`,
      );
      if (response.status === 200) {
        getTruckDailyWeight();
        toast.success('Deleted Successfully');
      }
    } catch (error) {
      console.error('Error deleting:', error);
    }
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
      background: #fff;
      border: 1px solid #DAE2ED;
      color: #1C2025;
      box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.05);
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
      <div className="flex justify-between items-start sm:items-center mb-6 gap-3 flex-col sm:flex-row">
        <Breadcrumb pageName="Labour Pickup " />
        <div className="flex gap-3">
          {checkExportPermission ? (
            <ExportButtonContent apikey="transport/getTransportDetail?type=pickUp&sortOrder" />
          ) : (
            ''
          )}
          {/* <button
          onClick={() => {
            setEditFarmerData(null);
            setOpenAddModal(true);
          }}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-black px-5 py-3 text-center font-medium text-white hover:bg-opacity-90"
        >
          <span>
            <AddIcon />
          </span>
          Add Register Farmer
        </button> */}
          {checkTransportPaymentPermission ? (
            <button
              onClick={() =>
                navigate(`${ROUTES_CONST.PICKUP_TRANSPORT_PAYMENT}`)
              }
              className="inline-flex items-center justify-center gap-2 rounded-md bg-black px-5 py-3 text-center font-medium text-white hover:bg-opacity-90"
            >
              <span>
                <AddIcon />
              </span>
              Transport Payment
            </button>
          ) : (
            ''
          )}
        </div>
      </div>
      <div className="table-container capitalize">
        <MaterialReactTable
          columns={columns}
          data={registerFarmers}
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
      <AddDailyPickupModal
        openAddModal={openAddModal}
        setOpenAddModal={setOpenAddModal}
        editFarmerData={editFarmerData}
        setEditFarmerData={setEditFarmerData}
        updateData={getTruckDailyWeight}
      />
    </>
  );
};

export default withPageGuard(LabourPickup, 'Pickups', 'List');
