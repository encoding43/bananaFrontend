import React from 'react';
import wpIcon from './../../images/wpIcon.png';

const WhatsAppComponent = ({ phoneNumber, message }) => {
  console.log('phoneNumberphoneNumber', phoneNumber);

  // const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://api.whatsapp.com/send?phone=+91${phoneNumber}&text=${message}&app_absent=0`;
  return (
    <button
      className="p-0 border-0 bg-transparent flex items-center justify-center"
      onClick={() => window.open(whatsappUrl, '_blank')}
    >
      <img className="h-10 flex" src={wpIcon} alt="" />
    </button>
  );
};

export default WhatsAppComponent;
