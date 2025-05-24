import React, { useMemo, useState, useEffect } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';
import { MaterialReactTable } from 'material-react-table';
import { Dropdown } from '@mui/base/Dropdown';
import { Menu } from '@mui/base/Menu';
import { MenuButton as BaseMenuButton } from '@mui/base/MenuButton';
import { MenuItem as BaseMenuItem, menuItemClasses } from '@mui/base/MenuItem';
import { styled } from '@mui/system';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import AddIcon from '@mui/icons-material/Add';
import AddFarmersModal from './AddFarmersModal';
import AddViewBoxModal from './AddViewBoxModal';
import { getAPI, getAPIAuth } from '../../service/apiInstance';
import { toast } from 'sonner';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { withPageGuard } from '../../utils/withPageGuard';
import AddExceptionModal from './ExceptionText';
import ViewImagesModal from '../../pages/packingMaterial/ViewImagesModal';
import ViewMap from '../../components/viewMap/ViewMap';
import ExportButtonContent from '../../utils/ExportButtonContent';
import { useCheckPermission } from '../../utils/useCheckPermission';

const Farmers = () => {
  const navigate = useNavigate();
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openBoxAddModal, setOpenBoxAddModal] = useState(false);
  const [openExceptionAddModal, setOpenExceptionAddModal] = useState(false);
  const [showImages, setShowImages] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [baseUrl, setBaseUrl] = useState('');
  const [editExceptionHarvestingdata, setEditExceptionHarvestingData] =
    useState({});
  const [editBoxHarvestingdata, setEditBoxHarvestingData] = useState({});
  const [data, setData] = useState([]);
  const [editHarvestingdata, setEditHarvestingData] = useState({});
  const [totalPages, setTotalPages] = useState(1);
  const [pageState, setPageState] = useState({ pageIndex: 0, pageSize: 10 });
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState([]);
  const { token } = useAuth();

  //

  const checkEditPermission = useCheckPermission('Add Harvesting', 'edit');
  const checkDeletePermission = useCheckPermission('Add Harvesting', 'delete');
  const checkAddPermission = useCheckPermission(
    'Add Harvesting',
    'Add Harvesting Details',
  );
  const checkExportPermission = useCheckPermission('Add Harvesting', 'Export');
  const checkImagesPermission = useCheckPermission('Add Harvesting', 'images');
  const checkboxDetailsPermission = useCheckPermission(
    'Add Harvesting',
    'box details',
  );
  const checkExceptionPermission = useCheckPermission(
    'Add Harvesting',
    'exception',
  );
  // const checkCompanyRatePermission = useCheckPermission(
  //   'Add Harvesting',
  //   'Company Rate',
  // );
  // const checkCompanyWastagePermission = useCheckPermission(
  //   'Add Harvesting',
  //   'Company Wastage',
  // );
  const checkScheduleFarmerPermission = useCheckPermission(
    'Add Harvesting',
    'Schedule farmer',
  );

  //
  console.log('totalPages', data);

  const getFarmers = async () => {
    try {
      const res = await getAPIAuth(
        `farmer/getHarvestingDetail?page=${pageState.pageIndex + 1}&perPage=${pageState.pageSize}&search=${globalFilter == undefined ? '' : globalFilter}&sortBy=${sorting?.length ? sorting?.[0]?.id : ''}&sortOrder=${sorting?.length ? (sorting?.[0]?.desc ? 'desc' : 'aesc') : ''}`,
        token,
      );
      if (res?.data?.success) {
        setData(res?.data?.data?.documents || []);
        setTotalPages(res?.data?.data?.pagination?.totalChildrenCount);
      }
    } catch (error) {
      console.error('error', error);
    }
  };

  useEffect(() => {
    if (token) {
      getFarmers();
    }
  }, [pageState?.pageIndex, token, globalFilter, sorting]); // Fetch data when pageIndex or pageSize changes

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
        accessorKey: 'farmerName',
        header: 'Farmer Name',
        size: 200,
        enableColumnActions: false,
        enableSorting: true,
      },
      {
        accessorKey: 'farmerMobileNo',
        header: 'Farmer Mobile',
        size: 150,
        enableColumnActions: false,
        enableSorting: true,
      },
      {
        accessorKey: 'date',
        header: 'Date',
        size: 150,
        Cell: ({ cell }) => moment(cell.getValue()).format('L'),
        enableColumnActions: false,
        enableSorting: true,
      },
      {
        header: 'Location',
        size: 250,
        enableColumnActions: false,
        enableSorting: false,
        Cell: ({ row }) => (
          <>
            {row?.original?.location}
            <ViewMap
              lat={row?.original?.geolocation?.[0]}
              lng={row?.original?.geolocation?.[1]}
            />
          </>
        ),
      },
      {
        accessorKey: 'vehicleNo',
        header: 'Vehicle Number',
        size: 70,
        enableColumnActions: false,
        enableSorting: false,
      },
      {
        accessorKey: 'laborName',
        header: 'Labor Name',
        enableColumnActions: false,
        enableSorting: true,
        size: 70,
        //  Cell: ({ row }) => {
        //   const laborName = row?.original?.labors?.[0]?.name;
        //   return laborName ? laborName : 'N/A';
        // },
      },
      {
        accessorKey: 'companyName',
        header: 'Company Name',
        size: 70,
        enableColumnActions: false,
        enableSorting: true,
        // Cell: ({ row }) => {
        //   const laborName = row?.original?.company?.companyAliasName;
        //   return laborName ? laborName : 'N/A';
        // },
      },
      {
        accessorKey: 'rate',
        header: 'Rate',
        size: 70,
        enableColumnActions: false,
        enableSorting: false,
      },
      {
        accessorKey: 'weight',
        header: 'Weight',
        enableColumnActions: false,
        enableSorting: true,
        size: 70,
        Cell: ({ cell }) => cell.getValue() || 'N/A',
      },
      {
        accessorKey: 'csName',
        header: 'Cold Storage',
        size: 70,
        //   Cell: ({ row }) => {
        //   const laborName = row?.original?.coldStore?.csName
        //   return laborName ? laborName : 'N/A';
        // },
        enableColumnActions: false,
        enableSorting: true,
      },
      {
        accessorKey: 'rate',
        header: 'Company Rate',
        size: 70,

        enableColumnActions: false,
        enableSorting: false,
      },
      {
        accessorKey: 'wastage',
        header: 'Company Wastage',
        size: 70,
        enableColumnActions: false,
        enableSorting: false,
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
              <MenuItem onClick={() => handleEditFarmer(row.original)}>
                Edit
              </MenuItem>
              <MenuItem onClick={() => handleDeleteFarmer(row.original._id)}>
                Delete
              </MenuItem>
              <MenuItem onClick={() => handleImagesFarmer(row.original)}>
                Images
              </MenuItem>

              <MenuItem onClick={() => handleViewBoxFarmer(row.original.box)}>
                Box Details
              </MenuItem>
              <MenuItem
                sx={{
                  backgroundColor:
                    row.original.exceptionDetails.length > 0
                      ? 'green'
                      : 'initial',
                  color:
                    row.original.exceptionDetails.length > 0
                      ? '#fff'
                      : 'initial',
                  '&:hover': {
                    backgroundColor:
                      row.original.exceptionDetails.length > 0
                        ? 'darkgreen'
                        : 'initial',
                    color:
                      row.original.exceptionDetails.length > 0
                        ? '#fff'
                        : 'initial',
                  },
                }}
                onClick={() => handleExceptionFarmer(row.original)}
              >
                Exception
              </MenuItem>
            </Menu>
          </Dropdown>
        ),
      },
    ],
    [pageState?.pageIndex , checkEditPermission , checkDeletePermission , checkAddPermission ,checkExportPermission ,checkImagesPermission,checkboxDetailsPermission,checkExceptionPermission,checkScheduleFarmerPermission],
  );

  const handleEditFarmer = (item) => {
    if (checkEditPermission) {
      if (item?.outward) {
        toast.error(
          `you can't edit this harvesting as you have outward it's data from cold storage`,
        );
        return;
      }
      setEditHarvestingData(item);
      setOpenAddModal(true);
    }
  };

  const handleViewBoxFarmer = (item) => {
    if (checkboxDetailsPermission) {
      setEditBoxHarvestingData(item);
      setOpenBoxAddModal(true);
    }
  };

  const handleExceptionFarmer = (item) => {
    if (checkExceptionPermission) {
      setEditExceptionHarvestingData(item);
      setOpenExceptionAddModal(true);
    }
  };

  const handleImagesFarmer = (item) => {
    console.log('itemitemitemitemitem', item);
    if (checkImagesPermission) {
      setSelectedImages(item?.images);
      setBaseUrl(item?.baseurl);
      setShowImages(true);
    }
  };

  const handleDeleteFarmer = async (id) => {
    if (checkDeletePermission) {
      try {
        const res = await getAPIAuth(`farmer/deleteHarvestingDetail?id=${id}`);
        if (res?.data?.success) {
          toast.success(res?.data?.message);
          getFarmers();
        }
      } catch (error) {
        console.error('error', error);
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
      <div className="flex justify-between items-start sm:items-center mb-6 gap-3 flex-col sm:flex-row">
        <Breadcrumb pageName="Harvesting Farmers" />
        <div className="flex gap-4">
          {checkExportPermission ? (
            <ExportButtonContent apikey="farmer/getHarvestingDetail" />
          ) : (
            ''
          )}
          {checkScheduleFarmerPermission ? (
             <button
             onClick={() => navigate('/farmerSchedules')}
             className="inline-flex items-center justify-center gap-2 rounded-md bg-black px-5 py-3 text-center font-medium text-white hover:bg-opacity-90"
           >
             <span>
               <AddIcon />
             </span>
             Schedule Farmer
           </button>
          ) : (
            ''
          )}
        
          {/*  */}
          <button
            onClick={() => {
              if (checkAddPermission) {
                setEditHarvestingData({});
                setOpenAddModal(true);
              }
            }}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-black px-5 py-3 text-center font-medium text-white hover:bg-opacity-90"
          >
            <span>
              <AddIcon />
            </span>
            Add Harvesting
          </button>
        </div>
      </div>
      <div className="table-container">
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
      {/* </DefaultLayout> */}
      <AddFarmersModal
        openAddModal={openAddModal}
        setOpenAddModal={setOpenAddModal}
        editHarvestingdata={editHarvestingdata}
        getFarmers={getFarmers}
      />
      <AddViewBoxModal
        openAddModal={openBoxAddModal}
        setOpenAddModal={setOpenBoxAddModal}
        editHarvestingdata={editBoxHarvestingdata}
        getFarmers={getFarmers}
      />
      {/* Exception */}
      <AddExceptionModal
        openAddModal={openExceptionAddModal}
        setOpenAddModal={setOpenExceptionAddModal}
        editHarvestingdata={editExceptionHarvestingdata}
        getFarmers={getFarmers}
      />
      <ViewImagesModal
        showImages={showImages}
        setShowImages={setShowImages}
        selectedImages={selectedImages}
        baseUrl={baseUrl}
      />
    </>
  );
};

export default withPageGuard(Farmers, 'Add Harvesting', 'List');
