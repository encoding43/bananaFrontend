import React, { useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useFormik } from 'formik';
import * as Yup from 'yup';
// import { useAuth } from '../../hooks/useAuth.jsx';
import { useAuth } from '../../../hooks/useAuth.jsx';
// import { postAPIAuth } from '../../service/apiInstance.ts';
import { toast, Toaster } from 'sonner';
import { postAPIAuth } from '../../../service/apiInstance.ts';

export default function LabourBillDetails({ openAddModal, setOpenAddModal, updateData , commissionData }) {
    console.log("commissionDatacommissionData" , commissionData);
    
   
  const { token } = useAuth();

  const handleClose = () => {
      setOpenAddModal(false);
  };

  const validationSchema = Yup.object({
      payment: Yup.number().required('commission Rate is required').positive('Payment must be a positive number'),
      // date: Yup.date().required('Date is required').nullable(),
  });

  const getExeptionFarmers = async (values, resetForm) => {
      console.log("valuesvalues" , values);
      
      const payload = {
        comission: values.payment,
        laborId : commissionData?._id
        };
        try {
          const res = await postAPIAuth(
            `supplier/labor/changeLaborComission`,
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
          payment: '' || commissionData?.commissionPer,
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
              Edit Commission Rate
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
                          label="Commission"
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
