import React, { FC } from 'react';
import styled from '@emotion/styled';
import { InputTypeAttribute } from 'src/typings/types';

interface InputFieldProps {
  id: string;
  name: string;
  value: string;
  onChangeValue: (e: any) => void;
  title: string;
  type: InputTypeAttribute;
};

const InputField: FC<InputFieldProps> = ({
  id,
  name,
  value,
  onChangeValue,
  title,
  type,
  }) => {
  return (
    <Block>
      <Input
        id={id}
        name={name}
        value={value}
        onChange={onChangeValue}
        type={type}
        required
        />
      <Label
        htmlFor={id}>
        {title}
      </Label>
    </Block>
  );
};

export default InputField;

const Block = styled.div`
  position: relative;
`;

const Label = styled.label`
  position: absolute;
  bottom: -17px;
  left: 0px;
  width: 100%;
  height: 100%;
  pointer-events: none;
  font-size: 14px;
  color: #7e7f92;
  padding-left: 15px;
  font-weight: 600;
  transition: all 0.3s ease;
`;

const Input = styled.input`
  width: 300px;
  height: 50px;
  outline: none;
  border: none;
  border-radius: 15px;
  background-color: #434459;
  color: #fff;
  padding: 15px 15px 0 15px;

  :focus + label,
  :valid + label {
    transform: translateY(-15%);
    font-size: 12px;
  }
`;