import { useLoginUserMutation, useRegisterUserMutation } from "api/userApi";
import { ChangeEvent, FormEvent, useReducer } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  getErrorState,
  getPasswordLengthError,
  loginInitialValues,
} from "./helpers";
import { LoginInitialValues } from "./types";

export const useLoginSignUpForm = (
  tabIndex: number,
  setTabIndex: (tabIndex: number) => void
): [
  (e: FormEvent) => void,
  (e: ChangeEvent<any>) => void,
  boolean,
  LoginInitialValues
] => {
  const [formData, setFormData] = useReducer(
    (state: LoginInitialValues, newState: LoginInitialValues) => ({
      ...state,
      ...newState,
    }),
    loginInitialValues
  );
  const [registerUser] = useRegisterUserMutation();
  const [loginUser] = useLoginUserMutation();
  const navigate = useNavigate();
  const passwordLengthError = getPasswordLengthError(formData, tabIndex);
  const error = getErrorState(formData, tabIndex);
  const buttonDisabled = tabIndex === 0 ? error : error || formData.name === "";

  // useEffect(() => {
  //   setFormData(loginInitialValues);
  // }, [setFormData, tabIndex]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (passwordLengthError) {
      return toast.error("Password must be at least 9 characters long");
    }
    if (tabIndex === 0) {
      return loginUser({ data: formData })
        .unwrap()
        .then((res) => {
          if (res) {
            localStorage.setItem("token", res.token);
            localStorage.setItem("userId", res._id);
            navigate("/home");
            toast.success(`Hi ${res.name}`);
          }
        })
        .catch((error) => {
          toast.error(error.data.message);
        });
    } else {
      return registerUser({ data: formData })
        .unwrap()
        .then((res) => {
          toast.success(res.message);
          setTabIndex(0);
          if (res) {
            setFormData({
              email: res.data.email,
              password: "",
              confirm_password: "",
              name: "",
            });
          }
        })
        .catch((error) => {
          toast.error(error.data.message);
        });
    }
  };

  const handleChange = (e: ChangeEvent<any>) => {
    const { name, value } = e.target;
    setFormData({ [name]: value } as Pick<
      LoginInitialValues,
      keyof LoginInitialValues
    >);
  };

  return [handleSubmit, handleChange, buttonDisabled, formData];
};
