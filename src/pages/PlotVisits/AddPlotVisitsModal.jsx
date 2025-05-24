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
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { getAPIAuth, postAPIAuth, postAPIAuthFormData } from '../../service/apiInstance';
import { toast } from 'sonner';
import { useAuth } from '../../hooks/useAuth';
import AutoComplete from "react-google-autocomplete";
import { GOOGLE_KEY } from '../../constants';
import moment from 'moment';




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

  const getaddFarmers = async(values , resetForm) => {
    console.log("values" , values);
    if(!address?.length) {
      setAddressError('Required')
      return
    }
    try {

      // alert("ssssshi")

      const formData = new FormData();
      // formData.append('name', values.name);
      formData.append('typeName', "plating");
      formData.append('mob', values.mob);
      formData.append('boxKg', values.boxKg == "custom" ? values.Box_custom_Value : values.boxKg); 
      formData.append('note', values.note);
      formData.append('cuttingNo', values.cuttingNo);
      formData.append('platingDate', values.plantingDate); // Ensure spelling is consistent
      formData.append('variety', values.variety);
      formData.append('area', values.area);
      formData.append('NOS', values.nos);
      // formData.append('image', values.images); // Handle file appropriately
      values?.images?.forEach((file) => {
        formData.append('image', file);
      });
      formData.append('geoLocation', JSON.stringify([selectedPlace?.lat, selectedPlace?.lng])); 
      // formData.append('location', values.location);
      formData.append('farmerId', values.farmerId ? values.farmerId : values.farmerID);
      formData.append('rateExpect', values.rateExpect);
      formData.append('weight', values.weight);
      formData.append('ratio', values.ratio);
      formData.append('location', address);
      if(Object.keys(editfarmerdata)?.length > 0){
        formData.append('id', editfarmerdata?._id);
      }
      

   console.log('param', formData)
   
  if(Object.keys(editfarmerdata)?.length > 0){
    const res = await postAPIAuthFormData("bussinessIntelligence/editPlotVisit " , formData , token);
    // console.log("ressssssssssssssssssssssss" , res);
    if(res.status == 200){
      toast.success(res.data.message);
      resetForm();
      getFarmersData();
      setOpenAddModal(false);
    }
  }
  else{
    const res = await postAPIAuthFormData("bussinessIntelligence/addPlotVisit" , formData , token);
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
  
  const formik = useFormik({
    initialValues: {
      mob: editfarmerdata?.mob || '',
      boxKg: editfarmerdata?.boxKg || '',
      note: editfarmerdata?.note || '',
      cuttingNo: editfarmerdata?.cuttingNo || '',
      plantingDate: isAfter || '', // Corrected spelling to "plantingDate"
      variety: editfarmerdata?.variety || '',
      area: editfarmerdata?.area || '',
      nos: editfarmerdata?.NOS || '',
      images:  editfarmerdata?.image  || [],
      farmerId: editfarmerdata?.farmerId || '',
      rateExpect: editfarmerdata?.rateExpect || '',
      weight: editfarmerdata?.weight ||  '',
      ratio: editfarmerdata?.ratio || '',
      Box_custom_Value : ""
    },
    validationSchema: Yup.object({
      // boxKg: Yup.number().required('Box Kg is required'),
      note: Yup.string(),
      cuttingNo: Yup.string().required('Cutting No. is required'),
      plantingDate: Yup.date().required('Planting Date is required'),
      variety: Yup.string().required('Variety is required'),
      area: Yup.number().required('Area is required'),
      nos: Yup.number().required('NOS is required'),
      // images: Yup.array()
      //   .of(Yup.mixed().required('An image is required')) // Ensures each file is required
      //   .min(1, 'At least one image is required'), // Ensures at least one image is uploaded
      mob: Yup.string()
        .required('Mobile is required')
        .matches(/^[0-9]{10}$/, 'Mobile number is not valid'),
    }),
    onSubmit: (values, { resetForm }) => {
      console.log('Form data', values);
      // alert("hii")
      getaddFarmers(values, resetForm);
    },
    enableReinitialize: true,
  });

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

  const handleFarmerChange = (event, value) => {
    formik.setFieldValue('farmerID', value?._id || ''); 
};

const handleImageChange = (event) => {
  const files = Array.from(event.target.files); // Convert FileList to Array
  console.log("filesfilesfiles" , files);
  
  formik.setFieldValue('images', files); // Set the selected files in Formik
};
console.log("formik.values" , formik.values);




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
     <form onSubmit={formik.handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">

 
{/* Box Kg */}
{/* <div>
  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
    Box Kg
  </label>
  <input
    type="text"
    name="boxKg"
    placeholder="Box Kg"
    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
    value={formik.values.boxKg}
    onChange={formik.handleChange}
    onBlur={formik.handleBlur}
  />
  {formik.touched.boxKg && formik.errors.boxKg ? (
    <div className="text-red-500 text-sm">{formik.errors.boxKg}</div>
  ) : null}
</div> */}

<div>
<label className="mb-3 block text-sm font-medium text-black dark:text-white">
  Select Box
  </label>
              <Select
                value={formik.values.boxKg}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                displayEmpty
                name="boxKg"
                sx={{ width: '100%', height: '49.6px' }}
              >
                <MenuItem value="" disabled>Select Box</MenuItem>
                {boxKgOptions.map((option, i) => (
                  <MenuItem key={i} value={option}>{option}</MenuItem>
                ))}
              </Select>
             
            </div>

    {
      formik.values.boxKg == "custom" &&             <div>
      <label className="mb-3 block text-sm font-medium text-black dark:text-white">
        Box custom Value
      </label>
      <input
        type="text"
        name="Box_custom_Value"
        placeholder="Box custom Value"
        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
        value={formik.values.Box_custom_Value}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />
      {formik.touched.Box_custom_Value && formik.errors.Box_custom_Value ? (
        <div className="text-red-500 text-sm">{formik.errors.Box_custom_Value}</div>
      ) : null}
    </div>
    }

<div>
  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
    Ratio
  </label>
  <input
    type="text"
    name="ratio"
    placeholder="Ratio"
    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
    value={formik.values.ratio}
    onChange={formik.handleChange}
    onBlur={formik.handleBlur}
  />
  {formik.touched.ratio && formik.errors.ratio ? (
    <div className="text-red-500 text-sm">{formik.errors.ratio}</div>
  ) : null}
</div>

<div>
  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
    Weight
  </label>
  <input
    type="text"
    name="weight"
    placeholder="Weight"
    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
    value={formik.values.weight}
    onChange={formik.handleChange}
    onBlur={formik.handleBlur}
  />
  {formik.touched.weight && formik.errors.weight ? (
    <div className="text-red-500 text-sm">{formik.errors.weight}</div>
  ) : null}
</div>

<div>
  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
    Rate Expect
  </label>
  <input
    type="text"
    name="rateExpect"
    placeholder="Rate Expect"
    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
    value={formik.values.rateExpect}
    onChange={formik.handleChange}
    onBlur={formik.handleBlur}
  />
  {formik.touched.rateExpect && formik.errors.rateExpect ? (
    <div className="text-red-500 text-sm">{formik.errors.rateExpect}</div>
  ) : null}
</div>
<div>
        <label className="block text-sm font-medium text-black dark:text-white mb-3">
            Select Farmers
        </label>
        <Autocomplete
            value={farmerData?.find((option) => option?._id === formik?.values?.farmerID) || null}
            onChange={handleFarmerChange}
            onBlur={formik.handleBlur}
            name="selectFarmer"
            options={farmerData}
            getOptionLabel={(option) => `${option.name} (${option?.mobileNo})`}
            isOptionEqualToValue={(option, value) => option._id === value._id}
            renderInput={(params) => (
                <TextField
                    {...params}
                    placeholder="Select Farmers"
                    sx={{ width: '100%', height: '49.6px' }}
                />
            )}
            sx={{ width: '100%' }}
        />
    </div>

<div>
  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
    Mobile
  </label>
  <input
    type="text"
    name="mob"
    placeholder="Mobile"
    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
    value={formik.values.mob}
    onChange={formik.handleChange}
    onBlur={formik.handleBlur}
  />
  {formik.touched.mob && formik.errors.mob ? (
    <div className="text-red-500 text-sm">{formik.errors.mob}</div>
  ) : null}
</div>

<div>
  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
    GeoLocation
  </label>
  {/* <AutoComplete
      name="geoLocation"
      placeholder=""
      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
      apiKey={GOOGLE_KEY}
      onPlaceSelected={handlePlaceSelect}
      defaultValue={editfarmerdata?.location ? editfarmerdata?.location : ''}
      options={{
        types: ["geocode", "establishment"],
        componentRestrictions: { country: "in" },
      }}
      onBlur={() => {
        if (!formValues.geoLocation && editfarmerdata?.location) {
          setFormValues((prev) => ({
            ...prev,
            geoLocation: editfarmerdata.location,
          }));
        }
      }}
      onClick={(e) => {
        e.stopPropagation();
      }}
    /> */}
    <AutoComplete
  name="geoLocation"
  placeholder=""
  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
  apiKey={GOOGLE_KEY}
  onPlaceSelected={handlePlaceSelect}
  defaultValue={editfarmerdata?.location ? editfarmerdata?.location : ''}
  options={{
    types: ["geocode", "establishment"],
    componentRestrictions: { country: "in" },
  }}
  onBlur={() => {
    if (!address && editfarmerdata?.location) {
      setAddress(editfarmerdata.location);
    }
  }}
  onClick={(e) => {
    e.stopPropagation();
  }}
/>
  {addressError ? (
    <div className="text-red-500 text-sm">{addressError}</div>
  ) : null}
</div>

<div>
        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
          Add Image
        </label>
        <input
          multiple
          type="file"
          accept=".jpg, .jpeg, .png"
          name="images" // Name for Formik
          onChange={handleImageChange} // Handle image change
          className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent font-normal outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:px-5 file:py-3 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
        />
      </div>

<div>
  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
    NOS
  </label>
  <input
    type="text"
    name="nos"
    placeholder="NOS"
    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
    value={formik.values.nos}
    onChange={formik.handleChange}
    onBlur={formik.handleBlur}
  />
  {formik.touched.nos && formik.errors.nos ? (
    <div className="text-red-500 text-sm">{formik.errors.nos}</div>
  ) : null}
</div>

<div>
  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
    Area
  </label>
  <input
    type="text"
    name="area"
    placeholder="Area"
    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
    value={formik.values.area}
    onChange={formik.handleChange}
    onBlur={formik.handleBlur}
  />
  {formik.touched.area && formik.errors.area ? (
    <div className="text-red-500 text-sm">{formik.errors.area}</div>
  ) : null}
</div>

<div>
  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
    Variety
  </label>
  <input
    type="text"
    name="variety"
    placeholder="Variety"
    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
    value={formik.values.variety}
    onChange={formik.handleChange}
    onBlur={formik.handleBlur}
  />
  {formik.touched.variety && formik.errors.variety ? (
    <div className="text-red-500 text-sm">{formik.errors.variety}</div>
  ) : null}
</div>

<div>
  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
    Planting Date
  </label>
  <input
    type="date"
    name="plantingDate"
    placeholder="Planting Date"
    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
    value={formik.values.plantingDate}
    onChange={formik.handleChange}
    onBlur={formik.handleBlur}
  />
  {formik.touched.plantingDate && formik.errors.plantingDate ? (
    <div className="text-red-500 text-sm">{formik.errors.plantingDate}</div>
  ) : null}
</div>

<div>
  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
    Cutting No.
  </label>
  <input
    type="text"
    name="cuttingNo"
    placeholder="Cutting No."
    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
    value={formik.values.cuttingNo}
    onChange={formik.handleChange}
    onBlur={formik.handleBlur}
  />
  {formik.touched.cuttingNo && formik.errors.cuttingNo ? (
    <div className="text-red-500 text-sm">{formik.errors.cuttingNo}</div>
  ) : null}
</div>

<div>
  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
    Note
  </label>
  <input
    type="text"
    name="note"
    placeholder="Note"
    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
    value={formik.values.note}
    onChange={formik.handleChange}
    onBlur={formik.handleBlur}
  />
  {formik.touched.note && formik.errors.note ? (
    <div className="text-red-500 text-sm">{formik.errors.note}</div>
  ) : null}
</div>

{/* Note */}


{/* Cutting No. */}


{/* Planting Date */}


{/* Variety */}


{/* Area */}


{/* NOS */}


{/* Image */}


{/* Mobile */}


{/* Farmer ID */}


{/* Rate Expect */}


{/* Weight */}


{/* Ratio */}


<div className="col-span-full">
  {Object.keys(editfarmerdata)?.length > 0 ? (
    <button 
      type="submit" 
      className="flex w-full mx-auto max-w-[350px] justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
    >
      Update Plots
    </button>
  ) : (
    <button 
      type="submit" 
      className="flex w-full mx-auto max-w-[350px] justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
    >
      Add Plots
    </button>
  )}
</div>

</form>
        </DialogContent>
        <DialogActions sx={{paddingInline: '20px'}}>
         
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
