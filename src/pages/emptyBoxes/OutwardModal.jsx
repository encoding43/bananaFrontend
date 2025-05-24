import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { IconButton, MenuItem, Select } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import {postAPIAuthFormData} from '../../service/apiInstance'
import {useAuth} from '../../hooks/useAuth'
import toast from 'react-hot-toast';

// const boxKgOptions = [3,5,7,13,13.5,14,16, 'custom']


const filter = createFilterOptions();


export default function OutwardModal({openOutwardModal, setOpenOutwardModal, selectedCompany, onSuccessFunction}) {
  const [loading, setLoading] = React.useState(false)
  const [filteredBoxBrand, setFilteredBoxBrand] = React.useState([])
  const [boxKgOptions, setBoxKgOptions] = React.useState([])
  const [selectedBoxId, setSelectedBoxId] = React.useState('')
  const [selectedBoxIdFromKg, setSelectedBoxIdFromKg] = React.useState('')
  const [editCount, setEditCount] = React.useState('')
  const {token} = useAuth()
  const [formValues, setFormValues] = React.useState({
    boxKgType : '',
    count: '',
    brand: '',
    note : ''
  })
  const [formErrors, setFormErrors] = React.useState({
    boxKgType : '',
    count: '',
    brand: '',
    note : ''
  })





  React.useEffect(()=> {
    if(selectedCompany?.stock?.box?.length) {
      const data = selectedCompany?.stock?.box?.filter(item=> item?.brand?.length > 0)
      if(data?.length) {
        const abc = data?.filter(elm=> elm?.boxKgType == formValues?.boxKgType)
        setFilteredBoxBrand(abc)
      }
    }
  }, [selectedCompany, formValues?.boxKgType])

  React.useEffect(()=> {
    if(selectedCompany?.stock?.box?.length) {
      const uniqueArray = [...new Map(selectedCompany?.stock?.box?.map(item => [item.boxKgType, item])).values()]
      // const filteredUniqueArray = [...new Set(uniqueArray.map(item => item.boxKgType))];
      const filteredData = uniqueArray?.length && uniqueArray?.filter(elm=> elm?.count > 0)
      setBoxKgOptions(filteredData)
    }
  }, [selectedCompany])

  React.useEffect(()=> {
    if(boxKgOptions?.length) {
      const data = boxKgOptions?.filter(item=> item?.boxKgType == formValues?.boxKgType)
      if(data) {
        setSelectedBoxId(data?.[0]?._id)
        setSelectedBoxIdFromKg(data?.[0]?._id)
        setEditCount(data?.[0]?.editCount)
      }
    }
  }, [formValues?.boxKgType])

  const handleClose = () => {
    setOpenOutwardModal(false);
  };

  
  console.log('selectedBoxId', selectedBoxId)

  const handleOutward = async ()=> {

    if(!formValues?.boxKgType) {
      setFormErrors(prev=>({
        ...prev, 
        boxKgType : 'Required'
      }))
    }
    if(!formValues?.count) {
      setFormErrors(prev=>({
        ...prev, 
        count : 'Required'
      }))
    }
    if(!formValues?.brand) {
      setFormErrors(prev=>({
        ...prev, 
        brand : 'Required'
      }))
    }
    if(!formValues?.note) {
      setFormErrors(prev=>({
        ...prev, 
        note : 'Required'
      }))
    }

    else {
      setLoading(true)
        const body = {
          boxKgType : formValues?.boxKgType,
          count : formValues?.count,
          brand : formValues?.brand,
          Note : formValues?.note,
          typeof : 'Outward',
        }
    
        try {
          const res = await postAPIAuthFormData(`supplier/company/Inventory/InwardAndOutward/${selectedCompany?.stock?._id}/${selectedBoxId ? selectedBoxId : selectedBoxIdFromKg ? selectedBoxIdFromKg : '66b1e92422224c7184e72faa'}`, body, token)
          console.log('res', res)
          if(res?.data?.success) {
            onSuccessFunction()
            handleClose()
            setFormValues({
              boxKgType : '',
              count: '',
              boxType : '',
              brand: '',
              note : ''
            })
            toast.success('Outward successfully')
          } else {
            toast.error(res?.data?.message)
          }
        } catch (error) {
          console.log(error)
          toast.error(error.message)
        } finally {
          setLoading(false)
        }
    }

  }

  return (
    <React.Fragment>
      <Dialog
        open={openOutwardModal}
        onClose={handleClose}
        fullWidth={true}
        maxWidth={'md'}
      >
        <DialogTitle>Outward</DialogTitle>
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
          <DialogContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                  <label class={` block text-sm font-medium text-black dark:text-white mb-3`}>
                      Select Box
                  </label>
                    <Select
                      value={formValues?.boxKgType}
                      onChange={(e)=> {
                        setFormValues(prev=>({...prev, boxKgType: e.target.value}))
                        setFormErrors(prev => ({...prev, boxKgType: ''}))
                        // setSelectedBoxId()
                      }}
                      displayEmpty
                      sx={{ width: '100%', height: '49.6px' }}
                    >
                      <MenuItem value="" disabled>Select box</MenuItem>
                      {boxKgOptions?.length ? boxKgOptions?.map((option, i) => (
                        <MenuItem key={option?.boxKgType} value={option?.boxKgType}>{option?.boxKgType}</MenuItem>
                      )) : 
                        <MenuItem value={''} disabled>No Box Available</MenuItem>
                      }
                    </Select>
                    {formErrors?.boxKgType && <div className='text-red-500 mt-1'>{formErrors?.boxKgType}</div>}
                </div>
                <div>
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Count
                  </label>
                  <input value={formValues?.count}
                    onChange={(e)=> {
                      setFormValues(prev=>({...prev, count: e.target.value}))
                      setFormErrors(prev => ({...prev, count: ''}))
                      }} type="text" placeholder="Enter count" className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"/>
                    {formErrors?.count && <div className='text-red-500 mt-1'>{formErrors?.count}</div>}
                </div>
                <div>
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Box Brand
                  </label>
                  <Select
                      value={formValues?.brand}
                      onChange={(e)=> {
                        setFormValues(prev=>({...prev, brand: e.target.value}))
                        setFormErrors(prev => ({...prev, brand: ''}))
                        // setSelectedBoxId()
                      }}
                      displayEmpty
                      sx={{ width: '100%', height: '49.6px' }}
                    >
                      <MenuItem value="" disabled>Select box brand</MenuItem>
                      {filteredBoxBrand?.length && filteredBoxBrand?.map((option, i) => (
                        <MenuItem key={option?.brand} value={option?.brand}>{option?.brand}</MenuItem>
                      ))}
                    </Select>
                    {formErrors?.brand && <div className='text-red-500 mt-1'>{formErrors?.brand}</div>}

                </div>
                <div>
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Note
                  </label>
                  <textarea onChange={(e)=> {
                        setFormValues(prev=>({...prev, note: e.target.value}))
                        setFormErrors(prev => ({...prev, note: ''}))
                      }} className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"/>
                    {formErrors?.note && <div className='text-red-500 mt-1'>{formErrors?.note}</div>}

                </div>
            </div>
          </DialogContent>
          <DialogActions>
          <button
              onClick={handleOutward}
              disabled={loading}
              type="submit"
              className={`flex w-full mx-auto max-w-[350px] justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 ${loading ? 'pointer-events-none bg-opacity-80' : ''}`}
            >
              {
                loading ? 'Loading...' : 'Submit'
              }
            </button>
          </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
