import React, { useState } from 'react';

import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

export default function FancyButton(props) {
  const [buttonText, setButtonText] = useState(props.buttonText);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [loadingSpinnerClass, setLoadingSpinnerClass] = useState('visually-hidden');
  const [onClickFunction, setOnClickFunction] = useState(props.onClick);

  
  const buttonClick = async (event) => {
    setButtonDisabled(true);
    setButtonText('');
    setLoadingSpinnerClass('');

    onClickFunction();
    
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
