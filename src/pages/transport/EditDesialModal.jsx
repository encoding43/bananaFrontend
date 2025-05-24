import React, { useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../hooks/useAuth.jsx';
import { postAPIAuth } from '../../service/apiInstance.ts';
import { toast, Toaster } from 'sonner';



export default function EditDesielModal({ openAddModal, setOpenAddModal, updateData }) {
    // console.log("AddPaymentData" , AddPaymentData);
    
    const { token } = useAuth();

    const handleClose = () => {
        setOpenAddModal(false);
    };

    const validationSchema = Yup.object({
        payment: Yup.number().required('Diesel Rate is required').positive('Payment must be a positive number'),
        // date: Yup.date().required('Date is required').nullable(),
    });

    const getExeptionFarmers = async (values, resetForm) => {
        console.log("valuesvalues" , values);
        
        const payload = {
            dieselRate: values.payment,
          };
          try {
            const res = await postAPIAuth(
              `farmer/createGlobalMaterial`,
              payload,
              token,
            );
            // console.log(res, 'fjfjfjfjfjfjfj');
      
            if (res?.status === 200) {
              toast.success('Amount Added Successfully');
              updateData();
              resetForm();
              setOpenAddModal(false);
            }
          } catch (error) {
            console.log(error);
          }
    };

    const formik = useFormik({
        initialValues: {
            payment: '',
        },
        validationSchema: validationSchema,
        onSubmit: (values, { resetForm }) => {
            getExeptionFarmers(values, resetForm);
        },
        enableReinitialize: true,
    });

    return (
        <Dialog open={openAddModal} onClose={handleClose} fullWidth={true} maxWidth={'xs'}>
            <DialogTitle>
                Edit Diesel Rate
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
                            label="Diesel Rate"
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
