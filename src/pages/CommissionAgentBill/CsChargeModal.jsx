import React, { useEffect, useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../hooks/useAuth.jsx';
import { postAPIAuth } from '../../service/apiInstance.ts';
import { toast, Toaster } from 'sonner';

export default function CsChargeModal({ showChargeModal, setShowChargeModal, selectedHarvesting, fetchData }) {

    const { token } = useAuth();

    const handleClose = () => {
        setShowChargeModal(false);
    };

    const [row, setRows] = useState([])

    console.log('rowrowrow', row)
    // const [hasError, setHasError] = useState(true)
    useEffect(()=> {
        const data = [];
        for(let i = 0; i< selectedHarvesting?.box?.length; i++) {
            data.push({
                boxKgType : selectedHarvesting?.box?.[i]?.boxKgType, 
                brand : selectedHarvesting?.box?.[i]?.brand, 
                rateOfBox :  selectedHarvesting?.box?.[i]?.rateOfBox ? selectedHarvesting?.box?.[i]?.rateOfBox : '', 
                chargeContainer : selectedHarvesting?.box?.[i]?.chargeContainer ? selectedHarvesting?.box?.[i]?.chargeContainer : '', 
                boxContainer : selectedHarvesting?.box?.[i]?.boxContainer ? selectedHarvesting?.box?.[i]?.boxContainer : ''
            })
        }
        setRows(data)
    }, [selectedHarvesting])

    const handleChange = (index, field, value)=> {
        const newRow = row?.length && row?.map((row, i)=> i === index ? {...row , [field] : value } : row)
        setRows(newRow)
    }

    const handleSubmit = async (e)=> {
        e.preventDefault();
        let hasError = false
        const data = row?.length && row?.map((item, index)=> {
            Object.entries(item)?.map(([key, value])=> {
                if(key === 'brand') {
                    if(!value) {
                        toast.error(`All fields are required`)
                        hasError = true
                        return
                    }
                } else {
                    if(value < 1) {
                        toast.error(`All fields are required`)
                        hasError = true
                    } 
                }
            })
        })
        if(hasError) return
        try {
            const payload = {
                id : selectedHarvesting?._id,
                box : row
            }
            const res = await postAPIAuth(`/supplier/company/chargeContainer`, payload, token)
            console.log('ressssssssssssssssssssss', res)
            if(res?.data?.success) {
                toast.success('Data updated successfully')
                handleClose()
            }
        } catch (error) {
            
        }
    }


    return (
        <Dialog open={showChargeModal} onClose={handleClose} fullWidth={true} maxWidth={'md'}>
            <DialogTitle>
                CS Charge Container
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
            </DialogTitle>
            <form>
                <DialogContent>
                    <div className="grid col-span-1 gap-4">
                        {
                            row?.length ? 
                                row?.map((item, index)=> {
                                    return (
                                        <>
                                            <div className="grid grid-cols-5 gap-3">
                                                <div className="col-span-1">
                                                    <label className='mb-3 block text-sm font-medium text-black dark:text-white' htmlFor="boxKgType">Box Kg Type</label>
                                                    <input readOnly value={item?.boxKgType} type="text" className='rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary w-full' />
                                                </div>
                                                <div className="col-span-1">
                                                    <label className='mb-3 block text-sm font-medium text-black dark:text-white' htmlFor="boxKgType">Box Brand</label>
                                                    <input readOnly value={item?.brand} type="text" className='rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary w-full' />
                                                </div>
                                                <div className="col-span-1">
                                                    <label className='mb-3 block text-sm font-medium text-black dark:text-white' htmlFor="boxKgType">Rate Of Box</label>
                                                    <input onChange={(e)=> handleChange(index, 'rateOfBox', e.target.value)} value={item?.rateOfBox} type="text" className='rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary w-full' />
                                                </div>
                                                <div className="col-span-1">
                                                    <label className='mb-3 block text-sm font-medium text-black dark:text-white' htmlFor="boxKgType">Box/Container</label>
                                                    <input onChange={(e)=> handleChange(index, 'boxContainer', e.target.value)} value={item?.boxContainer} type="text" className='rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary w-full' />
                                                </div>
                                                <div className="col-span-1">
                                                    <label className='mb-3 block text-sm font-medium text-black dark:text-white' htmlFor="boxKgType">Charge/Container</label>
                                                    <input onChange={(e)=> handleChange(index, 'chargeContainer', e.target.value)} value={item?.chargeContainer} type="text" className='rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary w-full' />
                                                </div>
                                            </div>
                                        </>
                                    )
                                })
                            : ''
                        }
                    </div>
                </DialogContent>
                <DialogActions>
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        className="flex w-full mx-auto max-w-[250px] justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                    >
                        Save
                    </button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
