import { FC, useRef } from 'react'
import { IFileUploadProps } from '../models'

export const FileUpload: FC<IFileUploadProps> = ({
  setFile,
  setUrl,
  accept,
  children,
}) => {
  const ref = useRef<HTMLInputElement | any>()

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files.length) return
    setFile(e.target.files[0])

    const pictureURL = URL.createObjectURL(e.target.files[0])
    setUrl(pictureURL)
  }

  return (
    <div onClick={() => ref?.current?.click()}>
      <input
        type="file"
        accept={accept}
        style={{ display: 'none' }}
        ref={ref}
        onChange={onChange}
      />
      {children}
    </div>
  )
}
