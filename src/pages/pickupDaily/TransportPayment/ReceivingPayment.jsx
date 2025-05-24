import React, { useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../../hooks/useAuth.jsx';
import { getAPIAuth, postAPIAuth } from '../../../service/apiInstance.ts';
import { toast, Toaster } from 'sonner';
import moment from 'moment';

export default function AddReceivingPaymentModal({ openAddModal, setOpenAddModal, AddPaymentData, fetchData }) {
    console.log("AddPaymentData" , AddPaymentData);
    // const dateeee = new Date(AddPaymentData?.scheduleDate).toISOString().split('T')[0]
    // console.log("dateeee" , dateeee);
    
    
    const { token } = useAuth();

    const handleClose = () => {
        setOpenAddModal(false);
    };

    const validationSchema = Yup.object({
        payment: Yup.number().required('Payment is required').positive('Payment must be a positive number'),
        date: Yup.date().required('Date is required').nullable(),
    });

    const handleDeleteCompanySchedule = async () => {
        // alert("hiii")
        try {
          const res = await getAPIAuth(
            `supplier/labor/delScheduleLaborBill?laborId=${AddPaymentData?._id}`,
            token,
          );
          if (res?.status === 200) {
            toast.success('Schedule Deleted Successfully');
            fetchData();
            setOpenAddModal(false);
          }
          console.log(res, 'uuuuuuuuuuuuuuu');
        } catch (error) {
          console.log(error);
        }
      };

    const getExeptionFarmers = async (values, resetForm) => {
        console.log("valuesvalues" , values);
        
      const payload = {
        laborId: AddPaymentData._id,
        recivedAmount: values.payment,
        initialAmount: String(AddPaymentData.amountDue),
        scheduleDate: values.date,
        isSchedule: true,
        type : 'Schedule'
      };
      try {
        const res = await postAPIAuth(
          `supplier/labor/scheduleLaborBill`,
          payload,
          token,
        );
  
        if (res?.status === 200) {
          toast.success('Schedule Added Successfully');
          fetchData();
          resetForm();
          setOpenAddModal(false);
                }
      } catch (error) {
        console.log(error);
      }
    };

    const formik = useFormik({
        initialValues: {
            payment: AddPaymentData?.scheduleAmount || '',
            date: moment(AddPaymentData?.scheduleDate).format('YYYY-MM-DD') || '',
            
            
            // const formattedDate = moment(AddPaymentData?.scheduleDate).subtract(1, 'days').format('YYYY-MM-DD');
            
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
            Receiving Payment
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
                    <Box className="flex gap-3">
                        <TextField
                            label="Payment"
                            variant="outlined"
                            size="small"
                            margin="normal"
                            fullWidth
                            name="payment"
                            value={formik.values.payment}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.payment && Boolean(formik.errors.payment)}
                            helperText={formik.touched.payment && formik.errors.payment}
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
                   <div className='flex w-[100%] gap-3 justify-center'>
                   <button
                        type="submit"
                        className="inline-flex w-full max-w-[190px] m-0 items-center justify-center gap-2 rounded-md  bg-primary px-3 py-2 text-center font-medium text-white hover:bg-opacity-90"
                    >
                        Save
                    </button>

                   {
                    AddPaymentData?.isSchedule ? (
                      <>
                       <button
                   type="button"
                className="inline-flex w-full max-w-[190px] m-0 items-center justify-center gap-2 rounded-md bg-red-600 px-3 py-2 text-center font-medium text-white hover:bg-opacity-90"
                onClick={handleDeleteCompanySchedule}
              >
                Delete Reminder
              </button>
                      </>
                    ) : (
                      <>
                      
                      </>
                    )
                   }
                   </div>
                  
                </DialogActions>
               
            </form>
        </Dialog>
    );
}
