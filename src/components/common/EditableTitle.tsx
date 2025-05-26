import React, { FC, useEffect, useState } from 'react';
import styled from '@emotion/styled';
import useInput from 'Hooks/useInput';
import useDoubleClick from 'Hooks/utils/useDoubleClick';

interface EditableTitleProps {
  initValue: string,
  submitEvent: Function,
};

const EditableTitle: FC<EditableTitleProps> = ({
  initValue,
  submitEvent,
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
          <SpaceTitle>{value}</SpaceTitle>
        </div>
    }
    </>
  );
};

export default EditableTitle;

const Input = styled.input`
  font-size: 20px;
  font-weight: 500;
  outline: none;
`;

const SpaceTitle = styled.h1`
  font-size: 28px;
  color: var(--white);
  margin: 0;
`;