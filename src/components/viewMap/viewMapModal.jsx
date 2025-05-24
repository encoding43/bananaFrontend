import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import {IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {APIProvider, Map, Marker} from '@vis.gl/react-google-maps';
import { GOOGLE_KEY } from '../../constants';





export default function ViewMapModal({openModal, setOpenModal, lat, lng}) {

  const handleClose = () => {
    setOpenModal(false);
  };

  console.log("GOOGLE_KEY" , GOOGLE_KEY);
  

  const handleMarkerClick = () => {
    const directionUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(directionUrl, "_blank");
  };
  return (
    <React.Fragment>
      <Dialog
        open={openModal}
        onClose={handleClose}
        fullWidth={true}
        maxWidth={'md'}

      >
        <DialogTitle>Location</DialogTitle>
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
        <APIProvider apiKey={GOOGLE_KEY} libraries={['marker']}>
          <Map
          // mapId={'bf51a910020fa25a'}
            style={{width: '100%', height: '400px'}}
            defaultCenter={{lat: lat, lng: lng}}
            defaultZoom={14}
            gestureHandling={'greedy'}
            disableDefaultUI={true}
          >
        <Marker
          position={{lat: lat, lng: lng}}
          clickable={true}
          onClick={handleMarkerClick}
          // title={'clickable google.maps.Marker'}
        />
        </Map>
        </APIProvider>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
