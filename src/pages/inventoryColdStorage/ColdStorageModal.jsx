import { Dialog, DialogTitle, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import React, { useEffect, useState } from 'react'
import moment from 'moment';
import ViewBoxDetailsModal from './ViewBoxDetailsModal';
import ExportButtonContent from '../../utils/ExportButtonContent';
import { exportToExcel } from '../../utils/excelExport';
import { useCheckPermission } from '../../utils/useCheckPermission';

const ColdStorageModal = ({showColdStorageModal, setShowColdStorageModal, data}) => {

  const [openBoxModal, setOpenBoxModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState({});
  const [exportData, setExportData] = useState([]);
  const checkExportPermission = useCheckPermission('Inventory - CS', 'export');

  useEffect(() => {
    const tableData = data?.map((el, index) => ({
      SrNo: index + 1,
      Date: moment(el?.time).format('L'),
      BillNo: el?.BillNo,
      Time: moment(el?.time).format('h:mm:ss A'),
      CompanyName: el?.partyName,
      VehicleNo: el?.VehicleNo,
      DriverMobile: el?.DriverMobile,
      UnitLocation: el?.UnitLocation,
      BoxWeight: el?.Box?.boxKgType,
      BoxBrand: el?.Box?.brand,
      HandsQty: el?.Box?.boxKgType < 13 ? el?.Box?.count : el?.Box?.handsRatio,
      Total: el?.Box?.boxKgType < 13 ? el?.Box?.count : 
             Object.values(el?.Box?.handsRatio).reduce((sum, value) => Number(sum) + Number(value), 0)
    }));
    const filteredResults = tableData?.filter((item) => item !== null);
    setExportData(filteredResults);
  },[data]);

  console.log("exportDataexportDataexportData" , exportData);
  

  const handleClose = ()=> {
    setShowColdStorageModal(false)
  }

  console.log('selectedItem', data)

  return (
    <>
    <Dialog
    open={showColdStorageModal}
    onClose={handleClose}
    fullWidth={true}
    maxWidth={'lg'}

  >
    <div className='pt-10 w-[calc(100%_-_45px)] flex justify-between pr-4 items-start sm:items-center mb-6 gap-3 flex-col sm:flex-row'>
    <DialogTitle>View Hands - Quantity </DialogTitle>
    {/* <ExportButtonContent
         apikey={apiKey}
         companyId = {editHarvestingdata?._id}
         /> */}
         <div>
        
      {
    checkExportPermission ? (
      <button
        className="inline-flex items-center justify-center gap-2 rounded-md bg-black px-5 py-3 text-center font-medium text-white hover:bg-opacity-90"
        onClick={() => exportToExcel(exportData)}
      >
        Export
      </button>
    ) : ("")
  }
         </div>
         </div>
    
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
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 text-nowrap">
                              <tr>
                                  <th scope="col" className="px-6 py-3">
                                      Sr. No
                                  </th>
                                  <th scope="col" className="px-6 py-3">
                                  Date
                                  </th>
                                  <th scope="col" className="px-6 py-3">
                                  Bill No.
                                  </th>
                                  <th scope="col" className="px-6 py-3">
                                      Time
                                  </th>
                                  <th scope="col" className="px-6 py-3">
                                  Company Name
                                  </th>
                                  <th scope="col" className="px-6 py-3">
                                  Vehicle No.
                                  </th>
                                  <th scope="col" className="px-6 py-3">
                                  Driver Mobile
                                  </th>
                                  <th scope="col" className="px-6 py-3">
                                  Unit Location
                                  </th>
                                  <th scope="col" className="px-6 py-3">
                                  Box Weight
                                  </th>
                                  <th scope="col" className="px-6 py-3">
                                  Box Brand
                                  </th>
                                  <th scope="col" className="px-6 py-3">
                                  Hands/Qty
                                  </th>
                                  <th scope="col" className="px-6 py-3">
                                  Total
                                  </th>
                              </tr>
                          </thead>
                          <tbody>
                            {
                              data?.length ? data?.map((el, index)=>
                                <tr className="bg-white text-nowrap border-b border-slate-300 dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <td className="px-6 py-4">
                                        {index + 1}
                                    </td>
                                    <td className="px-6 py-4">
                                        {moment(el?.time).format('L')}
                                    </td>
                                    <td className="px-6 py-4">
                                        {el?.BillNo}
                                    </td>
                                    <td className="px-6 py-4">
                                      {moment(el?.time).format('h:mm:ss A')}
                                    </td>
                                    <td className="px-6 py-4">
                                      {el?.partyName}
                                    </td>
                                    <td className="px-6 py-4">
                                      {el?.VehicleNo}
                                    </td>
                                    <td className="px-6 py-4">
                                      {el?.DriverMobile}
                                    </td>
                                    <td className="px-6 py-4">
                                      {el?.UnitLocation}
                                    </td>
                                    <td className="px-6 py-4">
                                      {el?.Box?.boxKgType}
                                    </td>
                                    <td className="px-6 py-4">
                                      {el?.Box?.brand}
                                    </td>
                                    <td className="px-6 py-4">
                                      {
                                                  el?.Box?.boxKgType < 13 ? el?.Box?.count : 
                                                  <button 
                                                    onClick={()=> {
                                                      setOpenBoxModal(true)
                                                      setSelectedItem(el?.Box?.handsRatio)
                                                    }}
                                                    className='inline-flex text-nowrap items-center justify-center text-sm rounded-md bg-black px-4 py-1 text-center font-medium text-white hover:bg-opacity-90 '>View Hands</button>
                                      }
                                    </td>
                                    <td className="px-6 py-4">
                                      {
                                                  el?.Box?.boxKgType < 13 ? el?.Box?.count : 
                                                  Object.values(el?.Box?.handsRatio).reduce((sum, value) => Number(sum) + Number(value), 0)
                                      }
                                    </td>
                                </tr>
                              ) : 
                              <tr className="bg-white border-b border-slate-300 dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                  <td colSpan={3} className="px-6 py-6 text-center text-bold">
                                      No Data Found
                                  </td>
                              </tr>
                            }
                          </tbody>
                      </table>
                  </div>
          {/* <MaterialReactTable
                  columns={columns}
                  data={data}
                  paginationDisplayMode={'pages'}
                  manualPagination
                  enableDensityToggle= {false}
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
                /> */}
    </Dialog>
            {
              openBoxModal ?
                <ViewBoxDetailsModal
                  openBoxModal={openBoxModal}
                  setOpenBoxModal={setOpenBoxModal}
                  selectedItem={selectedItem}
                />
              : ''
            }
            </>
  )
}

export default ColdStorageModal