import * as Yup from 'yup'

const passwordRules = /^[0-9a-zA-Z]+$/

const name = Yup.string()
  .required('Обязательное поле')
  .min(2, 'Слишком короткое имя')
  .max(200, 'Слишком длинное имя')

const email = Yup.string()
  .email('Введите корректный Email')
  .required('Обязательное поле')

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

export const settingsNameSchema = Yup.object().shape({ name })

export const settingsRemoveSchema = Yup.object().shape({ oldPassword })

export const settingsEmailSchema = Yup.object().shape({ email, oldPassword })

export const loginSchema = Yup.object().shape({ email, password })

export const settingsPasswordSchema = Yup.object().shape({
  oldPassword,
  password,
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Пароли не совпадают')
    .required('Обязательное поле'),
})
