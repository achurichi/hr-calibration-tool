import AnimationCalibration from '@/pages/Animations/components/AnimationCalibration/AnimationCalibration';

import { DESCRIPTION_ITEM_TYPES } from '@/constants/descriptions';
import { PATHS } from '@/constants/routes';

const Visemes = () => {
  return (
    <AnimationCalibration actionLink={PATHS.VISEME_CONFIGURE} descriptionItemType={DESCRIPTION_ITEM_TYPES.VISEME} />
  );
};

export default Visemes;
