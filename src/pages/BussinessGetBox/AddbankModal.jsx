import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import {
  IconButton,
  TextField,
} from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';
import { getAPIAuth, postAPIAuth } from '../../service/apiInstance';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Select, MenuItem } from '@mui/material';
import moment from 'moment';

export default function AddBankFarmerModal({ openAddModal, setOpenAddModal, editingLabor, updateData }) {
  console.log("editingLabor" , editingLabor);
  
  
  const navigate = useNavigate();
  const [farmerData, setFarmerData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [coldStorageList, setColdStorageList] = React.useState([]);
  const [companyList, setCompanyList] = React.useState([])
  const boxKgOptions = [3,5,7,13,13.5,14,16, 'custom']

  const handleClose = () => {
    setOpenAddModal(false);
  };

  const getColdStorageList = async ()=> {
    try {
      const res = await getAPIAuth('user/getColdStorage')
      if(res?.data?.success) {
        setColdStorageList(res?.data?.data?.user)
      }
    } catch (error) {
      console.log('error', error)
    }
  }

  const getCompanyList = async ()=> {
    try {
      const res = await getAPIAuth('supplier/company/get')
      if(res?.data?.success) {
        setCompanyList(res?.data?.data?.documents)
      }
    } catch (error) {
      console.log('error', error)
    }
  }

  React.useEffect(()=> {
    getColdStorageList();
    getCompanyList();
  }, [])

  const handleFormSubmit = async (values, resetForm) => {
    console.log("Submitted values", values);

    try {
      const userData = {
        note: values.note,
        packingDate: values.packingDate,
        companyId: values.companyId,
        ratePerBox: values.ratePerBox,
        coldStoreId: values.coldStoreId,
        ratio: values.ratio,
        count: values.count,
        boxKg : values.boxKg == "custom" ? values.Box_custom_Value : values.boxKg ,
        // boxKg
        ...(editingLabor ? { id: editingLabor._id } : {})
      };

      let res;
      if (editingLabor) {
        res = await postAPIAuth('bussinessIntelligence/editBananaBoxes', userData);
      } else {
        res = await postAPIAuth('bussinessIntelligence/addBananaBoxes', userData);
      }

      console.log("resresresres" , res);
      

      if (res?.data?.status == 200) {
        toast.success(`Box details ${editingLabor ? 'updated' : 'added'} successfully.`);
        handleClose();
        updateData();
        resetForm();
        // navigate("/farmerBoxDetails")
      } else {
        toast.error(res?.data?.message);
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      toast.error(err?.response?.data?.message);
    }
  };

  const validationSchema = Yup.object({
    note: Yup.string().required('Note is required'),
    packingDate: Yup.date().required('Packing date is required'),
    // companyId: Yup.string().required('Company ID is required'),
    ratePerBox: Yup.number().required('Rate per box is required'),
    coldStoreId: Yup.string().required('Cold Store ID is required'),
    ratio: Yup.number().required('Ratio is required'),
    count: Yup.number().required('Count is required'),
    boxKg: Yup.number().required('Box KG is required'),
  });
  const formattedDate = moment(editingLabor?.packingDate).format('YYYY-MM-DD');
  const formik = useFormik({
    initialValues: {
      note: editingLabor?.note || '',
      packingDate: formattedDate || '',
      // companyId: editingLabor?.companyId || '',
      ratePerBox: editingLabor?.ratePerBox || '',
      coldStoreId: editingLabor?.coldStoreId || '',
      ratio: editingLabor?.ratio || '',
      count: editingLabor?.count || '',
      boxKg: editingLabor?.boxKg || '',
      companyId : editingLabor?.companyId || "",
       Box_custom_Value : ""
    },
    validationSchema,
    onSubmit: ((values, { resetForm }) => {
      handleFormSubmit(values, resetForm)
    }),
    enableReinitialize: true
  });

  return (
    <React.Fragment>
      <Dialog
        open={openAddModal}
        onClose={handleClose}
        fullWidth={true}
        maxWidth={'md'}
      >
        <DialogTitle>{editingLabor ? 'Edit Boxes' : 'Add Boxes'}</DialogTitle>
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
          <form onSubmit={formik.handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* <div>
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">Box KG</label>
                <TextField
                  name="boxKg"
                  type="number"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.boxKg}
                  placeholder="Enter box KG"
                  fullWidth
                  variant="outlined"
                />
                {formik.touched.boxKg && formik.errors.boxKg ? <div className='mt-1 text-red-500'>{formik.errors.boxKg}</div> : null}
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
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">Note</label>
                <TextField
                  name="note"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.note}
                  placeholder="Enter note"
                  fullWidth
                  variant="outlined"
                />
                {formik.touched.note && formik.errors.note ? <div className='mt-1 text-red-500'>{formik.errors.note}</div> : null}
              </div>

              <div>
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">Packing Date</label>
                <TextField
                  name="packingDate"
                  type="date"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.packingDate}
                  fullWidth
                  variant="outlined"
                />
                {formik.touched.packingDate && formik.errors.packingDate ? <div className='mt-1 text-red-500'>{formik.errors.packingDate}</div> : null}
              </div>

              {/* <div>
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">Company ID</label>
                <TextField
                  name="companyId"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.companyId}
                  placeholder="Enter company ID"
                  fullWidth
                  variant="outlined"
                />
                {formik.touched.companyId && formik.errors.companyId ? <div className='mt-1 text-red-500'>{formik.errors.companyId}</div> : null}
              </div> */}

              <div>
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">Rate per Box</label>
                <TextField
                  name="ratePerBox"
                  type="number"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.ratePerBox}
                  placeholder="Enter rate per box"
                  fullWidth
                  variant="outlined"
                />
                {formik.touched.ratePerBox && formik.errors.ratePerBox ? <div className='mt-1 text-red-500'>{formik.errors.ratePerBox}</div> : null}
              </div>


<div>
        <label className="block text-sm font-medium text-black dark:text-white mb-3">
          Cold Storage
        </label>
        <Select
          name="coldStoreId"
          value={formik.values.coldStoreId}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          displayEmpty
          sx={{
            width: '100%',
            height: '49.6px',
            borderColor: formik.touched.coldStoreId && formik.errors.coldStoreId ? 'red' : 'initial',
          }}
        >
          <MenuItem value="" disabled>
            Select cold storage
          </MenuItem>
          {coldStorageList?.length > 0 &&
            coldStorageList.map((option) => (
              <MenuItem key={option?._id} value={option?._id}>
                {option?.csName}
              </MenuItem>
            ))}
        </Select>
        {formik.touched.coldStoreId && formik.errors.coldStoreId && (
          <p className="text-red-500 text-sm mt-1">{formik.errors.coldStoreId}</p>
        )}
      </div>

      {/*  */}

      <div>
  <label className="block text-sm font-medium text-black dark:text-white mb-3">
    Select Company
  </label>
  <Select
    name="companyId" // Updated to match the value prop
    value={formik.values.companyId}
    onChange={formik.handleChange}
    onBlur={formik.handleBlur}
    displayEmpty
    sx={{
      width: '100%',
      height: '49.6px',
      borderColor: formik.touched.companyId && formik.errors.companyId ? 'red' : 'initial', // Updated to match the field name
    }}
  >
    <MenuItem value="" disabled>
      Select Company Name
    </MenuItem>
    {companyList?.length > 0 &&
      companyList.map((option) => (
        <MenuItem key={option?._id} value={option?._id}>
          {option?.companyAliasName}
        </MenuItem>
      ))}
  </Select>
  {formik.touched.companyId && formik.errors.companyId && (
    <p className="text-red-500 text-sm mt-1">{formik.errors.companyId}</p> // Updated to match the field name
  )}
</div>




      {/*  */}


              <div>
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">Ratio</label>
                <TextField
                  name="ratio"
                  type="number"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.ratio}
                  placeholder="Enter ratio"
                  fullWidth
                  variant="outlined"
                />
                {formik.touched.ratio && formik.errors.ratio ? <div className='mt-1 text-red-500'>{formik.errors.ratio}</div> : null}
              </div>

              <div>
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">Count</label>
                <TextField
                  name="count"
                  type="number"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.count}
                  placeholder="Enter count"
                  fullWidth
                  variant="outlined"
                />
                {formik.touched.count && formik.errors.count ? <div className='mt-1 text-red-500'>{formik.errors.count}</div> : null}
              </div>

             
            </div>

            <DialogActions sx={{ paddingInline: '20px' }}>
              <button type="submit" className="flex w-full mx-auto max-w-[350px] justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">
                {editingLabor ? 'Edit Boxes' : 'Add Boxes'}
              </button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
