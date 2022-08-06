import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';

import hi from "@/assets/images/hi.png"

import InputPassword from '@/components/atom/InputPassword';
import InputBasic from '@/components/atom/InputBasic';
import AuthLayout from '@/layouts/AuthLayout';

const FormSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email address').required('Email is required'),
  username: Yup.string().min(5, 'Must be longer than 5 characters').required('Username is required'),
  password: Yup.string().min(5, 'Must be longer than 5 characters').required('Password is required')
});

const RegisterForm = () => {

  const submitForm = (values, { setSubmitting }) => {
    setTimeout(() => {
      alert(JSON.stringify(values, null, 2));
      setSubmitting(false);
    }, 1000);
  }

  return (
    <AuthLayout title="Hi, Welcome!" titleIcon={hi} description="Let’s create your account">
    <Formik
      initialValues={{ email: '', username: '', password: '' }}
      validationSchema={FormSchema}
      onSubmit={submitForm}
    >
      {({
        errors,
        touched,
        isSubmitting
      }) => (
        <Form>
          <div className="mb-5 md:mb-8">
            <label htmlFor="email" className="block font-medium text-base md:text-2xl mb-3 md:mb-5">
              Email Address
            </label>
            <InputBasic
              name="email"
              type="email"
              placeholder="Enter your email address"
              error={errors.email}
              touched={touched.email}
            />
            <div className="mt-2 text-gray text-xs md:text-sm">
              Valid email required for sign-up
            </div>
          </div>
          <div className="mb-5 md:mb-8">
            <label htmlFor="email" className="block font-medium text-base md:text-2xl mb-3 md:mb-5">
              Username
            </label>
            <InputBasic
              name="username"
              type="text"
              placeholder="Enter your username"
              error={errors.username}
              touched={touched.username}
            />
            <div className="mt-2 text-gray text-xs md:text-sm">
              You can use lowercase letters, numbers, periods, dashes, and underscores.
            </div>
          </div>
          <div className="mb-6 md:mb-8">
            <label htmlFor="email" className="block font-medium text-base md:text-2xl mb-3 md:mb-5">
              Password
            </label>
            <InputPassword
              name="password"
              placeholder="Enter your password"
              error={errors.password}
              touched={touched.password}
            />
          </div>
          <button 
            type="submit" 
            disabled={isSubmitting} 
            className="w-full bg-primary hover:bg-opacity-90 disabled:hover:bg-opacity-100 transition py-4 px-6 rounded-lg text-white text-center text-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="register"
          >
            Register 
          </button>
        </Form>
      )}
    </Formik>

    <div className="w-full text-center mt-6 text-sm md:text-base">
      Already have an account?
      <Link to={"/login"} className="text-primary ml-2 hover:underline">Login</Link>
    </div>

    <p className="text-gray text-sm mt-10">
      By proceeding to create your account and use SoundTown, you agree to our 
      <Link to={"#"} className="text-primary hover:underline"> Terms of Service</Link> and 
      <Link to={"#"} className="text-primary hover:underline"> Privacy Policy</Link>. 
      If you do not agree, you cannot use SoundTown.
    </p>
  </AuthLayout>
  )
}


export default RegisterForm