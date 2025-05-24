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
import AddRegisterFarmerModal from './AddRegisterModal';
import { toast } from 'sonner';
import ViewMap from '../../components/viewMap/ViewMap';
import ExportButtonContent from '../../utils/ExportButtonContent';
import { useCheckPermission } from '../../utils/useCheckPermission';
import { withPageGuard } from '../../utils/withPageGuard';

const dummyapidata = [
  {
    _id: '66aa1659fd6853eb27138031',
    date: '2024-07-31T00:00:00.000Z',
    location: 'Farm Location',
    geoLocation: [12.9715987, 77.5945627],
    name: 'Jandfghjge Smith',
    mobileNo: 9876543210,
    areaInAcres: '5',
    varietyOfBanana: 'Cavendish',
    plantationDate: '2023-03-15',
    photos: [
      'http://159.89.164.11:3131/uploads/photo1.jpg',
      'http://159.89.164.11:3131/uploads/photo2.jpg',
    ],
    supplierId: '66a9db80cad4c1f1bf2e89cf',
    isDeleted: false,
    createdAt: '2024-07-31T10:47:53.747Z',
    updatedAt: '2024-07-31T12:17:50.298Z',
  },
];

const RegisterFarmer = () => {
  const [editFarmerData, setEditFarmerData] = useState(null);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [registerFarmers, setRegisterFarmers] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [pageState, setPageState] = useState({ pageIndex: 0, pageSize: 3 });
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState([]);
  const { token } = useAuth();
  //
  const checkEditPermission = useCheckPermission('Register farmer', 'edit');
  const checkDeletePermission = useCheckPermission('Register farmer', 'delete');
  const checkAddPermission = useCheckPermission('Register farmer', 'add');

  const checkExportPermission = useCheckPermission('Register farmer', 'export');
  //
  const getRegisterFarmer = async () => {
    try {
      const res = await getAPIAuth(
        `farmer/getRegisterFarmer?page=${pageState.pageIndex + 1}&perPage=${pageState.pageSize}&search=${globalFilter == undefined ? '' : globalFilter}&sortBy=${sorting?.length ? sorting?.[0]?.id : ''}&sortOrder=${sorting?.length ? (sorting?.[0]?.desc ? 'desc' : 'aesc') : ''}`,
        token, "Register farmer" , "List"
      );
      console.log('check data', res.data);
      if (res?.data?.success) {
        setRegisterFarmers(res?.data?.data?.documents || []);
        setTotalPages(res?.data?.data?.pagination?.totalChildrenCount);
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  useEffect(() => {
    if (token) {
      getRegisterFarmer();
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
        Cell: ({ cell }) => new Date(cell.getValue()).toLocaleDateString(),
        enableColumnActions: false,
        enableSorting: true,
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
        header: 'Geolocation',
        // size: 150,
        Cell: ({ row }) => (
          <>
            <div className="text-nowrap">
              Lat : {row?.original?.geoLocation?.[0]} {' , '} Lng :{' '}
              {row?.original?.geoLocation?.[1]}
            </div>
            <ViewMap
              lat={Number(row?.original?.geoLocation?.[0])}
              lng={Number(row?.original?.geoLocation?.[1])}
            />
          </>
        ),
        enableColumnActions: false,
        enableSorting: false,
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
        size: 150,
        enableColumnActions: false,
        enableSorting: false,
      },
      {
        accessorKey: 'areaInAcres',
        header: 'Area in Acres',
        size: 150,
        enableColumnActions: false,
        enableSorting: false,
      },
      {
        accessorKey: 'varietyOfBanana',
        header: 'Variety Of Banana',
        size: 150,
        enableColumnActions: false,
        enableSorting: false,
      },
      {
        accessorKey: 'numberOfPlants',
        header: 'number Of Plants',
        size: 150,
        enableColumnActions: false,
        enableSorting: false,
      },
      {
        accessorKey: 'plantationDate',
        header: 'Plantation Date',
        size: 150,
        Cell: ({ cell }) => new Date(cell.getValue()).toLocaleDateString(),
        enableColumnActions: false,
        enableSorting: false,
      },
      {
        accessorKey: 'photos',
        header: 'Photos',
        size: 150,
        enableColumnActions: false,
        enableSorting: false,
        Cell: ({ cell }) => (
          <div style={{ display: 'flex', gap: '5px' }}>
            {cell.getValue().map((photo, index) => (
              <img
                key={index}
                src={photo}
                alt={`Photo ${index + 1}`}
                style={{
                  width: '50px',
                  height: '50px',
                  objectFit: 'cover',
                }}
              />
            ))}
          </div>
        ),
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
    [pageState?.pageIndex , checkEditPermission],
  );

  const handleEditFarmer = (farmer) => {
    if (checkEditPermission) {
      setEditFarmerData(farmer);
      setOpenAddModal(true);
      console.log({ farmer });
    }
  };

  const handleDeleteFarmer = async (id) => {
    if (checkDeletePermission) {
      try {
        const response = await getAPIAuth(
          `farmer/deleteRegisteredFarmer?id=${id}`,
        );
        if (response.status === 200) {
          getRegisterFarmer();
          toast.success('farmer Deleted Successfully');
        }
      } catch (error) {
        console.error('Error deleting farmer:', error);
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
        <Breadcrumb pageName="Register Farmer" />
        <div className="flex gap-3">
          {checkExportPermission ? (
            <ExportButtonContent apikey="farmer/getRegisterFarmer" />
          ) : ('')}
          {checkAddPermission ? (
            <button
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
      <AddRegisterFarmerModal
        openAddModal={openAddModal}
        setOpenAddModal={setOpenAddModal}
        editFarmerData={editFarmerData}
        setEditFarmerData={setEditFarmerData}
        updateData={getRegisterFarmer}
      />
    </>
  );
};

export default withPageGuard(RegisterFarmer, 'Register farmer', 'List');
