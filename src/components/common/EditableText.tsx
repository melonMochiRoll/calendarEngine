import React, { FC, useEffect, useState } from 'react';
import styled from '@emotion/styled';
import useDoubleClick from 'Hooks/utils/useDoubleClick';
import useInput from 'Hooks/utils/useInput';

interface EditableTextProps {
  initValue: string,
  submitEvent: Function,
  children: React.ReactNode,
};

const EditableText: FC<EditableTextProps> = ({
  initValue,
  submitEvent,
  children,
}) => {
  const [ editMode, setEditMode ] = useState(false);
  const [ value, onChangeValue, setValue ] = useInput(initValue);
  const onDoubleClick = useDoubleClick(() => setEditMode(true));

  useEffect(() => {
    setValue(initValue);
  }, [initValue]);

  const onSubmit = (e: any) => {
    e.preventDefault();
    
    submitEvent(value);
    setEditMode(false);
  };
  
  return (
    <>
      {
        editMode ?
          <form onSubmit={onSubmit}>
            <Input
              type='text'
              value={value}
              onChange={onChangeValue} />
          </form> :
          <div
            onClick={onDoubleClick}>
            {children}
          </div>
      }
    </>
  );
};

export default EditableText;

const Input = styled.input`
  font-size: 20px;
  font-weight: 500;
  outline: none;
`;