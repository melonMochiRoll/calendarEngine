import React, { FC, useEffect, useState } from 'react';
import styled from '@emotion/styled';
import gravatar from 'gravatar';
import ProfileAvatar from 'Src/components/ProfileAvatar';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import { defaultToastOption, imageTooLargeMessage, successMessage, waitingMessage } from 'Src/constants/notices';
import { generateProfileImagePresignedPutUrl, updateProfileImage } from 'Src/api/usersApi';
import { uuidv7 } from 'uuidv7';
import { uploadImageToPresignedUrl } from 'Src/api/sharedspacesApi';
import { useQueryClient } from '@tanstack/react-query';
import { GET_USER_KEY } from 'Src/constants/queryKeys';
import { useAppDispatch } from 'Src/hooks/reduxHooks';
import { closeModal } from 'Src/features/modalSlice';

interface ProfileImageUpdaterMain {
  nickname: string,
  ProfileImage: string,
  email: string,
}

const ProfileImageUpdaterMain: FC<ProfileImageUpdaterMain> = ({
  nickname,
  ProfileImage,
  email,
}) => {
  const qc = useQueryClient();
  const dispatch = useAppDispatch();
  const [ image, setImage ] = useState<File>();
  const [ preview, setPreview ] = useState<string>('');
  const src = ProfileImage ? ProfileImage : gravatar.url(email, { s: '25px', d: 'retro' });

  const onChangeImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (!e.target.files || !e.target.files.length) return;

    if (preview) {
      URL.revokeObjectURL(preview);
    }
    
    const imageFile = e.target.files[0];

    if (imageFile?.size >= 3 * 1024 * 1024) {
      toast.error(imageTooLargeMessage(3), defaultToastOption);
      return;
    }

    setImage(imageFile);
    setPreview(URL.createObjectURL(imageFile));
  };

  const onSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    image: File | undefined,
  ) => {
    e.preventDefault();
    if (!image) return;

    const tempImageId = uuidv7();

    try {
      const { key, presignedUrl, contentType } = await generateProfileImagePresignedPutUrl(
        tempImageId,
        image.name,
        image.size,
        image.type,
      );

      await uploadImageToPresignedUrl(presignedUrl, image, contentType);
      await updateProfileImage(tempImageId, key);
      await qc.refetchQueries([GET_USER_KEY]);
      
      toast.success(successMessage, defaultToastOption);
      dispatch(closeModal());
    } catch (err) {
      toast.error(waitingMessage, defaultToastOption);
    }
  };

  useEffect(() => {
    return () => {
      URL.revokeObjectURL(preview);
    };
  }, []);

  return (
    <Main>
      <PreviewContainer>
        <PreviewImg
          alt={image?.name || src}
          src={preview || src} />
        <ChatPreview>
          <ProfileWrapper>
            <ProfileAvatar
              ProfileImage={preview || ProfileImage}
              email={email}
              size={'large'} />
          </ProfileWrapper>
          <ChatWrapper>
            <InfoWrapper>
              <ProfileName>{nickname}</ProfileName>
              <Timestamp>{dayjs().format('A hh:mm')}</Timestamp>
            </InfoWrapper>
            <ContentWrapper>
              <Content>안녕하세요</Content>
            </ContentWrapper>
          </ChatWrapper>
        </ChatPreview>
      </PreviewContainer>
      <Form onSubmit={e => onSubmit(e, image)}>
        <FileBox>
          <Label htmlFor='profileimage-upload'>
            <UploadButton>업로드</UploadButton>
          </Label>
          <FileName>{image ? image.name : '...'}</FileName>
          <InputImageFile
            onChange={onChangeImageFile}
            id='profileimage-upload'
            type='file'
            accept='image/*' />
        </FileBox>
        <ButtonBox>
          <SubmitButton type='submit'>
              제출
          </SubmitButton>
        </ButtonBox>
      </Form>
    </Main>
  );
};

export default ProfileImageUpdaterMain;

const Main = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 85%;
  color: var(--white);
`;

const PreviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 70%;
  padding: 10px 20px;
  border-bottom: 1px solid var(--gray-8);
  gap: 10px;
`;

const PreviewImg = styled.img`
  width: 175px;
  height: 175px;
  border-radius: 175px;
  object-fit: cover;
  cursor: pointer;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 30%;
  padding: 20px;
`;

const UploadButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 35px;
  font-size: 18px;
  font-weight: 500;
  color: var(--gray-5);
  border: 1px solid var(--gray-7);
  border-radius: 4px;
  background-color: var(--gray-8);
  cursor: pointer;
  gap: 5px;
  transition: all 0.3s;

  &:hover {
    color: var(--white);
    border: 1px solid var(--white);
  }
`;

const FileName = styled.div`
  display: flex;
  align-items: center;
  width: 80%;
  height: 35px;
  border: 1px solid var(--gray-7);
  border-radius: 4px;
  padding: 0 10px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ChatPreview = styled.li<{ hoverMenuId?: string }>`
  position: relative;
  display: flex;
  width: 100%;
  padding: 10px 20px;
  gap: 15px;
  user-select: none;
`;

const ProfileWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const ChatWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 5px;
`;

const InfoWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  gap: 10px;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 90%;
  gap: 10px;
`;

const ProfileName = styled.span`
  color: var(--white);
  font-size: 20px;
  font-weight: 600;
`;

const Timestamp = styled.span`
  color: var(--gray-5);
  font-size: 16px;
`;

const Content = styled.p`
  width: 100%;
  color: var(--white);
  font-size: 18px;
  font-weight: 500;
  padding: 0;
  margin: 0;
  white-space: normal;
  word-wrap: break-word;
  word-break: normal;
  overflow-y: auto;
`;

const Label = styled.label`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 20%;
  cursor: pointer;
  gap: 5px;
`;

const InputImageFile = styled.input`
  position: absolute;
  width: 0;
  height: 0;
  padding: 0;
  overflow: hidden;
  border: 0;
`;

const FileBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  gap: 5px;
`;

const ButtonBox = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
`;

const SubmitButton = styled.button`
  color: var(--white);
  font-size: 16px;
  font-weight: 500;
  border: none;
  border-radius: 6px;
  padding: 5px 10px;
  background-color: var(--orange);
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    color: var(--orange);
    background-color: var(--white);
  }
`;