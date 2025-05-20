import { TbBulbFilled } from 'react-icons/tb';
import { BsGear } from 'react-icons/bs';
import { IoShuffleOutline } from "react-icons/io5";
import { FaEnvelope, FaWrench } from "react-icons/fa";

import { CommentSVG } from '../../Styled/svg';

// eslint-disable-next-line import/no-anonymous-default-export
export default (t) => [
  {
    title: t('Discover the editing features'),
    content: (
      <p>{t('Explore the new features and discover the interface with our guided tour!')}</p>
    ),
    placement: 'bottom',
    target: '#guided-tour-compass',
    disableBeacon: true,
    scroll: false,
  },
  {
    title: t('Select guidances'),
    content: (
      <div style={{
        display: 'flex',
        alignItems: 'center',
      }}>
        <div style={{ width: '200px', textAlign: 'center', paddingRight: '10px' }}>
          <TbBulbFilled size={60} />
        </div>
        <div>
          <p>{t('Consult the list of organizations offering guidances.')}</p>
          <p>{t('Then check off the guidances relevant to your project.')}</p>
          <p>{t('See guidances to the right of each question.')}</p>
        </div>
      </div>
    ),
    placement: 'top',
    target: '#accordion-guidance-choice',
    scroll: true,
  },
  {
    title: t('Create and manage research outputs'),
    content: (
      <>
        <p>{t('The creation of a research product allows you to display an adapted questionnaire (software or, dataset and others) to describe its management according to its nature or discipline.')}</p>
        <p>{t('Click on the "Create" tab to add another research output.')}</p>
        <p>{t('You can create as many search outputs as you need.')}</p>
      </>
    ),
    placement: 'right-start',
    target: '#ro-nav-bar .nav',
    scroll: true,
  },
  {
    title: t('View the suggested aids for each question'),
    content: (
      <>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          height: '70px',
        }}>
          <TbBulbFilled size={32} style={{ margin: '-20px 10px 0 5px' }} />
          <p>{t('Display guidances for this question.')}</p>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          height: '70px',
        }}>
          <div style={{ margin: '-10px 10px 0 5px' }}><CommentSVG size={32} /></div>
          <p>{t('View comments shared by collaborators. The number of comments is shown in brackets.')}</p>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          height: '70px',
        }}>
          <IoShuffleOutline size={64} style={{ margin: '-20px 10px 0 5px' }} />
          <p>{t('Choose the appropriate form for the data management service you use (data center, storage center, etc.), then save the form.')}</p>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          height: '70px',
        }}>
          <BsGear size={64} style={{ margin: '-15px 10px 0 5px' }} />
          <p>{t('Activate the tools proposed for this form: calculate the storage/calculation cost, send notifications to the relevant departments.')}</p>
        </div>
      </>
    ),
    placement: 'left-start',
    target: '#icons-container',
    scroll: true,
  },
  {
    title: t('Do you have a question?'),
    content: (
      <>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          height: '70px',
        }}>
          <FaEnvelope size={54} style={{ margin: '-1px 10px 0 5px' }} />
          <p>{t('For information on data management at your facility, click on the envelope.')}</p>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          height: '70px',
        }}>
           <FaWrench size={54} style={{ margin: '-20px 10px 0 5px' }} />
          <p>{t('To report a technical error or provide feedback on the DMP OPIDoR tool, click on the key.')}</p>
        </div>
      </>
    ),
    placement: 'top',
    target: '.contact-icons',
    scroll: false,
  },
];
