//年齢計算・目標年齢計算などのロジックを分離
export const computeProfileAge = (st) => {
  if (!st.birthDate) return { currentAge: null, goalAge: null };

  const birth = new Date(st.birthDate);
  const now = new Date();

  const currentAge = now.getFullYear() - birth.getFullYear();
  const goalAge = currentAge + st.goalYears;

  return { currentAge, goalAge };
};
