import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Autocomplete, Box, Chip, IconButton, MenuItem, Select } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Add, Delete } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import { Formik, useFormik } from 'formik';
import * as Yup from 'yup';
import { getAPIAuth, postAPIAuth, postAPIAuthFormData } from '../../service/apiInstance';
import { toast } from 'sonner';
import { useAuth } from '../../hooks/useAuth';
import AutoComplete from "react-google-autocomplete";
import { GOOGLE_KEY } from '../../constants';
import moment from 'moment';
import { Form, Field, ErrorMessage } from 'formik';
// import * as Yup from 'yup';




export default function AddPlotVisitsModal({openAddModal, setOpenAddModal , getFarmersData , editfarmerdata , setEditFarmerData}) {
  console.log("editfarmerdata" , editfarmerdata);
  
  const [selectedPlace, setSelectedPlace] = React.useState('')
  const [address, setAddress] = React.useState('')
  const [addressError, setAddressError] = React.useState('')
  const [farmerData, setFarmerData] = React.useState([]);
  // console.log('selectedPlace', farmerData)
  const boxKgOptions = [3,5,7,13,13.5,14,16, 'custom']
const {token} = useAuth();
  const handleClose = () => {
    setOpenAddModal(false);
  };

  React.useEffect(() => {
    if (editfarmerdata?.location) {
      setAddress(editfarmerdata.location);
      // Optionally, you can set selectedPlace if lat/lng is available from `editfarmerdata`
    }
  }, [editfarmerdata]);

  React.useEffect(()=> {
    setAddressError('')
  }, [address])




  // console.log('google addddddd', selectedPlace)


  const handlePlaceSelect = React.useCallback((place) => {
    if (place?.geometry) {
      const location = place?.geometry?.location;
      const lat = location.lat();
      const lng = location.lng();

      setSelectedPlace({lat, lng});
      setAddress(place.formatted_address);
      let prem = place?.address_components?.find((m) =>
        m?.types?.includes("premise")
      );
    } else {
      console.error("No geometry available for selected place");
    }
  }, []);
  const isAfter = moment(editfarmerdata?.platingDate).format('YYYY-MM-DD');
  console.log("isAfterisAfterisAfter" , isAfter);


  // Const isAfter = moment(editfarmerdata?.platingDate).format('YYYY-MM-DD');
  
  const initialValues = {
    Area: editfarmerdata?.area || '',
    Variety: editfarmerdata?.variety || '',
    NoOfPlantains: editfarmerdata?.platingNo || '',
    PlantationDate: isAfter || '',
    BoxType: editfarmerdata?.boxType || '',
    Box_custom_Value : "",
    Recovery: editfarmerdata?.recovery || '',
    DesiredWeight: editfarmerdata?.desireWeight || '',
    ExpectedRate: editfarmerdata?.rateExpect || '',
    CuttingCycleNo: editfarmerdata?.cuttingCycleNo || '',
    SellerInfo: editfarmerdata?.sellerInfo || '',
    ExpectedCommission: editfarmerdata?.expectedCommission || '',
    Picture: editfarmerdata?.image || [],
    ratio: editfarmerdata?.area || '', 
  };

  // Validation schema using Yup
  const validationSchema = Yup.object({
    Area: Yup.string().required('Area is required'),
    Variety: Yup.string().required('Variety is required'),
    NoOfPlantains: Yup.number()
      .required('Number of Plantains is required')
      .typeError('Must be a number'),
    PlantationDate: Yup.date().required('Plantation Date is required'),
    // BoxType: Yup.string().required('Box Type is required'),
    Recovery: Yup.string().required('Recovery is required'),
    DesiredWeight: Yup.number()
      .required('Desired Weight is required')
      .typeError('Must be a number'),
    ExpectedRate: Yup.number()
      .required('Expected Rate is required')
      .typeError('Must be a number'),
    CuttingCycleNo: Yup.number()
      .required('Cutting Cycle No is required')
      .typeError('Must be a number'),
    SellerInfo: Yup.string().required('Seller Info is required'),
    ExpectedCommission: Yup.number()
      .required('Expected Commission is required')
      .typeError('Must be a number'),
    // Picture: Yup.mixed().required('Picture is required'),
    ratio: Yup.string().required('Ratio is required'), // Validation for ratio
  });

  // Handle form submission
  const onSubmit = (values, { resetForm }) => {
    console.log('Form data', values);
    getaddFarmers(values, resetForm);
  };

  React.useEffect(() => {
  }, [editfarmerdata]);


  const getFarmerDataList = async ()=> {
    try {
      const res = await getAPIAuth('farmer/getFarmerDetail?block=true');
      if(res?.data?.success) {
        setFarmerData(res?.data?.data?.documents);
      }
    } catch (error) {
      console.log('error', error)
    }
  }

  React.useEffect(() => {
    getFarmerDataList();
  }, []);

const getaddFarmers = async(values , resetForm) => {
  console.log("values" , values);
  try {

    // alert("ssssshi")

    const formData = new FormData();
    // formData.append('name', values.name);
    formData.append('typeName', "plating");
    // formData.append('boxType', "plating");
    formData.append('boxType', values.BoxType == "custom" ? values.Box_custom_Value : values.BoxType); 
    formData.append('area', values.Area);
    formData.append('cuttingCycleNo', values.CuttingCycleNo); 
    formData.append('rateExpect', values.ExpectedRate);
    formData.append('desireWeight', values.DesiredWeight);
    formData.append('sellerInfo', values.SellerInfo); 
    formData.append('expectedCommission', values.ExpectedCommission);
    formData.append('recovery', values.Recovery);
    formData.append('platingNo', values.NoOfPlantains);
    values?.Picture?.forEach((file) => {
      formData.append('image', file);
    });
    if(Object.keys(editfarmerdata)?.length > 0){
      formData.append('id', editfarmerdata?._id);
    }
    formData.append('variety', values.Variety);
    formData.append('platingDate', values.PlantationDate);

    // variety

 console.log('param', formData)
 
if(Object.keys(editfarmerdata)?.length > 0){
  const res = await postAPIAuthFormData("bussinessIntelligence/editPlot" , formData , token);
  // console.log("ressssssssssssssssssssssss" , res);
  if(res.status == 200){
    toast.success(res.data.message);
    resetForm();
    getFarmersData();
    setOpenAddModal(false);
  }
}
else{
  const res = await postAPIAuthFormData("bussinessIntelligence/addPlot" , formData , token);
  console.log("ressssssssssssssssssssssss" , res);
  if(res.status == 200){
    toast.success(res.data.message);
    resetForm();
    getFarmersData();
    setOpenAddModal(false);

  }
}
  } catch (error) {
    console.log("errror" , error);
    toast.error(error.response.data.message);
    
  }

}


const handleImageChange = (event, setFieldValue) => {
  const files = Array.from(event.target.files); // Convert FileList to Array
  console.log("Selected files: ", files);
  setFieldValue('Picture', files); // Set the selected files in Formik
};


  return (
    <React.Fragment>
      <Dialog
        open={openAddModal}
        onClose={handleClose}
        fullWidth={true}
        maxWidth={'md'}

      >
        <DialogTitle>{Object.keys(editfarmerdata)?.length > 0 ? "Update Plots" : "Add Plots"}</DialogTitle>
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
        <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ setFieldValue, handleChange, handleBlur, values, touched, errors }) => (
        <Form>
          {/** Area Field */}
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
        {/* <div>
            <label className="mb-3 block text-sm font-medium text-black dark:text-white">Box Type</label>
            <input
              type="text"
              name="BoxType"
              placeholder="Box Type"
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary"
              value={values.BoxType}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.BoxType && errors.BoxType ? (
              <div className="text-red-500 text-sm">{errors.BoxType}</div>
            ) : null}
          </div> */}
          
<div>
<label className="mb-3 block text-sm font-medium text-black dark:text-white">
  Select Box
  </label>
              <Select
                value={values.BoxType}
                onChange={handleChange}
                onBlur={handleBlur}
                displayEmpty
                name="BoxType"
                sx={{ width: '100%', height: '49.6px' }}
              >
                <MenuItem value="" disabled>Select Box</MenuItem>
                {boxKgOptions.map((option, i) => (
                  <MenuItem key={i} value={option}>{option}</MenuItem>
                ))}
              </Select>
             
            </div>

    {
      values.BoxType == "custom" &&             <div>
      <label className="mb-3 block text-sm font-medium text-black dark:text-white">
        Box custom Value
      </label>
      <input
        type="text"
        name="Box_custom_Value"
        placeholder="Box custom Value"
        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
        value={values.Box_custom_Value}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      {touched.Box_custom_Value && errors.Box_custom_Value ? (
        <div className="text-red-500 text-sm">{errors.Box_custom_Value}</div>
      ) : null}
    </div>
    }
        <div>
            <label className="mb-3 block text-sm font-medium text-black dark:text-white">Area</label>
            <input
              type="text"
              name="Area"
              placeholder="Area"
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary"
              value={values.Area}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.Area && errors.Area ? (
              <div className="text-red-500 text-sm">{errors.Area}</div>
            ) : null}
          </div>

          {/** Variety Field */}
          <div>
            <label className="mb-3 block text-sm font-medium text-black dark:text-white">Variety</label>
            <input
              type="text"
              name="Variety"
              placeholder="Variety"
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary"
              value={values.Variety}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.Variety && errors.Variety ? (
              <div className="text-red-500 text-sm">{errors.Variety}</div>
            ) : null}
          </div>

          {/** No of Plantains Field */}
          <div>
            <label className="mb-3 block text-sm font-medium text-black dark:text-white">No of Plantains</label>
            <input
              type="text"
              name="NoOfPlantains"
              placeholder="No of Plantains"
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary"
              value={values.NoOfPlantains}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.NoOfPlantains && errors.NoOfPlantains ? (
              <div className="text-red-500 text-sm">{errors.NoOfPlantains}</div>
            ) : null}
          </div>

          {/** Plantation Date Field */}
          <div>
            <label className="mb-3 block text-sm font-medium text-black dark:text-white">Plantation Date</label>
            <input
              type="date"
              name="PlantationDate"
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary"
              value={values.PlantationDate}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.PlantationDate && errors.PlantationDate ? (
              <div className="text-red-500 text-sm">{errors.PlantationDate}</div>
            ) : null}
          </div>

          {/** Box Type Field */}
         

          {/** Recovery Field */}
          <div>
            <label className="mb-3 block text-sm font-medium text-black dark:text-white">Recovery</label>
            <input
              type="text"
              name="Recovery"
              placeholder="Recovery"
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary"
              value={values.Recovery}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.Recovery && errors.Recovery ? (
              <div className="text-red-500 text-sm">{errors.Recovery}</div>
            ) : null}
          </div>

          {/** Desired Weight Field */}
          <div>
            <label className="mb-3 block text-sm font-medium text-black dark:text-white">Desired Weight</label>
            <input
              type="text"
              name="DesiredWeight"
              placeholder="Desired Weight"
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary"
              value={values.DesiredWeight}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.DesiredWeight && errors.DesiredWeight ? (
              <div className="text-red-500 text-sm">{errors.DesiredWeight}</div>
            ) : null}
          </div>

          {/** Expected Rate Field */}
          <div>
            <label className="mb-3 block text-sm font-medium text-black dark:text-white">Expected Rate</label>
            <input
              type="text"
              name="ExpectedRate"
              placeholder="Expected Rate"
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary"
              value={values.ExpectedRate}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.ExpectedRate && errors.ExpectedRate ? (
              <div className="text-red-500 text-sm">{errors.ExpectedRate}</div>
            ) : null}
          </div>

          {/** Cutting Cycle No Field */}
          <div>
            <label className="mb-3 block text-sm font-medium text-black dark:text-white">Cutting Cycle No</label>
            <input
              type="text"
              name="CuttingCycleNo"
              placeholder="Cutting Cycle No"
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary"
              value={values.CuttingCycleNo}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.CuttingCycleNo && errors.CuttingCycleNo ? (
              <div className="text-red-500 text-sm">{errors.CuttingCycleNo}</div>
            ) : null}
          </div>

          {/** Seller Info Field */}
          <div>
            <label className="mb-3 block text-sm font-medium text-black dark:text-white">Seller Info</label>
            <input
              type="text"
              name="SellerInfo"
              placeholder="Seller Info"
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary"
              value={values.SellerInfo}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.SellerInfo && errors.SellerInfo ? (
              <div className="text-red-500 text-sm">{errors.SellerInfo}</div>
            ) : null}
          </div>

          {/** Expected Commission Field */}
          <div>
            <label className="mb-3 block text-sm font-medium text-black dark:text-white">Expected Commission</label>
            <input
              type="text"
              name="ExpectedCommission"
              placeholder="Expected Commission"
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary"
              value={values.ExpectedCommission}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.ExpectedCommission && errors.ExpectedCommission ? (
              <div className="text-red-500 text-sm">{errors.ExpectedCommission}</div>
            ) : null}
          </div>

          {/** Picture Field */}
          {/* <div>
            <label className="mb-3 block text-sm font-medium text-black dark:text-white">Picture</label>
            <input
              type="file"
              name="Picture"
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary"
              onChange={(event) => {
                setFieldValue('Picture', event.currentTarget.files[0]);
              }}
              onBlur={handleBlur}
            />
            {touched.Picture && errors.Picture ? (
              <div className="text-red-500 text-sm">{errors.Picture}</div>
            ) : null}
          </div> */}
      <div>
        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
          Add Image
        </label>
        <input
          multiple
          type="file"
          accept=".jpg, .jpeg, .png"
          name="Picture" // Name should match Formik field
          onChange={(event) => handleImageChange(event, setFieldValue)} // Pass setFieldValue to handleImageChange
          className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent font-normal outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:px-5 file:py-3 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
        />
      </div>

          {/** Ratio Field */}
          <div>
            <label className="mb-3 block text-sm font-medium text-black dark:text-white">Ratio</label>
            <input
              type="text"
              name="ratio"
              placeholder="Ratio"
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary"
              value={values.ratio}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.ratio && errors.ratio ? (
              <div className="text-red-500 text-sm">{errors.ratio}</div>
            ) : null}
          </div>

          {/** Submit Button */}
         
        </div>
        <button
            type="submit"
            className="mt-5 w-full rounded-lg bg-primary py-3 text-white transition hover:bg-opacity-90"
          >
            Submit
          </button>
        </Form>
      )}
    </Formik>
        </DialogContent>
        <DialogActions sx={{paddingInline: '20px'}}>
         
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
