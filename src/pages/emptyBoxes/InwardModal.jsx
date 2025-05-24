import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { IconButton, MenuItem, Select } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import {postAPIAuthFormData} from './../../service/apiInstance'
import {useAuth} from './../../hooks/useAuth'

// const boxKgOptions = [3,5,7,13,13.5,14,16, 'custom']


const filter = createFilterOptions();

export default function InwardModal({openInwardModal, setOpenInwardModal, selectedCompany, onSuccessFunction}) {

  const [filteredBoxBrand, setFilteredBoxBrand] = React.useState([])
  const [boxKgOptions, setBoxKgOptions] = React.useState([])
  const [selectedBoxId, setSelectedBoxId] = React.useState('')
  const [selectedBoxIdFromKg, setSelectedBoxIdFromKg] = React.useState('')
  const [editCount, setEditCount] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const {token} = useAuth()
  const [formValues, setFormValues] = React.useState({
    boxKgType : '',
    customValue : '',
    count: '',
    boxType : '',
    invoiceImages : ''
  })
  const [formErrors, setFormErrors] = React.useState({
    boxKgType : '',
    customValue : '',
    count: '',
    boxType : '',
    invoiceImages : ''
  })

  React.useEffect(()=> {
    if(selectedCompany?.stock?.box?.length) {
      const data = selectedCompany?.stock?.box?.filter(item=> item?.brand?.length > 0)
      // console.log('dataselectedBoxIdselectedBoxIdselectedBoxId', data)
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
      setBoxKgOptions(uniqueArray)
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
    setOpenInwardModal(false);
  };

  const handleInward = async ()=> {

    if(!formValues?.boxKgType) {
      setFormErrors(prev=>({
        ...prev, 
        boxKgType : 'Required'
      }))
    }
    // if(!formValues?.customValue) {
    //   setFormErrors(prev=>({
    //     ...prev, 
    //     customValue : 'Required'
    //   }))
    // }
    if(!formValues?.count) {
      setFormErrors(prev=>({
        ...prev, 
        count : 'Required'
      }))
    }
    if(!formValues?.boxType) {
      setFormErrors(prev=>({
        ...prev, 
        boxType : 'Required'
      }))
    }
    if(!formValues?.invoiceImages) {
      setFormErrors(prev=>({
        ...prev, 
        invoiceImages : 'Required'
      }))
    } else {
      setLoading(true)
        const formData = new FormData()
    
        formData?.append('boxKgType', formValues?.boxKgType === 'custom' ? formValues?.customValue : formValues?.boxKgType)
        formData?.append('count', formValues?.count)
        formData?.append('brand', formValues?.boxType)
        formData?.append('typeName', 'stock')
        formData?.append('typeof', 'Inward')
        formData?.append('editCount', editCount ? editCount : 0)
        formData?.append('custom', formValues?.boxKgType === 'custom' ? true : false)
        formValues?.invoiceImages.forEach((file) => {
          formData.append('images', file);
        });
    
        try {
          const res = await postAPIAuthFormData(`supplier/company/Inventory/InwardAndOutward/${selectedCompany?.stock?._id}/${selectedBoxId ? selectedBoxId : selectedBoxIdFromKg ? selectedBoxIdFromKg : '66b1e92422224c7184e72faa'}`, formData, token)
          console.log('res', res)
          if(res?.data?.success) {
            onSuccessFunction()
            handleClose()
            setFormValues({
              boxKgType : '',
              customValue : '',
              count: '',
              boxType : '',
              invoiceImages : ''
            })
          }
        } catch (error) {
          
        } finally {
          setLoading(false)
        }
    }


  }

  return (
    <React.Fragment>
      <Dialog
        open={openInwardModal}
        onClose={handleClose}
        fullWidth={true}
        maxWidth={'md'}
      >
        <DialogTitle>Inward</DialogTitle>
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
                        setFormErrors(prev=>({...prev, boxKgType: ''}))

                        // setSelectedBoxId()
                      }}
                      displayEmpty
                      sx={{ width: '100%', height: '49.6px' }}
                    >
                      <MenuItem value="" disabled>Select box</MenuItem>
                      {boxKgOptions?.length && boxKgOptions?.map((option, i) => (
                        <MenuItem key={option?.boxKgType} value={option?.boxKgType}>{option?.boxKgType}</MenuItem>
                      ))}
                        <MenuItem value={'custom'}>Custom</MenuItem>
                    </Select>
                    {formErrors?.boxKgType && <div className='text-red-500 mt-1'>{formErrors?.boxKgType}</div>}
                </div>
                {
                  formValues?.boxKgType === 'custom' ? 
                    <div>
                      <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                        Custom Value
                      </label>
                      <input value={formValues?.customValue}
                        onChange={(e)=> {setFormValues(prev=>({...prev, customValue: e.target.value}))
                        setFormErrors(prev=>({...prev, boxKgType: ''}))
                        }} type="text" placeholder="Enter custom box type" className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"/>
                    {/* {formErrors?.boxKgType && <div className='text-red-500 mt-1'>{formErrors?.boxKgType}</div>} */}

                    </div>
                  : ''
                }
                <div>
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Count
                  </label>
                  <input value={formValues?.count}
                    onChange={(e)=> {setFormValues(prev=>({...prev, count: e.target.value}))
                    setFormErrors(prev=>({...prev, count: ''}))
                    }} type="text" placeholder="Enter count" className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"/>
                                      {formErrors?.count && <div className='text-red-500 mt-1'>{formErrors?.count}</div>}

                </div>
                <div>
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Box Brand
                  </label>
                  {/* <Autocomplete
                    // id="free-solo-demo"
                    // freeSolo
                    // options={selectedCompany?.stock?.box.map((option) => option.brand)}
                    renderInput={(params) => <TextField {...params} />}
                  /> */}
                      <Autocomplete
                          value={formValues.boxType}
                          onInputChange={(event, newInputValue) => {
                            setFormValues(prev => ({ ...prev, boxType: newInputValue }));
                          }}
                          onChange={(event, newValue) => {
                            if (typeof newValue === 'string') {
                              // setValue({
                              //   title: newValue,
                              // });
                              setFormValues(prev=>({...prev, boxType: newValue}))
                              setSelectedBoxId('')
                              setFormErrors(prev=>({...prev, boxType: ''}))
                            } else if (newValue && newValue.inputValue) {
                              console.log('else if', newValue)
                              // Create a new value from the user input
                              
                              // setValue({
                              //   title: newValue.inputValue,
                              // });
                              setFormValues(prev=>({...prev, boxType: newValue.inputValue}))
                              setSelectedBoxId('')
                              setFormErrors(prev=>({...prev, boxType: ''}))

                            } else {
                              console.log('else', newValue)
                              // setValue(newValue);
                              setFormValues(prev=>({...prev, boxType: newValue?.brand}))
                              setSelectedBoxId(newValue?._id)
                              setFormErrors(prev=>({...prev, boxType: ''}))

                            }
                          }}
                          filterOptions={(options, params) => {
                            const filtered = filter(options, params);

                            const { inputValue } = params;
                            // Suggest the creation of a new value
                            const isExisting = options.some((option) => inputValue === option.brand);
                            if (inputValue !== '' && !isExisting) {
                              filtered.push({
                                inputValue,
                                title: `Add "${inputValue}"`,
                              });
                            }

                            return filtered;
                          }}
                          selectOnFocus
                          clearOnBlur
                          handleHomeEndKeys
                          id="free-solo-with-text-demo"
                          options={filteredBoxBrand}
                          getOptionLabel={(option) => {
                            // Value selected with enter, right from the input
                            if (typeof option === 'string') {
                              return option;
                            }
                            // Add "xxx" option created dynamically
                            if (option.inputValue) {
                              return option.inputValue;
                            }
                            // Regular option
                            return option.brand;
                          }}
                          renderOption={(props, option) => {
                            const { key, ...optionProps } = props;
                            return (
                              <li key={key} {...optionProps}>
                                {option.brand}
                              </li>
                            );
                          }}
                          sx={{ width: '100%' }}
                          freeSolo
                          renderInput={(params) => (
                            <TextField className='w-100' {...params} />
                          )}
                        />
                    {formErrors?.boxType && <div className='text-red-500 mt-1'>{formErrors?.boxType}</div>}

                </div>
                <div>
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Invoice Image
                  </label>
                  <input multiple onChange={(e)=> {setFormValues(prev=>({...prev, invoiceImages: Array.from(e.target.files)}))
                              setFormErrors(prev=>({...prev, invoiceImages: ''}))
                            }} type="file" accept=".jpg, .jpeg, .png" className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent font-normal outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:px-5 file:py-3 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"/>
                    {formErrors?.invoiceImages && <div className='text-red-500 mt-1'>{formErrors?.invoiceImages}</div>}
                          
                </div>
            </div>
          </DialogContent>
          <DialogActions>
          <button
              onClick={handleInward}
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
