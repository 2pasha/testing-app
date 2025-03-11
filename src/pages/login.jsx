import { useState } from "react";
import { useRouter } from "next/router";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAuth } from "@/contexts/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const [errorMessage, setErrorMessage] = useState(""); // Handle errors
  const router = useRouter();
  const { redirectTo } = router.query;

  // Validation Schema
  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  // Handle Login
  const handleSubmit = async (values, { setSubmitting }) => {
    setErrorMessage(""); // Clear previous errors

    const result = await login(values.email, values.password);

    if (result.success) {
      router.push(redirectTo || "/profile");
    } else {
      setErrorMessage(result.message);
    }

    setSubmitting(false);
  };

  return (
    <div className="flex items-center justify-center p-6">
      <div className="p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4">[ login ]</h2>

        {errorMessage && (
          <p className="text-red-500 text-sm text-center mb-4">
            {errorMessage}
          </p>
        )}

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="flex flex-col space-y-4">
              <div>
                <label className="block text-sm my-2">email</label>
                <Field
                  type="email"
                  name="email"
                  className="w-full px-4 py-2 bg-gray-700 rounded-md text-white"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm my-1"
                />
              </div>

              <div>
                <label className="block text-sm my-2">password</label>
                <Field
                  type="password"
                  name="password"
                  className="w-full px-4 py-2 bg-gray-700 rounded-md text-white"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm my-1"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="my-2 cursor-pointer bg-white text-black border border-white font-semibold px-6 py-3 rounded-md hover:bg-black hover:text-white disabled:bg-gray-600"
              >
                {isSubmitting ? "logging in..." : "login"}
              </button>

              <p className="text-sm text-gray-400 text-center">
                don't have an account?{" "}
                <a href="/register" className="text-white hover:underline">
                  register here
                </a>
              </p>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
