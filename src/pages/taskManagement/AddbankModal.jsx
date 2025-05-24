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
import moment from 'moment';

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
        task: values?.taskName,
        deadLine: values?.deadline,
        ...(editingLabor ? { id: editingLabor._id } : {})
      };

      let res;
      if (editingLabor) {
        // Call the update API
        res = await postAPIAuth(`task/updateTask`, userData);
      } else {
        // Call the add API
        res = await postAPIAuth('task/createTask', userData);
      }
       console.log({res})
      if (res?.data?.success ) {
          toast.success(`Task ${editingLabor ? 'updated' : 'added'} successfully.`);
          handleClose();
          updateData(); 
          resetForm();
          navigate("/task")
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
    taskName: Yup.string().required('Task name is required'),
  });
  const deadLineDateMoment = moment(editingLabor?.deadLine).format("YYYY-MM-DD")
  const formik = useFormik({
    initialValues: {
      taskName: editingLabor?.task ||'',
      deadline : deadLineDateMoment || ""
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
        <DialogTitle> {editingLabor ? 'Edit Task' : 'Add Task'}</DialogTitle>
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
          <label className="mb-3 block text-sm font-medium text-black dark:text-white">Task Name</label>
          <input
            type="text"
            name="taskName"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.taskName}
            placeholder="Default Input"
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
          {formik.touched.taskName && formik.errors.taskName ? <div className='mt-1 text-red-500'>{formik.errors.taskName}</div> : null}
        </div>

        {/*  */}
        <div>
          <label className="mb-3 block text-sm font-medium text-black dark:text-white">Task Deadline</label>
          <input
            type="date"
            name="deadline"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.deadline}
            placeholder="Task Deadline"
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
          {formik.touched.deadline && formik.errors.deadline ? <div className='mt-1 text-red-500'>{formik.errors.deadline}</div> : null}
        </div>
        {/*  */}
   
      </div>
      {/* <button type="submit" className="mt-4 px-6 py-3 bg-primary text-white rounded-lg">Submit</button> */}
      <DialogActions sx={{paddingInline: '20px'}}>
          <button type="submit"  className="flex w-full mx-auto max-w-[350px] justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">{editingLabor ? 'Edit Task' : 'Add Task'}</button>
        </DialogActions>
    </form>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
