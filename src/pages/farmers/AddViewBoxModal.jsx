import React, { useMemo, useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Autocomplete, Box, Chip, IconButton, MenuItem, Select } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Add, Delete } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import {getAPI, getAPIAuth, postAPIAuth, postAPIAuthFormData} from './../../service/apiInstance.ts'
import { useAuth } from '../../hooks/useAuth.jsx';
import AddIcon from '@mui/icons-material/Add';
// import toast from 'react-hot-toast';
import { toast, Toaster } from 'sonner';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import {MaterialReactTable} from 'material-react-table';
import { Dropdown } from '@mui/base/Dropdown';
import { Menu } from '@mui/base/Menu';
import { MenuButton as BaseMenuButton } from '@mui/base/MenuButton';
import { MenuItem as BaseMenuItem, menuItemClasses } from '@mui/base/MenuItem';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb.tsx';

export default function AddFarmersModal({openAddModal, setOpenAddModal , editHarvestingdata , getFarmers}) {
    const navigate = useNavigate();
    const [openBoxAddModal, setOpenBoxAddModal] = useState(false);
    const [editBoxHarvestingdata, setEditBoxHarvestingData] = useState({});
    const [data, setData] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [pageState, setPageState] = useState({ pageIndex: 0, pageSize: 10 });
    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState([]);
    const {token} = useAuth();
    console.log("editHarvestingdata" , editHarvestingdata);
    const handleClose = () => {
        setOpenAddModal(false);
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
          { accessorKey: 'boxKgType', header: 'Box Kg Type', size: 70, enableColumnActions: false, enableSorting: false },
          { accessorKey: 'count', header: 'Count Value', size: 70, enableColumnActions: false, enableSorting: false },
          { accessorKey: 'brand', header: 'Brand', size: 70, enableColumnActions: false, enableSorting: false, 
            Cell: ({ cell }) => cell.getValue() || 'N/A',
          },
          {
            accessorKey: 'handsRatio.3H',
            header: '3H',
            size: 70,
            enableColumnActions: false,
            enableSorting: false,
          },
          {
            accessorKey: 'handsRatio.4H',
            header: '4H',
            size: 70,
            enableColumnActions: false,
            enableSorting: false,
          },
          {
            accessorKey: 'handsRatio.5H',
            header: '5H',
            size: 70,
            enableColumnActions: false,
            enableSorting: false,
          },
          {
            accessorKey: 'handsRatio.6H',
            header: '6H',
            size: 70,
            enableColumnActions: false,
            enableSorting: false,
          },
          {
            accessorKey: 'handsRatio.7H',
            header: '7H',
            size: 70,
            enableColumnActions: false,
            enableSorting: false,
          },
          {
            accessorKey: 'handsRatio.8H',
            header: '8H',
            size: 70,
            enableColumnActions: false,
            enableSorting: false,
          },
          {
            accessorKey: 'handsRatio.9H',
            header: '9H',
            size: 70,
            enableColumnActions: false,
            enableSorting: false,
          },
          {
            accessorKey: 'handsRatio.10H',
            header: '10H',
            size: 70,
            enableColumnActions: false,
            enableSorting: false,
          },
          {
            accessorKey: 'customBox',
            header: 'Custom Box',
            size: 70,
            enableColumnActions: false,
            enableSorting: false,
            Cell: ({ cell }) => (cell.getValue() ? 'Yes' : 'No'),
          },
          { accessorKey: 'minimumWeight', header: 'Minimum Weight', size: 150, enableColumnActions: false, enableSorting: false },
          { accessorKey: 'maximumWeight', header: 'Maximum Weight', size: 150, enableColumnActions: false, enableSorting: false },
          { accessorKey: 'emptyBoxWeight', header: 'Empty Box Weight', size: 150, enableColumnActions: false, enableSorting: false },
        ],
        [pageState?.pageIndex]
      );
      
      
    
  return (
     <>
      <Dialog
        open={openAddModal}
        onClose={handleClose}
        fullWidth={true}
        maxWidth={'md'}

      >
         <DialogTitle>View Box </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>

        <div className="table-container">
          <MaterialReactTable
            columns={columns}
            data={editHarvestingdata}
            paginationDisplayMode={'pages'}
            manualPagination
            enableDensityToggle= {false}
            rowCount={totalPages}
            enableColumnFilters={false}
            initialState={{
              density: 'comfortable',
            }}
            manualFiltering= {true} //turn off client-side filtering
            onGlobalFilterChange= {setGlobalFilter} //hoist internal global state to your state
            manualSorting= {true}
            onSortingChange= {setSorting}
            muiPaginationProps={{
              color: 'primary',
              shape: 'rounded',
              showRowsPerPage: false,
              variant: 'outlined',
            }}
            state={{
              pagination: pageState,
              globalFilter ,
              sorting
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
        </Dialog>
     </>
  );
}
