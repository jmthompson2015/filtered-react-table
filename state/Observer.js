// see https://github.com/reactjs/redux/issues/303#issuecomment-125184409
const Observer = {};

Observer.observeStore = (store, select, onChange) => {
  let currentState;

  const handleChange = () => {
    const nextState = select(store.getState());

    if (nextState !== currentState) {
      currentState = nextState;
      onChange(nextState);
    }
  };

  const unsubscribe = store.subscribe(handleChange);

  handleChange();

  return unsubscribe;
};

Object.freeze(Observer);

export default Observer;
