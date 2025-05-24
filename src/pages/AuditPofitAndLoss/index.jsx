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
// import AddLaborModal from './AddLaborModal';
import { getAPIAuth, postAPIAuth } from '../../service/apiInstance';
import { toast } from 'sonner';
import { useAuth } from '../../hooks/useAuth';
import moment from 'moment';
import { withPageGuard } from '../../utils/withPageGuard';
import FarmerBillAddPaymentModal from './AddPaymentModal';
import WhatsAppComponent from '../../components/whatsApp/WhatsAppComponent';
import { Button, TextField, Box, Typography , Select, MenuItem } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useCheckPermission } from '../../utils/useCheckPermission';

const AuditProfitAndLoss = () => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });
  const [openAddModal, setOpenAddModal] = React.useState(false);
  const [data, setData] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [pageState, setPageState] = useState({ pageIndex: 0, pageSize: 10 });
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState([]);
  const {token} = useAuth();
  const [selectedData, setSelectedData] = useState({});
  const [year, setYear] = React.useState(currentYear);
  const [month, setMonth] = React.useState(currentMonth);
  console.log("datadatadatadata" , data);
  const difference = data?.allIncome - data?.allExpenses
  // const [totalldifference , setTotalDifference] = useState()
const checkExportPermission = useCheckPermission('Profit & Loss', 'export');
  
  const lastDateOfMonth = moment(`${year}-${month}`, 'YYYY-MMMM').endOf('month');
  const formattedLastDate = lastDateOfMonth.format('MM');
  console.log("monthmonthmonth" , difference);

  const fetchData = async () => {

    setLoading(true);
    try {
      const res = await getAPIAuth(`audit/profitLoss?page=${pageState.pageIndex + 1}&month=${formattedLastDate}&year=${year ? year : "" }&perPage=${pageState.pageSize}&search=${globalFilter == undefined ? "" :  globalFilter}&sortBy=${sorting?.length ? sorting?.[0]?.id : ''}&sortOrder=${sorting?.length ? (sorting?.[0]?.desc ? 'desc' : 'aesc') : ''}`, token);
      console.log("resresresresresresres" , res);
      if (res?.data?.status == 200) {
        // alert("hii")
        setData(res?.data?.data);
        // const totalCount = res?.data?.data?.[0]?.totalCount || 0;
        setTotalPages(res?.data?.data?.pagination?.totalChildrenCount);
      } else{
        console.log('else m gya')
        setData([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setData([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };
  console.log({totalPages})

  useEffect(() => {
    fetchData();
  }, [pageState?.pageIndex, token, globalFilter, sorting , month , year]);


  const handleYearChange = (event) => {
    setYear(event.target.value);
  };

  const handleMonthChange = (event) => {
    setMonth(event.target.value);
  };

  
  function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
  }
  
  const rows = [
    createData('Material', data?.materialPaybel ? data?.materialPaybel : "N/A", "Company Bill", data?.companyAmountPaybel ? data?.companyAmountPaybel : "N/A"),
    createData('Box', "N/A", "wastage", "N/A"),
    createData('Labor',data?.laborAmountPaybel ? data?.laborAmountPaybel : "N/A", "", ""),
    createData('Farmer', data?.farmerAmountPaybel ? data?.farmerAmountPaybel : "N/A", "", ""),
    createData('transport', data?.transportAmountPaybel ? data?.transportAmountPaybel : "N/A", "", ""),
    createData('Total Expenses', data?.allExpenses ? data?.allExpenses : "N/A", "Total Income", data?.allIncome ? data?.allIncome : "N/A"),

  ];
  
  return (
    <>
      {/* <DefaultLayout> */}
        <div className="flex justify-between items-start sm:items-center mb-6 gap-3 flex-col sm:flex-row">
          <Breadcrumb pageName="Profit & Loss" />
          <div className='inline-flex items-center justify-center gap-2 rounded-md bg-black px-5 py-3 text-center font-medium text-white hover:bg-opacity-90' >Difference : {difference}</div>
          <Box display="flex" justifyContent="end" alignItems="center" bgcolor="" color="white" p={2}>
            {/* djhdfj */}
      <Typography variant="p" className='text-black'>Year</Typography>
      <Select
      className='dfgyuiorftyuio'
        value={year}
        onChange={handleYearChange}
        placeholder='fdsjdhjh'
        variant="outlined"
        size="small"
        sx={{
          bgcolor: 'white',
          color: 'black',
          width: '100px',
          marginLeft: '8px',
          marginRight: '24px'
        }}
      >
     <MenuItem value={2015}>2015</MenuItem>
<MenuItem value={2016}>2016</MenuItem>
<MenuItem value={2017}>2017</MenuItem>
<MenuItem value={2018}>2018</MenuItem>
<MenuItem value={2019}>2019</MenuItem>
<MenuItem value={2020}>2020</MenuItem>
<MenuItem value={2021}>2021</MenuItem>
<MenuItem value={2022}>2022</MenuItem>
<MenuItem value={2023}>2023</MenuItem>
 <MenuItem value={2024}>2024</MenuItem>
 <MenuItem value={2025}>2025</MenuItem>
 <MenuItem value={2026}>2026</MenuItem>
 <MenuItem value={2027}>2027</MenuItem>
 <MenuItem value={2028}>2028</MenuItem>
 <MenuItem value={2029}>2029</MenuItem>
 <MenuItem value={2030}>2030</MenuItem>
 <MenuItem  value={2031}>2031</MenuItem>
        {/* Add more years as needed */}
      </Select>
      <Typography variant="p" className='text-black'>Month</Typography>
      <Select
        value={month}
        onChange={handleMonthChange}
        variant="outlined"
        className=''
        size="small"
        sx={{
          bgcolor: 'white',
          color: 'black',
          width: '150px',
          marginLeft: '8px',
        }}
      >
        
        <MenuItem value="January">January</MenuItem>
        <MenuItem value="February">February</MenuItem>
        <MenuItem value="March">March</MenuItem>
        <MenuItem value="April">April</MenuItem>
        <MenuItem value="May">May</MenuItem>
        <MenuItem value="June">June</MenuItem>
        <MenuItem value="July">July</MenuItem>
        <MenuItem value="August">August</MenuItem>
        <MenuItem value="September">September</MenuItem>
        <MenuItem value="October">October</MenuItem>
        <MenuItem value="November">November</MenuItem>
        <MenuItem value="December">December</MenuItem>
      </Select>
    </Box>
        </div>
      
        <div className="table-container capitalize">
        <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>All Expenses</TableCell>
            <TableCell align="right">Amount</TableCell>
            <TableCell align="right">All Income</TableCell>
            <TableCell align="right">Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody className='&:last-child:bg-red-500'>
          {rows.map((row, index) => (
            <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0, fontWeight: 500 } }}
            >
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.calories}</TableCell>
              <TableCell align="right">{row.fat}</TableCell>
              <TableCell align="right">{row.carbs}</TableCell>
              <TableCell align="right">{row.protein}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
      </div>
      {
        openAddModal &&
          <FarmerBillAddPaymentModal
            openAddModal={openAddModal}
            setOpenAddModal={setOpenAddModal}
            fetchData={fetchData}
            selectedData={selectedData}
          />
      }
    </>
  );
};

export default withPageGuard(AuditProfitAndLoss , "Profit & Loss" , "List" );