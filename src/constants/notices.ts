import { Bounce, ToastOptions } from "react-toastify";

export const incorrectCredentialsMessage = '이메일 혹은 비밀번호를 확인해주세요';

export const privateTooltip = '비공개 스페이스는 멤버로 초대받은 사람만 접근할 수 있습니다.';

export const emptyspaces = '스페이스가 없습니다.';

export const checkContent = '내용을 확인해주세요.';

export const waitingMessage = '잠시후에 다시 시도해주세요.';

export const needLogin = '로그인이 필요합니다.';

export const successMessage = '처리 완료되었습니다.';

export const conflictAccountMessage = '이미 가입된 이메일입니다.';

export const imageTooLargeMessage = '이미지 최대 용량은 5MB입니다.';

export const tooManyImagesMessage = '이미지는 최대 6개까지 첨부할 수 있습니다.';

export const checkURL = 'URL을 확인해주세요';

export const alreadyRequest = '이미 요청을 보냈습니다.';

export const defaultToastOption: ToastOptions = {
  position: 'top-center',
  autoClose: 5000,
  closeOnClick: true,
  draggable: true,
  pauseOnHover: false,
  pauseOnFocusLoss: false,
  progress: undefined,
  theme: 'dark',
  transition: Bounce,
};

export const muiMenuDarkModeSx = {
  '.MuiMenu-paper': {
    'backgroundColor': 'var(--black)',
    'color': 'var(--white)',
  },
  '.MuiMenu-paper li:hover': {
    'backgroundColor': 'var(--google-blue)',
  },
};