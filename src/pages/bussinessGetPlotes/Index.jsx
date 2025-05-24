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
// import AddVFarmerModal from './AddPlotVisitsModal';
import AddPlotVisitsModal from './AddPlotVisitsModal';
import { getAPIAuth, postAPIAuth } from '../../service/apiInstance';
import { toast } from 'sonner';
import { useAuth } from '../../hooks/useAuth';
import { withPageGuard } from '../../utils/withPageGuard';
import { useCheckPermission } from '../../utils/useCheckPermission';
import moment from 'moment';
import ViewImagesModal from '../packingMaterial/ViewImagesModal';
import ExportButtonContent from '../../utils/ExportButtonContent';

const BussinessPlotGets = () => {
  const navigate = useNavigate();
  const [openAddModal, setOpenAddModal] = React.useState(false);
  const [farmerdata, setFarmerData] = React.useState([]);
  const [editfarmerdata, setEditFarmerData] = React.useState({});
  const [totalPages, setTotalPages] = useState(1);
  const [pageState, setPageState] = useState({ pageIndex: 0, pageSize: 10 });
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState([]);
  const { token } = useAuth();
  const [showImages, setShowImages] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [baseUrl, setBaseUrl] = useState('');
  // const checkEditPermission = useCheckPermission("Farmer Manager" , "Edit Farmer");
  console.log('checkEditPermission', farmerdata);
  //
  const checkEditPermission = useCheckPermission('Get boxes', 'edit');
  const checkDeletePermission = useCheckPermission('Get boxes', 'delete');
  const checkAddPermission = useCheckPermission('Get boxes', 'add');
  const checkExportPermission = useCheckPermission('Get boxes', 'export');
  const checkaskPermission = useCheckPermission('Get boxes', 'ask');
  //

  const getFarmersData = async (page = 1, perPage = 5) => {
    try {
      const res = await getAPIAuth(
        `bussinessIntelligence/getPlot?page=${pageState.pageIndex + 1}&perPage=${pageState.pageSize}&search=${globalFilter ?? ''}&sortBy=${sorting?.length ? sorting?.[0]?.id : ''}&sortOrder=${sorting?.length ? (sorting?.[0]?.desc ? 'desc' : 'aesc') : ''}`,
        token,
      );
      console.log('1w2322222222222223', res);

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

  // const columns = useMemo(() => [
  //   {
  //     accessorKey: 'rowNumber',
  //     header: 'Sr. No',
  //     size: 60,
  //     Cell: ({ row }) =>
  //     row.index + 1 + pageState.pageIndex * pageState.pageSize,
  //     enableColumnActions: false,
  //     enableSorting: false,
  //   },
  //   {
  //     accessorKey: 'area',
  //     header: 'Area',
  //     size: 150,
  //     enableColumnActions: false,
  //     enableSorting: true,
  //   },
  //   {
  //     accessorKey: 'variety',
  //     header: 'Variety',
  //     size: 150,
  //     enableColumnActions: false,
  //     enableSorting: true,
  //   },
  //   {
  //     accessorKey: 'rateExpect',
  //     header: 'NO of Plantains',
  //     size: 150,
  //     enableColumnActions: false,
  //     enableSorting: true,
  //   },
  //   {
  //     accessorKey: 'platingDate',
  //     header: 'Plantation date',
  //     size: 150,
  //     enableColumnActions: false,
  //     enableSorting: true,
  //     Cell: ({ row }) => (
  //       <>
  //        {moment(row?.original?.platingDate).format('YYYY-MM-DD')}

  //       </>
  //     )
  //   },
  //   {
  //     accessorKey: 'boxType',
  //     header: 'Box type',
  //     size: 150,
  //     enableColumnActions: false,
  //     enableSorting: true,
  //   },
  //   {
  //     accessorKey: 'recovery',
  //     header: 'Recovery',
  //     size: 150,
  //     enableColumnActions: false,
  //     enableSorting: true,
  //   },
  //   {
  //     accessorKey: 'desireWeight',
  //     header: 'Desired weight',
  //     size: 150,
  //     enableColumnActions: false,
  //     enableSorting: true,
  //   },
  //   {
  //     accessorKey: 'rateExpect',
  //     header: 'Expected Rate',
  //     size: 150,
  //     enableColumnActions: false,
  //     enableSorting: true,
  //   },
  //   {
  //     accessorKey: 'cuttingCycleNo',
  //     header: 'Cutting Cycle No',
  //     size: 150,
  //     enableColumnActions: false,
  //     enableSorting: true,
  //     Cell: ({ row }) => (
  //       <>
  //       {row.original?.cuttingCycleNo ? row.original?.cuttingCycleNo : "N/A" }
  //       </>
  //     )
  //   },
  //   {
  //     accessorKey: 'sellerInfo',
  //     header: 'Seller info',
  //     size: 150,
  //     enableColumnActions: false,
  //     enableSorting: true,
  //   },
  //   {
  //     accessorKey: 'expectedCommission',
  //     header: 'Expected Commission',
  //     size: 150,
  //     enableColumnActions: false,
  //     enableSorting: true,
  //   },
  //   {
  //     accessorKey: 'name',
  //     header: 'picture',
  //     size: 150,
  //     enableColumnActions: false,
  //     enableSorting: true,
  //     Cell: ({ row }) => (
  //       // <div className='text-nowrap'>
  //       //   {row?.original?.image?.map((item, index) => (
  //       //     <img key={index} src={item} alt={`Image ${index}`} />
  //       //   ))}
  //       // </div>

  //        <div className="flex gap-3">

  //          {
  //           row?.original?.image?.length ?
  //           <>
  //             {
  //               row?.original?.image?.slice(0,3)?.map(item=> (
  //                 <div className='w-17 h-17 border border-[#e0e0e0]'>
  //                 <img className='size-full object-cover' src={row?.original?.baseurl+'/'+item } alt="No Image" />
  //               </div>
  //               ))
  //             }
  //             {
  //               row?.original?.image?.length > 3 ?
  //                 <div
  //                   onClick={()=> {
  //                     setSelectedImages(row?.original?.image)
  //                     setBaseUrl(row?.original?.baseurl)
  //                     setShowImages(true)
  //                   }}
  //                   className="w-17 h-17 border border-[#e0e0e0] flex items-center justify-center text-center font-medium text-[12px] cursor-pointer">
  //                   view <br /> More
  //                 </div>
  //               : ''
  //             }
  //           </>
  //         : 'No Image'
  //          }
  //          </div>
  //     )
  //   },
  //   {
  //     accessorKey: 'actions',
  //     size: 100,
  //     header: 'Actions',
  //     enableColumnActions: false,
  //     enableSorting: false,
  //     Cell: ({ row }) => (
  //       <Dropdown>
  //         <MenuButton>
  //           <MoreHorizIcon />
  //         </MenuButton>
  //         <Menu slots={{ listbox: Listbox }} className='z-99'>
  //           <MenuItem onClick={() => handleEditFarmer(row.original)}>Edit</MenuItem>
  //           <MenuItem onClick={() => handleDeleteCompany(row.original._id)}>Delete</MenuItem>

  //         </Menu>
  //       </Dropdown>
  //     ),
  //   },
  // ], [checkEditPermission ,pageState?.pageIndex]);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'rowNumber',
        header: 'Sr. No',
        size: 60,
        enableColumnActions: false,
        enableSorting: false,
        Cell: ({ row }) =>
          row.index + 1 + pageState.pageIndex * pageState.pageSize,
      },
      {
        accessorKey: 'area',
        header: 'Area',
        size: 150,
        enableColumnActions: false,
        enableSorting: true,
      },
      {
        accessorKey: 'variety',
        header: 'Variety',
        size: 150,
        enableColumnActions: false,
        enableSorting: true,
      },
      {
        accessorKey: 'rateExpect',
        header: 'NO of Plantains',
        size: 150,
        enableColumnActions: false,
        enableSorting: true,
      },
      {
        accessorKey: 'platingDate',
        header: 'Plantation date',
        size: 150,
        enableColumnActions: false,
        enableSorting: true,
        Cell: ({ row }) => (
          <>{moment(row?.original?.platingDate).format('YYYY-MM-DD')}</>
        ),
      },
      {
        accessorKey: 'boxType',
        header: 'Box type',
        size: 150,
        enableColumnActions: false,
        enableSorting: true,
      },
      {
        accessorKey: 'recovery',
        header: 'Recovery',
        size: 150,
        enableColumnActions: false,
        enableSorting: true,
      },
      {
        accessorKey: 'desireWeight',
        header: 'Desired weight',
        size: 150,
        enableColumnActions: false,
        enableSorting: true,
      },
      {
        accessorKey: 'rateExpect',
        header: 'Expected Rate',
        size: 150,
        enableColumnActions: false,
        enableSorting: true,
      },
      {
        accessorKey: 'cuttingCycleNo',
        header: 'Cutting Cycle No',
        size: 150,
        enableColumnActions: false,
        enableSorting: true,
        Cell: ({ row }) => (
          <>
            {row.original?.cuttingCycleNo
              ? row.original?.cuttingCycleNo
              : 'N/A'}
          </>
        ),
      },
      {
        accessorKey: 'sellerInfo',
        header: 'Seller info',
        size: 150,
        enableColumnActions: false,
        enableSorting: true,
      },
      {
        accessorKey: 'expectedCommission',
        header: 'Expected Commission',
        size: 150,
        enableColumnActions: false,
        enableSorting: true,
      },
      {
        accessorKey: 'name',
        header: 'Picture',
        size: 150,
        enableColumnActions: false,
        enableSorting: true,
        Cell: ({ row }) => (
          <div className="flex gap-3">
            {row?.original?.image?.length ? (
              <>
                {row?.original?.image?.slice(0, 3)?.map((item) => (
                  <div className="w-17 h-17 border border-[#e0e0e0]" key={item}>
                    <img
                      className="size-full object-cover"
                      src={`${item}`}
                      alt="No Image"
                    />
                  </div>
                ))}
                {row?.original?.image?.length > 3 && (
                  <div
                    onClick={() => {
                      setSelectedImages(row?.original?.image);
                      // setBaseUrl(row?.original?.baseurl);
                      setShowImages(true);
                    }}
                    className="w-17 h-17 border border-[#e0e0e0] flex items-center justify-center text-center font-medium text-[12px] cursor-pointer"
                  >
                    View <br /> More
                  </div>
                )}
              </>
            ) : (
              'No Image'
            )}
          </div>
        ),
      },
      {
        accessorKey: 'actions',
        header: 'Actions',
        size: 100,
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
              <MenuItem onClick={() => handleDeleteCompany(row.original._id)}>
                Delete
              </MenuItem>
            </Menu>
          </Dropdown>
        ),
      },
    ],
    [checkEditPermission, pageState?.pageIndex , checkDeletePermission],
  );

  const handleDeleteCompany = async (id) => {
    // alert("hiii")
    if (checkDeletePermission) {
      try {
        const response = await getAPIAuth(
          `bussinessIntelligence/deletePlot?id=${id}`,
        );
        // console.log("resoposteeeeeeeeeee" ,response );

        if (response.status === 200) {
          getFarmersData();
          toast.success('Company Deleted Successfully');
        }
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

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
        <Breadcrumb pageName="Gets Plotes" />
        <div className="flex gap-3">
          {checkExportPermission ? (
            <ExportButtonContent apikey="bussinessIntelligence/getPlot" />
          ) : (
            ''
          )}
          {checkAddPermission ? (
            <button
              onClick={() => setOpenAddModal(true)}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-black px-5 py-3 text-center font-medium text-white hover:bg-opacity-90"
            >
              <AddIcon />
              Add Plotes
            </button>
          ) : (
            ''
          )}
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
      <AddPlotVisitsModal
        openAddModal={openAddModal}
        setOpenAddModal={setOpenAddModal}
        getFarmersData={getFarmersData}
        editfarmerdata={editfarmerdata}
        setEditFarmerData={setEditFarmerData}
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

export default withPageGuard(BussinessPlotGets, 'Get Plots', 'list');
