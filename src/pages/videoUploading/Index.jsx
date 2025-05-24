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
import AddBankFarmerModal from './AddbankModal';
import { getAPIAuth, postAPIAuth } from '../../service/apiInstance';
import { toast } from 'sonner';
import { useAuth } from '../../hooks/useAuth';
import { withPageGuard } from './../../utils/withPageGuard.jsx';
import AddTaskModal from './AddVideoModal.jsx';
import AddVideoModal from './AddVideoModal.jsx';
import TaskViewModal from './TaskViewModal.jsx';
import { useSelector } from 'react-redux';

const VideoUploading = () => {
  const [openAddModal, setOpenAddModal] = React.useState(false);
  const [openTaskAddModal, setOpenTaskAddModal] = React.useState(false);
  const [openViewTaskAddModal, setOpenViewTaskAddModal] = React.useState(false);
  const [editingTask, setEditingTask] = React.useState(null);
  const [AssignView, setAssignView] = React.useState(null);
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [editingLabor, setEditingLabor] = React.useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [pageState, setPageState] = useState({ pageIndex: 0, pageSize: 10 });
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState([]);
  const { token } = useAuth();
  const userDetails = useSelector((state) => state?.user);
  console.log('datadatadatadatadatadata', userDetails);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getAPIAuth(
        `bussinessIntelligence/getVideo?page=${pageState.pageIndex + 1}&perPage=${pageState.pageSize}&sortBy=${sorting?.length ? sorting?.[0]?.id : ''}&name=${globalFilter == undefined ? '' : globalFilter}&sortOrder=${sorting?.length ? (sorting?.[0]?.desc ? 'desc' : 'aesc') : ''}`,
        token,
      );
      console.log('ssssdatadatadata', res);

      if (res?.data?.success) {
        setData(res?.data?.data || []);
        // const totalCount = res?.data?.data?.[0]?.totalCount || 0;
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
        accessorKey: 'title',
        header: 'Video Title',
        size: 80,
        enableColumnActions: false,
        enableSorting: true,
      },
      {
        accessorKey: 'video',
        header: 'Video',
        size: 200,
        enableColumnActions: false,
        enableSorting: true,
        Cell: ({ row }) => (
          <video
            key={row?.original?._id}
            style={{ width: '100%', height: '200px', objectFit: 'cover' }} // Set height and maintain aspect ratio
            controls
          >
            <source src={row.original.video} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ),
      },
      ...(userDetails?.data?.isAdmin
        ? [
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
                    <MenuItem
                      onClick={() => handleDeleteFarmer(row.original._id)}
                    >
                      Delete 
                    </MenuItem>
                  </Menu>
                </Dropdown>
              ),
            },
          ]
        : []),
    ],
    [pageState?.pageIndex, data],
  );

  const handleEditFarmer = (bankaccout) => {
    setEditingLabor(bankaccout);
    setOpenAddModal(true);
  };
  const handleAssignViewTask = (task) => {
    setAssignView(task);
    setOpenViewTaskAddModal(true);
  };
  const handleAssignTask = (task) => {
    setEditingTask(task);
    setOpenTaskAddModal(true);
  };

  const handleDeleteFarmer = async (id) => {
    try {
      const response = await getAPIAuth(
        `bussinessIntelligence/deleteVideo?id=${id}`,
      );
      if (response.status === 200) {
        toast.success('Video Deleted Successfully');
        fetchData();
      } else {
        setData([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
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
      <div className="pt-10 flex justify-between items-start sm:items-center mb-6 gap-3 flex-col sm:flex-row">
        <Breadcrumb pageName="View Video" />
        {userDetails?.data?.isAdmin ? (
          <button
            onClick={() => {
              setEditingLabor(null);
              setOpenAddModal(true);
            }}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-black px-5 py-3 text-center font-medium text-white hover:bg-opacity-90"
          >
            <span>
              <AddIcon />
            </span>
            Add Video
          </button>
        ) : (
          <></>
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
      <AddBankFarmerModal
        openAddModal={openAddModal}
        setOpenAddModal={setOpenAddModal}
        editingLabor={editingLabor}
        updateData={fetchData}
      />
      <AddVideoModal
        openAddModal={openTaskAddModal}
        setOpenAddModal={setOpenTaskAddModal}
        editingLabor={editingTask}
        updateData={fetchData}
      />
      <TaskViewModal
        openAddModal={openViewTaskAddModal}
        setOpenAddModal={setOpenViewTaskAddModal}
        editHarvestingdata={AssignView}
      />
    </>
  );
};

export default VideoUploading;
// withPageGuard(VideoUploading , "Super Admin" , "View video" )
