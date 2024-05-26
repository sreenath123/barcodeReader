function createstore(reducer, initialstate){
    let currentReducer = reducer;
    let currentState = initialstate;
    let listener = () => {}

    return {
        getState() {
            return currentState;
        },
        dispatch(action){
            currentState = currentReducer(currentState, action)
            listener()
            return action
        },
        subscribe(newlistener){
            listener = newlistener
        }
    }
}

function counter(state = 0, action) {
    switch (action.type) {
      case "INCREMENT":
        return state + 1
      case "DECREMENT":
        return state - 1
      default:
        return state
    }
  }

let store = createstore(counter, 0)
store.subscribe(() => console.log(store.getState()))

store.dispatch({ type: "INCREMENT" })
store.dispatch({ type: "INCREMENT" })
store.dispatch({ type: "DECREMENT" })