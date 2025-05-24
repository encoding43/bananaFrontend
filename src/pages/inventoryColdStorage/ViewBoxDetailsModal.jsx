import { Dialog, DialogTitle, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import React from 'react'

const ViewBoxDetailsModal = ({openBoxModal, setOpenBoxModal, selectedItem}) => {

  const handleClose = ()=> {
    setOpenBoxModal(false)
  }

  console.log('selectedItem', selectedItem)

  return (
    <Dialog
    open={openBoxModal}
    onClose={handleClose}
    fullWidth={true}
    maxWidth={'sm'}

  >
    <DialogTitle>View Hands - Quantity </DialogTitle>
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
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                          <tbody>
                            {
                              selectedItem && Object.entries(selectedItem)?.map(([key, value])=>
                                <tr className="bg-white border-b border-slate-300 dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <td className="px-6 py-4 text-gray-700 font-semibold uppercase bg-gray-50">
                                        {key}
                                    </td>
                                    <td className="px-6 py-4">
                                        {value}
                                    </td>
                                </tr>
                              )
                            }
                          </tbody>
                      </table>
                  </div>
    </Dialog>
  )
}

export default ViewBoxDetailsModal