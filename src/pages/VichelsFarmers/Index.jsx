import React, { useMemo } from 'react'
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
import { Button } from '@mui/material';
// import AddLaborModal from './AddLaborModal';
// import AddVichelsFarmersModal from './AddRegisterModal';
import AddVichelsFarmerModal from './AddvichelsModal';
import { useNavigate } from 'react-router-dom';
import { ROUTES_CONST } from '../../constants/routeConstant';

const VichelsFarmers = () => {
  const navigate = useNavigate();
  const [openAddModal, setOpenAddModal] = React.useState(false);


    const data = [
      {
        _id: 1,
        date: '2023-07-28',
        location: 'Jaipur', 
        farmerName: 'John Doe',
        farmerMobile: '+1 123-456-7890',
        vehicleNumber: 'ABC1234',
        laborName: 'Mike Johnson',
        companyName: 'AgroFarms Inc.',
        rate: 12.5,
        weight: '1500 Kg', 
        wastage: '5 Kg', 
        coldStorage: 'true',
        companyRate: 13.0,
        companyWastage: '4 Kg' 
      },
      {
        _id: 2,
        date: '2023-07-28',
        location: 'Jaipur', 
        farmerName: 'John Doe',
        farmerMobile: '+1 123-456-7890',
        vehicleNumber: 'ABC1234',
        laborName: 'Mike Johnson',
        companyName: 'AgroFarms Inc.',
        rate: 12.5,
        weight: '1500 Kg', 
        wastage: '5 Kg', 
        coldStorage: 'true',
        companyRate: 13.0,
        companyWastage: '4 Kg' 
      },
      {
        _id: 3,
        date: '2023-07-28',
        location: 'Jaipur', 
        farmerName: 'John Doe',
        farmerMobile: '+1 123-456-7890',
        vehicleNumber: 'ABC1234',
        laborName: 'Mike Johnson',
        companyName: 'AgroFarms Inc.',
        rate: 12.5,
        weight: '1500 Kg', 
        wastage: '5 Kg', 
        coldStorage: 'true',
        companyRate: 13.0,
        companyWastage: '4 Kg' 
      },
      {
        _id: 4,
        date: '2023-07-28',
        location: 'Jaipur', 
        farmerName: 'John Doe',
        farmerMobile: '+1 123-456-7890',
        vehicleNumber: 'ABC1234',
        laborName: 'Mike Johnson',
        companyName: 'AgroFarms Inc.',
        rate: 12.5,
        weight: '1500 Kg', 
        wastage: '5 Kg', 
        coldStorage: 'true',
        companyRate: 13.0,
        companyWastage: '4 Kg' 
      },
      {
        _id: 5,
        date: '2023-07-28',
        location: 'Jaipur', 
        farmerName: 'John Doe',
        farmerMobile: '+1 123-456-7890',
        vehicleNumber: 'ABC1234',
        laborName: 'Mike Johnson',
        companyName: 'AgroFarms Inc.',
        rate: 12.5,
        weight: '1500 Kg', 
        wastage: '5 Kg', 
        coldStorage: 'true',
        companyRate: 13.0,
        companyWastage: '4 Kg' 
      },
    ];

    const columns = useMemo(
      () => [
        {
          accessorKey: 'farmerName', //normal accessorKey
          header: 'Farmer Name',
          size: 200,
        },
        {
          accessorKey: 'farmerMobile',
          header: 'Farmer Mobile',
          size: 150,
        },
        {
          accessorKey: 'date', //access nested data with dot notation
          header: 'Date',
          size: 150,
        },
        {
          accessorKey: 'location',
          header: 'Location',
          size: 150,
        },
        {
          accessorKey: 'vehicleNumber',
          header: 'Vehicle Number',
          size: 150,
        },
        {
          accessorKey: 'laborName',
          header: 'Labor Name',
          size: 150,
        },
        {
          accessorKey: 'companyName',
          header: 'Company Name',
          size: 150,
        },
        {
          accessorKey: 'rate',
          header: 'Rate',
          size: 150,
        },
        {
          accessorKey: 'weight',
          header: 'Weight',
          size: 150,
        },
        {
          accessorKey: 'coldStorage',
          header: 'Cold Storage',
          size: 150,
        },
        {
          accessorKey: 'companyRate',
          header: 'Company Rate',
          size: 150,
        },
        {
          accessorKey: 'companyWastage',
          header: 'Company Wastage',
          size: 150,
        },
        {
          accessorKey: 'actions',
          header: 'Actions',
          Cell: ({ row }) => (
            <Dropdown>
            <MenuButton><MoreHorizIcon/></MenuButton>
            <Menu slots={{ listbox: Listbox }}>
              <MenuItem onClick={handleEditFarmer(row.original._id)}>Edit</MenuItem>
              <MenuItem onClick={handleDeleteFarmer(row.original._id)}>Delete</MenuItem>
            </Menu>
          </Dropdown>
      
          ),
        },
      ],
      [],
    );

    const handleEditFarmer = (id) => {
      return () => {
        console.log(`Clicked on ${_id}`);
      };
    };

    const handleDeleteFarmer = (id) => {
      return () => {
        console.log(`Clicked on ${_id}`);
      };
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
  

    const table = useMemo(() => ({
      columns,
      data,
      // enableTopToolbar: false,    // to show top bar options
      // enableBottomToolbar: false,   // to show bottom bar options(paginations)
      initialState:{
        columnVisibility: {
          laborName: false,
          companyName: false,
          rate: false,
          weight: false,
          wastage: false,
          coldStorage: false,
          companyRate: false,
          companyWastage: false
        },
      },
      muiTableProps: {
        sx: {
          fontFamily: 'Satoshi, sans-serif',
          caption: {
            captionSide: 'top',
          },
        },
      },
      muiTableHeadCellProps: {
        sx: {
          fontSize: '1rem',
          fontWeight: '500',
          paddingInline: '2rem'
        },
      },
      muiTableBodyCellProps: {
        sx: {
          paddingInline: '2rem'
        },
      },
    }), [columns, data]);
    

  return (
    <>
          <div className="flex justify-between items-start sm:items-center mb-6 gap-3 flex-col sm:flex-row">
            <Breadcrumb pageName="View Farmer Vichels" />
            <button 
              onClick={()=> navigate(ROUTES_CONST.FARMER_SCHEDULES)}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-black px-5 py-3 text-center font-medium text-white hover:bg-opacity-90 ">
                    <span>
                    <AddIcon />
                    </span>
                    Schedule Farmer
                  </button>
            <button 
              onClick={()=>setOpenAddModal(true)}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-black px-5 py-3 text-center font-medium text-white hover:bg-opacity-90 ">
                    <span>
                    <AddIcon />
                    </span>
                    Add Farmer
                  </button>
          </div>
          <div className="table-container">
            <MaterialReactTable {...table} />
          </div>
        <AddVichelsFarmerModal openAddModal={openAddModal} setOpenAddModal={setOpenAddModal}/>
    </>
  )
}

export default VichelsFarmers


