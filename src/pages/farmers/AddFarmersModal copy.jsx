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
import {getAPI, getAPIAuth, postAPIAuth, postAPIAuthFormData} from './../../service/apiInstance.ts'
import { useAuth } from '../../hooks/useAuth.jsx';
// import toast from 'react-hot-toast';
import { toast, Toaster } from 'sonner';
import { useSelector } from 'react-redux';
import moment from 'moment';
import * as Yup from 'yup';

const boxKgOptions = [3,5,7,13,13.5,14,16, 'custom']

const options = [
  { title: 'Option 1' },
  { title: 'Option 2' },
  { title: 'Option 3' },
  { title: 'Option 4' },
];

export default function AddFarmersModal({openAddModal, setOpenAddModal , editHarvestingdata , getFarmers}) {
  console.log("wwwwwwwwwwwweditHarvestingdata" , editHarvestingdata?._id);
  
  const {token} = useAuth();
  const [loading, setLoading] = React.useState(false)
  const [selectedLabors, setSelectedLabors] = React.useState([]);
  const [rows, setRows] = React.useState([{ boxKgType: '', customeVallue : '' , boxweight: '' , count: '', brand: '' , handsRatio : {
    '3H' : '',
    '4H' : '',
    '5H' : '',
    '6H' : '',
    '7H' : '',
    '8H' : '',
    '9H' : '',
    '10H' : '',
  } }]);

  console.log("rowsrows" , rows);
  
  const userDetails = useSelector(state=> state?.user);
  
  const [showHandsRatio, setShowHandsRatio] = React.useState(false)
  const [showMaterialGerm, setShowMaterialGerm] = React.useState(false)
  const [labourList, setLabourList] = React.useState([])
  const [companyList, setCompanyList] = React.useState([])
  const [farmerData, setFarmerData] = React.useState([]);
  const [coldStorageList, setColdStorageList] = React.useState([]);
  const [boxBrandValue , setBoxBrandValue] = React.useState([]);
  // console.log("dslkjfsdfdjl" , {errors , touched });
  const [packagingMaterialData, setPackagingMaterialData] = React.useState([]);
  console.log("packagingMaterialData" , boxBrandValue);
  let isError = false;
  
  const [inputErrors, setInputErrors] = React.useState({
    farmerID : "",
    laborId: '',
    vehicleNo: '',
    companyId : '',
    rate: '', 
    coldStoreId: '',
    weight: '',
    date: '',
    wastage: '',
  });

  console.log("inputErrors" , inputErrors);
  console.log("isHandRatioisHandRatio" , boxBrandValue);
  
  const [materialGermination, setMaterialGermination] = React.useState({
    foam : '',
    LDPE_Bag: '',
    foamQuantity : '',
    ethyleneQuantity : '',
    fevicol: '',
    ethylenePouch: '',
    rubber: '',
    germinationPaper : '',
    cuttingString : '',
    Chemicals: {
      fungicide: '',
      cChemical: '',
      amester: ''
    }
  }); 

  console.log("materialGerminationmaterialGermination" , materialGermination);
  
  

  const [formValues, setFormValues] = React.useState({
    typeName : 'farmer',
    farmerName : '',
    farmerMobileNo : '',
    location : '',
    date : '',
    vehicleNo : '',
    laborId : '',
    companyId : '',
    coldStoreId : '',
    rate : '',
    weight : '',
    wastage : '',
    companyWestage : '',
    companyRate : '',
    images: [],
    farmerID: '',
    box : [
      {
        boxKgType : '',
        customeVallue : '',
        boxweight : '',
        count: '',
        brand : '',
        handsRatio : {
          '3H' : '',
          '4H' : '',
          '5H' : '',
          '6H' : '',
          '7H' : '',
          '8H' : '',
          '9H' : '',
          '10H' : '',
        }
      }
    ],
 
  });

  console.log("formValuesformValues" , formValues);
  

  React.useEffect(() => {

    const companyFilterValue = companyList?.filter((item) => item._id === formValues?.companyId);
    console.log("companyFilterValuecompanyFilterValue" , companyFilterValue?.[0]?.stock?.box);
    setBoxBrandValue(companyFilterValue?.[0]?.stock?.box)
    
    

  }, [formValues.companyId])

  const framerFilterOutData = (name) => {
   const data =  farmerData?.filter((item) => item.name == name )
   return data?.[0]?._id
  }
  
React.useEffect(() => {

  setFormValues({
    typeName: 'farmer',
    farmerName: framerFilterOutData(editHarvestingdata?.farmerName) || '',
    farmerMobileNo: editHarvestingdata?.farmerMobileNo || '',
    location: editHarvestingdata?.location || '',
    date: moment(editHarvestingdata?.date).format('YYYY-MM-DD') || '',
    vehicleNo: editHarvestingdata?.vehicleNo || '',
    laborId: editHarvestingdata.labors?.[0]?._id || "",
    companyId: editHarvestingdata?.company?._id || '',
    coldStoreId: editHarvestingdata?.coldStore?._id || '',
    rate: editHarvestingdata?.rate || '',
    weight: editHarvestingdata?.weight || '',
    wastage: editHarvestingdata?.wastage || '',
    companyWestage: editHarvestingdata?.companyWestage || '',
    companyRate: editHarvestingdata?.companyRate || '',
    images: editHarvestingdata?.images || [],
    farmerID: framerFilterOutData(editHarvestingdata?.farmerName)  || '',
    box: editHarvestingdata?.box?.map(b => ({
        boxKgType: b.boxKgType || '',
        customeVallue : b.boxKgType ||'',
        boxweight : b.boxweight ||'',
        count: b.count || '',
        brand: b.brand || '',
        handsRatio: {
          '3H': editHarvestingdata?.handsRatio?.['3H'] || '',
          '4H': editHarvestingdata?.handsRatio?.['4H'] || '',
          '5H': editHarvestingdata?.handsRatio?.['5H'] || '',
          '6H': editHarvestingdata?.handsRatio?.['6H'] || '',
          '7H': editHarvestingdata?.handsRatio?.['7H'] || '',
          '8H': editHarvestingdata?.handsRatio?.['8H'] || '',
          '9H': editHarvestingdata?.handsRatio?.['9H'] || '',
          '10H': editHarvestingdata?.handsRatio?.['10H'] || ''
      }
    })), 
});
if(Object.keys(editHarvestingdata).length > 0){
  let arr = []
  editHarvestingdata?.box?.map(item=> {
    arr.push({ 
        boxKgType:item?.customBox ? 'custom' : item?.boxKgType, 
        customeVallue: !item?.customBox ? '' : item?.boxKgType,
        boxweight : item?.emptyBoxWeight , 
        count: item?.count, 
        brand: item?.brand , 
        handsRatio : {
        '3H' : item?.handsRatio?.["3H"],
        '4H' : item?.handsRatio?.["4H"],
        '5H' : item?.handsRatio?.["5H"],
        '6H' : item?.handsRatio?.["6H"],
        '7H' : item?.handsRatio?.["7H"],
        '8H' : item?.handsRatio?.["8H"],
        '9H' : item?.handsRatio?.["9H"],
        '10H' : item?.handsRatio?.["10H"],
      }})
    }
  )
  setRows(arr)
}
}, [editHarvestingdata]);

console.log('editHarvestingdataeditHarvestingdataeditHarvestingdata', editHarvestingdata)

const getPackagingMaterial = async () => {
  try {
    const res = await getAPIAuth(
      `/getGlobalMateialGermination`,
      token,
    );
    
    if (res?.data?.success) {
      setPackagingMaterialData(res?.data?.data);
    }
  } catch (error) {
    console.error('error', error);
  }
};

React.useEffect(() => {
    getPackagingMaterial();
}, []);

  // get global material list
  const getGlobalMaterial = async ()=> {
    try {
       
      if(!editHarvestingdata?._id){
        const res = await getAPIAuth('farmer/getGlobalMaterial')
        console.log('editHarvestingdata?._id', editHarvestingdata?._id)
        if(res?.data?.success) {
          console.log('inside the code' , res)
          setMaterialGermination(prev=> ({
            ...prev,
            foam : res?.data?.data?.foam,
            foamQuantity : res?.data?.data?.foamQuantity,
            ethyleneQuantity : res?.data?.data?.ethyleneQuantity,
            LDPE_Bag: res?.data?.data?.LDPE_Bag,
            fevicol: res?.data?.data?.fevicol,
            ethylenePouch: res?.data?.data?.ethylenePouch,
            rubber: res?.data?.data?.rubber,
            cuttingString : res?.data?.data?.cuttingString,
            germinationPaper : res?.data?.data?.germinationPaper,
            Chemicals : {
              fungicide : res?.data?.data?.Chemicals?.fungicide,
              cChemical : res?.data?.data?.Chemicals?.cChemical,
              amester : res?.data?.data?.Chemicals?.amester
            },
          }))
  
        }
      }
       
    } catch (error) {
      console.log('error', error)
    }
  }

  // get labor data
  const getLabourList = async ()=> {
    try {
      const res = await getAPIAuth('supplier/labor/get')
      if(res?.data?.success) {
        setLabourList(res?.data?.data?.documents)
      }
    } catch (error) {
      console.log('error', error)
    }
  }

  // get company data
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

  // get farmeredata

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



  // end farmer data 

  // get cold storage data
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

  React.useEffect(()=> {
    // getGlobalMaterial()
    getLabourList()
    getCompanyList()
    getColdStorageList()
    getFarmerDataList()
  }, [])

  React.useEffect(()=> {
    if(openAddModal && !editHarvestingdata?._id) {
      getGlobalMaterial()
    } else {
      setMaterialGermination(prev=> ({
        ...prev,
        // 1.5MM , 2.0MM
        foam: editHarvestingdata?.materialGermination?.foam > 0 ? "1.5MM" : "2.0MM",
        foamQuantity: editHarvestingdata?.materialGermination?.foam > 0 
            ? editHarvestingdata?.materialGermination?.foam 
            : editHarvestingdata?.materialGermination?.foam1,
        ethyleneQuantity : editHarvestingdata?.materialGermination?.ethylenePouch > 0 
        ? editHarvestingdata?.materialGermination?.ethylenePouch 
        : editHarvestingdata?.materialGermination?.ethylenePouch1,
        LDPE_Bag: editHarvestingdata?.materialGermination?.LDPE_Bag,
        fevicol: editHarvestingdata?.materialGermination?.fevicol,
        // "Bion" , "others"
        ethylenePouch: editHarvestingdata?.materialGermination?.ethylenePouch > 0 ? "Bion" : "others",
        rubber: editHarvestingdata?.materialGermination?.rubber,
        cuttingString : editHarvestingdata?.materialGermination?.cuttingString,
            germinationPaper : editHarvestingdata?.materialGermination?.germinationPaper,
        Chemicals : {
          fungicide : editHarvestingdata?.materialGermination?.Chemicals?.fungicide,
          cChemical : editHarvestingdata?.materialGermination?.Chemicals?.cChemical,
          amester : editHarvestingdata?.materialGermination?.Chemicals?.amester
        },
      }))
    }
  }, [openAddModal, editHarvestingdata])

  console.log('rowsssssssss', rows)

  // handle Labor Change
  const handleLaborChange = (event, value) => {
    setSelectedLabors(value);
  };

  // to set selected labor id to formvalues
  React.useEffect(()=> {
    if(selectedLabors?.length) {
      const selectedLaboursId = selectedLabors?.map(item=>item?._id)
      setFormValues(prev=>({
        ...prev,
        laborId: selectedLaboursId
      }))
    }
  }, [selectedLabors])

  // handle close modal
  const handleClose = () => {
    setOpenAddModal(false);
    setFormValues({
      typeName : 'farmer',
      farmerName : '',
      farmerMobileNo : '',
      location : '',
      date : '',
      vehicleNo : '',
      laborId : '',
      companyId : '',
      coldStoreId : '',
      rate : '',
      weight : '',
      wastage : '',
      companyWestage : '',
      companyRate : '',
      images: [],
      farmerID: '',
      box : [
        {
          boxKgType : '',
          customeVallue : '',
          boxweight : '',
          count: '',
          brand : '',
          handsRatio : {
            '3H' : '',
            '4H' : '',
            '5H' : '',
            '6H' : '',
            '7H' : '',
            '8H' : '',
            '9H' : '',
            '10H' : '',
          }
        }
      ],
   
    });
    setRows([{ boxKgType: '', customeVallue : '' , boxweight: '' , count: '', brand: '' , handsRatio : {
      '3H' : '',
      '4H' : '',
      '5H' : '',
      '6H' : '',
      '7H' : '',
      '8H' : '',
      '9H' : '',
      '10H' : '',
    } }]);
    setInputErrors({
      farmerID : "",
      laborId: '',
      vehicleNo: '',
      companyId : '',
      rate: '', 
      coldStoreId: '',
      weight: '',
      date: '',
      wastage: '',
    });
    
  };

  const handleInputChange = (index, name, value) => {
    setRows(prevRows => {
      const updatedRows = [...prevRows];
      updatedRows[index] = {
        ...updatedRows[index],
        handsRatio: {
          ...updatedRows[index].handsRatio,
          [name]: value,
        },
      };
      return updatedRows;
    });
  };
  // handle add more rows
  const handleAddRow = () => {
    setRows([...rows, { boxKgType: '', customeVallue : '' , boxweight : '' , count: '', brand: '' , handsRatio : {
      '3H' : '',
      '4H' : '',
      '5H' : '',
      '6H' : '',
      '7H' : '',
      '8H' : '',
      '9H' : '',
      '10H' : '',
    } }]);
  };
  
  // handle remove row
  const handleRemoveRow = (index) => {
    const newRows = rows?.filter((_, i) => i !== index);
    setRows(newRows);
  };


  

  // handle Row Input Select Change
  const handleChange = (index, field, value) => {
    console.log({index, field, value});
    let newRows 
    if(field === 'boxKgType') {
      newRows = rows?.map((row, i) => i === index ? { ...row, [field]: value, brand: '' } : row);

    } else {

      newRows = rows?.map((row, i) => i === index ? { ...row, [field]: value } : row);
    }
    
    console.log("newRowsnewRowsnewRows" , newRows);
    
    setRows(newRows);
  };

  // for showig and hiding hands ratio
  React.useEffect(()=> {
    setFormValues(prev=>({
      ...prev, 
      box : rows
    }))
    const data = rows?.filter((item)=> item?.boxKgType >= 13)
    if(data?.length) {
      setShowHandsRatio(true)
    } else {
      setShowHandsRatio(false)
    }
  }, [rows])


function transformBoxData(boxItem) {
  console.log("boxItemboxItem" , boxItem);
  
  if(boxItem.count == 0){
    // toast.error("enter count is zero plz correct this");
    toast.error(`box count can't be ${ Number(boxItem.count)} of brand  of the boxKgType ${boxItem.boxKgType === "custom" ? Number(boxItem.customeVallue) : Number(boxItem.boxKgType)}`);
    isError = true;
  }
  const transformed = {
    emptyBoxWeight: boxItem.boxweight ? Number(boxItem.boxweight) : 0,
    boxKgType: boxItem.boxKgType === "custom" ? Number(boxItem.customeVallue) : Number(boxItem.boxKgType),
    customeVallue : boxItem.boxKgType ,
    count: Number(boxItem.count),
    brand: boxItem.brand,
    handsRatio: {},
    customBox : boxItem.boxKgType === "custom" ? true : false
  };

  for (let key in boxItem.handsRatio) {
    if (boxItem.handsRatio[key]) {
      transformed.handsRatio[key] = boxItem.handsRatio[key];
    }
  }

  return transformed;
}

let IshadroError = []

  // handle add farmer form submit
  
  const isFieldsEmpty = () => {
    return !formValues.date || !formValues.vehicleNo || !formValues.laborId || !formValues.companyId;
};

// for checking for duplicate entries
const shallowCompare = (obj1, obj2) => {
  return (
    obj1.boxKgType === obj2.boxKgType &&
    obj1.brand === obj2.brand &&
    obj1.customeVallue === obj2.customeVallue
  );
};

const checkForDuplicates = (boxesArray) => {
  const duplicates = [];

  for (let i = 0; i < boxesArray?.length; i++) {
    for (let j = i + 1; j < boxesArray?.length; j++) {
      if (shallowCompare(boxesArray?.[i], boxesArray?.[j])) {
        duplicates?.push(boxesArray?.[i]);
      }
    }
  }

  if (duplicates?.length > 0) {
    console.error("Error: There are multiple objects with the same entries.", duplicates);
    toast.error('There are multiple boxes with the same entries')
    return true;
  } else {
    return false
  }
};

// Call the function to check for duplicates
  const handleFormSubmit = async (e)=> {
   
    e.preventDefault();
    let materialObject = {
      foam : materialGermination?.foam === '1.5MM' ? Number(materialGermination?.foamQuantity) : 0,
      foam1: materialGermination?.foam === '2.0MM' ? Number(materialGermination?.foamQuantity) : 0,
      LDPE_Bag: Number(materialGermination?.LDPE_Bag),
      fevicol: Number(materialGermination?.fevicol),
      ethylenePouch: materialGermination?.ethylenePouch === "Bion" ? Number(materialGermination?.ethyleneQuantity) : 0,
      ethylenePouch1: materialGermination?.ethylenePouch === "others" ? Number(materialGermination?.ethyleneQuantity) : 0,
      rubber: Number(materialGermination?.rubber),
      fungicide: Number(materialGermination?.Chemicals?.fungicide),
      cChemical: Number(materialGermination?.Chemicals?.cChemical),
      amester: Number(materialGermination?.Chemicals?.amester),
      cuttingString : Number(materialGermination?.cuttingString),
      germinationPaper : Number(materialGermination?.germinationPaper)
    };

   
    Object.entries(materialObject).forEach(([key, materialValue]) => {
      const dataItem = packagingMaterialData?.find(item => {
        const itemKey = item.conectionName.toLowerCase();
        return itemKey === key.toLowerCase();
      });
      const dataValue = dataItem ? Number(dataItem.value.value) : 0;
    
      console.log("11111111wwwwwwwwsdssds",{ dataItem, dataValue, materialValue });
    
      if (materialValue > dataValue) {
        toast.error(`Error: The value of ${key} (${materialValue}) exceeds the allowed limit (${dataValue}).`);
        isError = true;
      }
    });
    
      console.log("materialGermination" , materialGermination);

    const jsonString = JSON.stringify(materialObject);

    const formData = new FormData();
    formData.append('typeName', formValues?.typeName)

    formValues?.images?.forEach((file) => {
      formData.append('images', file);
    });
    formData.append('date', formValues?.date)
    formData.append('vehicleNo', formValues?.vehicleNo)
    formData.append('coldStoreId', formValues?.coldStoreId)
    formData.append('rate', formValues?.rate)
    if(formValues?.weight){
      formData.append('weight', formValues?.weight)
    }
    if(formValues?.wastage){
    formData.append('wastage', formValues?.wastage)
    }
    if (userDetails?.data?.role == "owner" || userDetails?.data?.role == "accountant") {
      if(formValues?.companyWestage){
      formData.append('companyWestage', formValues?.companyWestage);
      }
      if(formValues?.companyRate){
      formData.append('companyRate', Number(formValues?.companyRate));
      }
    }

    // append material data

        formData.append('materialGerminationData', jsonString);



    if(!Object.keys(editHarvestingdata)?.length > 0){
      formData.append('farmerId', formValues?.farmerID)
      formData.append('schedule', false)

    }
    formData.append('companyId', formValues?.companyId)
    formData.append('laborId', formValues?.laborId);
    formValues?.box?.forEach((boxItem, index) => {
      const transformedBoxItem = transformBoxData(boxItem);
    formData.append(`box[${index}]`, JSON.stringify(transformedBoxItem));
    });
    if(Object.keys(editHarvestingdata)?.length > 0){
      formData.append('id', editHarvestingdata?._id);
    }
    try {
      setLoading(true)
      if(Object.keys(editHarvestingdata)?.length > 0){
        const HandRatioHandelStop = IshadroError?.find((item) => item == false);
        if(HandRatioHandelStop == false){
          toast.error("HandRatio Is Not Equal to Count Value");
        }

        const checkingForDupliacts = checkForDuplicates(formValues?.box);

        if(checkingForDupliacts) {
          return
        }


        if (!formValues.laborId) {
          setInputErrors((prv) => ({ ...prv, laborId: "Select Labor is required" }));
        }
        if (!formValues.vehicleNo) {
          setInputErrors((prv) => ({ ...prv, vehicleNo: "Vehicle Number is required" }));
        }

        if (!formValues.companyId) {
          setInputErrors((prv) => ({ ...prv, companyId: "Select Company is required" }));
        }

        if (!formValues.rate) {
          setInputErrors((prv) => ({ ...prv, rate: "Rate is required" }));
        }

        if (!formValues.coldStoreId) {
          setInputErrors((prv) => ({ ...prv, coldStoreId: "Select Company is required" }));
        }

        if (!formValues.date) {
          setInputErrors((prv) => ({ ...prv, date: "Date is required" }));
        }

        
       if(formValues.laborId && formValues.vehicleNo && formValues.companyId && formValues.rate && formValues.coldStoreId &&formValues.date && !isError ){

        if(HandRatioHandelStop == undefined){
          const res = await postAPIAuthFormData(`farmer/editHarvestingDetail`, formData);
          console.log("resresresresresres" , res);
          
          
          if(res.status == 200){
    
            toast.success(`${res?.data?.message}`);
            getFarmers();
            setOpenAddModal(false);
            setFormValues({
              typeName : 'farmer',
              farmerName : '',
              farmerMobileNo : '',
              location : '',
              date : '',
              vehicleNo : '',
              laborId : '',
              companyId : '',
              coldStoreId : '',
              rate : '',
              weight : '',
              wastage : '',
              companyWestage : '',
              companyRate : '',
              images: [],
              farmerID: '',
              box : [
                {
                  boxKgType : '',
                  customeVallue : '',
                  boxweight : '',
                  count: '',
                  brand : '',
                  handsRatio : {
                    '3H' : '',
                    '4H' : '',
                    '5H' : '',
                    '6H' : '',
                    '7H' : '',
                    '8H' : '',
                    '9H' : '',
                    '10H' : '',
                  }
                }
              ],
           
            });
            setRows([{ boxKgType: '', customeVallue : '' , boxweight : '' , count: '', brand: '' , handsRatio : {
              '3H' : '',
              '4H' : '',
              '5H' : '',
              '6H' : '',
              '7H' : '',
              '8H' : '',
              '9H' : '',
              '10H' : '',
            } }]);
            setInputErrors({
              farmerID : "",
              laborId: '',
              vehicleNo: '',
              companyId : '',
              rate: '', 
              coldStoreId: '',
              weight: '',
              date: '',
              wastage: '',
            })
    
          }
        }

      }
     
      }
      else{
       
        const HandRatioHandelStop = IshadroError?.find((item) => item == false);
        if(HandRatioHandelStop == false){
          toast.error("HandRatio Is Not Equal to Count Value");
        }

        const checkingForDupliacts = checkForDuplicates(formValues?.box);

        if(checkingForDupliacts) {
          return
        }

        if (!formValues.farmerID) {
          setInputErrors((prv) => ({ ...prv, farmerID: "Select Farmer Required" }));
        }

        if (!formValues.laborId) {
          setInputErrors((prv) => ({ ...prv, laborId: "Select Labor is required" }));
        }
        if (!formValues.vehicleNo) {
          setInputErrors((prv) => ({ ...prv, vehicleNo: "Vehicle Number is required" }));
        }

        if (!formValues.companyId) {
          setInputErrors((prv) => ({ ...prv, companyId: "Select Company is required" }));
        }

        if (!formValues.rate) {
          setInputErrors((prv) => ({ ...prv, rate: "Rate is required" }));
        }

        if (!formValues.coldStoreId) {
          setInputErrors((prv) => ({ ...prv, coldStoreId: "Select Company is required" }));
        }

        if (!formValues.date) {
          setInputErrors((prv) => ({ ...prv, date: "Date is required" }));
        }


        
       if(formValues.farmerID && formValues.laborId && formValues.vehicleNo && formValues.companyId && formValues.rate && formValues.coldStoreId &&formValues.date && !isError){
        if(HandRatioHandelStop == undefined){
          // alert("hiii")
          const res = await postAPIAuthFormData(`farmer/addHarvestingDetail`, formData);      
          
          if(res.status == 200){
            setLoading(false)
            toast.success(`Add Harvesting Farmer ${res?.data?.message}`);
            getFarmers();
            setOpenAddModal(false);
            setFormValues({
              typeName : 'farmer',
              farmerName : '',
              farmerMobileNo : '',
              location : '',
              date : '',
              vehicleNo : '',
              laborId : '',
              companyId : '',
              coldStoreId : '',
              rate : '',
              weight : '',
              wastage : '',
              companyWestage : '',
              companyRate : '',
              images: [],
              farmerID: '',
              box : [
                {
                  boxKgType : '',
                  customeVallue : '',
                  boxweight : '',
                  count: '',
                  brand : '',
                  handsRatio : {
                    '3H' : '',
                    '4H' : '',
                    '5H' : '',
                    '6H' : '',
                    '7H' : '',
                    '8H' : '',
                    '9H' : '',
                    '10H' : '',
                  }
                }
              ],
           
            });
            setRows([{ boxKgType: '', customeVallue : '' , boxweight : '' , count: '', brand: '' , handsRatio : {
              '3H' : '',
              '4H' : '',
              '5H' : '',
              '6H' : '',
              '7H' : '',
              '8H' : '',
              '9H' : '',
              '10H' : '',
            } }]);

            setInputErrors({
              farmerID : "",
              laborId: '',
              vehicleNo: '',
              companyId : '',
              rate: '', 
              coldStoreId: '',
              weight: '',
              date: '',
              wastage: '',
            })
    
          }
         }
       }
      }
    } catch (error) {
      console.log("eroror" , error);
      toast.error(error?.response?.data?.message);
      setLoading(false)
      
    }
    finally{
      setLoading(false)
    }
  }

  // custom text field styled component
  const CustomTextField = styled(TextField)(({ theme }) => ({
    '& .MuiInputBase-root': {
      minHeight: '49.6px', 
      paddingBlock: '4px',
      fontWeight: '400',
      borderRadius: '0.5rem'
    },
  }));

  const handleFarmerChange = (event, value) => {
    setFormValues((prev) => ({ ...prev, farmerID: value?._id || '' }));
    setInputErrors((prv) => ({ ...prv, farmerID: "" }));

  };

  const handleLabourChange = (event, value) => {
    setFormValues((prev) => ({ ...prev, laborId: value?._id || '' }));
    setInputErrors((prev) => ({ ...prev, laborId: '' }));
  };
  

  return (
    <React.Fragment>
      <Dialog
        open={openAddModal}
        onClose={handleClose}
        fullWidth={true}
        maxWidth={'md'}

      >
        <DialogTitle>{!editHarvestingdata?._id ? "Add Harvest" : "Edit Harvest"}</DialogTitle>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* <div>
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Date
              </label>
              <input
                value={formValues?.date}
                onChange={(e)=>setFormValues(prev=>({...prev, date: e.target.value}))}
                type="date" placeholder="Default Input" className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"/>
            </div> */}
           <div>
    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
      Date
    </label>
    <input
      name="date"
      value={formValues.date}
      onChange={(e) => {
        setFormValues((prev) => ({ ...prev, date: e.target.value }));
        setInputErrors((prev) => ({ ...prev, date: '' })); // Clear error on change
      }}
      onBlur={() => {
        if (!formValues.date) {
          setInputErrors((prev) => ({ ...prev, date: 'Date is required' }));
        }
      }}
      type="date"
      placeholder="Default Input"
      className={`w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${
        inputErrors.date ? 'border-red-500' : ''
      }`}
    />
    {inputErrors.date && (
      <div className="text-red-500 text-sm mt-1">{inputErrors.date}</div>
    )}
  </div>
            
             {/* <div>
      <label className="block text-sm font-medium text-black dark:text-white mb-3">
        Select Farmers
      </label>
      <Autocomplete
        value={farmerData?.find((option) => option._id === formValues.farmerID) || null}
        error={inputErrors.farmerID && true}
        helperText={inputErrors.farmerID}
        onBlur={() => {
                  if (!formValues.farmerID) {
                    setInputErrors((prv) => ({ ...prv, farmerID: "Select Farmer Required" }));
                  }
                }}
                renderInput={(params) => (
                  <TextField {...params} placeholder="Select Farmers" sx={{ width: '100%', height: '49.6px' }} />
                )}
        
        onChange={handleFarmerChange}
          name="selectFarmer"
        options={farmerData}
        disabled={Object.keys(editHarvestingdata)?.length > 0 ? true : false}
        getOptionLabel={(option) => `${option.name} (${option?.mobileNo})`}
        
        isOptionEqualToValue={(option, value) => option._id === value._id}
        sx={{ width: '100%' }}
      />
    </div> */}
    <div>
    <label className="block text-sm font-medium text-black dark:text-white mb-3">
      Select Farmers
    </label>
    <Autocomplete
      value={farmerData?.find((option) => option._id === formValues.farmerID) || null}
      onBlur={() => {
        if (!formValues.farmerID) {
          setInputErrors((prev) => ({ ...prev, farmerID: "Select Farmer Required" }));
        }
      }}
      onChange={handleFarmerChange}
      name="selectFarmer"
      options={farmerData}
      disabled={Object.keys(editHarvestingdata)?.length > 0}
      getOptionLabel={(option) => `${option.name} (${option?.mobileNo})`}
      isOptionEqualToValue={(option, value) => option._id === value._id}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Select Farmers"
          sx={{ width: '100%', height: '49.6px' }}
          error={!!inputErrors.farmerID}
          helperText={inputErrors.farmerID}
        />
      )}
      sx={{ width: '100%' }}
    />
  </div>
     
          {/*  */}
          <div>
    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
      Vehicle Number
    </label>
    <input
      value={formValues?.vehicleNo}
      onChange={(e) => {
        setFormValues((prev) => ({ ...prev, vehicleNo: e.target.value }));
        setInputErrors((prev) => ({ ...prev, vehicleNo: '' })); // Clear error on change
      }}
      onBlur={() => {
        if (!formValues.vehicleNo) {
          setInputErrors((prev) => ({ ...prev, vehicleNo: 'Vehicle Number is required' }));
        }
      }}
      type="text"
      placeholder="Default Input"
      className={`w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary ${
        inputErrors.vehicleNo ? 'border-red-500' : ''
      } dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
    />
    {inputErrors.vehicleNo && (
      <p className="text-red-500 text-sm mt-1">{inputErrors.vehicleNo}</p>
    )}
  </div>
   {/* <div>
  <Autocomplete
    options={labourList}
    getOptionLabel={(option) => option.name}
    value={labourList.find((option) => option._id === formValues?.laborId) || null}
    onChange={handleLabourChange}
    renderInput={(params) => (
      <CustomTextField
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
</div> */}
 <div>
    <Autocomplete
      options={labourList}
      getOptionLabel={(option) => option.name}
      value={labourList.find((option) => option._id === formValues?.laborId) || null}
      onChange={handleLabourChange}
      onBlur={() => {
        if (!formValues.laborId) {
          setInputErrors((prev) => ({ ...prev, laborId: 'Select Labor is required' }));
        }
      }}
      renderInput={(params) => (
        <CustomTextField
          {...params}
          placeholder="Select Labor"
          variant="outlined"
          label="Select Labor"
          error={!!inputErrors.laborId} // Ensure boolean value for error
          helperText={inputErrors.laborId} // Display the error message
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
  </div>

{/*  */}

<div>
    <label className="block text-sm font-medium text-black dark:text-white mb-3">
      Select Company
    </label>
    <Select
      value={formValues?.companyId}
      onChange={(e) => {
        setFormValues((prev) => ({ ...prev, companyId: e.target.value }));
        setInputErrors((prev) => ({ ...prev, companyId: '' })); // Clear error on change
      }}
      onBlur={() => {
        if (!formValues.companyId) {
          setInputErrors((prev) => ({ ...prev, companyId: 'Select Company is required' }));
        }
      }}
      disabled={Object.keys(editHarvestingdata)?.length > 0}
      displayEmpty
      sx={{
        width: '100%',
        height: '49.6px',
        borderColor: inputErrors.companyId ? 'red' : 'initial', // Set border color to red if there's an error
      }}
    >
      <MenuItem value="" disabled>
        Select company
      </MenuItem>
      {companyList?.length &&
        companyList?.map((option) => (
          <MenuItem key={option?._id} value={option?._id}>
            {option?.companyAliasName}
          </MenuItem>
        ))}
    </Select>
    {inputErrors.companyId && (
      <p className="text-red-500 text-sm mt-1">{inputErrors.companyId}</p>
    )}
  </div>
            
  <div>
    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
      Rate
    </label>
    <input
      value={formValues?.rate}
      // onChange={(e) => {
      //   setFormValues((prev) => ({ ...prev, rate: e.target.value }));
      //   setInputErrors((prev) => ({ ...prev, rate: '' })); // Clear error on change
      // }}
      onChange={(e) => {
        const value = e.target.value;
        setFormValues((prev) => ({ ...prev, rate: value }));

        // Clear error if the input value is valid
        if (/^\d*\.?\d*$/.test(value) || value === '') {
          setInputErrors((prev) => ({ ...prev, rate: '' }));
        } else {
          setInputErrors((prev) => ({ ...prev, rate: 'Rate must be a valid number' }));
        }
      }}
      onBlur={() => {
        if (!formValues.rate) {
          setInputErrors((prev) => ({ ...prev, rate: 'Rate is required' }));
        }
      }}
      type="text"
      placeholder="Default Input"
      className={`w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary ${
        inputErrors.rate ? 'border-red-500' : ''
      } dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
    />
    {inputErrors.rate && (
      <p className="text-red-500 text-sm mt-1">{inputErrors.rate}</p>
    )}
  </div>
            
  <div>
    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
      Weight
    </label>
    <input
      value={formValues?.weight}
      onChange={(e) => {
        const value = e.target.value;
        setFormValues((prev) => ({ ...prev, weight: value }));

        // Clear error if the input value is valid or empty
        if (value === '' || /^\d*\.?\d*$/.test(value)) {
          setInputErrors((prev) => ({ ...prev, weight: '' }));
        } else {
          setInputErrors((prev) => ({ ...prev, weight: 'Weight must be a valid number' }));
        }
      }}
      onBlur={() => {
        // Only validate for errors; no required field validation
        if (formValues.weight && !/^\d*\.?\d*$/.test(formValues.weight)) {
          setInputErrors((prev) => ({ ...prev, weight: 'Weight must be a valid number' }));
        }
      }}
      type="text"
      placeholder="Default Input"
      className={`w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary ${
        inputErrors.weight ? 'border-red-500' : ''
      } dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
    />
    {inputErrors.weight && (
      <p className="text-red-500 text-sm mt-1">{inputErrors.weight}</p>
    )}
  </div>
            
  <div>
    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
      Wastage
    </label>
    <input
      value={formValues?.wastage}
      onChange={(e) => {
        const value = e.target.value;
        setFormValues((prev) => ({ ...prev, wastage: value }));

        if (value === '' || /^\d*\.?\d*$/.test(value)) {
          setInputErrors((prev) => ({ ...prev, wastage: '' }));
        } else {
          setInputErrors((prev) => ({ ...prev, wastage: 'Wastage must be a valid number' }));
        }
      }}
      onBlur={() => {
        if (formValues.wastage && !/^\d*\.?\d*$/.test(formValues.wastage)) {
          setInputErrors((prev) => ({ ...prev, wastage: 'Wastage must be a valid number' }));
        }
      }}
      type="text"
      placeholder="Default Input"
      className={`w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary ${
        inputErrors.wastage ? 'border-red-500' : ''
      } dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
    />
    {inputErrors.wastage && (
      <p className="text-red-500 text-sm mt-1">{inputErrors.wastage}</p>
    )}
  </div>
            
            <div>
    <label className="block text-sm font-medium text-black dark:text-white mb-3">
      Cold Storage
    </label>
    <Select
      value={formValues?.coldStoreId}
      onChange={(e) => {
        setFormValues((prev) => ({ ...prev, coldStoreId: e.target.value }));
        setInputErrors((prev) => ({ ...prev, coldStoreId: '' })); 
      }}
      onBlur={() => {
        if (!formValues.coldStoreId) {
          setInputErrors((prev) => ({ ...prev, coldStoreId: 'Cold Storage is required' }));
        }
      }}
      disabled={Object.keys(editHarvestingdata)?.length > 0}
      displayEmpty
      sx={{
        width: '100%',
        height: '49.6px',
        borderColor: inputErrors.coldStoreId ? 'red' : 'initial',
      }}
    >
      <MenuItem value="" disabled>
        Select cold storage
      </MenuItem>
      {coldStorageList?.length &&
        coldStorageList?.map((option) => (
          <MenuItem key={option?._id} value={option?._id}>
            {option?.csName}
          </MenuItem>
        ))}
    </Select>
    {inputErrors.coldStoreId && (
      <p className="text-red-500 text-sm mt-1">{inputErrors.coldStoreId}</p>
    )}
  </div>

          {
            userDetails?.data?.role == "owner" || userDetails?.data?.role == "accountant" ? (
              <>
                <div>
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Company Rate
              </label>
              <input     value={formValues?.companyRate}
              onChange={(e)=>setFormValues(prev=>({...prev, companyRate: e.target.value}))} type="text" placeholder="Default Input" className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"/>
            </div>

            <div>
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Company Wastage
              </label>
              <input     value={formValues?.companyWestage}
              onChange={(e)=>setFormValues(prev=>({...prev, companyWestage: e.target.value}))} type="text" placeholder="Default Input" className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"/>
            </div>
              </>
            ) : (
              <>
              </>
            )
          }

            <div>
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Add Images
              </label>
              <input multiple onChange={(e)=>setFormValues(prev=>({...prev, images: Array.from(e.target.files)}))} type="file" className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent font-normal outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:px-5 file:py-3 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"/>
            </div>
            <div className="col-span-2">
            
            <Box>
              
           
      {rows?.map((row, index) => {

        console.log("klfdjlkklsddfsdlldslfds" , row);
        // count vlaueeee

        let brandValuedata = []
        // if(typeof(row.boxKgType) == "number"){
          // setRows([{ boxKgType: '', customeVallue : '' , boxweight: '' , count: '', brand: '' , handsRatio : {
          //   '3H' : '',
          //   '4H' : '',
          //   '5H' : '',
          //   '6H' : '',
          //   '7H' : '',
          //   '8H' : '',
          //   '9H' : '',
          //   '10H' : '',
          // } }])

         brandValuedata =  boxBrandValue?.filter((item) => item.boxKgType == (row.boxKgType === 'custom' ? row?.customeVallue : row.boxKgType))
        //  brandValuedata =  boxBrandValue?.filter((item) => item.boxKgType == row.boxKgType)
        console.log('new console', row.boxKgType, row?.customeVallue, brandValuedata)

        // }  
        const isDropdownDisabled = brandValuedata?.length === 0 || brandValuedata?.[0]?.brand === "";
        console.log("isDropdownDisabledisDropdownDisabledisDropdownDisabled" , brandValuedata);
        

        // end count valueeee
        const totalSum = Object.values(row.handsRatio).reduce((sum, value) => {
          return sum + (value ? parseInt(value) : 0);
      }, 0);

      console.log("totalSum" , totalSum);

      if(row.boxKgType >= 13){

        if(row?.count == totalSum){
          IshadroError.push(true);
        }
        else{
          IshadroError.push(false)
          // toast.error("HandRatio Is Not Equal to Count Value");
  
        }

      }

     

      console.log("dkljdsfkldjldsdjl" , formValues?.box );
      
        return(
          <>
          <Box key={index} display="flex" alignItems="center" gap={2} mb={index === rows.length - 1 ? '' : 2}>
            <div className="w-[35%]">
              <label className="block text-sm font-medium text-black dark:text-white mb-3">Select Box</label>
              <Select
                value={row.boxKgType}
                onChange={(e) => {
                  handleChange(index, 'boxKgType', e.target.value)
                  // handleChange(index, 'brand', '')
                }}
                displayEmpty
                sx={{ width: '100%', height: '49.6px' }}
              >
                <MenuItem value="" disabled>Select Box</MenuItem>
                {boxKgOptions.map((option, i) => (
                  <MenuItem key={i} value={option}>{option}</MenuItem>
                ))}
              </Select>
             
            </div>
  
            {(row.boxKgType === "custom" || row?.customBox)  && (
            
            <>
              <div className="w-[calc(30%_-_40px)]">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">Custom Value</label>
                <TextField
                  value={row?.customeVallue}
                  onChange={(e) => handleChange(index, 'customeVallue', e.target.value)}
                  placeholder="Custom Value"
                  inputProps={{ style: { height: '17.6px' } }}
                  sx={{ width: '100%', height: '49.6px' }}
                />
              </div>
              <div className="w-[calc(30%_-_40px)]">
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">Empty Box Weight</label>
              <TextField
                value={row.boxweight}
                onChange={(e) => handleChange(index, 'boxweight', e.target.value)}
                placeholder="Box Weight"
                inputProps={{ style: { height: '17.6px' } }}
                sx={{ width: '100%', height: '49.6px' }}
              />
            </div>
             </>
            )}
  
         
  
            <div className="w-[calc(30%_-_40px)]">
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">Enter Count</label>
              <TextField
                value={row.count}
                onChange={(e) => handleChange(index, 'count', e.target.value)}
                placeholder="Count"
                inputProps={{ style: { height: '17.6px' } }}
                sx={{ width: '100%', height: '49.6px' }}
              />
            </div>
  
            <div className="w-[35%]">
  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
    Select Box Brand
  </label>
  <Select
    value={row.brand}
    disabled={isDropdownDisabled}
    onChange={(e) => {
      const value = e.target.value || "No Data Found";
      handleChange(index, 'brand', value);
    }}
    displayEmpty
    sx={{ width: '100%', height: '49.6px' }}
  >
    <MenuItem value="" disabled>Box Brand</MenuItem>

    {isDropdownDisabled ? (
      <MenuItem value="" disabled>No Data Available</MenuItem>
    ) : (
      brandValuedata?.map((option, i) => (
        <MenuItem key={i} value={option?.brand}>
          {option?.brand}
        </MenuItem>
      ))
    )}
  </Select>
</div>
  
            {index === 0 ? (
              <IconButton sx={{ width: '40px', marginTop: '32px' }} color="primary" onClick={handleAddRow}>
                <Add />
              </IconButton>
            ) : (
              <IconButton sx={{ width: '40px', marginTop: '32px', color: 'red' }} onClick={() => handleRemoveRow(index)}>
                <Delete />
              </IconButton>
            )}

         
           
          </Box>
  
          {
                      row?.boxKgType >= 13 || (row?.boxKgType === 'custom' && row?.customeVallue >=13) ? (
                        <div className="col-span-2 mt-4">
                          <div className="grid grid-cols-4 gap-4">
                            <div className="col-span-4">
                              <label className="mb-1 block text-sm font-medium text-black dark:text-white">
                                Hands Ratio 3H
                              </label>
                            </div>
                            {formValues?.box?.[0]?.handsRatio && Object.keys(formValues?.box?.[0]?.handsRatio)?.map((key) => (
                              <div key={key}>
                                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                  {key}
                                </label>
                                <input
                                  type="text"
                                  name={key}
                                  value={row.handsRatio[key]}
                                  onChange={(e) => handleInputChange(index, key, e.target.value)}
                                  placeholder={key}
                                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : ""
                    }
  
                   </> 
        )
      })}
    </Box>
            </div>
            <div className="col-span-2">
                  <div>
                    <label
                      htmlFor="checkboxLabelOne"
                      className="flex cursor-pointer select-none items-center"
                    >
                      <div className="relative">
                        <input
                          type="checkbox"
                          id="checkboxLabelOne"
                          className="sr-only"
                          onChange={() => {
                            setShowMaterialGerm(!showMaterialGerm);
                          }}
                        />
                        <div
                          className={`mr-4 flex h-5 w-5 items-center justify-center rounded border ${
                            showMaterialGerm && 'border-primary bg-gray dark:bg-transparent'
                          }`}
                        >
                          <span
                            className={`h-2.5 w-2.5 rounded-sm ${showMaterialGerm && 'bg-primary'}`}
                          ></span>
                        </div>
                      </div>
                      Change Material Germination
                    </label>
                  </div>
                </div>
            {
              (showMaterialGerm) ? 
                <div className="col-span-2">
                  <div className="grid grid-cols-4 gap-4">
                      <div>
                        <label class={` block text-sm font-medium text-black dark:text-white mb-3`}>
                          Foam
                        </label>
                        <Select
                          value={materialGermination?.foam}
                          onChange={(e) => setMaterialGermination(prev=> ({
                            ...prev, 
                            foam: e.target.value
                          }))}
                          displayEmpty
                          sx={{ width: '100%', height: '49.6px' }}
                        >
                          <MenuItem value="" disabled>Select Foam</MenuItem>
                          <MenuItem value="1.5MM">1.5 MM</MenuItem>
                          <MenuItem value="2.0MM">2.0 MM</MenuItem>
                        </Select>
                      </div>
                      <div className='relative'>
                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                        Foam Count
                        </label>
                        <input 
                          value={materialGermination?.foamQuantity} 
                          onChange={(e) => setMaterialGermination(prev=> ({
                            ...prev, 
                            foamQuantity: e.target.value
                          }))}
                          type="text" placeholder="Foam Count" className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary pr-[50px]"/>
                          <div className="absolute right-[10px] bottom-[17%]">Bud</div>
                      </div>
                      <div className='relative'>
                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                          LDPE Bag
                        </label>
                        <input 
                          value={materialGermination?.LDPE_Bag} 
                          onChange={(e) => setMaterialGermination(prev=> ({
                            ...prev, 
                            LDPE_Bag: e.target.value
                          }))}
                          type="text" placeholder="LDPE Bag (In Kg)" className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary pr-[50px]"/>
                          <div className="absolute right-[10px] bottom-[17%]">Nos</div>
                      </div>
                      <div className='relative'>
                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                          Fevicol
                        </label>
                        <input  
                          value={materialGermination?.fevicol} 
                          onChange={(e) => setMaterialGermination(prev=> ({
                            ...prev, 
                            fevicol: e.target.value
                          }))}
                        type="text" placeholder="Fevicol (In Kg)" className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary pr-[50px]"/>
                        <div className="absolute right-[10px] bottom-[17%]">Kg</div>
                      </div>
                      <div className='relative'>
                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                          Rubber
                        </label>
                        <input   
                          value={materialGermination?.rubber} 
                          onChange={(e) => setMaterialGermination(prev=> ({
                            ...prev, 
                            rubber: e.target.value
                          }))}
                          type="text" placeholder="Rubber (Nos)" className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary pr-[50px]"/>
                          <div className="absolute right-[10px] bottom-[17%]">Nos</div>
                      </div>
                        <div>
                        <label class={` block text-sm font-medium text-black dark:text-white mb-3`}>
                          Ethylene Pouch
                        </label>
                        <Select
                            value={materialGermination?.ethylenePouch} 
                            onChange={(e) => setMaterialGermination(prev=> ({
                              ...prev, 
                              ethylenePouch: e.target.value
                            }))}
                          displayEmpty
                          sx={{ width: '100%', height: '49.6px' }}
                        >
                          <MenuItem value="" disabled>Select Ethylene Pouch</MenuItem>
                          <MenuItem value="Bion">Bion</MenuItem>
                          <MenuItem value="others">Others</MenuItem>
                        </Select>
                      </div>
                      <div className='relative'>
                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                        Ethylene Pouch Count
                        </label>
                        <input 
                          value={materialGermination?.ethyleneQuantity} 
                          onChange={(e) => setMaterialGermination(prev=> ({
                            ...prev, 
                            ethyleneQuantity: e.target.value
                          }))}
                          type="text" placeholder=" Ethylene Pouch Count" className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary pr-[50px]"/>
                          <div className="absolute right-[10px] bottom-[17%]">Nos</div>
                      </div>
                      <div className='relative'>
                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                          Fungicide
                        </label>
                        <input  
                          value={materialGermination?.Chemicals?.fungicide}
                          onChange={(e) => setMaterialGermination(prev=> ({
                            ...prev, 
                            Chemicals : {
                              ...prev?.Chemicals,
                              fungicide: e.target.value
                            }
                          }))}
                          type="text" placeholder="Fungicide (Kg)" className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary pr-[50px]"/>
                          <div className="absolute right-[10px] bottom-[17%]">Kg</div>
                      </div>
                      <div className='relative'>
                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                          C - Chemical
                        </label>
                        <input 
                                value={materialGermination?.Chemicals?.cChemical}
                                onChange={(e) => setMaterialGermination(prev=> ({
                                  ...prev, 
                                  Chemicals : {
                                    ...prev?.Chemicals,
                                    cChemical: e.target.value
                                  }
                                }))}
                          type="text" placeholder="C - Chemical (Kg)" className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary pr-[50px]"/>
                          <div className="absolute right-[10px] bottom-[17%]">Kg</div>
                      </div>
                      <div className='relative'>
                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                          Amester
                        </label>
                        <input 
                        
                        value={materialGermination?.Chemicals?.amester}
                        onChange={(e) => setMaterialGermination(prev=> ({
                          ...prev, 
                          Chemicals : {
                            ...prev?.Chemicals,
                            amester: e.target.value
                          }
                        }))}
                        type="text" placeholder="Amester (Ltr)" className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary pr-[50px]"/>
                        <div className="absolute right-[10px] bottom-[17%]">Ltr</div>
                      </div>
                      {/* addded 2 extra */}

                      <div className='relative'>
                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                        Germination Paper
                        </label>
                        <input   
                          value={materialGermination?.germinationPaper} 
                          onChange={(e) => setMaterialGermination(prev=> ({
                            ...prev, 
                            germinationPaper: e.target.value
                          }))}
                          type="text" placeholder="Germination Paper (Nos)" className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary pr-[50px]"/>
                          <div className="absolute right-[10px] bottom-[17%]">Nos</div>
                      </div>
                      {/*  */}
                      <div className='relative'>
                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                        Cutting String
                        </label>
                        <input   
                          value={materialGermination?.cuttingString} 
                          onChange={(e) => setMaterialGermination(prev=> ({
                            ...prev, 
                            cuttingString: e.target.value
                          }))}
                          type="text" placeholder="Cutting String (Bud)" className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary pr-[50px]"/>
                          <div className="absolute right-[10px] bottom-[17%]">Bud</div>
                      </div>

                      {/*  */}
                  </div>
                </div>
              : ''
            }

          </div>
        </DialogContent>
        <DialogActions sx={{paddingInline: '20px'}}>
          <button 
          disabled={loading}
          onClick={handleFormSubmit} className={`flex w-full mx-auto max-w-[350px] justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 ${loading ? 'pointer-events-none bg-opacity-80' : ''}`}>
            { 
  !editHarvestingdata?._id 
    ? (loading ? 'Loading...' : 'Add Harvest') 
    : (loading ? 'Loading...' : 'Edit Harvest')
}

          </button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
