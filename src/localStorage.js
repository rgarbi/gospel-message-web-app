
const defaultState = {
    emailAddress: '',
    password: '',
    token: {},
  };

export const loadState = () => {
    try {
      console.log('Loading the state');
      const serializedState = sessionStorage.getItem('state');
      console.log('Got this out of the local store: ', serializedState);
      if (serializedState === null) {
        return defaultState;
      }
      return JSON.parse(serializedState);
    } catch (err) {
      return {};
    }
}; 
  
export const saveState = (state) => {
    try {
      console.log('Saving the state: ', state);
      const serializedState = JSON.stringify(state);
      sessionStorage.setItem('state', serializedState);
    } catch {
      // ignore write errors
    }
};