import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import {
  Autocomplete,
  IconButton,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { getAPIAuth, postAPIAuth } from '../../service/apiInstance';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useFormik } from 'formik';
import * as Yup from 'yup';

export default function AddBankFarmerModal({ openAddModal, setOpenAddModal, editingLabor, updateData }) {
  console.log("editingLabor" , editingLabor);
  
  const navigate = useNavigate();  
  const [laborName, setLaborName] = React.useState('');
  const [laborMobileNo, setLaborMobileNo] = React.useState('');
  const [teamContractor, setTeamContractor] = React.useState('');
  const [contractorMobile, setContractorMobile] = React.useState('');
  const [farmerData, setFarmerData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);


  React.useEffect(() => {
    if (editingLabor) {
      setLaborName(editingLabor.name || '');
      setLaborMobileNo(editingLabor.mobile || '');
      setTeamContractor(editingLabor.teamContractor || '');
      setContractorMobile(editingLabor.ContractorMobile || '');
    } else {
      setLaborName('');
      setLaborMobileNo('');
      setTeamContractor('');
      setContractorMobile('');
    }
  }, [editingLabor]);

  const handleClose = () => {
    setOpenAddModal(false);
  };

  const getFarmerDataList = async ()=> {
    try {
      const res = await getAPIAuth('farmer/getFarmerDetail?block=true');
      console.log("resresresresresresres" , res);
      if(res?.data?.success) {
        setFarmerData(res?.data?.data?.documents);
      }
    } catch (error) {
      console.log('error', error)
    }
  }

  React.useEffect(() => {
    getFarmerDataList();
  },[])

  const handleFormSubmit = async (values, resetForm) => {
    console.log("sddddddvalues" , values);
    
    
    try {
      const userData = {
        farmerId: values?.farmerID,
        bankName: values.bankName,
        accountHolder: values.nameOnAccount,
        accountNumber: values.accountNumber,
        ifscCode: values.ifscCode,
        accountType: values.accountType,
        accountType: values.accountType,
  ...(editingLabor ? { id: editingLabor._id } : {})
      };

      let res;
      if (editingLabor) {
        // Call the update API
        res = await postAPIAuth(`farmer/editBankDetail`, userData);
      } else {
        // Call the add API
        res = await postAPIAuth('farmer/addFarmerBankAccount', userData);
      }
       console.log({res})
      if (res?.data?.success ) {
          toast.success(`Bank Accout ${editingLabor ? 'updated' : 'added'} successfully.`);
          handleClose();
          updateData(); 
          resetForm();
          navigate("/farmerBankAccount")
        }
        else{
            toast.error(res?.data?.message);
        }
    } catch (err) {
        console.error('Error submitting form:', err);
        toast.error(err?.response?.data?.message);
        // toast.error(`Error ${editingLabor ? 'updating' : 'adding'} labor. Please try again later.`);
    }
  };
  const validationSchema = Yup.object({
    farmerID: Yup.string().required('Farmer selection is required'), 
    bankName: Yup.string().required('Bank Name is required'),
    nameOnAccount: Yup.string().required('Name on Account is required'),
    // farmerMobile: Yup.string().required('Farmer Mobile No. is required'),
    accountNumber: Yup.string().required('Account No. is required'),
    ifscCode: Yup.string().required('IFSC Code is required'),
    accountType: Yup.string().required('Account Type is required'),
  });
  const formik = useFormik({
    initialValues: {
      farmerID: editingLabor?.farmerId || '', 
      bankName: editingLabor?.bankName ||'',
      nameOnAccount: editingLabor?.accountHolder ||'',
      // farmerMobile: '',
      accountNumber: editingLabor?.accountNumber||'',
      ifscCode: editingLabor?.ifscCode||'',
      accountType: editingLabor?.accountType||'',
    },
    validationSchema,
    onSubmit: ((vlaues, { resetForm }) => {
      handleFormSubmit(vlaues , resetForm)
    }),
    enableReinitialize : true
  });
  const handleFarmerChange = (event, value) => {
    formik.setFieldValue('farmerID', value?._id || '');
  };

  return (
    <React.Fragment>
      <Dialog
        open={openAddModal}
        onClose={handleClose}
        fullWidth={true}
        maxWidth={'md'}
      >
        <DialogTitle> {editingLabor ? 'Edit Bank Account' : 'Add Bank Account'}</DialogTitle>
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
      <div>
          <label className="block text-sm font-medium text-black dark:text-white mb-3">
            Select Farmers
          </label>
          <Autocomplete
            value={farmerData.find((option) => option._id === formik.values.farmerID) || null}
            onChange={handleFarmerChange}
            options={farmerData}
            getOptionLabel={(option) => `${option.name} (${option?.mobileNo})`}
            renderInput={(params) => (
              <TextField {...params} placeholder="Select Farmers" sx={{ width: '100%', height: '49.6px' }} />
            )}
            isOptionEqualToValue={(option, value) => option?._id === value?._id}
            sx={{ width: '100%' }}
          />
          {formik.touched.farmerID && formik.errors.farmerID ? <div className='mt-1 text-red-500'>{formik.errors.farmerID}</div> : null}
        </div>
        <div>
          <label className="mb-3 block text-sm font-medium text-black dark:text-white">Bank Name</label>
          <input
            type="text"
            name="bankName"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.bankName}
            placeholder="Default Input"
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
          {formik.touched.bankName && formik.errors.bankName ? <div className='mt-1 text-red-500'>{formik.errors.bankName}</div> : null}
        </div>
        <div>
          <label className="mb-3 block text-sm font-medium text-black dark:text-white">Name on Account</label>
          <input
            type="text"
            name="nameOnAccount"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.nameOnAccount}
            placeholder="Default Input"
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
          {formik.touched.nameOnAccount && formik.errors.nameOnAccount ? <div className='mt-1 text-red-500'>{formik.errors.nameOnAccount}</div> : null}
        </div>
        {/* <div>
          <label className="mb-3 block text-sm font-medium text-black dark:text-white">Mobile</label>
          <input
            type="text"
            name="farmerMobile"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.farmerMobile}
            placeholder="Default Input"
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
          {formik.touched.farmerMobile && formik.errors.farmerMobile ? <div>{formik.errors.farmerMobile}</div> : null}
        </div> */}
        <div>
          <label className="mb-3 block text-sm font-medium text-black dark:text-white">Account No.</label>
          <input
            type="text"
            name="accountNumber"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.accountNumber}
            placeholder="Default Input"
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
          {formik.touched.accountNumber && formik.errors.accountNumber ? <div className='mt-1 text-red-500'>{formik.errors.accountNumber}</div> : null}
        </div>
        <div>
          <label className="mb-3 block text-sm font-medium text-black dark:text-white">IFSC Code</label>
          <input
            type="text"
            name="ifscCode"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.ifscCode}
            placeholder="Default Input"
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
          {formik.touched.ifscCode && formik.errors.ifscCode ? <div className='mt-1 text-red-500'>{formik.errors.ifscCode}</div> : null}
        </div>
        {/* <div>
          <label className="mb-3 block text-sm font-medium text-black dark:text-white">Account Type</label>
          <input
            type="text"
            name="accountType"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.accountType}
            placeholder="Default Input"
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
          {formik.touched.accountType && formik.errors.accountType ? <div className='mt-1 text-red-500'>{formik.errors.accountType}</div> : null}
        </div> */}
      <div>
  <label className="mb-3 block text-sm font-medium text-black dark:text-white">Account Type</label>
  <Select
    name="accountType"
    onChange={formik.handleChange}
    onBlur={formik.handleBlur}
    value={formik.values.accountType}
    size='small'
    fullWidth
    displayEmpty
    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-3 py-1 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
  >
    <MenuItem value="" disabled>
      Select account type
    </MenuItem>
    <MenuItem value="Saving">Saving</MenuItem>
    <MenuItem value="Current">Current</MenuItem>
  </Select>
  {formik.touched.accountType && formik.errors.accountType ? (
    <div className='mt-1 text-red-500'>{formik.errors.accountType}</div>
  ) : null}
</div>
      </div>
      {/* <button type="submit" className="mt-4 px-6 py-3 bg-primary text-white rounded-lg">Submit</button> */}
      <DialogActions sx={{paddingInline: '20px'}}>
          <button type="submit"  className="flex w-full mx-auto max-w-[350px] justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">{editingLabor ? 'Edit Bank Account' : 'Add Bank Account'}</button>
        </DialogActions>
    </form>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
