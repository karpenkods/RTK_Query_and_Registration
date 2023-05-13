import { ChangeEvent, FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useField } from 'formik'

import { Chip, Stack, TextField, TextFieldProps } from '@mui/material'

import { CostumButton } from './costumButton'

export const PostTags: FC<TextFieldProps> = (props) => {
  const [tag, setTag] = useState('')
  const [field, meta, helpers] = useField<string[]>(props.name ?? 'tags')

  const { t } = useTranslation()

  const handleChangeTag = (event: ChangeEvent<HTMLInputElement>) => {
    setTag(event.target.value)
  }

  const handleAddTag = () => {
    if (field.value?.includes(tag)) {
      setTag('')
      return
    }
    helpers.setValue([...(field.value ?? []), tag])
    setTag('')
  }

  return (
    <Stack direction="column" mb="20px">
      <Stack direction="row" alignItems="center">
        <TextField
          placeholder={`${t('tags')}`}
          variant="standard"
          name={field.name}
          value={tag}
          fullWidth
          sx={{ margin: '0 20px 10px 0' }}
          onChange={handleChangeTag}
          helperText={meta.error && meta.touched ? meta.error : ''}
          error={Boolean(meta.error) && meta.touched}
          disabled={props.disabled}
          {...props}
        />
        <CostumButton
          disabled={props.disabled || !tag}
          onClick={handleAddTag}
          variant="text"
          color="primary"
        >
          {t('add')}
        </CostumButton>
      </Stack>
      <Stack direction="row" gap="20px" flexWrap="wrap">
        {field.value?.map((tag) => (
          <Chip
            key={tag}
            label={tag}
            onDelete={() =>
              helpers.setValue(
                field.value.filter((tagToDelete) => tagToDelete !== tag),
              )
            }
            sx={{ width: 'fit-content' }}
            color="success"
          />
        ))}
      </Stack>
    </Stack>
  )
}
