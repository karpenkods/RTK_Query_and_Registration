import { TFunction } from 'i18next'
import * as Yup from 'yup'

const passwordRules = /^[0-9a-zA-Z]+$/

export const settingsNameSchema = (t: TFunction<'translation'>) =>
  Yup.object().shape({
    name: Yup.string()
      .required(`${t('required')}`)
      .min(2, `${t('nameShort')}`)
      .max(200, `${t('nameLong')}`),
  })

export const settingsRemoveSchema = (t: TFunction<'translation'>) =>
  Yup.object().shape({
    oldPassword: Yup.string()
      .required(`${t('required')}`)
      .min(6, `${t('minimumCharacters')}`)
      .matches(passwordRules, {
        message: `${t('lettersOnly')}`,
      }),
  })

export const settingsEmailSchema = (t: TFunction<'translation'>) =>
  Yup.object().shape({
    email: Yup.string()
      .email(`${t('validEmail')}`)
      .required(`${t('required')}`),
    oldPassword: Yup.string()
      .required(`${t('required')}`)
      .min(6, `${t('minimumCharacters')}`)
      .matches(passwordRules, {
        message: `${t('lettersOnly')}`,
      }),
  })

export const loginSchema = (t: TFunction<'translation'>) =>
  Yup.object().shape({
    email: Yup.string()
      .email(`${t('validEmail')}`)
      .required(`${t('required')}`),
    password: Yup.string()
      .required(`${t('required')}`)
      .min(6, `${t('minimumCharacters')}`)
      .matches(passwordRules, {
        message: `${t('lettersOnly')}`,
      }),
  })

export const newPasswordSchema = (t: TFunction<'translation'>) =>
  Yup.object().shape({
    email: Yup.string()
      .email(`${t('validEmail')}`)
      .required(`${t('required')}`),
    message: Yup.string()
      .required(`${t('required')}`)
      .min(3, `${t('messageShort')}`)
      .max(200, `${t('messageLong')}`),
  })

export const registrationSchema = (t: TFunction<'translation'>) =>
  Yup.object().shape({
    name: Yup.string()
      .required(`${t('required')}`)
      .min(2, `${t('nameShort')}`)
      .max(200, `${t('nameLong')}`),
    email: Yup.string()
      .email(`${t('validEmail')}`)
      .required(`${t('required')}`),
    password: Yup.string()
      .required(`${t('required')}`)
      .min(6, `${t('minimumCharacters')}`)
      .matches(passwordRules, {
        message: `${t('lettersOnly')}`,
      }),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], `${t('passwordMismatch')}`)
      .required(`${t('required')}`),
  })

export const settingsPasswordSchema = (t: TFunction<'translation'>) =>
  Yup.object().shape({
    oldPassword: Yup.string()
      .required(`${t('required')}`)
      .min(6, `${t('minimumCharacters')}`)
      .matches(passwordRules, {
        message: `${t('lettersOnly')}`,
      }),
    password: Yup.string()
      .required(`${t('required')}`)
      .min(6, `${t('minimumCharacters')}`)
      .matches(passwordRules, {
        message: `${t('lettersOnly')}`,
      }),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], `${t('passwordMismatch')}`)
      .required(`${t('required')}`),
  })
