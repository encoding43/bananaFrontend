import * as React from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Autocomplete, IconButton, MenuItem, Select } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Add, Delete, Close as CloseIcon } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import AutoComplete from 'react-google-autocomplete';
import { getAPIAuth, postAPIAuth } from '../../service/apiInstance';
import { toast } from 'sonner';
import moment from 'moment';


export default function AddScheduleFarmerModal({ openAddModal, setOpenAddModal, schedulefarmerdata , updateData }) {
  console.log("schedulefarmerdataschedulefarmerdata" , schedulefarmerdata);
  
  // const [selectedPlace, setSelectedPlace] = React.useState('');
  // const [address, setAddress] = React.useState('');
  // const [addressError, setAddressError] = React.useState('');
  const [labourList, setLabourList] = React.useState([]);
  const [companyList, setCompanyList] = React.useState([]);
  const [farmerData, setFarmerData] = React.useState([]);
  const [coldStorageList, setColdStorageList] = React.useState([]);

  console.log("selectedPlace", { labourList, companyList, farmerData, coldStorageList  });

  const handleClose = () => {
    setOpenAddModal(false);
  };

  const getLabourList = async () => {
    try {
      const res = await getAPIAuth('supplier/labor/get');
      if (res?.data?.success) {
        setLabourList(res?.data?.data?.documents);
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  const getCompanyList = async () => {
    try {
      const res = await getAPIAuth('supplier/company/get');
      if (res?.data?.success) {
        setCompanyList(res?.data?.data?.documents);
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  const getFarmerDataList = async () => {
    try {
      const res = await getAPIAuth('farmer/getFarmerDetail?block=true');
      if (res?.data?.success) {
        setFarmerData(res?.data?.data?.documents);
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  const getColdStorageList = async () => {
    try {
      const res = await getAPIAuth('user/getColdStorage');
      if (res?.data?.success) {
        setColdStorageList(res?.data?.data?.user);
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  React.useEffect(() => {
    getLabourList();
    getCompanyList();
    getColdStorageList();
    getFarmerDataList();
  }, []);

  const validationSchema = Yup.object({
    date: Yup.string().required('Date is required'),
    farmerName: Yup.string().required('Farmer Name is required'),
    vehicleNumber: Yup.string().required('Vehicle No. is required'),
    laborName: Yup.string().required('Labor Name is required'),
    companyId: Yup.string().required('Company Name is required'),
    rate: Yup.string().required('Rate is required'),
    coldStoreId: Yup.string().required('Cold Storage is required'),
  });

  const getSubmitData = async(values , resetForm) => {

    // console.log("values , resetFormvalues , resetForm" ,values);
    // alert("hii")
    try {

      const param = {
        date : values?.date,
        vehicleNo : values?.vehicleNumber,
        laborId : values?.laborId,
        // schedule : "true",
        companyId : values?.companyId,
        rate : `${values?.rate}`,
        coldStoreId :values?.coldStoreId,
        ...(Object.keys(schedulefarmerdata)?.length > 0 ? {} : { schedule: "true", farmerId: values?.farmerId }),
        ...(Object.keys(schedulefarmerdata)?.length > 0 ?{ id : schedulefarmerdata._id }: {})
        
      }

      // const response = postAPIAuth("farmer/addHarvestingDetail" , param , token)
      let res;
      if (Object.keys(schedulefarmerdata)?.length > 0) {
        // Call the update API
        res = await postAPIAuth(`farmer/editHarvestingDetail`, param);
        // const res = await postAPIAuthFormData(`farmer/editHarvestingDetail`, formData);
      } else {
        // Call the add API
        res = await postAPIAuth('farmer/addHarvestingDetail', param);
      }      

      if (res?.data?.status == 200 ) {
      console.log("resssssssss" , res);
// alert("hii")
        toast.success(`Schedule Farmer ${schedulefarmerdata ? 'updated' : 'added'} successfully.`);
        handleClose();
        updateData(); 
        resetForm();
        navigate("/farmerSchedules")
      }
      else{
        
        
          toast.error(res?.data?.message);
      }
      
    } catch (error) {
      console.log(error)
    }
    

  }
  const framerFilterOutData = (name) => {
    const data =  farmerData?.filter((item) => item.name == name );
    // console.log("qqqqqqqqqqqqqqqqdatadata" , data);
    
    return data?.[0]?._id
   }
  const formik = useFormik({
    initialValues: {
      date: '' || moment(schedulefarmerdata?.date).format("YYYY-MM-DD"),
      farmerName: '' || schedulefarmerdata?.farmerName,
      vehicleNumber: '' || schedulefarmerdata?.vehicleNo,
      laborName: '' || schedulefarmerdata?.labors?.[0]?.name,
      laborId: '' || schedulefarmerdata?.labors?.[0]?._id,
      companyId: '' || schedulefarmerdata?.company?._id,
      rate: '' || schedulefarmerdata?.rate,
      coldStoreId: '' || schedulefarmerdata?.coldStore?._id,
      farmerId : "" || framerFilterOutData(schedulefarmerdata?.farmerName)
    },
    validationSchema,
    onSubmit: ((values , { resetForm }) => {
      getSubmitData(values , resetForm)
    }),
    enableReinitialize : true
  });

  const handleLabourChange = (event, value) => {
    formik.setFieldValue('laborName', value ? value.name : '');
    formik.setFieldValue('laborId', value ? value._id : '');
  };

  const handleFarmerChange = (event, value) => {
    formik.setFieldValue('farmerName', value ? value.name : '');
    formik.setFieldValue('farmerId', value ? value._id : '');
  };

  console.log("valeeeeeee" , formik.values);
  

  return (
    <React.Fragment>
      <Dialog open={openAddModal} onClose={handleClose} fullWidth={true} maxWidth={'md'}>
        {/* <DialogTitle>Add Schedule Farmer</DialogTitle> */}
        <DialogTitle>{Object.keys(schedulefarmerdata)?.length > 0 ? "Update Schedule Farmer" : "Add Schedule Farmer"}</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
        >
          <CloseIcon />
        </IconButton>

        <DialogContent>
        <form onSubmit={formik.handleSubmit}>
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div>
      <label className="mb-3 block text-sm font-medium text-black dark:text-white">Date</label>
      <input
        type="date"
        name="date"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.date}
        placeholder="Default Input"
        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
      />
      {formik.touched.date && formik.errors.date ? (
        <div className="text-red-500 text-sm mt-1">{formik.errors.date}</div>
      ) : null}
    </div>

    <div>
      <Autocomplete
        options={farmerData}
        getOptionLabel={(option) => `${option.name} (${option?.mobileNo})`}
        value={farmerData.find((option) => option._id === formik.values.farmerId) || null}
        onChange={handleFarmerChange}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Select Farmer"
            variant="outlined"
            label="Select Farmer"
            disabled={Object.keys(schedulefarmerdata)?.length > 0 ? true : false}
            className="mb-3 block text-sm font-medium text-black dark:text-white"
            InputLabelProps={{
              shrink: true,
              style: {
                transform: "translate(0px, 0px) scale(1)",
                position: "relative",
                marginBottom: "0.75rem",
                fontSize: "0.875rem",
                lineHeight: "1.25rem",
                fontWeight: "500",
                color: "#1c2434",
                fontFamily: "Satoshi, sans-serif",
              },
            }}
          />
        )}
        isOptionEqualToValue={(option, value) => option._id === value._id}
        sx={{ width: '100%' }}
      />
      {formik.touched.farmerName && formik.errors.farmerName ? (
        <div className="text-red-500 text-sm mt-1">{formik.errors.farmerName}</div>
      ) : null}
    </div>

    <div>
      <label className="mb-3 block text-sm font-medium text-black dark:text-white">Vehicle No.</label>
      <input
        type="text"
        name="vehicleNumber"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.vehicleNumber}
        placeholder="Default Input"
        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
      />
      {formik.touched.vehicleNumber && formik.errors.vehicleNumber ? (
        <div className="text-red-500 text-sm mt-1">{formik.errors.vehicleNumber}</div>
      ) : null}
    </div>

    <div>
      <Autocomplete
        options={labourList}
        getOptionLabel={(option) => option.name}
        value={labourList.find((option) => option._id === formik.values.laborId) || null}
        onChange={handleLabourChange}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Select Labor"
            variant="outlined"
            label="Select Labor"
            className="mb-3 block text-sm font-medium text-black dark:text-white"
            InputLabelProps={{
              shrink: true,
              style: {
                transform: "translate(0px, 0px) scale(1)",
                position: "relative",
                marginBottom: "0.75rem",
                fontSize: "0.875rem",
                lineHeight: "1.25rem",
                fontWeight: "500",
                color: "#1c2434",
                fontFamily: "Satoshi, sans-serif",
              },
            }}
          />
        )}
        isOptionEqualToValue={(option, value) => option._id === value._id}
        sx={{ width: '100%' }}
      />
      {formik.touched.laborName && formik.errors.laborName ? (
        <div className="text-red-500 text-sm mt-1">{formik.errors.laborName}</div>
      ) : null}
    </div>

    <div>
      <Autocomplete
        options={companyList}
        getOptionLabel={(option) => option.companyAliasName}
        value={companyList.find((option) => option._id === formik.values.companyId) || null}
        onChange={(event, value) => formik.setFieldValue('companyId', value ? value._id : '')}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Select Company"
            variant="outlined"
            label="Select Company"
            className="mb-3 block text-sm font-medium text-black dark:text-white"
            InputLabelProps={{
              shrink: true,
              style: {
                transform: "translate(0px, 0px) scale(1)",
                position: "relative",
                marginBottom: "0.75rem",
                fontSize: "0.875rem",
                lineHeight: "1.25rem",
                fontWeight: "500",
                color: "#1c2434",
                fontFamily: "Satoshi, sans-serif",
              },
            }}
          />
        )}
        isOptionEqualToValue={(option, value) => option._id === value._id}
        sx={{ width: '100%' }}
      />
      {formik.touched.companyId && formik.errors.companyId ? (
        <div className="text-red-500 text-sm mt-1">{formik.errors.companyId}</div>
      ) : null}
    </div>

    <div>
      <label className="mb-3 block text-sm font-medium text-black dark:text-white">Rate</label>
      <input
        type="text"
        name="rate"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.rate}
        placeholder="Default Input"
        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
      />
      {formik.touched.rate && formik.errors.rate ? (
        <div className="text-red-500 text-sm mt-1">{formik.errors.rate}</div>
      ) : null}
    </div>

    <div>
      <Autocomplete
        options={coldStorageList}
        getOptionLabel={(option) => option.csName}
        value={coldStorageList.find((option) => option._id === formik.values.coldStoreId) || null}
        onChange={(event, value) => formik.setFieldValue('coldStoreId', value ? value._id : '')}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Select Cold Storage"
            variant="outlined"
            label="Select Cold Storage"
            className="mb-3 block text-sm font-medium text-black dark:text-white"
            InputLabelProps={{
              shrink: true,
              style: {
                transform: "translate(0px, 0px) scale(1)",
                position: "relative",
                marginBottom: "0.75rem",
                fontSize: "0.875rem",
                lineHeight: "1.25rem",
                fontWeight: "500",
                color: "#1c2434",
                fontFamily: "Satoshi, sans-serif",
              },
            }}
          />
        )}
        isOptionEqualToValue={(option, value) => option._id === value._id}
        sx={{ width: '100%' }}
      />
      {formik.touched.coldStoreId && formik.errors.coldStoreId ? (
        <div className="text-red-500 text-sm mt-1">{formik.errors.coldStoreId}</div>
      ) : null}
    </div>
  </div>
  <DialogActions sx={{ paddingInline: '20px' }}>
    <button
      type="submit"
      className="flex w-full mx-auto max-w-[350px] justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
    >
      {Object.keys(schedulefarmerdata)?.length > 0 ? "Update Add Schedule Farmer" : "Add Schedule Farmer"}
    </button>
  </DialogActions>
</form>

        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
