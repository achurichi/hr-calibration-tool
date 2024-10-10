import { useEffect } from 'react';
import { observer } from 'mobx-react';
import { useFormContext, useFieldArray } from 'react-hook-form';

import { BsArrowLeftCircleFill, BsArrowRightCircleFill, BsXCircleFill } from 'react-icons/bs';

import ClickableIcon from '@/components/ClickableIcon/ClickableIcon';
import Dropzone from '@/components/Dropzone/Dropzone';
import Spinner from '@/components/Spinner/Spinner';

import rootStore from '@/stores/root.store';

import styles from './ImageFieldArray.module.scss';

const ImageFieldArray = observer(({ name }) => {
  const { descriptionStore } = rootStore;
  const { control, register } = useFormContext();
  const { fields, append, remove, move } = useFieldArray({
    control,
    name,
  });
  const fileIds = fields.filter((field) => field.value.id).map((field) => field.value.id);

  useEffect(() => {
    fields.forEach((field) => {
      if (field.value.id) {
        descriptionStore.fetchImageIfNotPresent(field.value.id);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileIds]);

  const onAdd = (files) => {
    files.forEach((file) => append({ value: { url: URL.createObjectURL(file) } }));
  };

  return (
    <>
      <div className="mb-2">Images</div>
      <div className={styles.container}>
        {fields.map((field, index) => {
          // use referenceImages map directly to trigger re-render when the image is loaded
          const image = descriptionStore.referenceImages.get(field.value.id);
          const url = field.value.url || image?.base64;
          const isFirst = index === 0;
          const isLast = index === fields.length - 1;
          return (
            <div className={styles['image-container']} key={field.id}>
              {!url && <Spinner className={styles.spinner} />}
              {!!url && (
                <>
                  <img
                    alt="thumbnail"
                    className={styles.thumbnail}
                    src={url}
                    {...register(`${name}.${index}.value.url`)}
                  />
                  <div className={styles['hover-background']}></div>
                  <ClickableIcon
                    Icon={BsArrowLeftCircleFill}
                    className={styles['move-left']}
                    disabled={isFirst}
                    iconClassName={styles['move-icon']}
                    onClick={() => {
                      if (!isFirst) {
                        move(index, index - 1);
                      }
                    }}
                    size={23}
                  />
                  <ClickableIcon
                    Icon={BsArrowRightCircleFill}
                    className={styles['move-right']}
                    disabled={isLast}
                    iconClassName={styles['move-icon']}
                    onClick={() => {
                      if (!isLast) {
                        move(index, index + 1);
                      }
                    }}
                    size={23}
                  />
                  <ClickableIcon
                    Icon={BsXCircleFill}
                    className={styles.remove}
                    iconClassName={styles['remove-icon']}
                    onClick={() => remove(index)}
                    size={23}
                  />
                </>
              )}
            </div>
          );
        })}
        <Dropzone
          accept={{
            'image/jpeg': [],
            'image/png': [],
          }}
          activeMessage="Drop the images here..."
          defaultMessage="Add images"
          onAdd={onAdd}
        />
      </div>
    </>
  );
});

export default ImageFieldArray;
