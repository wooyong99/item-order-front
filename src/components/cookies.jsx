import { Cookies } from "react-cookie";

const cookies = new Cookies();

export const setCookie = (props) => {
  return cookies.set(props.key, props.value);
};

export const getCookie = (props) => {
  return cookies.get(props.name);
};
