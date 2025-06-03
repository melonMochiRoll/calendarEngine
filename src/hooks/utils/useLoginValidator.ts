
export function useLoginValidator() {
  const emailConfirmation = (email: string) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    return !emailPattern.test(email) ? '이메일 형식을 확인해주세요' : '';
  };

  const passwordConfirmation = (password: string) => {
    return password.length < 8 ? '비밀번호는 8자 이상이어야 합니다.' : '';
  };

  return { emailConfirmation, passwordConfirmation };
}