import { Button, Modal, Typography } from 'antd'
import { forwardRef, useImperativeHandle, useState } from 'react'

import { IModalMethods } from '@/types/modal.type'

const { Title } = Typography

export interface IModalProps {
  title: string
  children?: React.ReactNode
  width?: number
  handleOk?: () => void
  handleCancel?: () => void
}

const _CommonModal: React.ForwardRefRenderFunction<IModalMethods, IModalProps> = (
  { title, children, handleOk, handleCancel, width },
  ref
) => {
  const [open, setOpen] = useState<boolean>(false)

  useImperativeHandle<IModalMethods, IModalMethods>(ref, () => ({
    showModal: (): void => setOpen(true),
    hideModal: (): void => setOpen(false)
  }))

  const handleCancelChild = (): void => {
    if (handleCancel) {
      handleCancel()
    }
    setOpen(false)
  }

  const handleOkChild = (): void => {
    if (handleOk) {
      handleOk()
    } else {
      console.error('handleOk is not defined')
    }
  }

  return (
    <>
      <Modal
        className='view-modal'
        title={<Title level={3}>{title}</Title>}
        open={open}
        transitionName='ant-move-up'
        width={width ? width + 'px' : '600px'}
        onCancel={handleCancelChild}
        footer={
          handleOk
            ? [
                <Button className='btn-cancel mt-1' onClick={handleCancelChild} type='primary' key='cancel'>
                  Close
                </Button>,
                <Button className='btn-primary mt-1' onClick={handleOkChild} type='primary' key='ok'>
                  Confirm
                </Button>
              ]
            : null
        }
      >
        <div className='content-box'>{children}</div>
      </Modal>
    </>
  )
}

const CommonModal = forwardRef(_CommonModal)
export default CommonModal
