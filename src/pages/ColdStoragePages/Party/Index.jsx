import React, { useEffect, useMemo, useState } from 'react';
// import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb'
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
// import AddVFarmerModal from './AddPartyModal';
import { getAPIAuth, postAPIAuth } from '../../../service/apiInstance';
import { toast } from 'sonner';
import { useAuth } from '../../../hooks/useAuth';
import { withPageGuard } from '../../../utils/withPageGuard'
import { useCheckPermission } from '../../../utils/useCheckPermission';
import AddColdStoragePArtyModal from './AddPartyModal';

const ColdStorageParty = () => {
  const navigate = useNavigate();
  const [openAddModal, setOpenAddModal] = React.useState(false);
  const [partydata, setPartyData] = React.useState([]);
  const [editfarmerdata, setEditFarmerData] = React.useState({});
  const [totalPages, setTotalPages] = useState(1);
  const [pageState, setPageState] = useState({ pageIndex: 0, pageSize: 10 });
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState([]);
  const { token } = useAuth();
  const checkEditPermission = useCheckPermission("Farmer Manager" , "Edit Farmer");
  console.log("checkEditPermission" , partydata);
  

  const getFarmersData = async (page = 1, perPage = 10) => {
    try {
      const res = await getAPIAuth(`coldStorage/party/get?page=${pageState.pageIndex + 1}&perPage=${pageState.pageSize}&name=${globalFilter  ?? ""}&sortBy=${sorting?.length ? sorting?.[0]?.id : ''}&sortOrder=${sorting?.length ? (sorting?.[0]?.desc ? 'desc' : 'aesc') : ''}`, token);
      if (res.status === 200) {
        console.log("resresresresres" , res);
        
        setPartyData(res?.data?.data?.documents || []);
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
  }, [pageState?.pageIndex, token, globalFilter, sorting ]);

  const columns = useMemo(() => [
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
      accessorKey: 'name',
      header: 'partyName',
      size: 150,
      enableColumnActions: true,
      enableSorting: true,
    },
    {
      accessorKey: 'ownerName',
      header: 'Owner Name',
      size: 150,
      enableColumnActions: true,
      enableSorting: true,
    },
    {
      accessorKey: 'address',
      header: 'Address',
      size: 150,
      enableColumnActions: true,
      enableSorting: true,
    },
    {
      accessorKey: 'mobile',
      header: 'Mobile',
      size: 100,
      enableColumnActions: true,
      enableSorting: true,
    },
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
          <Menu slots={{ listbox: Listbox }} className='z-999'>
            <MenuItem onClick={() => handleEditFarmer(row.original)}>Edit</MenuItem>
            <MenuItem onClick={() => handleDeleteParty(row?.original?._id)}>Delete</MenuItem>

          </Menu>
        </Dropdown>
      ),
    },
  ], [checkEditPermission ,pageState?.pageIndex]);

  const handleEditFarmer = (item) => {
    setEditFarmerData(item);
    setOpenAddModal(true);
  };

  const handleDeleteParty = async (id) => {
    try {
      const response = await postAPIAuth(`coldStorage/party/delete/${id}`);
      if (response.status === 200) {
        toast.success("Party Deleted Successfully");
        getFarmersData();
      }
    } catch (error) {
      console.error('Error deleting user:', error);
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
        <Breadcrumb pageName="View Party " />
        <button
          onClick={() => setOpenAddModal(true)}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-black px-5 py-3 text-center font-medium text-white hover:bg-opacity-90"
        >
          <AddIcon />
          Add Party
        </button>
      </div>
      <div className="table-container capitalize">
        <MaterialReactTable
          columns={columns}
          data={partydata}
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
      <AddColdStoragePArtyModal
        openAddModal={openAddModal}
        setOpenAddModal={setOpenAddModal}
        getFarmersData={getFarmersData}
        editfarmerdata={editfarmerdata}
        setEditFarmerData={setEditFarmerData}
      />
    </>
  );
};

export default ColdStorageParty;
