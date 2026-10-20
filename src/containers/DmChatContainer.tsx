import React, { FC, useCallback, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { useParams } from 'react-router-dom';
import useUser from 'Src/hooks/queries/useUser';
import { useDmChats } from 'Src/hooks/queries/useDmChats';
import useInput from 'Src/hooks/utils/useInput';
import { toast } from 'react-toastify';
import { defaultToastOption, imageTooLargeMessage, tooManyImagesMessage } from 'Src/constants/notices';
import { useChatSocket } from 'Src/hooks/useChatSocket';
import { GET_DM_CHATS_KEY } from 'Src/constants/queryKeys';
import ChatList from 'Src/components/chat/ChatList';
import ChatFooter from 'Src/components/chat/ChatFooter';
import ChatDisableFooter from 'Src/components/chat/ChatDisableFooter';
import { CHATROOM_TYPE } from 'Src/constants/constants';
import { useInView } from 'Src/hooks/utils/useInView';

const DmChatContainer: FC = () => {
  const { ChatRoomId } = useParams();
  const { data: userData } = useUser();

  const {
    data: chatListData,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isFetchNextPageError,
  } = useDmChats();

  const sentinelRef = useInView(() => {
    fetchNextPage();
    canShowNotify.current = true;
  }, {
    enable: hasNextPage && !isFetchingNextPage && !isFetchNextPageError,
    rootMargin: '0px 0px 100px 0px',
  });

  const bottomRef = useInView(() => {
    canShowNotify.current = false;
    setShowNewChat(null);
  }, {
    enable: true,
    rootMargin: '100px 0px 0px 0px',
  });
  
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
  } = useChatSocket(GET_DM_CHATS_KEY, CHATROOM_TYPE.DM);

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

  const onSubmit = useCallback((ChatRoomId: string | undefined, content: string, images: File[], previews: string[]) => {
    sendSharedspaceChat(ChatRoomId, content, images, previews);

    bottomRef?.current?.scrollIntoView({ block: 'end', behavior: 'instant' });
    setChat('');
    setImages([]);
    setPreviews([]);
  }, [sendSharedspaceChat]);

  const chatList = chatListData.pages.flatMap(page => page.chats);

  return (
    <ChatBlock>
      <ChatWrapper>
        <ChatList
          chatList={chatList}
          previews={previews}
          sentinelRef={sentinelRef}
          bottomRef={bottomRef}
          hasNextPage={hasNextPage}
          showNewChat={showNewChat}
          canShowNotify={canShowNotify}
          updateSharedspaceChat={updateSharedspaceChat}
          deleteSharedspaceChat={deleteSharedspaceChat}
          deleteSharedspaceChatImage={deleteSharedspaceChatImage}
          deleteFile={deleteFile} />
        {
          userData ?
            <ChatFooter
              onSubmit={() => onSubmit(ChatRoomId, chat, images, previews)}
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

export default DmChatContainer;

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