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
// import AddVFarmerModal from './AddFarmersModal';
import { getAPIAuth } from '../../service/apiInstance';
import { toast } from 'sonner';
import { useAuth } from '../../hooks/useAuth';
import { withPageGuard } from '../../utils/withPageGuard'
import { useCheckPermission } from '../../utils/useCheckPermission';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const BusssinessBananaHarvesting = () => {
  const navigate = useNavigate();
  const [openAddModal, setOpenAddModal] = React.useState(false);
  const [farmerdata, setFarmerData] = React.useState([]);
  const [editfarmerdata, setEditFarmerData] = React.useState({});
  const [totalPages, setTotalPages] = useState(1);
  const [pageState, setPageState] = useState({ pageIndex: 0, pageSize: 10 });
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState([]);
  const { token } = useAuth();
  const checkEditPermission = useCheckPermission("Farmer Manager" , "Edit Farmer");
  console.log("checkEditPermission" , farmerdata);
  

  const getFarmersData = async (page = 1, perPage = 5) => {
    try {
      const res = await getAPIAuth(`bussinessIntelligence/totalBannanaHarvested`, token);
      console.log("resresresres111" , res);
      
      if (res.status === 200) {
        setFarmerData(res?.data?.data || []);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred');
    }
  };

  function createData(name, calories) {
    return { name, calories };
  }
  
  const rows = [
    createData('Total KG Harvested', farmerdata?.totalKgHarvest),
    createData('Total amount Paid to Farmer', farmerdata?.totalAmountPaid),
    createData('Total Containers', farmerdata?.totalContainer),
    createData('Total Parties', farmerdata?.totalParties )

  ];

  useEffect(() => {
    if (token) {
      getFarmersData();
    }
  }, [pageState?.pageIndex, token, globalFilter, sorting ]);


  
  return (
    <>
      <div className="flex justify-between items-start sm:items-center mb-6 gap-3 flex-col sm:flex-row">
        <Breadcrumb pageName="Total Banana Harvested " />
      </div>
      <div className="table-container capitalize">
      <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Harvested</TableCell>
            <TableCell align="right">Data</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.calories}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
      </div>
    </>
  );
};

export default withPageGuard(BusssinessBananaHarvesting , "Total B harvested" , "Data" );


