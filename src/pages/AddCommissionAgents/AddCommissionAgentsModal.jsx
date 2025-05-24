import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { postAPIAuth } from '../../service/apiInstance';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
// import { useFormik } from 'formik';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const Editfields = [
  'commissionAgentName',
  'commissionAgentAddress',
  'commissionAgentShortForm',
  'commissionAgentEmail',
  'ownerName',
  'ownerMobile',
  // 'paymentRelatedPerson',
  // 'paymentRelatedPersonContact',
  'gstin',
  'iecCode',
];
const Updatefields = [
  'commissionAgentName',
  'commissionAgentAddress',
  'commissionAgentShortForm',
  'commissionAgentEmail',
  'ownerName',
  // 'ownerMobile',
  // 'paymentRelatedPerson',
  // 'paymentRelatedPersonContact',
  'gstin',
  'iecCode',
];
export default function AddCommissionAgentModal({
  openAddModal,
  setOpenAddModal,
  editingLabor,
  updateData,
}) {
  console.log('openAddModalopenAddModal', openAddModal);

  console.log('editingLaboreditingLabor', editingLabor);
  console.log('updateDataupdateData', updateData);

  const validationSchema = Yup.object({
    commissionAgentName: Yup.string().required(
      'Commission Agent Name is required',
    ),
    commissionAgentAddress: Yup.string().required(
      'Commission Agent Address is required',
    ),
    commissionAgentShortForm: Yup.string().required(
      'Commission Agent Short form/ Alias is required',
    ),
    commissionAgentEmail: Yup.string()
      .email('Invalid email')
      .required('Commission Agent Email is required'),
    ownerName: Yup.string().required('Owner Name is required'),
    ownerMobile: Yup.string()
      .matches(/^[0-9]+$/, 'Must be only digits')
      .required('Owner Mobile is required'),
    // paymentRelatedPerson: Yup.string().required(
    //   'Payment Related Person is required',
    // ),
    // paymentRelatedPersonContact: Yup.string()
    //   .matches(/^[0-9]+$/, 'Must be only digits')
    //   .required('Payment Related Person Contact is required'),
    // gstin: Yup.string().required('GSTIN is required'),
    // iecCode: Yup.string().required('IEC Code is required'),
    billingBy: Yup.string().required('Billing By is required'),
  });

  const navigate = useNavigate();
  const [laborName, setLaborName] = React.useState('');
  const [laborMobileNo, setLaborMobileNo] = React.useState('');
  const [teamContractor, setTeamContractor] = React.useState('');
  const [contractorMobile, setContractorMobile] = React.useState('');
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

  const handleFormSubmit = async (vlaues, resetForm) => {
    console.log('vlaues', vlaues);
    try {
      const userData = {
        companyName: vlaues?.commissionAgentName,
        companyAddress: vlaues?.commissionAgentAddress,
        companyAliasName: vlaues?.commissionAgentShortForm,
        companyEmail: vlaues?.commissionAgentEmail,
        ownerName: vlaues?.ownerName,
        ownersMobile: vlaues?.ownerMobile,
        paymentRelatedPerson: vlaues?.paymentRelatedPerson,
        contractorMobile: vlaues?.paymentRelatedPersonContact,
        paymentRelatedPersonContact: vlaues?.paymentRelatedPersonContact,
        // ...(vlaues?.gstin.length > 0 ? {gstIn: vlaues?.gstin} : {}),
        // ...(vlaues?.iecCode.length > 0 ? {iecCode: vlaues?.iecCode} : {}),
        // ...(editingLabor ? {} : { ownerPassword: vlaues?.ownersPassword }),
        gstIn: vlaues?.gstin,
        iecCode: vlaues?.iecCode,
        billingBy: vlaues?.billingBy,
        serviceCharges:
          vlaues.billingBy === 'per kg' ? vlaues?.serviceCharges : '1',
        serviceChargeType:
          vlaues.billingBy === 'per kg' ? vlaues?.billingOption : '',

        // commented
        // ...(vlaues?.billingBy == 'per kg'
        //   ? {
        //       serviceCharges: vlaues?.serviceCharges,
        //       serviceChargeType: vlaues?.billingOption,
        //     }
        //   : {}),
      };

      console.log('userDatauserData', userData);

      let res;
      if (editingLabor) {
        res = await postAPIAuth(
          `commissionAgent/editCommissionAgentDetail/${editingLabor._id}`,
          userData,
        );
      } else {
        res = await postAPIAuth(
          'commissionAgent/addCommissionAgentDetail',
          userData,
        );
      }
      if (res?.data?.success) {
        toast.success(
          `CommissionAgent ${editingLabor ? 'updated' : 'added'} successfully.`,
        );
        handleClose();
        updateData();
        resetForm();
        navigate('/addCommissionAgent');
      } else {
        console.log('res?.data?.message', res);
        toast.error(res?.data?.message);
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      toast.error(
        `Error ${editingLabor ? 'updating' : 'adding'} commission agent. Please try again later.`,
      );
    }
  };

  const formik = useFormik({
    initialValues: {
      commissionAgentName: editingLabor?.companyName || '',
      commissionAgentAddress: editingLabor?.companyAddress || '',
      commissionAgentShortForm: editingLabor?.companyAliasName || '',
      commissionAgentEmail: editingLabor?.companyEmail || '',
      ownerName: editingLabor?.companyName || '',
      ownerMobile: editingLabor?.ownersMobile || '',
      // paymentRelatedPerson: editingLabor?.paymentRelatedPerson || '',
      // paymentRelatedPersonContact:
      //   editingLabor?.paymentRelatedPersonContact || '',
      gstin: editingLabor?.gstIn || '',
      // ownersPassword: '',
      iecCode: editingLabor?.iecCode || '',
      billingBy: editingLabor?.billingBy || 'per box',
      serviceCharges: editingLabor?.serviceCharges || '',
      billingOption: editingLabor?.serviceChargeType || '',
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      // Handle form submission
      console.log({ values });
      handleFormSubmit(values, resetForm);
    },
    enableReinitialize: true,
  });
  console.log('formikformikformikformik', formik.errors);

  return (
    <React.Fragment>
      <Dialog
        open={openAddModal}
        onClose={handleClose}
        fullWidth={true}
        maxWidth={'md'}
      >
        <DialogTitle>
          {' '}
          {editingLabor ? 'Edit CommissionAgent' : 'Add CommissionAgent'}
        </DialogTitle>
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
              {editingLabor ? (
                <>
                  {Updatefields.map((field) => (
                    <div key={field}>
                      <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                        {field.replace(/([A-Z])/g, ' $1').trim()}
                      </label>
                      <input
                        name={field}
                        value={formik.values[field]}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        type="text"
                        placeholder={`Enter ${field.replace(/([A-Z])/g, ' $1').trim()}`}
                        className={`w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${
                          formik.touched[field] && formik.errors[field]
                            ? 'border-red-500'
                            : ''
                        }`}
                      />
                      {formik.touched[field] && formik.errors[field] ? (
                        <div className="text-red-500">
                          {formik.errors[field]}
                        </div>
                      ) : null}
                    </div>
                  ))}
                </>
              ) : (
                <>
                  {Editfields.map((field) => (
                    <div key={field}>
                      <label className="mb-3 block text-sm font-medium text-black dark:text-white capitalize">
                        {field.replace(/([A-Z])/g, ' $1').trim()}
                      </label>
                      <input
                        name={field}
                        value={formik.values[field]}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        type="text"
                        placeholder={`Enter ${field.replace(/([A-Z])/g, ' $1').trim()}`}
                        className={`w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${
                          formik.touched[field] && formik.errors[field]
                            ? 'border-red-500'
                            : ''
                        }`}
                      />
                      {formik.touched[field] && formik.errors[field] ? (
                        <div className="text-red-500">
                          {formik.errors[field]}
                        </div>
                      ) : null}
                    </div>
                  ))}
                </>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4 place-items-start mt-4">
              <div>
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Billing By
                </label>
                <div>
                  <label>
                    <input
                      type="radio"
                      name="billingBy"
                      value="per box"
                      checked={formik.values.billingBy === 'per box'}
                      onChange={formik.handleChange}
                    />
                    Per Box
                  </label>
                  <label className="ml-4">
                    <input
                      type="radio"
                      name="billingBy"
                      value="per kg"
                      checked={formik.values.billingBy === 'per kg'}
                      onChange={formik.handleChange}
                    />
                    Per kg
                  </label>
                </div>
                {formik.touched.billingBy && formik.errors.billingBy ? (
                  <div className="text-red-500">{formik.errors.billingBy}</div>
                ) : null}
              </div>

              {formik.values.billingBy === 'per kg' && (
                <>
                  <div>
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Choose Charge
                    </label>
                    <select
                      name="billingOption"
                      value={formik.values.billingOption}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${
                        formik.touched.billingOption &&
                        formik.errors.billingOption
                          ? 'border-red-500'
                          : ''
                      }`}
                    >
                      <option value="" label="Select option" />
                      {/* <option
                        value="netWeight"
                        label="Service charge by net weight"
                      />
                      <option
                        value="boxWeight"
                        label="Service charge per box weight"
                      /> */}
                      <option
                        value="commisionByNetWeight"
                        label="Commision by net weight"
                      />
                      <option
                        value="commisionPerBoxWeight"
                        label="Commision Per box weight"
                      />
                    </select>
                  </div>

                  {formik.values.billingBy === 'per kg' &&
                    formik.values.billingOption && (
                      <div>
                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                          {formik.values.billingOption === 'netWeight'
                            ? 'Service Charges by Net Weight'
                            : formik.values.billingOption === 'boxWeight'
                              ? 'Service Charges per Box Weight'
                              : formik.values.billingOption ===
                                  'commisionByNetWeight'
                                ? 'Commision by Net Weight'
                                : 'Commision per Box Weight'}
                        </label>
                        <input
                          name="serviceCharges"
                          value={formik.values.serviceCharges}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          type="number"
                          placeholder="Enter Service Charges"
                          className={`w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${
                            formik.touched.serviceCharges &&
                            formik.errors.serviceCharges
                              ? 'border-red-500'
                              : ''
                          }`}
                        />
                        {formik.touched.serviceCharges &&
                        formik.errors.serviceCharges ? (
                          <div className="text-red-500">
                            {formik.errors.serviceCharges}
                          </div>
                        ) : null}
                      </div>
                    )}
                </>
              )}
            </div>

            <DialogActions sx={{ paddingInline: '20px' }}>
              <button
                type="submit"
                className="flex w-full mx-auto max-w-[350px] justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
              >
                {editingLabor ? 'Update' : 'Add'}
              </button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
