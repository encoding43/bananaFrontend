import React, { useEffect, useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../hooks/useAuth.jsx';
import { getAPIAuth, postAPIAuth } from '../../service/apiInstance.ts';
import { toast, Toaster } from 'sonner';

export default function FarmerBillAddPaymentModal({ openAddModal, setOpenAddModal, selectedData, fetchData }) {
  console.log("selectedDataselectedData" , selectedData);
  
    const [AddPaymentData, setAddPaymentData] = useState({
      farmerId : '',
      recivedAmount : '',
      totalamountpayable: '',
      date : ''
    })    
    const { token } = useAuth();

    const handleClose = () => {
        setOpenAddModal(false);
    };

    const getFarmerDetail = async ()=> {
      try {
        const res = await getAPIAuth( `farmer/bill/totalamountpayable/${selectedData?.farmerId}`, token)
        if(res?.data?.success) {
          setAddPaymentData(prev=> ({
            ...prev,
            totalamountpayable: res?.data?.data?.totalamountpayable
          }))
        }
      } catch (error) {
        
      }
    }

    useEffect(()=> {
      if(selectedData?.farmerId) {
        getFarmerDetail()
      }
    }, [selectedData?.farmerId])

    useEffect(()=> {
      setAddPaymentData(prev=> ({
        ...prev,
        farmerId : selectedData?.farmerId,
        // totalamountpayable: selectedData?.totalamountpayable
      }))
    }, [selectedData])

    const validationSchema = Yup.object({
      recivedAmount: Yup.number().required('Payment is required').positive('Payment must be a positive number'),
        date: Yup.date().required('Date is required').nullable(),
    });

    const getExeptionFarmers = async (values, resetForm) => {
        console.log("valuesvalues" , values);
        
        const payload = {
          farmerId : AddPaymentData?.farmerId,
          recivedAmount : Number(values?.recivedAmount),
          totalamountpayable: Number(AddPaymentData?.totalamountpayable),
          date : values?.date
          };
          try {
            const res = await postAPIAuth(
              `farmer/addFarmerBillPayment`,
              payload,
              token,
            );
            console.log(res, 'fjfjfjfjfjfjfj');
      
            if (res?.status === 200) {
              toast.success('Amount Added Successfully');
              fetchData();
              resetForm();
              setOpenAddModal(false);
            } else {
              // console.log('ressssssssssssssssssssssssssssssssss', res)
            }
          } catch (error) {
            toast.error(error?.response?.data?.message)
            console.log(error);
          }
    };

    const formik = useFormik({
        initialValues: {
            recivedAmount: '',
            date:  '',
        },
        validationSchema: validationSchema,
        onSubmit: (values, { resetForm }) => {
            getExeptionFarmers(values, resetForm);
        },
        enableReinitialize: true,
    });

    return (
        <Dialog open={openAddModal} onClose={handleClose} fullWidth={true} maxWidth={'sm'}>
            <DialogTitle>
                Add Payment
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
            <form onSubmit={formik.handleSubmit}>
                <DialogContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className='font-semibold '>Farmer Name : {selectedData?.farmerName}</div>
                    <div className='font-semibold'>Farmer Mobile No : {selectedData?.farmerMobileNumber}</div>
                    <div className='font-semibold'>Total Payable Amount : {Number(AddPaymentData?.totalamountpayable)}</div>
                  </div>
                    <Box className="flex gap-3">
                        <TextField
                            label="Payment"
                            variant="outlined"
                            size="small"
                            margin="normal"
                            fullWidth
                            name="recivedAmount"
                            value={formik.values.recivedAmount}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.recivedAmount && Boolean(formik.errors.recivedAmount)}
                            helperText={formik.touched.recivedAmount && formik.errors.recivedAmount}
                        />
                        <TextField
                            label="Date"
                            variant="outlined"
                            size="small"
                            margin="normal"
                            fullWidth
                            type="date"
                            name="date"
                            value={formik.values.date}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            InputLabelProps={{ shrink: true }}
                            error={formik.touched.date && Boolean(formik.errors.date)}
                            helperText={formik.touched.date && formik.errors.date}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <button
                        type="submit"
                        className="flex w-full mx-auto max-w-[250px] justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                    >
                        Save
                    </button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
