import { createContext, useState } from "react";
const UserProgressContext = createContext({
  progress: "",
  showCard: () => {},
  hideCard: () => {},
  showCheckOut: () => {},
  hideCheckOut: () => {},
});
export function UserProgressContextProvider({ children }) {
  const [userProgress, setUserProgress] = useState("");
  function showCard() {
    setUserProgress("cart");
  }
  function hideCard() {
    setUserProgress("");
  }
  function showCheckOut() {
    setUserProgress("checkout");
  }
  function hideCheckOut() {
    setUserProgress("");
  }
  const userProgressCtx = {
    progress: userProgress,
    showCard,
    hideCard,
    showCheckOut,
    hideCheckOut,
  };
  return (
    <UserProgressContext.Provider value={userProgressCtx}>
      {children}
    </UserProgressContext.Provider>
  );
}
export default UserProgressContext;
