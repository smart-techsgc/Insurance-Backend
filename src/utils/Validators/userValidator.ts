import * as yup from "yup";

export const userSchema = yup.object().shape({
  email: yup.string().email().required("Email is required"),
  createdBy: yup.string().required("Created By is required"),
  userType: yup.string().required("User Type is required"),
  firstName: yup.string().required("First Name is required"),
  lastName: yup.string().required("Last Name is required"),
  otherName: yup.string(), // optional
  dateOfBirth: yup.date().required("Date of Birth is required"),
  gender: yup.string().required("Gender is required"),
  maritalStatus: yup.string().required("Marital Status is required"),
  nationality: yup.string().required("Nationality is required"),
  phone: yup.string().required("Phone is required"),
  photo: yup.string(),
  address: yup.string().required("Address is required"),
});
