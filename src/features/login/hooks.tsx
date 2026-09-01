import { ChangeEvent, FormEvent, useEffect, useReducer } from "react";
import toast from "react-hot-toast";
import { supabase } from "lib/supabaseClient";
import {
  getErrorState,
  getPasswordLengthError,
  loginInitialValues,
} from "./helpers";
import type { LoginInitialValues } from "./types";

export const useLoginSignUpForm = (
  tabIndex: number,
  setTabIndex: (tabIndex: number) => void
): [
  (e: FormEvent) => void,
  (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
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
  const passwordLengthError = getPasswordLengthError(formData, tabIndex);
  const error = getErrorState(formData, tabIndex);
  const buttonDisabled = tabIndex === 0 ? error : error || formData.name === "";

  useEffect(() => {
    setFormData(loginInitialValues);
  }, [setFormData, tabIndex]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (passwordLengthError) {
      return toast.error("Password must be at least 9 characters long");
    }
    if (!supabase) {
      return toast.error("Authentication is not configured");
    }

    const { email, password } = formData;

    if (tabIndex === 0) {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      // On success the auth listener updates the session and LoginPage
      // redirects to /home.
      if (signInError) {
        toast.error(signInError.message);
      }
      return;
    }

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });
    if (signUpError) {
      toast.error(signUpError.message);
      return;
    }
    setTabIndex(0);
    setFormData({ ...loginInitialValues, email });
    if (!data.session) {
      toast.success("Check your email to confirm your account, then log in.");
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ [name]: value } as Pick<
      LoginInitialValues,
      keyof LoginInitialValues
    >);
  };

  return [handleSubmit, handleChange, buttonDisabled, formData];
};
