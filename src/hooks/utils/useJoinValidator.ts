import { isUser } from "Api/usersApi";

export function useJoinValidator() {
  const emailConfirmation = async (email: string) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailPattern.test(email)) {
      return '이메일 형식을 확인해주세요';
    }

    if (await isUser(email)) {
      return '중복 된 이메일입니다.';
    }

    return '';
  };

  const passwordConfirmation = (password: string) => {
    return password.length < 8 ? '비밀번호는 8자 이상이어야 합니다.' : '';
  };

  const passwordChkConfirmation = (password: string, passwordChk: string) => {
    return password !== passwordChk ? '비밀번호가 일치하지 않습니다.' : '';
  };

  return { emailConfirmation, passwordConfirmation, passwordChkConfirmation };
}