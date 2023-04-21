import * as Yup from 'yup'

export const settingsUserSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Слишком короткое имя')
    .max(200, 'Слишком длинное имя')
    .required('Обязательное поле'),
})
