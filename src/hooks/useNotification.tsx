
// 3rd party
import toast, { ToastOptions } from "react-hot-toast";


const useNotification = () => {
  const notify = (message: string | (() => string), type: keyof typeof toast, options?: ToastOptions): void => {
    const messageString = typeof message === 'function' ? message() : message;
    (toast[type] as (message: string, options?: ToastOptions) => void)(messageString, {
      position: "bottom-center",
      style: {
        minWidth: "300px",
        fontSize: "16px",
        background: "#ffffff",
        marginLeft: "50px"
      },
      duration: 4000,
    });
  };

  return {
    notify
  };
};

export default useNotification;
