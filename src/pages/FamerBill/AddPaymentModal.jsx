import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TableContainer,
  TextField,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../hooks/useAuth.jsx';
import { getAPIAuth, postAPIAuth } from '../../service/apiInstance.ts';
import { toast, Toaster } from 'sonner';

export default function FarmerBillAddPaymentModal({
  openAddModal,
  setOpenAddModal,
  selectedData,
  fetchData,
}) {
  console.log('selectedDataselectedData', selectedData);

  const [AddPaymentData, setAddPaymentData] = useState({
    farmerId: '',
    recivedAmount: '',
    totalamountpayable: '',
    date: '',
  });
  const { token } = useAuth();

  const handleClose = () => {
    setOpenAddModal(false);
  };

  const getFarmerDetail = async () => {
    try {
      const res = await getAPIAuth(
        `farmer/bill/totalamountpayable/${selectedData?.farmerId}`,
        token,
      );
      console.log('Payment Deteials', res);
      if (res?.data?.success) {
        setAddPaymentData((prev) => ({
          ...prev,
          totalamountpayable: res?.data?.data?.totalamountpayable,
          details: res?.data?.data?.details,
        }));
      }
    } catch (error) {}
  };

  useEffect(() => {
    if (selectedData?.farmerId) {
      getFarmerDetail();
    }
  }, [selectedData?.farmerId]);

  useEffect(() => {
    setAddPaymentData((prev) => ({
      ...prev,
      farmerId: selectedData?.farmerId,
      // totalamountpayable: selectedData?.totalamountpayable
    }));
  }, [selectedData]);

  const validationSchema = Yup.object({
    recivedAmount: Yup.number()
      .required('Payment is required')
      .positive('Payment must be a positive number'),
    date: Yup.date().required('Date is required').nullable(),
  });

  const getExeptionFarmers = async (values, resetForm) => {
    console.log('valuesvalues', values);

    const payload = {
      farmerId: AddPaymentData?.farmerId,
      recivedAmount: Number(values?.recivedAmount),
      totalamountpayable: Number(AddPaymentData?.totalamountpayable),
      date: values?.date,
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
      toast.error(error?.response?.data?.message);
      console.log(error);
    }
  };

  const formik = useFormik({
    initialValues: {
      recivedAmount: '',
      date: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values, { resetForm }) => {
      getExeptionFarmers(values, resetForm);
    },
    enableReinitialize: true,
  });

  return (
    <Dialog
      open={openAddModal}
      onClose={handleClose}
      fullWidth={true}
      maxWidth={'sm'}
    >
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
            <div className="font-semibold">
              Farmer Name: {selectedData?.farmerName}
            </div>
            <div className="font-semibold">
              Farmer Mobile No: {selectedData?.farmerMobileNo}
            </div>
          </div>
          <div className="mb-4">
            <TableContainer>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Sr No
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {AddPaymentData?.details?.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(item?.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {Number(item?.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableContainer>
          </div>
          <div className="font-semibold mb-4">
            Total Payable Amount: {Number(AddPaymentData?.totalamountpayable)}
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
              error={
                formik.touched.recivedAmount &&
                Boolean(formik.errors.recivedAmount)
              }
              helperText={
                formik.touched.recivedAmount && formik.errors.recivedAmount
              }
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
