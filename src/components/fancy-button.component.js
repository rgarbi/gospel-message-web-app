import React, { useState } from 'react';

import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

export default function FancyButton() {
  const [buttonText, setButtonText] = useState('');
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [loadingSpinnerClass, setLoadingSpinnerClass] = useState('visually-hidden');

  
  const buttonClick = async (event) => {
    setButtonDisabled(true);
    setButtonText('');
    setLoadingSpinnerClass('');
    
  };

  return (
    <Button variant="primary" type="submit" disabled={buttonDisabled} onClick={buttonClick}>
    {buttonText}
    <Spinner
        as="span"
        animation="border"
        size="sm"
        role="status"
        aria-hidden="true"
        className={loadingSpinnerClass}
    />
    <span className="visually-hidden">Submitting...</span>
    </Button>
  );
  
};
