import React from 'react';
import Spinner from 'react-bootstrap/Spinner';
import styles from '../../styles/Asset.module.css';

// Asset component that displays either a spinner, image, or message
const Asset = ({ spinner, src, message }) => {
 return (
   <div className={`${styles.Asset} p-4`}>
     {/* Show loading spinner if spinner prop is true */}
     {spinner && (
       <Spinner animation="border" role="status">
         <span className="visually-hidden">Loading...</span>
       </Spinner>
     )}

     {/* Display image if src prop is provided */}
     {src && <img src={src} alt={message} />}

     {/* Show message text if message prop exists */} 
     {message && <p className="mt-4">{message}</p>}
   </div>
 );
};

export default Asset;