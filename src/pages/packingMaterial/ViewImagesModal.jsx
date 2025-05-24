import { Dialog, DialogTitle, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import React, { useState } from 'react'

const ViewImagesModal = ({showImages, setShowImages, selectedImages, baseUrl}) => {

  const handleClose = ()=> {
    setShowImages(false)
  }


  return (
    <>
    <Dialog
    open={showImages}
    onClose={handleClose}
    fullWidth={true}
    maxWidth={'md'}

  >
    <DialogTitle>View Images </DialogTitle>
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
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-5">

        {
          selectedImages?.length ? 
            selectedImages?.map(item=> (
              <div className='border aspect-square border-[#e0e0e0]'>
                {
                  baseUrl ? 
                  <img className='size-full object-contain' src={baseUrl+'/'+item } alt="No Image" />
                  : 
                  <img className='size-full object-contain' src={item } alt="No Image" />
                }
                </div>
            ))
          : '---'
        }

    </div>
    </Dialog>
  </>
  )
}

export default ViewImagesModal