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
import { useSpaceChatSocket } from 'Src/hooks/useSpaceChatSocket';
import { GET_SHAREDSPACE_CHATS_KEY } from 'Src/constants/queryKeys';

const ChatContainer: FC = () => {
  const { url } = useParams();
  const { data: userData } = useUser({ suspense: true, throwOnError: true });

  const { data: chatList, loadMore } = useChats();

  const scrollbarRef = useRef<HTMLUListElement>(null);
  const [ chat, onChangeChat, setChat ] = useInput('');
  const [ images, setImages ] = useState<File[]>([]);
  const [ previews, setPreviews ] = useState<string[]>([]);

  const {
    sendSharedspaceChat,
    updateSharedspaceChat,
    deleteSharedspaceChat,
    deleteSharedspaceChatImage,
    showNewChat,
    setShowNewChat,
    canShowNotify,
  } = useSpaceChatSocket(GET_SHAREDSPACE_CHATS_KEY);

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
      toast.info(tooManyImagesMessage, defaultToastOption);
      return;
    }

    const newImages: File[] = [];
    const newPreviews: string[] = [];

    for (const file of Array.from(e.target.files)) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(imageTooLargeMessage(5), defaultToastOption);
        return;
      }

      newImages.push(file);
      newPreviews.push(URL.createObjectURL(file));
    }

    setImages(prev => [ ...prev, ...newImages ]);
    setPreviews(prev => [ ...prev, ...newPreviews ]);
  };

  const onSubmit = useCallback((url: string | undefined, content: string, images: File[], previews: string[]) => {
    sendSharedspaceChat(url, content, images, previews);

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
          deleteSharedspaceChatImage={deleteSharedspaceChatImage}
          loadMore={loadMore}
          deleteFile={deleteFile} />
        {
          userData ?
            <ChatFooter
              onSubmit={() => onSubmit(url, chat, images, previews)}
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
  flex-grow: 1;
  flex-shrink: 1;
  padding: 0 20px;
`;

const ChatWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: var(--dark-gray);
`;