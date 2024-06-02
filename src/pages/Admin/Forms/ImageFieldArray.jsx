import React, { useState, useEffect, useRef } from "react";
import { observer } from "mobx-react";
import { useFormContext, useFieldArray } from "react-hook-form";

import rootStore from "stores/root.store";

import Spinner from "react-bootstrap/Spinner";
import {
  BsArrowLeftCircleFill,
  BsArrowRightCircleFill,
  BsXCircleFill,
} from "react-icons/bs";
import ClickableIcon from "components/ClickableIcon/ClickableIcon";
import Dropzone from "components/Dropzone/Dropzone";

import styles from "./ImageFieldArray.module.scss";

const ImageFieldArray = observer(({ name }) => {
  const { descriptionStore } = rootStore;
  const { control, register } = useFormContext();
  const { fields, append, remove, move, update } = useFieldArray({
    control,
    name,
  });
  const [loadingImages, setLoadingImages] = useState(false);
  const fieldsRef = useRef(fields);
  const filedIds = fields
    .filter((field) => field.fileId)
    .map((field) => field.fileId);

  useEffect(() => {
    fieldsRef.current = fields;
  }, [fields]);

  useEffect(() => {
    const loadImages = async () => {
      setLoadingImages(true);
      const promises = fields.map(async (field, index) => {
        if (!field.fileId || field.base64) {
          return;
        }
        const base64 = await descriptionStore.getOrFetchImage(field.fileId);
        // update the field with the image only if the field is still the same
        if (field.fileId === fieldsRef?.current[index]?.fileId) {
          update(index, { ...field, base64 });
        }
      });
      await Promise.all(promises);
      setLoadingImages(false);
    };

    loadImages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filedIds)]);

  const onAdd = (files) => {
    files.forEach((file) => append({ url: URL.createObjectURL(file) }));
  };

  return (
    <>
      <div className="mb-2">Images</div>
      <div className={styles.container}>
        {fields.map((field, index) => {
          const url = field.url || field.base64;
          const isFirst = index === 0;
          const isLast = index === fields.length - 1;
          return (
            <div className={styles["image-container"]} key={field.id}>
              {!url && (
                <div className={styles["spinner-container"]}>
                  <Spinner variant="primary" />
                </div>
              )}
              {!!url && (
                <>
                  <img
                    alt="thumbnail"
                    className={styles.thumbnail}
                    src={url}
                    {...register(`${name}.${index}.url`)}
                  />
                  <div className={styles["hover-background"]}></div>
                  <ClickableIcon
                    Icon={BsArrowLeftCircleFill}
                    className={styles["move-left"]}
                    disabled={isFirst || loadingImages}
                    iconClassName={styles["move-icon"]}
                    onClick={() => {
                      if (!isFirst) {
                        move(index, index - 1);
                      }
                    }}
                    size={23}
                  />
                  <ClickableIcon
                    Icon={BsArrowRightCircleFill}
                    className={styles["move-right"]}
                    disabled={isLast || loadingImages}
                    iconClassName={styles["move-icon"]}
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
                    disabled={loadingImages}
                    iconClassName={styles["remove-icon"]}
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
            "image/jpeg": [],
            "image/png": [],
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
