import { checkSession, getCurrentUser } from "@/lib/appwrite";
import { createContext, useContext, useState, useEffect } from "react";

interface GlobalContextProps {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  user: any;
  setUser: React.Dispatch<React.SetStateAction<any>>;
  isLoading: boolean;
}

const GlobalContext = createContext<GlobalContextProps>({
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  user: null,
  setUser: () => {},
  isLoading: true,
});

export const useGlobalContext = () =>
  useContext<GlobalContextProps>(GlobalContext);

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const [user, setUser] = useState<any>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // check if a session exists and then call getCurrentUser
    checkSession().then((response) => {
      console.log("checking session", response);
      if (response === true) {
        getCurrentUser().then((response) => {
          if (response) {
            setIsLoggedIn(true);
            setUser(response);
            setIsLoading(false);
          } else {
            setIsLoggedIn(false);
            setUser(null);
            setIsLoading(false);
          }
        });
      } else {
        setIsLoggedIn(false);
        setUser(null);
        setIsLoading(false);
      }
    });

    // getCurrentUser()
    //   .then((response) => {
    //     if (response) {
    //       setIsLoggedIn(true);
    //       setUser(response);
    //     } else {
    //       setIsLoggedIn(false);
    //       setUser(null);
    //     }
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   })
    //   .finally(() => {
    //     setIsLoading(false);
    //   });
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        user,
        setUser,
        isLoading,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
