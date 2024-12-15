import { Button, Modal } from 'antd'
import { forwardRef, useImperativeHandle, useState } from 'react'

import { IModalMethods } from '@/types/modal.type'

export interface IModalProps {
  title: string
  content: React.ReactNode
  width?: number
  handleOk?: () => void
}

const _CommonModal: React.ForwardRefRenderFunction<IModalMethods, IModalProps> = (
  { title, content, handleOk, width },
  ref
) => {
  const [open, setOpen] = useState<boolean>(false)

  useImperativeHandle<IModalMethods, IModalMethods>(ref, () => ({
    showModal: (): void => setOpen(true),
    hideModal: (): void => setOpen(false)
  }))

  const handleCancelChild = (): void => {
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
        title={title}
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
        <div className='content-box'>{content}</div>
      </Modal>
    </>
  )
}

const CommonModal = forwardRef(_CommonModal)
export default CommonModal
