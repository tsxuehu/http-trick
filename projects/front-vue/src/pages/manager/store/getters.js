//
export const resolveHost = state => {
  return state.profile.resolveHost || false;
};
export const enableHost = state => {
  return state.profile.enableHost || false;
};
export const enableRule = state => {
  return state.profile.enableRule || false;
};
export const enableFilter = state => {
  return state.profile.enableFilter || false;
};
