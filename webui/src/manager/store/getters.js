//
export const ruleState = state => {
  return state.profile.enableRule || false;
};
export const hostState = state => {
  return state.profile.enableHost || false;
};
export const filterState = state => {
  return state.profile.enableFilter || false;
};
