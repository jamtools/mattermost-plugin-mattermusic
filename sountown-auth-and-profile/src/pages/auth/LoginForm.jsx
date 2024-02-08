import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import hi from "@/assets/images/hi.png"
import { Link } from 'react-router-dom';
import InputPassword from '@/components/atom/InputPassword';
import InputBasic from '@/components/atom/InputBasic';
import AuthLayout from '@/layouts/AuthLayout';

const FormSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().min(5, 'Must be longer than 5 characters').required('Password is required')
});

const LoginForm = () => {

  const submitForm = (values, { setSubmitting }) => {
    setTimeout(() => {
      alert(JSON.stringify(values, null, 2));
      setSubmitting(false);
    }, 1000);
  }

  return (
    <AuthLayout title="Hi, Welcome Back!" titleIcon={hi} description="Happy to see you again, please login here.">
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={FormSchema}
        onSubmit={submitForm}
      >
        {({
          errors,
          touched,
          isSubmitting
        }) => (
          <Form>
            <div className="mb-5 md:mb-10">
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
            </div>
            <div className="mb-5">
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
            <div className="mb-5 md:mb-10 flex items-center justify-between text-sm md:text-base">
              <div className="space-x-2">
                <input id="remember-me" type="checkbox" className="cursor-pointer" />
                <label htmlFor="remember-me" className="cursor-pointer">Remember me</label>
              </div>
              <Link to="/reset-password" className="text-primary hover:underline">
                Forgot Password
              </Link>
            </div>
            <button 
              type="submit" 
              disabled={isSubmitting} 
              className="w-full bg-primary hover:bg-opacity-90 disabled:hover:bg-opacity-100 transition py-4 px-6 rounded-lg text-white text-center text-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="submit-login"
            >
              Login 
            </button>
          </Form>
        )}
      </Formik>

      <div className="w-full text-center mt-8 md:mt-12 text-sm md:text-base">
        Don't have an account?
        <Link to={"/register"} className="text-primary ml-2 hover:underline">Register</Link>
      </div>
    </AuthLayout>
  )
}


export default LoginForm