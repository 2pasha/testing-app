import { useState } from "react";
import { useRouter } from "next/router";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

export default function Register() {
  const [step, setStep] = useState(1); // Manage steps (1 or 2)
  const [role, setRole] = useState(""); // Store selected role
  const [errorMessage, setErrorMessage] = useState(""); // Handle errors
  const router = useRouter();

  // Step 1: Select User Role
  const handleRoleSelection = (selectedRole) => {
    setRole(selectedRole);
    setStep(2);
  };

  // Validation Schema for Step 2
  const validationSchema = Yup.object().shape({
    name: Yup.string().min(2, "Too short!").required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
  });

  // Handle Registration
  const handleSubmit = async (values, { setSubmitting }) => {
    setErrorMessage(""); // Clear previous errors

    const userData = {
      role,
      name: values.name,
      email: values.email,
      password: values.password,
    };

    try {
      // Send registration request
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // Auto-login after registration
      const loginResponse = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: values.email, password: values.password }),
      });

      const loginData = await loginResponse.json();

      if (!loginResponse.ok) {
        throw new Error(loginData.message || "Login failed");
      }

      // Redirect to profile page after successful login
      router.push("/profile");
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center p-2">
      <div className="p-8 rounded-lg shadow-lg w-full max-w-md">
        {step === 1 ? (
          <>
            <h2 className="text-2xl font-bold text-center mb-6">[ register as ]</h2>
            <div className="flex flex-col space-y-4">
              <button
                onClick={() => handleRoleSelection("student")}
                className="border border-white text-white px-6 py-3 rounded-md hover:bg-white hover:text-black"
              >
                student
              </button>
              <button
                onClick={() => handleRoleSelection("teacher")}
                className="border border-white text-white px-6 py-3 rounded-md hover:bg-white hover:text-black"
              >
                teacher
              </button>
            </div>
          </>
        ) : (
          <Formik
            initialValues={{
              name: "",
              email: "",
              password: "",
              confirmPassword: "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="flex flex-col space-y-4">
                <h2 className="text-xl font-bold text-center mb-4">[ register as {role} ]</h2>

                {errorMessage && <p className="text-red-500 text-sm text-center">{errorMessage}</p>}

                <div>
                  <label className="block text-sm my-2">name</label>
                  <Field type="text" name="name" className="w-full px-4 py-2 bg-gray-700 rounded-md text-white" />
                  <ErrorMessage name="name" component="div" className="text-red text-sm my-2" />
                </div>

                <div>
                  <label className="block text-sm my-2">email</label>
                  <Field type="email" name="email" className="w-full px-4 py-2 bg-gray-700 rounded-md text-white" />
                  <ErrorMessage name="email" component="div" className="text-red text-sm my-2" />
                </div>

                <div>
                  <label className="block text-sm my-2">password</label>
                  <Field type="password" name="password" className="w-full px-4 py-2 bg-gray-700 rounded-md text-white" />
                  <ErrorMessage name="password" component="div" className="text-red text-sm my-2" />
                </div>

                <div>
                  <label className="block text-sm my-2">confirm password</label>
                  <Field type="password" name="confirmPassword" className="w-full px-4 py-2 bg-gray-700 rounded-md text-white" />
                  <ErrorMessage name="confirmPassword" component="div" className="text-red text-sm my-2" />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="my-2 cursor-pointer bg-white text-black border border-white font-semibold px-6 py-3 rounded-md hover:bg-black hover:text-white disabled:bg-gray-600"
                >
                  {isSubmitting ? "registering..." : "register"}
                </button>

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="cursor-pointer text-gray-400 hover:text-white text-sm text-center"
                >
                  back to role selection
                </button>
              </Form>
            )}
          </Formik>
        )}
      </div>
    </div>
  );
}
