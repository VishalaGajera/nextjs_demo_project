import { PhoneNumberUtil } from "google-libphonenumber";

const mobileUtil = PhoneNumberUtil.getInstance();

export const isValidMobileNumber = (value: string) => {
  if (!value) {
    return true;
  }
  try {
    const number = mobileUtil.parseAndKeepRawInput(`+${value}`);

    return mobileUtil.isValidNumber(number);
  } catch {
    return false;
  }
};
