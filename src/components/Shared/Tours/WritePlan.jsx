import { TbBulbFilled } from 'react-icons/tb';
import { BsGear } from 'react-icons/bs';
import { IoShuffleOutline } from "react-icons/io5";
import { FaEnvelope, FaWrench } from "react-icons/fa";
import { renderToStaticMarkup } from 'react-dom/server';

import { CommentSVG } from '../../Styled/svg';

const icons = {
  TbBulbFilled,
  BsGear,
  IoShuffleOutline,
  FaEnvelope,
  FaWrench,
  CommentSVG,
};

const showIcon = (name, size) => {
  const IconComponent = icons[name];
  if (!IconComponent) return '';
  return renderToStaticMarkup(<IconComponent size={size} />);
};

export default (t) => [
  {
    element: '#guided-tour-compass',
    popover: {
      title: t('Discover the editing features'),
      description: t('Explore the new features and discover the interface with our guided tour!'),
      side: 'left',
      align: 'start',
    }
  },
  {
    element: '#accordion-guidance-choice',
    popover: {
      title: t('Select guidances'),
      description: `<div style="display: flex; align-items: center; height: 100px;">
          <div style="margin: -20px 10px 0 10px;">${showIcon('TbBulbFilled', 60)}</div>
          <div>
            <p>${t('Consult the list of organizations offering guidances.')}</p>
            <p>${t('Then check off the guidances relevant to your project.')}</p>
            <p>${t('See guidances to the right of each question.')}</p>
          </div>
        </div>`,
      side: 'top',
      align: 'start',
    }
  },
  {
    element: '#icons-container',
    popover: {
      title: t('View the suggested aids for each question'),
      description: `
        <p>
          <div style="display: flex; align-items: center; height: 70px;">
            <div style="margin: -20px 10px 0 10px;">${showIcon('TbBulbFilled', 32)}</div>
            <p>${t('Display guidances for this question.')}</p>
          </div>

          <div style="display: flex; align-items: center; height: 70px;">
            <div style="margin: -10px 10px 0 10px;">${showIcon('CommentSVG', 32)}</div>
            <p>${t('View comments shared by collaborators. The number of comments is shown in brackets.')}</p>
          </div>

          <div style="display: flex; align-items: center; height: 70px;">
            <div style="margin: -20px 10px 0 10px;">${showIcon('IoShuffleOutline', 32)}</div>
            <p>${t('Choose the appropriate form for the data management service you use (data center, storage center, etc.), then save the form.')}</p>
          </div>

          <div style="display: flex; align-items: center; height: 70px;">
            <div style="margin: -15px 10px 0 10px;">${showIcon('BsGear', 32)}</div>
            <p>${t('Activate the tools proposed for this form: calculate the storage/calculation cost, send notifications to the relevant departments.')}</p>
          </div>
        </p>
      `,
      side: 'left',
      align: 'start',
    },
  },
  {
    element: '.contact-icons',
    popover: {
      title: t('Do you have a question?'),
      description: `
        <p>
          <div style="display: flex; align-items: center; height: 70px;">
            <div style="margin: -1px 10px 0 5px;">${showIcon('FaEnvelope', 32)}</div>
            <p>${t('For information on data management at your facility, click on the envelope.')}</p>
          </div>
          <div style="display: flex; align-items: center; height: 70px;">

            <div style="margin: -20px 10px 0 5px;">${showIcon('FaWrench', 32)}</div>
            <p>${t('To report a technical error or provide feedback on the DMP OPIDoR tool, click on the key.')}</p>
          </div>
        </p>
      `,
      side: 'top',
      align: 'start',
    }
  },
];
