import { FC } from 'react';
import { useModal } from 'modals/ModalProvider';
import { Modal } from 'modals/Modal';
import { ModalType } from 'modals/index';

export const ModalTokenList: FC<{ id: string }> = ({ id }) => {
  const { closeModal, getModalData } = useModal();

  const data = getModalData(ModalType.TOKEN_LIST, id);

  return (
    <Modal id={id}>
      <div className={'space-y-20'}>
        <button
          className={'bg-sky-500 px-2 text-white'}
          onClick={() => closeModal(id)}
        >
          close
        </button>
        <div>MODAL TOKEN LIST</div>
        <div>
          Data:
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>

        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aspernatur
          laudantium libero, nobis non nostrum odio quos sit. Amet earum et, id
          inventore magni necessitatibus nihil odit quasi sunt unde velit.
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aspernatur
          laudantium libero, nobis non nostrum odio quos sit. Amet earum et, id
          inventore magni necessitatibus nihil odit quasi sunt unde velit.
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aspernatur
          laudantium libero, nobis non nostrum odio quos sit. Amet earum et, id
          inventore magni necessitatibus nihil odit quasi sunt unde velit.
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aspernatur
          laudantium libero, nobis non nostrum odio quos sit. Amet earum et, id
          inventore magni necessitatibus nihil odit quasi sunt unde velit.
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aspernatur
          laudantium libero, nobis non nostrum odio quos sit. Amet earum et, id
          inventore magni necessitatibus nihil odit quasi sunt unde velit.
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aspernatur
          laudantium libero, nobis non nostrum odio quos sit. Amet earum et, id
          inventore magni necessitatibus nihil odit quasi sunt unde velit.
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aspernatur
          laudantium libero, nobis non nostrum odio quos sit. Amet earum et, id
          inventore magni necessitatibus nihil odit quasi sunt unde velit.
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aspernatur
          laudantium libero, nobis non nostrum odio quos sit. Amet earum et, id
          inventore magni necessitatibus nihil odit quasi sunt unde velit.
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aspernatur
          laudantium libero, nobis non nostrum odio quos sit. Amet earum et, id
          inventore magni necessitatibus nihil odit quasi sunt unde velit.
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aspernatur
          laudantium libero, nobis non nostrum odio quos sit. Amet earum et, id
          inventore magni necessitatibus nihil odit quasi sunt unde velit.
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aspernatur
          laudantium libero, nobis non nostrum odio quos sit. Amet earum et, id
          inventore magni necessitatibus nihil odit quasi sunt unde velit.
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aspernatur
          laudantium libero, nobis non nostrum odio quos sit. Amet earum et, id
          inventore magni necessitatibus nihil odit quasi sunt unde velit.
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aspernatur
          laudantium libero, nobis non nostrum odio quos sit. Amet earum et, id
          inventore magni necessitatibus nihil odit quasi sunt unde velit.
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aspernatur
          laudantium libero, nobis non nostrum odio quos sit. Amet earum et, id
          inventore magni necessitatibus nihil odit quasi sunt unde velit.
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aspernatur
          laudantium libero, nobis non nostrum odio quos sit. Amet earum et, id
          inventore magni necessitatibus nihil odit quasi sunt unde velit.
        </p>
      </div>
    </Modal>
  );
};
