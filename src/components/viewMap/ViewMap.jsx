import React, { useState } from 'react'
import ViewMapModal from './viewMapModal';

const ViewMap = ({lat, lng}) => {
  const [openModal, setOpenModal] = useState(false)
  return (
    <>
      <div className='underline text-blue-500 cursor-pointer' onClick={()=> setOpenModal(true)}>View Location</div>
      <ViewMapModal 
        openModal={openModal}
        setOpenModal={setOpenModal}
        lat={lat}
        lng={lng}
      />
    </>
  )
}

export default ViewMap