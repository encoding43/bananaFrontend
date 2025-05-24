import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchUserStart,
  fetchUserFailure,
  fetchUserSuccess,
} from '../../redux/userSlice.tsx';
import { getAPIAuth, postAPIAuthFormData } from '../../service/apiInstance.ts';
import toast from 'react-hot-toast';
import {useAuth} from './../../hooks/useAuth'
import moment from 'moment';
import { withPageGuard } from '../../utils/withPageGuard.jsx';


const NotificationPage = () => {
  const user = useSelector((state) => state.user);
  const [totalPages, setTotalPages] = React.useState(1);
  const [pageState, setPageState] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [sorting, setSorting] = React.useState([]);
  const [data, setData] = React.useState([]);
  const dispatch = useDispatch();
  const { token } = useAuth();
  console.log('aaaaaaaaaaaaaaaauser', data);

  // const fetchUserData = async () => {
  //   try {
  //     // alert('hello')
  //     dispatch(fetchUserStart());
  //     const res = await getAPIAuth("/user/userFullDetails", token);
  //     console.log('aaaaaares', res)
  //     dispatch(fetchUserSuccess(res?.data?.data));
  //   } catch (error) {
  //     dispatch(fetchUserFailure(error.toString()));
  //   }
  // };
  const fetchUserDatas = async () => {
    try {
      dispatch(fetchUserStart());
      const res = await getAPIAuth('/user/userFullDetails', token);
      console.log('aaaaaares', res);
      dispatch(fetchUserSuccess(res?.data?.data));
    } catch (error) {
      dispatch(fetchUserFailure(error.toString()));
    }
  };
  const fetchUserData = async () => {
    try {
      const res = await getAPIAuth(`user/getNotifications`, token);

      console.log('resresres', res);

      if (res?.data?.success) {
        setData(res?.data?.data?.documents || []);
        setTotalPages(res?.data?.data?.pagination?.totalChildrenCount);
        fetchUserDatas();
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch data');
    }
  };

  React.useEffect(() => {
    fetchUserData();
  }, []);

  const getProfileData = async (vlaues) => {
    console.log('vlauesvlaues', vlaues);
    const formData = new FormData();
    formData?.append('typeName', 'users');
    formData?.append(
      'type',
      user?.data?.role === 'FruitSupplier' ? 'FS' : 'CS',
    );
    formData?.append('name', vlaues.name);
    formData?.append('images', vlaues.logo);
    try {
      const res = await postAPIAuthFormData(
        `user/updateUser/${user?.data?._id}`,
        formData,
      );
      console.log(res, 'fjfjfjfjfjfjfj');

      if (res?.data?.success) {
        // toast.success('Amount Added Successfully');
        fetchUserData();
        // fetchData();
        // resetForm();
        // setOpenAddModal(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const formik = useFormik({
    initialValues: {
      name: user?.data?.companyName || '',
      logo: user?.data?.images || null,
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      logo: Yup.mixed().required('Logo is required'),
    }),
    onSubmit: (values) => {
      getProfileData(values);
    },
  });

  const handleLogoChange = (event) => {
    formik.setFieldValue('logo', event.currentTarget.files[0]);
  };

  return (
    <>
      <div className="flex justify-between items-start sm:items-center mb-6 gap-3 flex-col sm:flex-row">
        <Breadcrumb pageName="Notification " />
      </div>
      <div className="table-container capitalize bg-white rounded-lg shadow-md p-8">
        <div class="flex flex-col gap-5">
          {data?.length ? data?.map((item) => {
            console.log('itemitemitem', item);

            return (
              <>
                <div class="rounded-[10px] border-l-[5px] border-meta-3 bg-white px-4 py-6 shadow-13 dark:bg-boxdark sm:px-5 xl:px-7.5">
                  {item.notificationType == 6 ? (
                    <div>
                      <p>
                        <span className="font-bold">{`${item?.name}'s`} </span>
                        plot of{' '}
                        <span className="font-bold">
                          {`${item?.areaInAcres}`}{' '}
                        </span>{' '}
                        acres in{' '}
                        <span className="font-bold">
                          {`${item?.location}`}{' '}
                        </span>{' '}
                        is complete<span className="font-bold"> 6 months </span>{' '}
                        from the plantation. Ask them for fruit care.{' '}
                      </p>
                    </div>
                  ) :  item.notificationType == 9 ? (
                  <p><span className='font-bold'>{`${item?.name}'s`} </span>plot of <span className='font-bold'>{`${item?.areaInAcres}`} </span> acres in <span className='font-bold'>{`${item?.location}`} </span> is complete <span className='font-bold'> 9 months </span> from the plantation.
                Ask them about harvesting. </p>
                ) : item?.notificationType === "attendance" ? ( 
                  <p>We have noted your absence for {moment(item?.date).format("MMM Do YYYY")}, and it has been marked as a {item?.attendenceType === "A" ? 'Full' : "Half"} absent day. We have updated our records accordingly.</p>
                ) : ''
               }
              
             </div>
            
             </>
               )

                  })
                  : 
                  <div className='text-center font-semibold'>No Notifications</div>
                 }

                    
                  </div>
</div>
    </>
  );
};

export default withPageGuard(NotificationPage , "Notification" , "messages" );

