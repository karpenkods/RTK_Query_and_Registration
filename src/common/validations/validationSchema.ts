import * as Yup from 'yup'

const passwordRules = /^[0-9a-zA-Z]+$/

const name = Yup.string()
  .required('Обязательное поле')
  .min(2, 'Слишком короткое имя')
  .max(200, 'Слишком длинное имя')

const email = Yup.string()
  .email('Введите корректный Email')
  .required('Обязательное поле')

const message = Yup.string()
  .required('Обязательное поле')
  .min(3, 'Слишком короткое сообщение')
  .max(200, 'Слишком длинное сообщение')

const oldPassword = Yup.string()
  .required('Обязательное поле')
  .min(6, 'Минимум 6 символов')
  .matches(passwordRules, {
    message: 'Только латинские буквы и(или) цифры',
  })

const password = Yup.string()
  .required('Обязательное поле')
  .min(6, 'Минимум 6 символов')
  .matches(passwordRules, {
    message: 'Только латинские буквы и(или) цифры',
  })

const confirmPassword = Yup.string()
  .oneOf([Yup.ref('password')], 'Пароли не совпадают')
  .required('Обязательное поле')

export const settingsNameSchema = Yup.object().shape({ name })

export const settingsRemoveSchema = Yup.object().shape({ oldPassword })

export const settingsEmailSchema = Yup.object().shape({ email, oldPassword })

export const loginSchema = Yup.object().shape({ email, password })

export const newPasswordSchema = Yup.object().shape({ email, message })

export const registrationSchema = Yup.object().shape({
  name,
  email,
  password,
  confirmPassword,
})

export const settingsPasswordSchema = Yup.object().shape({
  oldPassword,
  password,
  confirmPassword,
})
