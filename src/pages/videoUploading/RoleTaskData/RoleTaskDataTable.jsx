import React, { useEffect, useMemo, useState } from 'react';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../../layout/DefaultLayout';
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
// import AddBankFarmerModal from './AddbankModal';
import { getAPIAuth, postAPIAuth } from '../../../service/apiInstance';
import { toast } from 'sonner';
import { useAuth } from '../../../hooks/useAuth';
import { Box } from '@mui/material';
import moment from 'moment';


const RoleTaskData = () => {

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
  const {token} = useAuth();
  console.log("datadatadata" , data);
  

 

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getAPIAuth(`task/viewRoleTask?page=${pageState.pageIndex + 1}&perPage=${pageState.pageSize}&sortBy=${sorting?.length ? sorting?.[0]?.id : ''}&name=${globalFilter == undefined ? "" :  globalFilter}&sortOrder=${sorting?.length ? (sorting?.[0]?.desc ? 'desc' : 'aesc') : ''}`, token);
  console.log("ssssssdatadatadata" , res);
     
      if (res?.data?.success) {
        setData(res?.data?.data?.documents || []);
        // const totalCount = res?.data?.data?.[0]?.totalCount || 0;
        setTotalPages(res?.data?.data?.pagination?.totalChildrenCount);
      }
      else{
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
    if (token){
        fetchData();
    }
  }, [pageState?.pageIndex, token, globalFilter, sorting]);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'rowNumber',
        header: 'Sr. No',
        size: 60,
        Cell: ({ row }) => row.index + 1 + pageState.pageIndex * pageState.pageSize,
        enableColumnActions: false,
        enableSorting: false,
      },
      {
        accessorKey: 'taskName',
        header: 'Task Name',
        size: 200,
        enableColumnActions: false,
        enableSorting: false,
      },
      {
        accessorKey: 'createdAt',
        header: 'Task Assign Date',
        size: 200,
        enableColumnActions: false,
        enableSorting: false,
        accessorFn: (row) => moment(row?.createdAt).format('YYYY-MM-DD'),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        size: 200,
        enableColumnActions: false,
        enableSorting: false,
        Cell: ({ row }) => (<div
          className={`
            ${row.original.status === "running" ? "text-[#009688]" : ""}
            ${row.original.status === "reject" ? "text-red-500" : ""}
            ${row.original.status === "completed" ? "text-green-500" : ""}
          `}
        >{row.original.status}</div>)
      },
      {
        accessorKey: 'actions',
        header: 'Actions',
        enableColumnActions: false,
        enableSorting: false,
        Cell: ({ row }) => (
          <>
          {
            row.original.status == "reject" || row.original.status == "running" || row.original.status == "completed" ? (
              <></>
            ): (
              <div className='flex gap-3'>
              <Box className="inline-flex items-center justify-center gap-2 rounded-md bg-black px-5 py-3 text-center font-medium text-white hover:bg-opacity-90 cursor-pointer" onClick={() => handleAccept(row.original._id)}>Accept</Box>
              <Box className="inline-flex items-center justify-center gap-2 rounded-md bg-[red] px-5 py-3 text-center font-medium text-white hover:bg-opacity-90 cursor-pointer" onClick={() => handleDelete(row.original._id)}>Delete</Box>
              </div>
            )
          }
          {
            row.original.status == "running" ? (
              <div className='flex gap-3'>
              <Box className="inline-flex items-center justify-center gap-2 rounded-md bg-black px-5 py-3 text-center font-medium text-white hover:bg-opacity-90 cursor-pointer">Complete</Box>
              
              </div>
            ): (
              
              <></>
            )
          }
          </>
        ),
      },
    ],
    [pageState?.pageIndex]
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

  const handleAccept = async (id) => {
    try {
      const response = await getAPIAuth(`task/acceptRejectTask?status=${true}&id=${id}`);
      if (response.status === 200) {
        toast.success("task is running");
        fetchData();
      }
      else{
        setData([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await getAPIAuth(`task/acceptRejectTask?status=${false}&id=${id}`);
      if (response.status === 200) {
        toast.success("Task Rejected Successfully");
        fetchData();
      }
      else{
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
          <Breadcrumb pageName="View Task" />
         
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
    </>
  );
};

export default RoleTaskData;
