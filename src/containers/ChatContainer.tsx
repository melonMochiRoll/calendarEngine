import React, { FC, useCallback, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { useChats } from 'Hooks/queries/useChats';
import { useParams } from 'react-router-dom';
import useInput from 'Hooks/utils/useInput';
import { toast } from 'react-toastify';
import { defaultToastOption, imageTooLargeMessage, tooManyImagesMessage, waitingMessage } from 'Constants/notices';
import ChatFooter from 'Components/chat/ChatFooter';
import ChatList from 'Components/chat/ChatList';
import ChatDisableFooter from 'Src/components/chat/ChatDisableFooter';
import useUser from 'Src/hooks/queries/useUser';
import { useChatSocket } from 'Src/hooks/useChatSocket';

const ChatContainer: FC = () => {
  const { data: userData } = useUser({ suspense: true, throwOnError: true });

  const { data: chatList, loadMore } = useChats();

  const scrollbarRef = useRef<HTMLUListElement>(null);
  const [ chat, onChangeChat, setChat ] = useInput('');
  const [ images, setImages ] = useState<File[]>([]);
  const [ previews, setPreviews ] = useState<string[]>([]);

  const {
    socketStatus,
    sendSharedspaceChat,
    updateSharedspaceChat,
    deleteSharedspaceChat,
    showNewChat,
    setShowNewChat,
    canShowNotify,
  } = useChatSocket();

  const deleteFile = useCallback((idx: number) => {
    setImages(prev => [ ...prev.slice(0, idx), ...prev.slice(idx + 1, prev.length) ]);
    setPreviews(prev => {
      URL.revokeObjectURL(prev[idx]);
      return [ ...prev.slice(0, idx), ...prev.slice(idx + 1, prev.length) ];
    });
  }, []);

  const onChangeImageFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (!e.target.files) return;

    if (images.length + e.target.files.length > 6) {
      toast.info(tooManyImagesMessage, {
        ...defaultToastOption,
      });
      return;
    }

    const newImages: File[] = [];
    const newPreviews: string[] = [];

    for (const file of Array.from(e.target.files)) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(imageTooLargeMessage, {
          ...defaultToastOption,
          toastId: waitingMessage,
        });
        return;
      }

      newImages.push(file);
      newPreviews.push(URL.createObjectURL(file));
    }

    setImages(prev => [ ...prev, ...newImages ]);
    setPreviews(prev => [ ...prev, ...newPreviews ]);
  };

  const onSubmit = useCallback((content: string, images: File[], previews: string[]) => {
    const result = sendSharedspaceChat(content, images, previews);

    if (!result) {
      toast.error(waitingMessage, defaultToastOption);
      return;
    }

    scrollbarRef?.current?.scrollTo(0, 0);
    setChat('');
    setImages([]);
    setPreviews([]);
  }, [sendSharedspaceChat]);

  return (
    <ChatBlock>
      <ChatWrapper>
        <ChatList
          chatList={chatList}
          previews={previews}
          scrollbarRef={scrollbarRef}
          showNewChat={showNewChat}
          setShowNewChat={setShowNewChat}
          canShowNotify={canShowNotify}
          updateSharedspaceChat={updateSharedspaceChat}
          deleteSharedspaceChat={deleteSharedspaceChat}
          loadMore={loadMore}
          onSubmit={onSubmit}
          deleteFile={deleteFile} />
        {
          userData ?
            <ChatFooter
              onSubmit={() => onSubmit(chat, images, previews)}
              socketStatus={socketStatus}
              chat={chat}
              onChangeChat={onChangeChat}
              onChangeImageFiles={onChangeImageFiles} />
              :
              <ChatDisableFooter />
        }
      </ChatWrapper>
    </ChatBlock>
  );
};

export default ChatContainer;

const ChatBlock = styled.div`
  display: flex;
  justify-content: center;
  width: 70%;
`;

const ChatWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 1000px;
  height: 100%;
  background-color: var(--dark-gray);
`;