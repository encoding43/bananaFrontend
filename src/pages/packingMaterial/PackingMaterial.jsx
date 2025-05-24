// @ts-nocheck
import React, { useEffect, useMemo, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { MaterialReactTable } from 'material-react-table';
import { Button, TextField, Box } from '@mui/material';
import { toast } from 'sonner';
import { useAuth } from '../../hooks/useAuth';
import { getAPIAuth, postAPIAuth, postAPIAuthFormData } from '../../service/apiInstance';
import ViewImagesModal from './ViewImagesModal';
import {withPageGuard} from "../../utils/withPageGuard.jsx"
import {useCheckPermission} from "../../utils/useCheckPermission.jsx"

const PackingMaterial = () => {
  const [data, setData] = useState([]);
  const [editRowIndex, setEditRowIndex] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [totalPages, setTotalPages] = useState(1);
  const [pageState, setPageState] = useState({ pageIndex: 0, pageSize: 10 });
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();
  const [showImages, setShowImages] = useState(false)
  const [selectedImages, setSelectedImages] = useState([])
  const [baseUrl, setBaseUrl] = useState('')
  const [date, selectedDate] = useState(Date.now())
  const [rate, setRate] = useState(null)
  const [selectedType, setSelectedType] = useState('')
  const checkInwardPermission = useCheckPermission('Packing Material', 'inward');
  const checkOutwardPermission = useCheckPermission('Packing Material', 'outward');
  const getSupplierList = async () => {
    try {
      const res = await getAPIAuth(
        `/getGlobalMateialGermination?page=${pageState.pageIndex + 1}&perPage=${pageState.pageSize}&search=${globalFilter == undefined ? "" :  globalFilter}&sortBy=${sorting?.length ? sorting?.[0]?.id : ''}&sortOrder=${sorting?.length ? (sorting?.[0]?.desc ? 'desc' : 'aesc') : ''}`,
        token,
      );
      if (res?.data?.success) {
        setData(res?.data?.data);
        // setTotalPages(res?.data?.data?.pagination?.totalChildrenCount);
      }
    } catch (error) {
      console.error('error', error);
    }
  };

  useEffect(() => {
    if (token) {
      getSupplierList();
    }
  }, [pageState?.pageIndex, token, globalFilter, sorting]);

  const handleEditClick = (rowIndex, row, type) => {

    console.log('rowwwwwwwwwwwwwwwwww', row)
    setEditRowIndex(rowIndex);
    setEditValues({
      ...row, 
      value : {
        ...row?.value,
        value : ''
      }
    });
    setSelectedType(type)
  };


  console.log('editvaluessssssssssssssss', editValues)

  const handleInwardSubmit = async () => {
    console.log(!editValues?.value.value, 'aajajajajaja')

    if(!editValues?.value.value) {
      toast.error('Please enter quantity')
      return
    }
    if(!editValues?.image) {
      toast.error('Please select image')
      return
    }
    if(!editValues?.value.date) {
      toast.error('Please select date')
      return
    }
    if(!editValues?.value.rate) {
      toast.error('Please enter rate')
      return
    }
    try {
      const formData = new FormData();
    //   console.log("editValueseditValues",editValues.value)
      formData.append('value', editValues?.value.value);
      formData.append('type', selectedType);
      formData.append('date', editValues.value.date);
      formData.append('rate', editValues.value.rate);
      formData.append('name', editValues?.value?.name ? editValues?.value?.name : '');
      formData.append('typeName', "Images");
      if (editValues.image) {
        // formData.append('image', editValues.image);
        editValues?.image.forEach((file) => {
          formData.append('image', file);
        });
      }

      const res = await postAPIAuthFormData(
        `/update/globalMaterial/${editValues._id}`,
        formData,
        token,
      );

      if (res?.data?.status === 200) {
        const newData = [...data];
        newData[editRowIndex] = editValues;
        setData(newData);
        setEditRowIndex(null);
        getSupplierList();
        toast.success('Data saved successfully');
      } else {
        toast.error('Failed to save data');
      }
    } catch (error) {
      console.error('Error saving data:', error);
      toast.error('Error saving data');
    }
  };

  const handleOutwardSubmit = async () => {
    if(!editValues?.value.value) {
      toast.error('Please enter quantity')
      return
    }
    if(!editValues.value.date) {
      toast.error('Please select date')
      return
    }
    if(!editValues?.value.note) {
      toast.error('Please enter note')
      return
    }
    try {

      const body = {
        value : editValues?.value.value,
        date : editValues.value.date,
        note : editValues.value.note,
        name : editValues?.value?.name ? editValues?.value?.name : '',
        type : selectedType
      }

      const res = await postAPIAuthFormData(
        `/update/globalMaterial/${editValues._id}`,
        body,
        token,
      );

      if (res?.data?.status === 200) {
        const newData = [...data];
        newData[editRowIndex] = editValues;
        setData(newData);
        setEditRowIndex(null);
        getSupplierList();
        toast.success('Data saved successfully');
      } else {
        toast.error('Failed to save data');
      }
    } catch (error) {
      console.error('Error saving data:', error);
      toast.error('Error saving data');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // console.log("check value", name, value)
    setEditValues({
      ...editValues,
      value: {
        ...editValues.value,
            [name]: value,
      }
    });
  };

  const handleFileChange = (e) => {
    setEditValues({
      ...editValues,
      // image: e.target.files[0],
      image : Array.from(e.target.files)
    });
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'rowNumber',
        header: 'Sr. No',
        size: 60,
        Cell: ({ row }) => row.index + 1,
        enableColumnActions: false,
        enableSorting: false,
      },
      {
        accessorKey: 'title',
        header: 'List',
        size: 200,
        enableColumnActions: false,
        enableSorting: false,
        Cell: ({ row }) => row?.original?.value?.name ? `${row?.original?.title} - ${row?.original?.value?.name}` : row?.original?.title ,
      },
      {
        accessorKey: 'value',
        header: 'Stock',
        size: 150,
        enableColumnActions: false,
        enableSorting: false,
        Cell: ({ row }) =>{
          return editRowIndex === row?.original?._id ? (
            <TextField
              name="value"
              value={editValues.value.value}
              onChange={handleInputChange}
              size="small"
              fullWidth
              className='w-[140px] rounded-lg border-[1.5px] border-slate-400 bg-transparent px-2.5 py-2.5 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary'
            />
          ) : (
            row?.original?.value?.value +' ' + row?.original?.unit
          )},
      },
      {
        accessorKey: 'addStock',
        header: '',
        size: 150,
        enableColumnActions: false,
        enableSorting: false,
        Cell: ({ row }) =>
          editRowIndex === row?.original?._id ? (
            <>
            <div className="flex items-center gap-3">

            {/* <Box> */}
            {
              selectedType === 'inward' ? 
                <input
                  type="file"
                  accept=".jpg, .jpeg, .png"
                  name="image"
                  className="w-[250px] cursor-pointer rounded-lg border-[1.5px] border-slate-400 bg-transparent font-normal outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:px-5 file:py-3 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
                  onChange={handleFileChange}
                  // style={{ marginTop: '8px' }}
                  multiple
                />
              : ''
            }
            {/* </Box> */}
              <input
                type='date'
                name='date'
                  value={editValues.value.date}
                  onChange={handleInputChange}
                  className="w-[140px] rounded-lg border-[1.5px] border-slate-400 bg-transparent px-2.5 py-2.5 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />

              {
                selectedType === 'inward' ? 
                  <input
                  type='text'
                  placeholder='Rate'
                  name='rate'
                    value={editValues.value.rate}
                    onChange={handleInputChange}
                    className="w-[140px] rounded-lg border-[1.5px] border-slate-400 bg-transparent px-2.5 py-2.5 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
                : ''
              }
              {
                selectedType === 'outward' ? 
                  <textarea
                  name='note'
                  placeholder='Note'
                    value={editValues.value.rate}
                    onChange={handleInputChange}
                    className="w-[200px] rounded-lg border-[1.5px] border-slate-400 bg-transparent px-2.5 py-2.5 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
                : ''
              }
            </div>
            </>
          ) : (
           <>
           {/* <div className="flex gap-3">

           {
            row?.original?.value?.image?.length ? 
            <>
              {
                row?.original?.value?.image?.slice(0,3)?.map(item=> (
                  <div className='w-17 h-17 border border-[#e0e0e0]'>
                  <img className='size-full object-cover' src={row?.original?.baseurl+'/'+item } alt="No Image" />
                </div>
                ))
              } 
              {
                row?.original?.value?.image?.length > 3 ? 
                  <div 
                    onClick={()=> {
                      setSelectedImages(row?.original?.value?.image)
                      setBaseUrl(row?.original?.baseurl)
                      setShowImages(true)
                    }}
                    className="w-17 h-17 border border-[#e0e0e0] flex items-center justify-center text-center font-medium text-[12px] cursor-pointer">
                    view <br /> More
                  </div>
                : ''
              }
            </>
          : 'No Image'
           }
           </div> */}
           </>
          ),
      },
      {
        accessorKey: 'isBlocked',
        header: 'Actions',
        size: 150,
        enableColumnActions: false,
        enableSorting: false,
        Cell: ({ row }) =>
          editRowIndex === row?.original?._id ? 
              (selectedType === 'inward') ? 
              <button  className="inline-flex items-center justify-center gap-2 rounded-md bg-black px-3 py-2 text-center font-medium text-white hover:bg-opacity-90" onClick={handleInwardSubmit}>
                Save Inward
              </button> :
              (selectedType === 'outward') ? 
              <button  className="inline-flex items-center justify-center gap-2 rounded-md bg-black px-3 py-2 text-center font-medium text-white hover:bg-opacity-90" onClick={handleOutwardSubmit}>
              Save Outward
              </button> : 
              ''
            : (
            <>
            <div className="flex gap-3">

           {
            checkInwardPermission ? (
              <>
               <button
               className="inline-flex items-center justify-center gap-2 rounded-md bg-black px-3 py-2 text-center font-medium text-white hover:bg-opacity-90"
              onClick={() => handleEditClick(row?.original?._id, row.original, 'inward')}
            >
              Inward
            </button>
              </>
            ) : (<></>)
           }
              {
            checkOutwardPermission ? (
              <>
                <button
                        className="inline-flex items-center justify-center gap-2 rounded-md bg-black px-3 py-2 text-center font-medium text-white hover:bg-opacity-90"
                       onClick={() => handleEditClick(row?.original?._id, row.original, 'outward')}
                     >
                       Outward
                     </button>
              </>
            ) : (<></>)
           }
           
            </div>
            </>
          ),
      },
    ],
    [editRowIndex, editValues , checkOutwardPermission ,  checkInwardPermission],
  );

  return (
    <>
      <div className="flex justify-between items-start sm:items-center mb-6 gap-3 flex-col sm:flex-row">
        <Breadcrumb pageName="Packing Material" />
      </div>
      <div className="table-container capitalize">
        <MaterialReactTable
          columns={columns}
          data={data}
          enableDensityToggle={false}
          enableFullScreenToggle={false}
          enableGlobalFilter={false}
          enableHiding={false}
          // rowCount={data.length}
          enableColumnFilters={false}
          initialState={{
            density: 'comfortable',
           
          }
        }
          manualFiltering={true}
          onGlobalFilterChange={setGlobalFilter}
          manualSorting={true}
          onSortingChange={setSorting}
          enablePagination={false}
          muiPaginationProps={{
            color: 'primary',
            shape: 'rounded',
            showRowsPerPage: false,
            variant: 'outlined',
          }}
          state={{
            pagination: { pageIndex: 0, pageSize: 20 },
            globalFilter,
            sorting,
          }}
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
      <ViewImagesModal
        showImages={showImages}
        setShowImages={setShowImages}
        selectedImages={selectedImages}
        baseUrl={baseUrl}
      />
    </>
  );
};

export default withPageGuard(PackingMaterial , "Packing Material" , "Stock list" );

