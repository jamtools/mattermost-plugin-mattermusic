import { Field, ErrorMessage } from 'formik';

const InputBasic = ({ name, type, placeholder, error, touched}) => {
  return (
    <>
      <Field
        id={name}
        type={type}
        name={name}
        placeholder={placeholder}
        className={`
          border border-gray rounded-lg px-5 py-4 focus:outline w-full bg-black 
          ${!error && touched && 'border-primary'}
          ${error && touched && 'border-danger'}
        `}
      />
      <ErrorMessage
        name={name}
        component="div"
        className="text-xs md:text-sm text-danger mt-2 h-5"
      />
    </>
  )
}

export default InputBasic